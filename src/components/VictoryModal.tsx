import React from 'react';
import { Trophy, Star, RotateCcw, Home, Sparkles, Award } from 'lucide-react';
import { GameSaveData } from '../game/storage';

interface VictoryModalProps {
  saveData: GameSaveData;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  saveData,
  onPlayAgain,
  onMenu,
}) => {
  const totalStars = Object.values(saveData.levels).reduce((sum, l) => sum + (l.stars || 0), 0);
  const totalCoins = saveData.totalCoins;
  const totalScore = saveData.totalScore;

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-40 animate-fade-in select-none">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 to-indigo-950 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6">
        {/* Golden Trophy */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-2xl animate-bounce">
            <Trophy className="w-10 h-10 fill-amber-400" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-spin" />
        </div>

        {/* Title */}
        <div className="text-center">
          <span className="text-[10px] font-pixel px-3 py-1 bg-amber-400 text-slate-950 rounded-full uppercase font-bold tracking-wider">
            CAMPAIGN CONQUERED!
          </span>
          <h2 className="text-3xl sm:text-5xl font-pixel text-amber-300 tracking-wider drop-shadow-[0_4px_0_#78350f] mt-3">
            YOU WIN!
          </h2>
          <p className="text-xs font-pixel text-slate-300 mt-2">
            YOU ARE THE TRUE PIXEL MASTER!
          </p>
        </div>

        {/* Campaign Stats Card */}
        <div className="w-full bg-slate-950/80 rounded-2xl border border-amber-500/40 p-5 flex flex-col gap-3 font-pixel">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <Award className="w-4 h-4 text-amber-400" /> TOTAL ADVENTURE SCORE:
            </span>
            <span className="text-amber-300 text-sm font-bold">{totalScore.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> TOTAL STARS EARNED:
            </span>
            <span className="text-yellow-300 text-sm font-bold">{totalStars} / 9</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <span className="text-amber-400 font-bold">$</span> TOTAL COINS HOARDED:
            </span>
            <span className="text-amber-300 text-sm font-bold">{totalCoins}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 shadow-xl flex items-center justify-center gap-2 text-white font-pixel text-xs sm:text-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onMenu}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 shadow-lg flex items-center justify-center gap-2 text-slate-200 font-pixel text-xs transition"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
