import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { GameScoreRepository } from '@/services/storage/gameStorage';
import GameHeader from '@/components/games/GameHeader';
import GameOverScreen from '@/components/games/GameOverScreen';
import Button from '@/components/ui/Button';

const GOOD = ['🍔', '🍕', '🍟', '🥤', '🍩'];
const BAD = ['🗑️', '🔥', '💣'];
const WIDTH = 320;
const HEIGHT = 420;
const BASKET_WIDTH = 60;

interface FallingItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  good: boolean;
  speed: number;
}

export default function CatchFoodGame() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const best = GameScoreRepository.getBest('catch-food');

  const basketX = useRef(WIDTH / 2 - BASKET_WIDTH / 2);
  const [, forceRender] = useState(0);
  const itemsRef = useRef<FallingItem[]>([]);
  const idCounter = useRef(0);
  const frameRef = useRef<number>(0);
  const lastSpawn = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);

  const start = () => {
    itemsRef.current = [];
    basketX.current = WIDTH / 2 - BASKET_WIDTH / 2;
    scoreRef.current = 0;
    livesRef.current = 3;
    setScore(0);
    setLives(3);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;

      if (now - lastSpawn.current > 800) {
        lastSpawn.current = now;
        const good = Math.random() > 0.25;
        idCounter.current += 1;
        itemsRef.current.push({
          id: idCounter.current,
          x: Math.random() * (WIDTH - 30),
          y: -30,
          emoji: good ? GOOD[Math.floor(Math.random() * GOOD.length)] : BAD[Math.floor(Math.random() * BAD.length)],
          good,
          speed: 0.09 + Math.random() * 0.05 + scoreRef.current * 0.0004,
        });
      }

      const basketY = HEIGHT - 50;
      const remaining: FallingItem[] = [];
      for (const item of itemsRef.current) {
        const newY = item.y + item.speed * dt;
        const caught =
          newY > basketY - 10 &&
          newY < basketY + 30 &&
          item.x + 15 > basketX.current &&
          item.x < basketX.current + BASKET_WIDTH;

        if (caught) {
          if (item.good) {
            scoreRef.current += 10;
          } else {
            livesRef.current -= 1;
          }
          continue;
        }
        if (newY > HEIGHT) {
          if (item.good) livesRef.current -= 1;
          continue;
        }
        remaining.push({ ...item, y: newY });
      }
      itemsRef.current = remaining;
      setScore(scoreRef.current);
      setLives(livesRef.current);
      forceRender((n) => n + 1);

      if (livesRef.current <= 0) {
        GameScoreRepository.record('catch-food', scoreRef.current);
        setPhase('over');
        return;
      }
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [phase]);

  const moveBasket = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left - BASKET_WIDTH / 2;
    basketX.current = Math.max(0, Math.min(WIDTH - BASKET_WIDTH, x));
  };

  if (phase === 'over') return <GameOverScreen score={score} onRestart={start} />;

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader
        title="🍔 Catch the Food"
        right={
          phase === 'playing' ? (
            <span className="text-xs font-bold text-ink-500">
              {t('score')}: {score} · {t('lives')}: {'❤️'.repeat(Math.max(0, lives))}
            </span>
          ) : undefined
        }
      />

      {phase === 'idle' ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl">🍔</span>
          <p className="text-sm text-ink-500">
            {t('bestScore')}: {best || '—'}
          </p>
          <Button size="lg" onClick={start}>
            {t('startGame')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-4">
          <div
            className="relative touch-none overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 to-cream-100 shadow-elevated"
            style={{ width: WIDTH, height: HEIGHT }}
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              moveBasket(e.touches[0].clientX, rect);
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              moveBasket(e.clientX, rect);
            }}
          >
            {itemsRef.current.map((item) => (
              <div key={item.id} className="absolute text-2xl" style={{ left: item.x, top: item.y }}>
                {item.emoji}
              </div>
            ))}
            <div
              className="absolute bottom-2 flex h-8 items-center justify-center rounded-full bg-brand-600 text-lg shadow-md"
              style={{ width: BASKET_WIDTH, left: basketX.current }}
            >
              🧺
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
