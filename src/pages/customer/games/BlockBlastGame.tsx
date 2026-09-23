import { useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { GameScoreRepository } from '@/services/storage/gameStorage';
import GameHeader from '@/components/games/GameHeader';
import GameOverScreen from '@/components/games/GameOverScreen';
import Button from '@/components/ui/Button';

const GRID = 8;
const CELL = 38;
const BOARD = GRID * CELL;
const LIFT = 64; // px the dragged piece floats above the finger so it stays visible

type Point = [number, number];
interface Shape {
  cells: Point[];
}
interface Piece {
  id: string;
  shape: Shape;
  color: string;
}

const SHAPES: Shape[] = [
  { cells: [[0, 0]] },
  { cells: [[0, 0], [1, 0]] },
  { cells: [[0, 0], [0, 1]] },
  { cells: [[0, 0], [1, 0], [2, 0]] },
  { cells: [[0, 0], [0, 1], [0, 2]] },
  { cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { cells: [[0, 0], [1, 0], [2, 0], [3, 0]] },
  { cells: [[0, 0], [0, 1], [0, 2], [0, 3]] },
  { cells: [[0, 0], [0, 1], [0, 2], [1, 2]] },
  { cells: [[1, 0], [1, 1], [1, 2], [0, 2]] },
  { cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  { cells: [[1, 0], [2, 0], [0, 1], [1, 1]] },
];

const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#4ade80', '#38bdf8', '#818cf8', '#c084fc', '#f472b6'];

function shapeBounds(shape: Shape): { w: number; h: number } {
  const w = Math.max(...shape.cells.map((c) => c[0])) + 1;
  const h = Math.max(...shape.cells.map((c) => c[1])) + 1;
  return { w, h };
}

function randomPiece(): Piece {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return { id: `${Date.now()}-${Math.random()}`, shape, color };
}

function emptyBoard(): (string | null)[] {
  return Array(GRID * GRID).fill(null);
}

function canPlace(board: (string | null)[], shape: Shape, col: number, row: number): boolean {
  return shape.cells.every(([dx, dy]) => {
    const x = col + dx;
    const y = row + dy;
    if (x < 0 || y < 0 || x >= GRID || y >= GRID) return false;
    return board[y * GRID + x] === null;
  });
}

function canPlaceAnywhere(board: (string | null)[], shape: Shape): boolean {
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      if (canPlace(board, shape, col, row)) return true;
    }
  }
  return false;
}

export default function BlockBlastGame() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [board, setBoard] = useState<(string | null)[]>(emptyBoard());
  const [pieces, setPieces] = useState<(Piece | null)[]>([null, null, null]);
  const [score, setScore] = useState(0);
  const best = GameScoreRepository.getBest('block-blast');

  const boardRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{
    pieceIndex: number;
    piece: Piece;
    x: number;
    y: number;
    anchor: Point | null;
    valid: boolean;
  } | null>(null);

  const start = () => {
    setBoard(emptyBoard());
    setPieces([randomPiece(), randomPiece(), randomPiece()]);
    setScore(0);
    setPhase('playing');
  };

  const checkGameOver = (nextBoard: (string | null)[], nextPieces: (Piece | null)[], finalScore: number) => {
    const stillPlayable = nextPieces.some((p) => p && canPlaceAnywhere(nextBoard, p.shape));
    if (!stillPlayable) {
      GameScoreRepository.record('block-blast', finalScore);
      setPhase('over');
    }
  };

  const placeAt = (pieceIndex: number, piece: Piece, col: number, row: number) => {
    const next = [...board];
    piece.shape.cells.forEach(([dx, dy]) => {
      next[(row + dy) * GRID + (col + dx)] = piece.color;
    });

    // clear any fully-filled rows/columns
    const fullRows: number[] = [];
    const fullCols: number[] = [];
    for (let r = 0; r < GRID; r++) {
      if (Array.from({ length: GRID }, (_, c) => next[r * GRID + c]).every((v) => v !== null)) fullRows.push(r);
    }
    for (let c = 0; c < GRID; c++) {
      if (Array.from({ length: GRID }, (_, r) => next[r * GRID + c]).every((v) => v !== null)) fullCols.push(c);
    }
    fullRows.forEach((r) => {
      for (let c = 0; c < GRID; c++) next[r * GRID + c] = null;
    });
    fullCols.forEach((c) => {
      for (let r = 0; r < GRID; r++) next[r * GRID + c] = null;
    });

    const linesCleared = fullRows.length + fullCols.length;
    const gained = piece.shape.cells.length + (linesCleared > 0 ? linesCleared * 10 + (linesCleared > 1 ? linesCleared * 5 : 0) : 0);

    let nextPieces = pieces.map((p, i) => (i === pieceIndex ? null : p));
    if (nextPieces.every((p) => p === null)) {
      nextPieces = [randomPiece(), randomPiece(), randomPiece()];
    }

    const nextScore = score + gained;
    setBoard(next);
    setPieces(nextPieces);
    setScore(nextScore);
    setDrag(null);
    checkGameOver(next, nextPieces, nextScore);
  };

  const computeTarget = (piece: Piece, clientX: number, clientY: number): { anchor: Point | null; valid: boolean } => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { anchor: null, valid: false };
    const liftedY = clientY - LIFT;
    const localX = clientX - rect.left;
    const localY = liftedY - rect.top;
    if (localX < -CELL || localX > BOARD + CELL || localY < -CELL * 2 || localY > BOARD + CELL) {
      return { anchor: null, valid: false };
    }
    const { w, h } = shapeBounds(piece.shape);
    let col = Math.round(localX / CELL - w / 2);
    let row = Math.round(localY / CELL - h / 2);
    col = Math.max(0, Math.min(GRID - w, col));
    row = Math.max(0, Math.min(GRID - h, row));
    return { anchor: [col, row], valid: canPlace(board, piece.shape, col, row) };
  };

  const onPointerDown = (e: React.PointerEvent, index: number, piece: Piece) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const { anchor, valid } = computeTarget(piece, e.clientX, e.clientY);
    setDrag({ pieceIndex: index, piece, x: e.clientX, y: e.clientY, anchor, valid });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const { anchor, valid } = computeTarget(drag.piece, e.clientX, e.clientY);
    setDrag({ ...drag, x: e.clientX, y: e.clientY, anchor, valid });
  };

  const onPointerUp = () => {
    if (!drag) return;
    if (drag.anchor && drag.valid) {
      placeAt(drag.pieceIndex, drag.piece, drag.anchor[0], drag.anchor[1]);
    } else {
      setDrag(null);
    }
  };

  const previewCells = useMemo(() => {
    if (!drag?.anchor) return new Set<number>();
    const [col, row] = drag.anchor;
    return new Set(drag.piece.shape.cells.map(([dx, dy]) => (row + dy) * GRID + (col + dx)));
  }, [drag]);

  if (phase === 'over') return <GameOverScreen score={score} onRestart={start} />;

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader title="🧩 Block Blast" right={<span className="text-sm font-bold text-ink-500">{t('score')}: {score}</span>} />

      {phase === 'idle' ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl">🧩</span>
          <p className="max-w-xs text-sm text-ink-500">Drag pieces onto the grid. Fill a full row or column to clear it and score big.</p>
          <p className="text-sm text-ink-500">
            {t('bestScore')}: {best || '—'}
          </p>
          <Button size="lg" onClick={start}>
            {t('startGame')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-1 select-none flex-col items-center justify-center gap-6 px-4">
          <div
            ref={boardRef}
            className="relative overflow-hidden rounded-2xl bg-ink-900 shadow-elevated ring-4 ring-ink-900/60"
            style={{ width: BOARD, height: BOARD }}
          >
            {Array.from({ length: GRID * GRID }, (_, i) => {
              const filled = board[i];
              const isPreview = previewCells.has(i);
              const row = Math.floor(i / GRID);
              const col = i % GRID;
              return (
                <div
                  key={i}
                  className="absolute rounded-[6px]"
                  style={{
                    width: CELL - 3,
                    height: CELL - 3,
                    left: col * CELL + 1.5,
                    top: row * CELL + 1.5,
                    background: filled ?? (isPreview ? (drag?.valid ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.35)') : 'rgba(255,255,255,0.04)'),
                    boxShadow: filled ? 'inset 0 0 0 1px rgba(0,0,0,0.15)' : undefined,
                    outline: isPreview ? `2px solid ${drag?.valid ? '#4ade80' : '#f87171'}` : undefined,
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4">
            {pieces.map((piece, i) => {
              if (!piece) return <div key={i} className="h-[68px] w-[68px]" />;
              const { w, h } = shapeBounds(piece.shape);
              const scale = Math.min(68 / (w * CELL), 68 / (h * CELL), 1);
              const isDragging = drag?.pieceIndex === i;
              return (
                <div
                  key={piece.id}
                  onPointerDown={(e) => onPointerDown(e, i, piece)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  className="relative flex h-[68px] w-[68px] touch-none items-center justify-center rounded-xl bg-white shadow-card ring-1 ring-ink-100"
                  style={{ opacity: isDragging ? 0.25 : 1 }}
                >
                  <div className="relative" style={{ width: w * CELL * scale, height: h * CELL * scale }}>
                    {piece.shape.cells.map(([dx, dy], idx) => (
                      <div
                        key={idx}
                        className="absolute rounded-[4px]"
                        style={{
                          width: (CELL - 5) * scale,
                          height: (CELL - 5) * scale,
                          left: dx * CELL * scale,
                          top: dy * CELL * scale,
                          background: piece.color,
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[11px] text-ink-400">Drag a piece onto the grid — release to drop</p>
        </div>
      )}

      {drag && (
        <div
          className="pointer-events-none fixed z-50"
          style={{
            left: drag.x - (shapeBounds(drag.piece.shape).w * CELL) / 2,
            top: drag.y - LIFT - (shapeBounds(drag.piece.shape).h * CELL) / 2,
          }}
        >
          <div className="relative" style={{ width: shapeBounds(drag.piece.shape).w * CELL, height: shapeBounds(drag.piece.shape).h * CELL }}>
            {drag.piece.shape.cells.map(([dx, dy], idx) => (
              <div
                key={idx}
                className="absolute rounded-[6px] opacity-90"
                style={{ width: CELL - 4, height: CELL - 4, left: dx * CELL + 2, top: dy * CELL + 2, background: drag.piece.color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
