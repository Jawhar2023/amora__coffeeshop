import { useEffect, useState } from 'react';
import type { LiquidColor } from '../types';
import { LIQUID_COLORS } from '../colors';

interface LiquidLayerProps {
  color: LiquidColor;
  heightPercent: number;
  isTopOfTube: boolean;
  /** 'enter' grows the layer in from nothing, 'exit' drains it away to nothing */
  animatePhase?: 'enter' | 'exit' | null;
}

export default function LiquidLayer({ color, heightPercent, isTopOfTube, animatePhase }: LiquidLayerProps) {
  const [height, setHeight] = useState(animatePhase === 'enter' ? 0 : heightPercent);
  const style = LIQUID_COLORS[color];

  useEffect(() => {
    if (animatePhase === 'enter') {
      setHeight(0);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setHeight(heightPercent)));
      return () => cancelAnimationFrame(raf);
    }
    if (animatePhase === 'exit') {
      const raf = requestAnimationFrame(() => setHeight(0));
      return () => cancelAnimationFrame(raf);
    }
    setHeight(heightPercent);
  }, [animatePhase, heightPercent]);

  return (
    <div
      className="relative w-full shrink-0 transition-[height] duration-300 ease-out motion-reduce:transition-none"
      style={{ height: `${height}%`, background: style.gradient }}
    >
      {isTopOfTube && height > 1 && (
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-[45%] rounded-t-[45%] opacity-70"
          style={{ background: `linear-gradient(180deg, ${style.highlight} 0%, transparent 100%)` }}
        />
      )}
    </div>
  );
}
