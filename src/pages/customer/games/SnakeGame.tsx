import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft as LeftIcon, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { GameScoreRepository } from '@/services/storage/gameStorage';
import GameHeader from '@/components/games/GameHeader';
import GameOverScreen from '@/components/games/GameOverScreen';
import Button from '@/components/ui/Button';

const GRID = 15;
const CELL = 22;
const BOARD = GRID * CELL;
type Point = { x: number; y: number };
type Dir = 'up' | 'down' | 'left' | 'right';

const DIRS: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

// rotation so the head + eyes face the direction of travel
const HEAD_ROTATION: Record<Dir, number> = { right: 0, down: 90, left: 180, up: 270 };

function randomFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
}

export default function SnakeGame() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const best = GameScoreRepository.getBest('snake');

  const snakeRef = useRef<Point[]>([{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }]);
  const dirRef = useRef<Dir>('right');
  const nextDirRef = useRef<Dir>('right');
  const foodRef = useRef<Point>(randomFood(snakeRef.current));
  const [, forceRender] = useState(0);
  const speedRef = useRef(170);
  const [pulse, setPulse] = useState(false);

  const reset = () => {
    snakeRef.current = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }];
    dirRef.current = 'right';
    nextDirRef.current = 'right';
    foodRef.current = randomFood(snakeRef.current);
    speedRef.current = 170;
    setScore(0);
  };

  const start = () => {
    reset();
    setPhase('playing');
  };

  const changeDir = useCallback((d: Dir) => {
    const opposite: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };
    if (opposite[d] !== dirRef.current && d !== dirRef.current) {
      nextDirRef.current = d;
      vibrate(8);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') changeDir('up');
      if (e.key === 'ArrowDown') changeDir('down');
      if (e.key === 'ArrowLeft') changeDir('left');
      if (e.key === 'ArrowRight') changeDir('right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [changeDir]);

  useEffect(() => {
    if (phase !== 'playing') return;
    let timeoutId: number;

    const tick = () => {
      dirRef.current = nextDirRef.current;
      const delta = DIRS[dirRef.current];
      const head = snakeRef.current[0];
      const newHead: Point = { x: head.x + delta.x, y: head.y + delta.y };

      const hitWall = newHead.x < 0 || newHead.y < 0 || newHead.x >= GRID || newHead.y >= GRID;
      const hitSelf = snakeRef.current.some((s) => s.x === newHead.x && s.y === newHead.y);

      if (hitWall || hitSelf) {
        vibrate([30, 40, 30]);
        const finalScore = (snakeRef.current.length - 3) * 10;
        GameScoreRepository.record('snake', finalScore);
        setScore(finalScore);
        setPhase('over');
        return;
      }

      const ateFood = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
      const newSnake = [newHead, ...snakeRef.current];
      if (ateFood) {
        foodRef.current = randomFood(newSnake);
        setScore((s) => s + 10);
        speedRef.current = Math.max(75, speedRef.current - 3.5);
        vibrate(15);
        setPulse(true);
        window.setTimeout(() => setPulse(false), 200);
      } else {
        newSnake.pop();
      }
      snakeRef.current = newSnake;
      forceRender((n) => n + 1);
      timeoutId = window.setTimeout(tick, speedRef.current);
    };

    timeoutId = window.setTimeout(tick, speedRef.current);
    return () => window.clearTimeout(timeoutId);
  }, [phase, score]);

  // Continuous joystick-style swipe: fires as soon as the drag crosses a small
  // threshold, then re-anchors, so quick flicks feel instant instead of
  // waiting for touchend like a classic one-shot swipe.
  const dragOrigin = useRef<Point | null>(null);
  const THRESHOLD = 18;

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragOrigin.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragOrigin.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragOrigin.current.x;
    const dy = touch.clientY - dragOrigin.current.y;
    if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      changeDir(dx > 0 ? 'right' : 'left');
    } else {
      changeDir(dy > 0 ? 'down' : 'up');
    }
    dragOrigin.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = () => {
    dragOrigin.current = null;
  };

  if (phase === 'over') return <GameOverScreen score={score} onRestart={start} />;

  const transitionMs = Math.max(60, speedRef.current - 15);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-cream-50 to-ink-50">
      <GameHeader title="🐍 Snake" right={<span className="text-sm font-bold text-ink-500">{t('score')}: {score}</span>} />

      {phase === 'idle' ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl">🐍</span>
          <p className="text-sm text-ink-500">
            {t('bestScore')}: {best}
          </p>
          <Button size="lg" onClick={start}>
            {t('startGame')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-1 select-none flex-col items-center justify-center gap-5 px-4">
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative touch-none overflow-hidden rounded-[1.75rem] shadow-elevated ring-4 ring-ink-900/80"
            style={{
              width: BOARD,
              height: BOARD,
              background:
                'radial-gradient(circle at 30% 20%, #2a3a24 0%, #1a2517 55%, #10160d 100%)',
              backgroundImage:
                'radial-gradient(circle at 30% 20%, #2a3a24 0%, #1a2517 55%, #10160d 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent ' +
                CELL +
                'px), repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent ' +
                CELL +
                'px)',
            }}
          >
            {/* food */}
            <div
              className={`absolute flex items-center justify-center transition-transform ${pulse ? 'scale-125' : 'scale-100'}`}
              style={{
                width: CELL,
                height: CELL,
                left: foodRef.current.x * CELL,
                top: foodRef.current.y * CELL,
                transitionDuration: '180ms',
              }}
            >
              <span
                className="block rounded-full shadow-[0_0_10px_2px_rgba(248,113,113,0.55)]"
                style={{
                  width: CELL - 6,
                  height: CELL - 6,
                  background: 'radial-gradient(circle at 32% 28%, #fca5a5 0%, #ef4444 45%, #b91c1c 100%)',
                }}
              />
              <span
                className="absolute rounded-full bg-emerald-500"
                style={{ width: 5, height: 6, top: 1, left: '54%' }}
              />
            </div>

            {/* snake */}
            {snakeRef.current.map((s, i) => {
              const isHead = i === 0;
              const isTail = i === snakeRef.current.length - 1;
              const t = 1 - i / Math.max(8, snakeRef.current.length);
              const size = isHead ? CELL - 2 : isTail ? CELL - 8 : CELL - 3 - Math.max(0, 6 - i);
              const inset = (CELL - size) / 2;

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    width: CELL,
                    height: CELL,
                    left: s.x * CELL,
                    top: s.y * CELL,
                    transition: `left ${transitionMs}ms linear, top ${transitionMs}ms linear`,
                  }}
                >
                  <div
                    className="absolute rounded-[7px]"
                    style={{
                      width: size,
                      height: size,
                      left: inset,
                      top: inset,
                      background: isHead
                        ? 'linear-gradient(135deg, #86efac, #22c55e 60%, #16a34a)'
                        : `linear-gradient(135deg, rgba(74,222,128,${0.55 + t * 0.35}), rgba(22,163,74,${0.65 + t * 0.3}))`,
                      boxShadow: isHead ? '0 2px 6px rgba(0,0,0,0.35)' : 'inset 0 0 0 1px rgba(0,0,0,0.12)',
                      transform: isHead ? `rotate(${HEAD_ROTATION[dirRef.current]}deg)` : undefined,
                    }}
                  >
                    {isHead && (
                      <>
                        <span className="absolute h-[5px] w-[5px] rounded-full bg-white" style={{ top: '18%', right: '14%' }}>
                          <span className="absolute h-[2.5px] w-[2.5px] rounded-full bg-ink-900" style={{ top: '30%', left: '30%' }} />
                        </span>
                        <span className="absolute h-[5px] w-[5px] rounded-full bg-white" style={{ bottom: '18%', right: '14%' }}>
                          <span className="absolute h-[2.5px] w-[2.5px] rounded-full bg-ink-900" style={{ top: '30%', left: '30%' }} />
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative grid grid-cols-3 gap-2.5">
            <div />
            <DirButton icon={<ArrowUp size={22} />} onClick={() => changeDir('up')} />
            <div />
            <DirButton icon={<LeftIcon size={22} />} onClick={() => changeDir('left')} />
            <div className="flex items-center justify-center text-lg">🕹️</div>
            <DirButton icon={<ArrowRight size={22} />} onClick={() => changeDir('right')} />
            <div />
            <DirButton icon={<ArrowDown size={22} />} onClick={() => changeDir('down')} />
            <div />
          </div>
          <p className="text-center text-[11px] text-ink-400">Swipe on the board or use the pad — drag continuously to steer</p>
        </div>
      )}
    </div>
  );
}

function DirButton({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ink-700 shadow-card ring-1 ring-ink-100 transition-all active:scale-90 active:bg-brand-50 active:text-brand-600"
    >
      {icon}
    </button>
  );
}
