export type LiquidColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'cyan'
  | 'lime'
  | 'rose'
  | 'sky'
  | 'amber';

export interface Tube {
  id: string;
  layers: LiquidColor[];
}

export type GameStatus = 'idle' | 'playing' | 'won';

export interface LevelConfig {
  numColors: number;
  numTubes: number;
  numEmpty: number;
  targetMoves: number;
}

export interface WaterSortProgress {
  currentLevel: number;
  bestMoves: Record<number, number>;
  soundEnabled: boolean;
}
