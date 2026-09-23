import type { LiquidColor, Tube as TubeModel } from '../types';
import { TUBE_CAPACITY } from '../engine/gameLogic';
import LiquidLayer from './LiquidLayer';

interface DisplayLayer {
  color: LiquidColor;
  phase: 'enter' | 'exit' | null;
}

interface TubeProps {
  tube: TubeModel;
  index: number;
  isSelected: boolean;
  isShaking: boolean;
  disabled: boolean;
  /** count of top layers currently draining out (this tube is the pour source) */
  pouringOutCount: number;
  /** layers currently flowing in (this tube is the pour destination) */
  pouringIn: { color: LiquidColor; amount: number } | null;
  /** inline transform applied while this tube is animating toward its destination */
  transform: string | null;
  onSelect: () => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}

function describeContents(tube: TubeModel): string {
  if (tube.layers.length === 0) return 'empty';
  return `contains, from bottom to top, ${tube.layers.join(', ')}`;
}

export default function Tube({
  tube,
  index,
  isSelected,
  isShaking,
  disabled,
  pouringOutCount,
  pouringIn,
  transform,
  onSelect,
  registerRef,
}: TubeProps) {
  const layers: DisplayLayer[] = tube.layers.map((color, i) => ({
    color,
    phase: i >= tube.layers.length - pouringOutCount ? 'exit' : null,
  }));
  if (pouringIn) {
    for (let i = 0; i < pouringIn.amount; i++) layers.push({ color: pouringIn.color, phase: 'enter' });
  }

  return (
    <button
      ref={registerRef}
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-label={`Tube ${index + 1}, ${describeContents(tube)}`}
      aria-pressed={isSelected}
      className="group relative flex h-32 w-9 flex-col items-center rounded-xl transition-transform duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 motion-reduce:transition-none sm:h-36 sm:w-10 md:h-40 md:w-11"
      style={{ transform: transform ?? undefined, zIndex: transform ? 30 : undefined }}
    >
      <div
        className={`relative flex w-full flex-1 flex-col-reverse overflow-hidden rounded-b-[1.35rem] rounded-t-md border-2 border-white/20 bg-white/[0.04] shadow-[0_10px_22px_-8px_rgba(0,0,0,0.6)] transition-transform duration-150 ease-out ${
          isSelected ? '-translate-y-3 shadow-[0_0_0_3px_rgba(165,243,252,0.55),0_16px_28px_-8px_rgba(0,0,0,0.65)]' : ''
        } ${isShaking ? 'animate-tube-shake' : ''}`}
      >
        {layers.map((l, i) => (
          <LiquidLayer key={i} color={l.color} heightPercent={100 / TUBE_CAPACITY} isTopOfTube={i === layers.length - 1} animatePhase={l.phase} />
        ))}

        {/* glass rim shading */}
        <span className="pointer-events-none absolute inset-0 rounded-b-[1.35rem] rounded-t-md ring-1 ring-inset ring-white/10" />
        {/* glossy vertical reflection */}
        <span className="pointer-events-none absolute inset-y-1 left-1 w-1 rounded-full bg-gradient-to-b from-white/60 via-white/15 to-transparent opacity-70" />
      </div>
      {/* tube mouth */}
      <span className="-mt-px h-1.5 w-[82%] rounded-full bg-white/15" />
    </button>
  );
}
