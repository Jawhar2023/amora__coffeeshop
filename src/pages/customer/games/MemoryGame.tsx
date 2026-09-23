import { useEffect, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { GameScoreRepository } from '@/services/storage/gameStorage';
import GameHeader from '@/components/games/GameHeader';
import GameOverScreen from '@/components/games/GameOverScreen';
import Button from '@/components/ui/Button';

const EMOJIS = ['🍔', '🍕', '🍰', '🥤', '🍟', '🍩', '🌮', '🍣'];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function buildDeck(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  return pairs
    .sort(() => Math.random() - 0.5)
    .map((emoji, id) => ({ id, emoji, flipped: false, matched: false }));
}

export default function MemoryGame() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'idle' | 'playing' | 'won'>('idle');
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const best = GameScoreRepository.getBest('memory');

  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(interval);
  }, [phase]);

  const start = () => {
    setCards(buildDeck());
    setSelected([]);
    setMoves(0);
    setSeconds(0);
    setPhase('playing');
  };

  const handleFlip = (id: number) => {
    if (selected.length === 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const nextSelected = [...selected, id];
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextSelected;
      const cardA = cards.find((c) => c.id === a)!;
      const cardB = cards.find((c) => c.id === b)!;
      if (cardA.emoji === cardB.emoji) {
        window.setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c)));
          setSelected([]);
        }, 300);
      } else {
        window.setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c)));
          setSelected([]);
        }, 700);
      }
    }
  };

  useEffect(() => {
    if (phase === 'playing' && cards.length > 0 && cards.every((c) => c.matched)) {
      const score = Math.max(10, 1000 - moves * 20 - seconds * 5);
      GameScoreRepository.record('memory', score);
      setPhase('won');
    }
  }, [cards, phase, moves, seconds]);

  if (phase === 'won') {
    const score = Math.max(10, 1000 - moves * 20 - seconds * 5);
    return <GameOverScreen score={score} onRestart={start} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader
        title="🧠 Memory Match"
        right={
          phase === 'playing' ? (
            <span className="text-xs font-bold text-ink-500">
              {t('moves')}: {moves} · {t('time')}: {seconds}s
            </span>
          ) : undefined
        }
      />

      {phase === 'idle' ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl">🧠</span>
          <p className="text-sm text-ink-500">
            {t('bestScore')}: {best || '—'}
          </p>
          <Button size="lg" onClick={start}>
            {t('startGame')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2.5 px-5 pt-2">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className={`flex aspect-square items-center justify-center rounded-xl text-2xl shadow-card transition-transform ${
                card.flipped || card.matched ? 'bg-white' : 'bg-brand-600 active:scale-95'
              } ${card.matched ? 'opacity-50' : ''}`}
            >
              {card.flipped || card.matched ? card.emoji : ''}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
