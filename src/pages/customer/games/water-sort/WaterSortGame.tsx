import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useWaterSortGame } from './hooks/useWaterSortGame';
import Tube from './components/Tube';
import GameControls from './components/GameControls';
import VictoryModal from './components/VictoryModal';
import Button from '@/components/ui/Button';

export default function WaterSortGame() {
  const navigate = useNavigate();
  const {
    tubes,
    selectedTube,
    moves,
    level,
    status,
    stars,
    isAnimating,
    pendingAnim,
    shakeTubeId,
    soundEnabled,
    bestMoves,
    canUndo,
    startLevel,
    selectTube,
    undo,
    restart,
    nextLevel,
    toggleSound,
  } = useWaterSortGame();

  const tubeRefs = useRef(new Map<string, HTMLButtonElement>());
  const [sourceTransform, setSourceTransform] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (!pendingAnim) {
      setSourceTransform(null);
      return;
    }
    const fromEl = tubeRefs.current.get(pendingAnim.fromId);
    const toEl = tubeRefs.current.get(pendingAnim.toId);
    if (!fromEl || !toEl) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const dx = toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);
    const dy = Math.min(toRect.top - fromRect.top, -12);
    const angle = dx >= 0 ? 28 : -28;
    setSourceTransform(`translate(${dx * 0.5}px, ${dy}px) rotate(${angle}deg)`);
  }, [pendingAnim]);

  const registerTubeRef = useCallback(
    (id: string) => (el: HTMLButtonElement | null) => {
      if (el) tubeRefs.current.set(id, el);
      else tubeRefs.current.delete(id);
    },
    []
  );

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0b1224]">
      {/* premium ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -right-10 top-1/3 h-56 w-56 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex items-center justify-between px-5 pb-2 pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/games')}
            aria-label="Back to games"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-[var(--font-display)] text-lg font-extrabold text-white">Water Sort</h1>
            {status === 'playing' && <p className="text-xs font-semibold text-white/50">Level {level} · Moves: {moves}</p>}
          </div>
        </div>
        {status === 'playing' && (
          <GameControls canUndo={canUndo} soundEnabled={soundEnabled} onUndo={undo} onRestart={restart} onToggleSound={toggleSound} />
        )}
      </div>

      {status === 'idle' && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="text-6xl">🧪</span>
          <p className="max-w-xs text-sm text-white/60">
            Tap a tube to pick it up, tap another to pour. Sort every color into its own tube to clear the level.
          </p>
          <Button size="lg" onClick={() => startLevel(level)}>
            {level > 1 ? `Continue · Level ${level}` : 'Start Game'}
          </Button>
        </div>
      )}

      {status !== 'idle' && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-2 px-4 pb-10">
          <div className="flex max-w-md flex-wrap items-end justify-center gap-x-3 gap-y-6">
            {tubes.map((tube, i) => (
              <Tube
                key={tube.id}
                tube={tube}
                index={i}
                isSelected={selectedTube === tube.id}
                isShaking={shakeTubeId === tube.id}
                disabled={isAnimating || status !== 'playing'}
                pouringOutCount={pendingAnim?.fromId === tube.id ? pendingAnim.amount : 0}
                pouringIn={pendingAnim?.toId === tube.id ? { color: pendingAnim.color, amount: pendingAnim.amount } : null}
                transform={pendingAnim?.fromId === tube.id ? sourceTransform : null}
                onSelect={() => selectTube(tube.id)}
                registerRef={registerTubeRef(tube.id)}
              />
            ))}
          </div>
        </div>
      )}

      {status === 'won' && (
        <VictoryModal level={level} moves={moves} bestMoves={bestMoves} stars={stars} onNextLevel={nextLevel} onReplay={restart} />
      )}
    </div>
  );
}
