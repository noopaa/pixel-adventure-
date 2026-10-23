import React from 'react';
import { Heart, Pause, RotateCcw, Volume2, VolumeX, Zap, Shield, ArrowUpCircle } from 'lucide-react';
import { PlayerPowerUp } from '../game/types';

interface HUDProps {
  score: number;
  coins: number;
  health: number;
  maxHealth: number;
  lives: number;
  timeLeft: number;
  levelName: string;
  powerUp: PlayerPowerUp | null;
  isMuted: boolean;
  onPause: () => void;
  onRestart: () => void;
  onToggleMute: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  coins,
  health,
  maxHealth,
  lives,
  timeLeft,
  levelName,
  powerUp,
  isMuted,
  onPause,
  onRestart,
  onToggleMute,
}) => {
  const formattedMinutes = Math.floor(timeLeft / 60);
  const formattedSeconds = Math.floor(timeLeft % 60).toString().padStart(2, '0');
  const isTimeCritical = timeLeft < 20;

  return (
    <div className="absolute top-0 left-0 right-0 p-2 sm:p-4 pointer-events-none z-20 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        {/* Left Side: Lives, Health & Coins */}
        <div className="flex items-center gap-2 sm:gap-4 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
          {/* Lives Indicator */}
          <div className="flex items-center gap-1.5 border-r border-slate-700/60 pr-2 sm:pr-3">
            <span className="text-[10px] sm:text-xs text-amber-400 font-pixel">P1</span>
            <span className="text-xs sm:text-sm font-pixel text-slate-100">x{lives}</span>
          </div>

          {/* Health Hearts */}
          <div className="flex items-center gap-1">
            {Array.from({ length: maxHealth }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
                  i < health
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-600 fill-slate-800 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 border-l border-slate-700/60 pl-2 sm:pl-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 border border-amber-200 flex items-center justify-center shadow-inner">
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-950 font-pixel">$</span>
            </div>
            <span className="text-xs sm:text-sm font-pixel text-amber-300">
              {coins.toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Center: Level Name & Score */}
        <div className="hidden md:flex flex-col items-center bg-slate-900/85 backdrop-blur-md px-5 py-1.5 rounded-xl border border-slate-700/80 shadow-lg">
          <span className="text-[10px] text-cyan-400 font-pixel tracking-wider uppercase">{levelName}</span>
          <span className="text-sm font-pixel text-slate-100 tracking-widest">{score.toString().padStart(6, '0')}</span>
        </div>

        {/* Right Side: Timer & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
          {/* Timer */}
          <div className="flex flex-col items-end border-r border-slate-700/60 pr-2 sm:pr-3">
            <span className="text-[9px] font-pixel text-slate-400">TIME</span>
            <span
              className={`text-xs sm:text-sm font-pixel ${
                isTimeCritical ? 'text-rose-500 animate-pulse font-bold' : 'text-slate-200'
              }`}
            >
              {formattedMinutes}:{formattedSeconds}
            </span>
          </div>

          {/* Quick Audio Mute */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95"
            title="Toggle Mute"
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Quick Restart */}
          <button
            onClick={onRestart}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95"
            title="Restart Level"
            aria-label="Restart Level"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Pause */}
          <button
            onClick={onPause}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition active:scale-95 shadow"
            title="Pause Game (ESC / P)"
            aria-label="Pause Game"
          >
            <Pause className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>

      {/* Active Power-up Status Pill */}
      {powerUp && (
        <div className="mx-auto bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-500/50 flex items-center gap-2 shadow-lg animate-bounce pointer-events-none">
          {powerUp.type === 'speed' && <Zap className="w-3.5 h-3.5 text-cyan-400" />}
          {powerUp.type === 'high_jump' && <ArrowUpCircle className="w-3.5 h-3.5 text-amber-400" />}
          {powerUp.type === 'shield' && <Shield className="w-3.5 h-3.5 text-purple-400" />}
          <span className="text-[10px] font-pixel text-slate-200 uppercase">
            {powerUp.type === 'speed' ? 'SUPER SPEED' : powerUp.type === 'high_jump' ? 'HIGH JUMP' : 'STAR SHIELD'}{' '}
            ({Math.ceil(powerUp.remainingTime)}s)
          </span>
        </div>
      )}
    </div>
  );
};
