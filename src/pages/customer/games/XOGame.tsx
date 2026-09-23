import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { GameScoreRepository } from '@/services/storage/gameStorage';
import GameHeader from '@/components/games/GameHeader';
import GameOverScreen from '@/components/games/GameOverScreen';
import Button from '@/components/ui/Button';

type Cell = 'X' | 'O' | null;
type Winner = 'X' | 'O' | 'draw' | null;

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getWinner(board: Cell[]): { winner: Winner; line: number[] | null } {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every((c) => c !== null)) return { winner: 'draw', line: null };
  return { winner: null, line: null };
}

export default function XOGame() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [tally, setTally] = useState({ X: 0, O: 0, draw: 0 });
  const best = GameScoreRepository.getBest('xo');

  const result = getWinner(board);

  const start = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setTally({ X: 0, O: 0, draw: 0 });
    setPhase('playing');
  };

  const nextRound = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setPhase('playing');
  };

  const play = (i: number) => {
    if (board[i] || result.winner) return;
    const next = [...board];
    next[i] = turn;
    setBoard(next);

    const nextResult = getWinner(next);
    if (nextResult.winner) {
      const newTally = {
        ...tally,
        [nextResult.winner]: tally[nextResult.winner] + 1,
      };
      setTally(newTally);
      const bestWins = Math.max(newTally.X, newTally.O);
      GameScoreRepository.record('xo', bestWins);
      setPhase('done');
    } else {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  };

  if (phase === 'done') {
    const winner = result.winner;
    const scoreLabel = winner === 'draw' ? "It's a draw" : `Player ${winner} wins this round`;
    return (
      <GameOverScreen
        score={Math.max(tally.X, tally.O)}
        scoreLabel={scoreLabel}
        onRestart={nextRound}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader
        title="⭕ Tic Tac Toe"
        right={
          phase === 'playing' ? (
            <span className="text-xs font-bold text-ink-500">
              X: {tally.X} · O: {tally.O} · Draws: {tally.draw}
            </span>
          ) : undefined
        }
      />

      {phase === 'idle' ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl">⭕</span>
          <p className="max-w-xs text-sm text-ink-500">Two players, one phone. Take turns tapping a square — first to line up 3 wins.</p>
          <p className="text-sm text-ink-500">
            {t('bestScore')}: {best || '—'}
          </p>
          <Button size="lg" onClick={start}>
            {t('startGame')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
          <p className="text-sm font-bold text-ink-700">
            Turn: <span className={turn === 'X' ? 'text-brand-600' : 'text-sky-600'}>Player {turn}</span>
          </p>
          <div className="grid grid-cols-3 gap-2.5 rounded-3xl bg-white p-2.5 shadow-card ring-1 ring-ink-100">
            {board.map((cell, i) => (
              <button
                key={i}
                onClick={() => play(i)}
                disabled={!!cell}
                className="flex h-24 w-24 items-center justify-center rounded-2xl bg-ink-50 text-5xl font-black transition-transform active:scale-95 disabled:active:scale-100"
              >
                <span className={cell === 'X' ? 'text-brand-600' : 'text-sky-600'}>{cell}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
