/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameState, GameSettings } from './game/types';
import { StorageManager, GameSaveData } from './game/storage';
import { audio } from './game/audio';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { GameCanvas } from './components/GameCanvas';
import { PauseModal } from './components/PauseModal';
import { LevelClearModal } from './components/LevelClearModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { SettingsModal } from './components/SettingsModal';
import { HowToPlayModal } from './components/HowToPlayModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [saveData, setSaveData] = useState<GameSaveData>(StorageManager.loadProgress());
  const [settings, setSettings] = useState<GameSettings>(StorageManager.loadSettings());

  // Accumulated score and coins across levels in current session
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [sessionCoins, setSessionCoins] = useState<number>(0);

  // Level clear summary modal data
  const [lastClearSummary, setLastClearSummary] = useState<{
    score: number;
    coins: number;
    timeBonus: number;
    totalScore: number;
    stars: number;
  }>({
    score: 0,
    coins: 0,
    timeBonus: 0,
    totalScore: 0,
    stars: 1,
  });

  // Game over modal stats
  const [gameOverStats, setGameOverStats] = useState<{ score: number; coins: number }>({
    score: 0,
    coins: 0,
  });

  // Modal overlays
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState<boolean>(false);

  // Initialize audio settings
  useEffect(() => {
    audio.setVolumes(settings.masterVolume, settings.musicVolume, settings.sfxVolume);
  }, [settings]);

  // Handle Play from Main Menu
  const handlePlayFromMenu = () => {
    audio.unlock();
    // Find highest unlocked level that is uncompleted, or default to 1
    let targetLevel = 1;
    for (let i = 1; i <= 3; i++) {
      if (saveData.levels[i]?.unlocked && !saveData.levels[i]?.completed) {
        targetLevel = i;
        break;
      }
    }
    startLevel(targetLevel);
  };

  const startLevel = (levelId: number) => {
    audio.unlock();
    setCurrentLevelId(levelId);
    setGameState('PLAYING');
  };

  // Level Clear Handler
  const handleLevelClear = (summary: {
    score: number;
    coins: number;
    timeBonus: number;
    totalScore: number;
    stars: number;
  }) => {
    const updatedSave = StorageManager.updateLevelCompletion(
      currentLevelId,
      summary.totalScore,
      summary.coins,
      summary.timeBonus / 20,
      summary.stars
    );
    setSaveData(updatedSave);

    setLastClearSummary(summary);
    setSessionScore((prev) => prev + summary.totalScore);
    setSessionCoins((prev) => prev + summary.coins);

    setGameState('LEVEL_CLEAR');
  };

  // Next Level Progression
  const handleNextLevel = () => {
    if (currentLevelId >= 3) {
      // Completed all 3 levels! Triumphant Victory!
      audio.playVictory();
      setGameState('VICTORY');
    } else {
      startLevel(currentLevelId + 1);
    }
  };

  // Game Over Handler
  const handleGameOver = (finalScore: number, finalCoins: number) => {
    setGameOverStats({ score: finalScore, coins: finalCoins });
    setGameState('GAME_OVER');
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    StorageManager.saveSettings(newSettings);
  };

  // Reset Saved Progress
  const handleResetProgress = () => {
    localStorage.removeItem('pixel_adventure_progress_v1');
    const fresh = StorageManager.loadProgress();
    setSaveData(fresh);
    setSessionScore(0);
    setSessionCoins(0);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-silkscreen select-none">
      {/* 1. MAIN MENU */}
      {gameState === 'MENU' && (
        <MainMenu
          onPlay={handlePlayFromMenu}
          onLevelSelect={() => {
            audio.unlock();
            setGameState('LEVEL_SELECT');
          }}
          onHowToPlay={() => {
            audio.unlock();
            setShowHowToPlayModal(true);
          }}
          onSettings={() => {
            audio.unlock();
            setShowSettingsModal(true);
          }}
          saveData={saveData}
        />
      )}

      {/* 2. LEVEL SELECT */}
      {gameState === 'LEVEL_SELECT' && (
        <LevelSelect
          onSelectLevel={(id) => startLevel(id)}
          onBack={() => setGameState('MENU')}
          saveData={saveData}
        />
      )}

      {/* 3. ACTIVE GAME CANVAS (Rendered during PLAYING, PAUSED, LEVEL_CLEAR, and GAME_OVER) */}
      {(gameState === 'PLAYING' ||
        gameState === 'PAUSED' ||
        gameState === 'LEVEL_CLEAR' ||
        gameState === 'GAME_OVER') && (
        <GameCanvas
          key={`canvas_level_${currentLevelId}`}
          levelId={currentLevelId}
          settings={settings}
          initialScore={sessionScore}
          initialCoins={sessionCoins}
          onLevelClear={handleLevelClear}
          onGameOver={handleGameOver}
          onPause={() => setGameState('PAUSED')}
          isPaused={gameState !== 'PLAYING'}
        />
      )}

      {/* 4. PAUSE MODAL */}
      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={() => setGameState('PLAYING')}
          onRestart={() => startLevel(currentLevelId)}
          onSettings={() => setShowSettingsModal(true)}
          onQuit={() => {
            audio.stopMusic();
            setGameState('MENU');
          }}
        />
      )}

      {/* 5. LEVEL CLEAR MODAL */}
      {gameState === 'LEVEL_CLEAR' && (
        <LevelClearModal
          levelId={currentLevelId}
          summary={lastClearSummary}
          onNextLevel={handleNextLevel}
          onReplay={() => startLevel(currentLevelId)}
          onMenu={() => {
            audio.stopMusic();
            setGameState('MENU');
          }}
          isFinalLevel={currentLevelId === 3}
        />
      )}

      {/* 6. GAME OVER MODAL */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          score={gameOverStats.score}
          coins={gameOverStats.coins}
          onRetry={() => startLevel(currentLevelId)}
          onLevelSelect={() => {
            audio.stopMusic();
            setGameState('LEVEL_SELECT');
          }}
          onMenu={() => {
            audio.stopMusic();
            setGameState('MENU');
          }}
        />
      )}

      {/* 7. VICTORY MODAL */}
      {gameState === 'VICTORY' && (
        <VictoryModal
          saveData={saveData}
          onPlayAgain={() => startLevel(1)}
          onMenu={() => {
            audio.stopMusic();
            setGameState('MENU');
          }}
        />
      )}

      {/* 8. SETTINGS MODAL */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettingsModal(false)}
          onResetProgress={handleResetProgress}
        />
      )}

      {/* 9. HOW TO PLAY / GUIDE MODAL */}
      {showHowToPlayModal && (
        <HowToPlayModal onClose={() => setShowHowToPlayModal(false)} />
      )}
    </main>
  );
}
