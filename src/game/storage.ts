import { LevelProgress, GameSettings } from './types';

const STORAGE_KEY_PROGRESS = 'pixel_adventure_progress_v1';
const STORAGE_KEY_SETTINGS = 'pixel_adventure_settings_v1';

export interface GameSaveData {
  levels: Record<number, LevelProgress>;
  totalScore: number;
  totalCoins: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.7,
  musicVolume: 0.5,
  sfxVolume: 0.8,
  screenShake: true,
  touchControlsVisible: true,
};

const DEFAULT_PROGRESS: GameSaveData = {
  levels: {
    1: { unlocked: true, completed: false, highScore: 0, bestTime: 0, coinsCollected: 0, totalCoins: 35, stars: 0 },
    2: { unlocked: false, completed: false, highScore: 0, bestTime: 0, coinsCollected: 0, totalCoins: 40, stars: 0 },
    3: { unlocked: false, completed: false, highScore: 0, bestTime: 0, coinsCollected: 0, totalCoins: 38, stars: 0 },
  },
  totalScore: 0,
  totalCoins: 0,
};

export class StorageManager {
  public static loadProgress(): GameSaveData {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          levels: { ...DEFAULT_PROGRESS.levels, ...parsed.levels },
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROGRESS;
  }

  public static saveProgress(data: GameSaveData) {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(data));
    } catch {
      // Ignore
    }
  }

  public static updateLevelCompletion(
    levelId: number,
    score: number,
    coins: number,
    timeTaken: number,
    stars: number
  ): GameSaveData {
    const data = this.loadProgress();
    const current = data.levels[levelId] || {
      unlocked: true,
      completed: false,
      highScore: 0,
      bestTime: 9999,
      coinsCollected: 0,
      totalCoins: 30,
      stars: 0,
    };

    current.completed = true;
    current.highScore = Math.max(current.highScore, score);
    current.coinsCollected = Math.max(current.coinsCollected, coins);
    current.bestTime = current.bestTime === 0 ? timeTaken : Math.min(current.bestTime, timeTaken);
    current.stars = Math.max(current.stars, stars);
    data.levels[levelId] = current;

    // Unlock next level if exists
    if (data.levels[levelId + 1]) {
      data.levels[levelId + 1].unlocked = true;
    }

    data.totalCoins += coins;
    data.totalScore += score;

    this.saveProgress(data);
    return data;
  }

  public static loadSettings(): GameSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: GameSettings) {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }
}
