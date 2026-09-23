import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { GameRepository, GameScoreRepository } from '@/services/storage/gameStorage';
import BottomNav from '@/components/menu/BottomNav';
import type { GameConfig } from '@/types';

interface PosterTheme {
  bg: string;
  label: string;
  blobs: string[];
}

const POSTERS: Record<string, PosterTheme> = {
  xo: {
    bg: 'radial-gradient(circle at 30% 25%, #f97316 0%, #9a3412 55%, #431407 100%)',
    label: '#ffffff',
    blobs: ['#fde68a', '#38bdf8'],
  },
  'water-sort': {
    bg: 'radial-gradient(circle at 60% 25%, #38bdf8 0%, #0e7490 55%, #082f49 100%)',
    label: '#ffffff',
    blobs: ['#f43f5e', '#facc15', '#a3e635'],
  },
  snake: {
    bg: 'radial-gradient(circle at 30% 25%, #164e63 0%, #0f172a 60%, #020617 100%)',
    label: '#22d3ee',
    blobs: ['#22d3ee', '#a3e635', '#f472b6'],
  },
  memory: {
    bg: 'radial-gradient(circle at 70% 20%, #7c3aed 0%, #4c1d95 55%, #1e1b4b 100%)',
    label: '#fbbf24',
    blobs: ['#f472b6', '#c084fc', '#fbbf24'],
  },
  'catch-food': {
    bg: 'radial-gradient(circle at 30% 70%, #fb923c 0%, #c2410c 55%, #7c2d12 100%)',
    label: '#fef08a',
    blobs: ['#fde047', '#fb7185', '#fdba74'],
  },
  reaction: {
    bg: 'radial-gradient(circle at 50% 30%, #fbbf24 0%, #d97706 55%, #78350f 100%)',
    label: '#ffffff',
    blobs: ['#fef9c3', '#f97316'],
  },
  quiz: {
    bg: 'radial-gradient(circle at 30% 20%, #ef4444 0%, #991b1b 55%, #450a0a 100%)',
    label: '#ffffff',
    blobs: ['#ffffff', '#fca5a5'],
  },
  'truth-or-dare': {
    bg: 'radial-gradient(circle at 70% 25%, #ec4899 0%, #9d174d 55%, #4a044e 100%)',
    label: '#fde047',
    blobs: ['#fb7185', '#a78bfa'],
  },
  'block-blast': {
    bg: 'radial-gradient(circle at 30% 25%, #6d28d9 0%, #312e81 55%, #1e1b4b 100%)',
    label: '#fbbf24',
    blobs: ['#facc15', '#4ade80', '#a78bfa'],
  },
  'road-race': {
    bg: 'radial-gradient(circle at 50% 30%, #334155 0%, #1e293b 55%, #0f172a 100%)',
    label: '#ffffff',
    blobs: ['#ef4444', '#facc15'],
  },
};

const DEFAULT_POSTER: PosterTheme = {
  bg: 'radial-gradient(circle at 30% 25%, #c0392b 0%, #7c261f 60%, #3b0a06 100%)',
  label: '#ffffff',
  blobs: ['#f87171', '#fbbf24'],
};

function formatBest(game: GameConfig, best: number): string {
  if (best <= 0) return '—';
  if (game.id === 'reaction') return `${best}ms`;
  if (game.id === 'quiz') return `${best}/15`;
  if (game.id === 'truth-or-dare') return `${best}rd`;
  if (game.id === 'xo') return `${best}W`;
  if (game.id === 'water-sort') return `Lvl ${best}`;
  return String(best);
}

export default function GameCenterPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const games = GameRepository.getAll().filter((g) => g.enabled);

  return (
    <div className="min-h-screen bg-sky-50/70 pb-8">
      <header className="flex items-center gap-3 border-b border-sky-100 bg-white px-4 py-4">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-700">
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <h1 className="font-[var(--font-display)] text-2xl font-extrabold uppercase tracking-wide text-slate-700">{t('gameCenter')}</h1>
      </header>

      <div className="grid grid-cols-2 gap-4 px-4 pt-5">
        {games.map((game, i) => {
          const best = game.id === 'reaction' ? GameScoreRepository.getBestReactionMs() : GameScoreRepository.getBest(game.id);
          const poster = POSTERS[game.id] ?? DEFAULT_POSTER;
          const hasBest = best > 0;
          return (
            <button
              key={game.id}
              onClick={() => navigate(`/games/${game.id}`)}
              style={{ animationDelay: `${i * 40}ms` }}
              className="animate-pop group relative aspect-[0.92] overflow-hidden rounded-[26px] bg-white p-1.5 shadow-card ring-1 ring-black/5 transition-transform active:scale-[0.96]"
            >
              <div className="relative h-full w-full overflow-hidden rounded-[20px]" style={{ background: poster.bg }}>
                {poster.blobs.map((color, bi) => (
                  <span
                    key={bi}
                    className="pointer-events-none absolute rounded-full opacity-40 blur-xl"
                    style={{
                      background: color,
                      width: 60 + bi * 18,
                      height: 60 + bi * 18,
                      left: `${15 + bi * 30}%`,
                      top: `${bi % 2 === 0 ? -10 : 55}%`,
                    }}
                  />
                ))}

                {hasBest && (
                  <span className="absolute right-2 top-2 flex items-center gap-0.5 rounded-full bg-black/40 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
                    <Trophy size={10} className="text-yellow-300" />
                    {formatBest(game, best)}
                  </span>
                )}

                <span className="absolute inset-0 flex items-center justify-center text-[3.4rem] drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]">
                  {game.icon}
                </span>

                <div className="absolute inset-x-2 bottom-2 rounded-2xl bg-black/45 px-2.5 py-2 text-center backdrop-blur-sm">
                  <p
                    className="font-[var(--font-display)] text-[13px] font-extrabold uppercase leading-tight tracking-wide"
                    style={{ color: poster.label }}
                  >
                    {game.name}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mx-4 mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-4">
        <span className="text-2xl">⭐</span>
        <p className="text-xs text-ink-600">
          Finish any game for a chance to leave a quick review — totally optional, never required.
        </p>
      </div>

      <div className="h-16" />
      <BottomNav />
    </div>
  );
}
