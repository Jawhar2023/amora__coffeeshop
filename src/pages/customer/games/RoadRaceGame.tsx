import { useEffect, useRef, useState } from 'react';
import { ArrowLeft as LeftIcon, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { GameScoreRepository } from '@/services/storage/gameStorage';
import GameHeader from '@/components/games/GameHeader';
import GameOverScreen from '@/components/games/GameOverScreen';
import Button from '@/components/ui/Button';
import TopDownCar from '@/components/games/TopDownCar';

const LANES = 3;
const ROAD_WIDTH = 300;
const ROAD_HEIGHT = 460;
const LANE_WIDTH = ROAD_WIDTH / LANES;
const CAR_W = 38;
const CAR_H = 62;
const PLAYER_Y = ROAD_HEIGHT - CAR_H - 16;
const MAX_BOARD_WIDTH = 320; // design width the road/physics are tuned for; scaled down to fit narrow screens

const TRAFFIC_COLORS = [
  { body: '#60a5fa', dark: '#1d4ed8' },
  { body: '#facc15', dark: '#b45309' },
  { body: '#a78bfa', dark: '#5b21b6' },
  { body: '#34d399', dark: '#047857' },
  { body: '#fb923c', dark: '#c2410c' },
  { body: '#f472b6', dark: '#be185d' },
];
const PLAYER_COLOR = { body: '#f87171', dark: '#7f1d1d' };

interface Traffic {
  id: number;
  lane: number;
  y: number;
  color: { body: string; dark: string };
  passed: boolean;
}

function laneX(lane: number, width: number): number {
  return lane * LANE_WIDTH + LANE_WIDTH / 2 - width / 2;
}

// cars look closer (bigger) near the player and further (smaller) near the horizon
function depthScale(y: number): number {
  const t = Math.max(0, Math.min(1, (y + CAR_H) / (ROAD_HEIGHT + CAR_H)));
  return 0.8 + 0.25 * t;
}

export default function RoadRaceGame() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const best = GameScoreRepository.getBest('road-race');

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [boardScale, setBoardScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const available = Math.min(el.clientWidth, MAX_BOARD_WIDTH);
      setBoardScale(Math.max(0.6, Math.min(1, available / (ROAD_WIDTH + 12))));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  const laneRef = useRef(1);
  const [, forceRender] = useState(0);
  const trafficRef = useRef<Traffic[]>([]);
  const idCounter = useRef(0);
  const frameRef = useRef<number>(0);
  const lastSpawn = useRef(0);
  const scoreRef = useRef(0);
  const speedRef = useRef(0.13);
  const dashOffset = useRef(0);

  const start = () => {
    laneRef.current = 1;
    trafficRef.current = [];
    scoreRef.current = 0;
    speedRef.current = 0.13;
    setScore(0);
    setPhase('playing');
  };

  const moveLane = (dir: -1 | 1) => {
    laneRef.current = Math.max(0, Math.min(LANES - 1, laneRef.current + dir));
    forceRender((n) => n + 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') moveLane(-1);
      if (e.key === 'ArrowRight') moveLane(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;
      dashOffset.current = (dashOffset.current + speedRef.current * dt * 1.4) % 48;

      if (now - lastSpawn.current > Math.max(500, 1000 - scoreRef.current * 2)) {
        lastSpawn.current = now;
        idCounter.current += 1;
        trafficRef.current.push({
          id: idCounter.current,
          lane: Math.floor(Math.random() * LANES),
          y: -CAR_H,
          color: TRAFFIC_COLORS[Math.floor(Math.random() * TRAFFIC_COLORS.length)],
          passed: false,
        });
      }

      let crashed = false;
      const remaining: Traffic[] = [];
      for (const car of trafficRef.current) {
        const movedY = car.y + speedRef.current * dt;

        if (!car.passed && movedY > PLAYER_Y + CAR_H) {
          car.passed = true;
          if (car.lane === laneRef.current) scoreRef.current += 3;
        }

        const overlapsY = movedY + CAR_H > PLAYER_Y && movedY < PLAYER_Y + CAR_H;
        if (overlapsY && car.lane === laneRef.current) {
          crashed = true;
        }

        if (movedY < ROAD_HEIGHT + CAR_H) {
          remaining.push({ ...car, y: movedY });
        }
      }
      trafficRef.current = remaining;

      speedRef.current = Math.min(0.32, speedRef.current + 0.0000025 * dt);
      scoreRef.current += dt * 0.006;
      setScore(Math.floor(scoreRef.current));
      forceRender((n) => n + 1);

      if (crashed) {
        GameScoreRepository.record('road-race', Math.floor(scoreRef.current));
        setPhase('over');
        return;
      }
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [phase]);

  const dragStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - dragStartX.current;
    if (dx > 30) moveLane(1);
    else if (dx < -30) moveLane(-1);
    dragStartX.current = null;
  };

  if (phase === 'over') return <GameOverScreen score={Math.floor(score)} scoreLabel="Distance score" onRestart={start} />;

  return (
    <div className="flex min-h-screen flex-col">
      <GameHeader title="🏎️ Road Race" right={<span className="text-sm font-bold text-ink-500">{t('score')}: {Math.floor(score)}</span>} />

      {phase === 'idle' ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl">🏎️</span>
          <p className="max-w-xs text-sm text-ink-500">Swipe or use the buttons to switch lanes. Dodge traffic and rack up distance.</p>
          <p className="text-sm text-ink-500">
            {t('bestScore')}: {best || '—'}
          </p>
          <Button size="lg" onClick={start}>
            {t('startGame')}
          </Button>
        </div>
      ) : (
        <div ref={wrapRef} className="flex flex-1 flex-col items-center justify-center gap-5 px-4">
          <div style={{ width: (ROAD_WIDTH + 12) * boardScale, height: (ROAD_HEIGHT + 12) * boardScale }}>
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative touch-none overflow-hidden rounded-[1.75rem] shadow-elevated ring-[6px] ring-ink-900"
            style={{
              width: ROAD_WIDTH,
              height: ROAD_HEIGHT,
              transform: `scale(${boardScale})`,
              transformOrigin: 'top center',
              background:
                'linear-gradient(180deg, #4b5563 0%, #374151 40%, #1f2937 100%), repeating-linear-gradient(115deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 7px)',
              boxShadow: 'inset 0 40px 60px -40px rgba(0,0,0,0.6), inset 0 -40px 60px -40px rgba(0,0,0,0.6)',
            }}
          >
            {/* grass shoulders */}
            <div
              className="absolute inset-y-0 left-0"
              style={{ width: 14, background: 'repeating-linear-gradient(180deg, #15803d 0px, #15803d 10px, #166534 10px, #166534 20px)' }}
            />
            <div
              className="absolute inset-y-0 right-0"
              style={{ width: 14, background: 'repeating-linear-gradient(180deg, #15803d 0px, #15803d 10px, #166534 10px, #166534 20px)' }}
            />
            {/* rumble strips */}
            <div
              className="absolute inset-y-0"
              style={{
                left: 14,
                width: 5,
                backgroundImage: 'repeating-linear-gradient(180deg, #ef4444 0px, #ef4444 14px, #f8fafc 14px, #f8fafc 28px)',
                backgroundPositionY: `${dashOffset.current}px`,
              }}
            />
            <div
              className="absolute inset-y-0"
              style={{
                right: 14,
                width: 5,
                backgroundImage: 'repeating-linear-gradient(180deg, #ef4444 0px, #ef4444 14px, #f8fafc 14px, #f8fafc 28px)',
                backgroundPositionY: `${dashOffset.current}px`,
              }}
            />

            {/* lane dividers */}
            {Array.from({ length: LANES - 1 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0"
                style={{
                  left: (i + 1) * LANE_WIDTH - 1.5,
                  width: 3,
                  backgroundImage:
                    'repeating-linear-gradient(180deg, rgba(250,204,21,0.85) 0px, rgba(250,204,21,0.85) 20px, transparent 20px, transparent 42px)',
                  backgroundPositionY: `${dashOffset.current}px`,
                }}
              />
            ))}

            {/* traffic, drawn back-to-front so nearer cars overlap further ones */}
            {[...trafficRef.current]
              .sort((a, b) => a.y - b.y)
              .map((car) => (
                <div
                  key={car.id}
                  className="absolute"
                  style={{ left: laneX(car.lane, CAR_W), top: car.y, width: CAR_W, height: CAR_H }}
                >
                  <TopDownCar width={CAR_W} height={CAR_H} body={car.color.body} bodyDark={car.color.dark} scale={depthScale(car.y)} />
                </div>
              ))}

            {/* player */}
            <div
              className="absolute transition-[left] duration-100 ease-out"
              style={{ left: laneX(laneRef.current, CAR_W), top: PLAYER_Y, width: CAR_W, height: CAR_H }}
            >
              <TopDownCar width={CAR_W} height={CAR_H} body={PLAYER_COLOR.body} bodyDark={PLAYER_COLOR.dark} variant="player" scale={1.0} />
            </div>
          </div>
          </div>

          <div className="flex items-center gap-6">
            <DirButton icon={<LeftIcon size={22} />} onClick={() => moveLane(-1)} />
            <DirButton icon={<ArrowRight size={22} />} onClick={() => moveLane(1)} />
          </div>
          <p className="text-center text-[11px] text-ink-400">Swipe left/right on the road, or use the buttons</p>
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
