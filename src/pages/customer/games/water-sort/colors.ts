import type { LiquidColor } from './types';

interface LiquidStyle {
  /** main fill, top to bottom */
  gradient: string;
  /** thin top highlight shown on the topmost layer of a tube */
  highlight: string;
  /** glow used for selection / stream effects */
  glow: string;
}

// Centralized liquid palette — every color used anywhere in the game is defined once here.
export const LIQUID_COLORS: Record<LiquidColor, LiquidStyle> = {
  red: { gradient: 'linear-gradient(180deg, #ff6b6b 0%, #e63946 60%, #c11f2f 100%)', highlight: '#ffb3b3', glow: '#ef4444' },
  blue: { gradient: 'linear-gradient(180deg, #5aa8ff 0%, #3a7bff 60%, #1e4fd6 100%)', highlight: '#bcd9ff', glow: '#3b82f6' },
  green: { gradient: 'linear-gradient(180deg, #4ce089 0%, #22c55e 60%, #0f9d4e 100%)', highlight: '#c8f7d8', glow: '#22c55e' },
  yellow: { gradient: 'linear-gradient(180deg, #ffe066 0%, #facc15 60%, #d69e0a 100%)', highlight: '#fff3c4', glow: '#facc15' },
  purple: { gradient: 'linear-gradient(180deg, #b98bff 0%, #9155f6 60%, #6d28d9 100%)', highlight: '#e3d1ff', glow: '#a855f7' },
  pink: { gradient: 'linear-gradient(180deg, #ff8fc0 0%, #f0509a 60%, #c22672 100%)', highlight: '#ffd4e8', glow: '#ec4899' },
  orange: { gradient: 'linear-gradient(180deg, #ffb066 0%, #f97316 60%, #c2560a 100%)', highlight: '#ffdfb8', glow: '#f97316' },
  cyan: { gradient: 'linear-gradient(180deg, #7ff0f0 0%, #22d3ee 60%, #0aa6c2 100%)', highlight: '#cffcfc', glow: '#22d3ee' },
  lime: { gradient: 'linear-gradient(180deg, #d4fa6a 0%, #a3e635 60%, #77b419 100%)', highlight: '#eeffc4', glow: '#a3e635' },
  rose: { gradient: 'linear-gradient(180deg, #ff7a8a 0%, #f43f5e 60%, #be1938 100%)', highlight: '#ffcdd4', glow: '#f43f5e' },
  sky: { gradient: 'linear-gradient(180deg, #85d3ff 0%, #38bdf8 60%, #0a83c2 100%)', highlight: '#d3f0ff', glow: '#38bdf8' },
  amber: { gradient: 'linear-gradient(180deg, #ffd27a 0%, #eab308 60%, #b8850a 100%)', highlight: '#ffedbd', glow: '#eab308' },
};

export const COLOR_ORDER: LiquidColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 'cyan', 'lime', 'rose', 'sky', 'amber'];
