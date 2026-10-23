export type GameState = 
  | 'MENU'
  | 'LEVEL_SELECT'
  | 'PLAYING'
  | 'PAUSED'
  | 'LEVEL_CLEAR'
  | 'GAME_OVER'
  | 'VICTORY'
  | 'HOW_TO_PLAY'
  | 'SETTINGS';

export type ThemeType = 'grass' | 'forest' | 'lava';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlayerPowerUp {
  type: 'speed' | 'high_jump' | 'shield';
  remainingTime: number; // in seconds
  duration: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: 'left' | 'right';
  animState: 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'hurt' | 'dead';
  animTimer: number;
  animFrame: number;
  onGround: boolean;
  onPlatformId?: string;
  isRunning: boolean;
  coyoteTimer: number;
  jumpBufferTimer: number;
  isJumping: boolean;
  health: number;
  maxHealth: number;
  lives: number;
  invulnerableTimer: number;
  powerUp: PlayerPowerUp | null;
  squashX: number;
  squashY: number;
}

export type BlockType = 
  | 'solid'
  | 'mystery_coin'
  | 'mystery_powerup'
  | 'mystery_heart'
  | 'empty_block'
  | 'breakable_brick'
  | 'spike'
  | 'spring'
  | 'crumbling';

export interface TileBlock extends Rect {
  id: string;
  type: BlockType;
  theme?: ThemeType;
  bumpOffset?: number; // for bounce effect when hit from below
  isHit?: boolean;
  crumbleTimer?: number; // starts when player stands on it
  isFallen?: boolean;
  respawnTimer?: number;
}

export interface MovingPlatform extends Rect {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  vx: number;
  vy: number;
  speed: number;
  currentT: number; // 0 to 1
  direction: 1 | -1;
  theme: ThemeType;
}

export type CollectibleType = 'coin' | 'powerup_speed' | 'powerup_jump' | 'powerup_shield' | 'heart';

export interface Collectible extends Rect {
  id: string;
  type: CollectibleType;
  collected: boolean;
  animFrame: number;
  animTimer: number;
  baseY: number;
  bobOffset: number;
}

export type EnemyType = 'slime' | 'mushroom' | 'bat' | 'fire_beetle';

export interface Enemy extends Rect {
  id: string;
  type: EnemyType;
  vx: number;
  vy: number;
  startX: number;
  startY: number;
  patrolDistance: number;
  facing: 'left' | 'right';
  isAlive: boolean;
  isSquashed: boolean;
  squashTimer: number;
  animTimer: number;
  animFrame: number;
  baseY: number; // for flying bat sine wave
  sineOffset?: number;
}

export interface Checkpoint extends Rect {
  id: string;
  spawnX: number;
  spawnY: number;
  isReached: boolean;
}

export interface PortalGoal extends Rect {
  animTimer: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'spark' | 'smoke' | 'rubble' | 'star';
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

export interface LevelData {
  id: number;
  name: string;
  subtitle: string;
  theme: ThemeType;
  width: number;
  height: number;
  timeLimit: number; // seconds
  playerSpawn: { x: number; y: number };
  blocks: TileBlock[];
  movingPlatforms: MovingPlatform[];
  collectibles: Collectible[];
  enemies: Enemy[];
  checkpoints: Checkpoint[];
  goal: PortalGoal;
}

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  highScore: number;
  bestTime: number; // in seconds
  coinsCollected: number;
  totalCoins: number;
  stars: number; // 0 to 3
}

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  screenShake: boolean;
  touchControlsVisible: boolean;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  run: boolean;
  up: boolean;
  down: boolean;
}
