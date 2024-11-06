export interface PlayerStyle {
  color: string;
  design: 'cube' | 'sphere' | 'diamond';
  material: 'normal' | 'neon';
}

export interface GameSettings {
  playerStyle: PlayerStyle;
  backgroundMode: 'day' | 'night';
} 