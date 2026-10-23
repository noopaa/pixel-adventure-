import React from 'react';
import { Play, Grid, HelpCircle, Settings, Trophy, Star, Coins, Download } from 'lucide-react';
import { GameSaveData } from '../game/storage';

interface MainMenuProps {
  onPlay: () => void;
  onLevelSelect: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
  onOpenInstall?: () => void;
  isInstalled?: boolean;
  saveData: GameSaveData;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onPlay,
  onLevelSelect,
  onHowToPlay,
  onSettings,
  onOpenInstall,
  isInstalled,
  saveData,
}) => {
  // Calculate total stars
  const totalStars = Object.values(saveData.levels).reduce((sum, l) => sum + (l.stars || 0), 0);
  const totalScore = saveData.totalScore;
  const totalCoins = saveData.totalCoins;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 overflow-y-auto select-none z-10">
      {/* Animated Clouds & Hills background effect */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 overflow-hidden">
        {/* Parallax Clouds */}
        <div className="absolute top-10 left-10 w-32 h-10 bg-white/80 rounded-full blur-[0.5px] animate-pulse" />
        <div className="absolute top-24 right-20 w-48 h-12 bg-white/70 rounded-full blur-[0.5px]" />
        <div className="absolute top-40 left-1/3 w-40 h-10 bg-white/60 rounded-full blur-[0.5px]" />
        
        {/* Rolling Hills Silhouette */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-emerald-600/40 rounded-t-[100px] transform scale-125" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-emerald-700/60 rounded-t-[80px]" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-emerald-800" />
      </div>

      {/* Top Stats Bar */}
      <div className="w-full max-w-xl flex items-center justify-between bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-slate-700/80 shadow-2xl">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-pixel text-slate-300">SCORE:</span>
          <span className="text-xs font-pixel text-amber-300">{totalScore.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-pixel text-amber-300">{totalCoins}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-pixel text-yellow-300">{totalStars}/9</span>
          </div>
        </div>
      </div>

      {/* Hero Title & Character Mascot */}
      <div className="flex flex-col items-center text-center my-auto py-6">
        {/* Animated Pixel Mascot */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900/80 border-4 border-amber-400 p-2 shadow-2xl flex items-center justify-center animate-bounce">
            {/* Retro Pixel Avatar */}
            <div className="relative w-16 h-16 flex flex-col items-center justify-center">
              <div className="w-12 h-6 bg-blue-600 rounded-t-md relative">
                <div className="absolute -top-2 right-1 w-2 h-4 bg-red-500 rounded-full" />
              </div>
              <div className="w-10 h-4 bg-amber-100 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
              </div>
              <div className="w-12 h-2 bg-yellow-400" />
              <div className="w-10 h-5 bg-cyan-500" />
              <div className="w-10 h-2 bg-slate-800 flex justify-between px-1">
                <div className="w-3 h-2 bg-amber-800" />
                <div className="w-3 h-2 bg-amber-800" />
              </div>
            </div>
          </div>
          {/* Badge */}
          <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white text-[9px] font-pixel px-2 py-0.5 rounded-full border border-rose-300 shadow">
            RETRO
          </div>
        </div>

        {/* Title Logo */}
        <div className="relative">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-pixel text-amber-300 tracking-wider drop-shadow-[0_4px_0_#78350f] mb-1">
            PIXEL ADVENTURE
          </h1>
          <p className="text-xs sm:text-sm font-pixel text-amber-100 tracking-[0.25em] drop-shadow-[0_2px_0_#0f172a]">
            THE GAME
          </p>
        </div>
      </div>

      {/* Main Menu Action Buttons */}
      <div className="w-full max-w-xs sm:max-w-sm flex flex-col gap-3 mb-4">
        {/* PLAY BUTTON */}
        <button
          onClick={onPlay}
          className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 shadow-xl flex items-center justify-center gap-3 transition"
        >
          <Play className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
          <span className="text-sm sm:text-base font-pixel text-white tracking-wider">
            PLAY GAME
          </span>
        </button>

        {/* LEVEL SELECT */}
        <button
          onClick={onLevelSelect}
          className="group relative w-full py-3.5 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border-2 border-indigo-500/70 hover:border-indigo-400 border-b-4 border-b-indigo-900 active:border-b-2 active:translate-y-0.5 shadow-lg flex items-center justify-center gap-3 transition"
        >
          <Grid className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs sm:text-sm font-pixel text-slate-100 tracking-wide">
            LEVEL SELECT
          </span>
        </button>

        {/* Secondary Buttons Row */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onHowToPlay}
            className="py-3 px-3 rounded-xl bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-700 hover:border-slate-500 border-b-4 border-b-slate-950 active:border-b-2 active:translate-y-0.5 shadow flex items-center justify-center gap-2 transition"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] sm:text-xs font-pixel text-slate-200">
              GUIDE
            </span>
          </button>

          <button
            onClick={onSettings}
            className="py-3 px-3 rounded-xl bg-slate-900/85 hover:bg-slate-800 border-2 border-slate-700 hover:border-slate-500 border-b-4 border-b-slate-950 active:border-b-2 active:translate-y-0.5 shadow flex items-center justify-center gap-2 transition"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] sm:text-xs font-pixel text-slate-200">
              SETTINGS
            </span>
          </button>
        </div>

        {/* INSTALL APP (PWA) BUTTON */}
        {!isInstalled && onOpenInstall && (
          <button
            onClick={onOpenInstall}
            className="group relative w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/60 hover:border-amber-400 text-amber-300 font-pixel text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span>INSTALL APP (PWA)</span>
          </button>
        )}
      </div>

      {/* Footer credit */}
      <div className="text-center text-[10px] font-pixel text-slate-800 drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
        PIXEL ENGINE • 60 FPS ARCADE PLATFORMER
      </div>
    </div>
  );
};
