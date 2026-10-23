import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../game/engine';
import { getLevelData } from '../game/levels';
import { InputState, GameSettings, PlayerPowerUp } from '../game/types';
import { audio } from '../game/audio';
import { HUD } from './HUD';
import { VirtualControls } from './VirtualControls';

interface GameCanvasProps {
  levelId: number;
  settings: GameSettings;
  initialScore: number;
  initialCoins: number;
  onLevelClear: (summary: { score: number; coins: number; timeBonus: number; totalScore: number; stars: number }) => void;
  onGameOver: (finalScore: number, finalCoins: number) => void;
  onPause: () => void;
  isPaused: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  levelId,
  settings,
  initialScore,
  initialCoins,
  onLevelClear,
  onGameOver,
  onPause,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Input state shared between keyboard and touch virtual controls
  const inputRef = useRef<InputState>({
    left: false,
    right: false,
    jump: false,
    run: false,
    up: false,
    down: false,
  });

  // HUD React states
  const [hudState, setHudState] = useState({
    score: initialScore,
    coins: initialCoins,
    health: 3,
    maxHealth: 3,
    lives: 3,
    timeLeft: 120,
    levelName: 'Green Meadows',
    powerUp: null as PlayerPowerUp | null,
    isMuted: audio.getMuted(),
  });

  const lastTimeRef = useRef<number>(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  // Setup / Reset Level
  const initLevel = useCallback(() => {
    const levelData = getLevelData(levelId);
    const engine = new GameEngine(levelData, settings, initialScore, initialCoins);

    engine.onLevelClear = (summary) => {
      onLevelClear(summary);
    };

    engine.onGameOver = () => {
      onGameOver(engine.score, engine.coins);
    };

    engineRef.current = engine;

    // Start background music
    audio.startMusic(levelData.theme);

    setHudState({
      score: engine.score,
      coins: engine.coins,
      health: engine.player.health,
      maxHealth: engine.player.maxHealth,
      lives: engine.player.lives,
      timeLeft: engine.timeLeft,
      levelName: levelData.name,
      powerUp: engine.player.powerUp,
      isMuted: audio.getMuted(),
    });
  }, [levelId, settings, initialScore, initialCoins, onLevelClear, onGameOver]);

  useEffect(() => {
    initLevel();
    return () => {
      audio.stopMusic();
    };
  }, [initLevel]);

  // Sync settings changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateSettings(settings);
    }
  }, [settings]);

  // Pause handling
  useEffect(() => {
    if (isPaused) {
      audio.stopMusic();
    } else if (engineRef.current) {
      audio.startMusic(engineRef.current.level.theme);
      lastTimeRef.current = performance.now();
    }
  }, [isPaused]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      audio.unlock(); // unlock audio context

      if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault();
        onPause();
        return;
      }

      if (e.code === 'KeyR' && !isPaused) {
        e.preventDefault();
        initLevel();
        return;
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        inputRef.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        inputRef.current.right = true;
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        inputRef.current.jump = true;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        inputRef.current.run = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        inputRef.current.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        inputRef.current.right = false;
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        inputRef.current.jump = false;
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        inputRef.current.run = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onPause, isPaused, initLevel]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let lastHudSync = 0;

    const loop = (currentTime: number) => {
      let dt = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Cap delta time to prevent physics clipping on tab background
      if (dt > 0.08) dt = 0.08;

      const canvas = canvasRef.current;
      const engine = engineRef.current;

      if (canvas && engine) {
        // Resize canvas to match actual pixel size
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = false;

          // Update physics if not paused
          if (!isPaused) {
            engine.update(dt, inputRef.current);
          }

          // Render canvas
          engine.render(ctx, canvas.width, canvas.height);

          // Throttled HUD state sync (10 times a second)
          if (currentTime - lastHudSync > 100) {
            lastHudSync = currentTime;
            setHudState({
              score: engine.score,
              coins: engine.coins,
              health: engine.player.health,
              maxHealth: engine.player.maxHealth,
              lives: engine.player.lives,
              timeLeft: engine.timeLeft,
              levelName: engine.level.name,
              powerUp: engine.player.powerUp,
              isMuted: audio.getMuted(),
            });
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused]);

  const handleToggleMute = () => {
    const muted = audio.toggleMute();
    setHudState((prev) => ({ ...prev, isMuted: muted }));
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      {/* HTML5 Game Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block pixel-art"
      />

      {/* Retro CRT Scanlines overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* In-Game HUD */}
      <HUD
        score={hudState.score}
        coins={hudState.coins}
        health={hudState.health}
        maxHealth={hudState.maxHealth}
        lives={hudState.lives}
        timeLeft={hudState.timeLeft}
        levelName={hudState.levelName}
        powerUp={hudState.powerUp}
        isMuted={hudState.isMuted}
        onPause={onPause}
        onRestart={initLevel}
        onToggleMute={handleToggleMute}
      />

      {/* On-Screen Virtual Touchpad */}
      {settings.touchControlsVisible && (
        <VirtualControls inputState={inputRef} />
      )}
    </div>
  );
};
