export interface Platform {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  type?: 'moving' | 'toggling';
  movement?: {
    axis: 'x' | 'y' | 'z';
    range: number;
    speed: number;
  };
  toggleInterval?: number;
  isStart?: boolean;
  isEnd?: boolean;
}