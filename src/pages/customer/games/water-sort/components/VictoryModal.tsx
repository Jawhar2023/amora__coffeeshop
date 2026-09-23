import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw, Home } from 'lucide-react';
import StarRating from './StarRating';

interface VictoryModalProps {
  level: number;
  moves: number;
  bestMoves?: number;
  stars: 1 | 2 | 3;
  onNextLevel: () => void;
  onReplay: () => void;
}

const CONFETTI_COLORS = ['#22d3ee', '#f43f5e', '#facc15', '#a3e635', '#a855f7', '#38bdf8'];

export default function VictoryModal({ level, moves, bestMoves, stars, onNextLevel, onReplay }: VictoryModalProps) {
  const navigate = useNavigate();

  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.6 + Math.random() * 1.2,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: Math.random() * 360,
        size: 5 + Math.random() * 5,
      })),
    []
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="absolute top-[-5%] rounded-sm motion-reduce:hidden"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.size * 1.6,
              background: c.color,
              animation: `confetti-fall ${c.duration}s ease-in ${c.delay}s forwards`,
              transform: `rotate(${c.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div className="animate-pop relative w-full max-w-xs overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-slate-800 to-slate-900 p-6 text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Level Complete</p>
        <p className="mt-1 font-[var(--font-display)] text-3xl font-extrabold text-white">Level {level}</p>

        <div className="mt-4">
          <StarRating stars={stars} />
        </div>

        <div className="mt-5 flex items-center justify-center gap-6 text-white">
          <div>
            <p className="text-2xl font-extrabold">{moves}</p>
            <p className="text-[11px] uppercase tracking-wide text-white/50">Moves</p>
          </div>
          <div className="h-8 w-px bg-white/15" />
          <div>
            <p className="text-2xl font-extrabold">{bestMoves ?? moves}</p>
            <p className="text-[11px] uppercase tracking-wide text-white/50">Best</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNextLevel}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 py-3.5 text-sm font-extrabold uppercase tracking-wide text-slate-900 shadow-[0_10px_24px_-8px_rgba(34,211,238,0.6)] transition-transform active:scale-95"
        >
          Next Level <ArrowRight size={16} />
        </button>

        <div className="mt-2.5 flex gap-2.5">
          <button
            type="button"
            onClick={onReplay}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-white/15 py-2.5 text-xs font-bold uppercase tracking-wide text-white/80 transition-colors active:bg-white/10"
          >
            <RotateCcw size={14} /> Replay
          </button>
          <button
            type="button"
            onClick={() => navigate('/games')}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-white/15 py-2.5 text-xs font-bold uppercase tracking-wide text-white/80 transition-colors active:bg-white/10"
          >
            <Home size={14} /> Games
          </button>
        </div>
      </div>
    </div>
  );
}
