import React from 'react';
import { RotateCcw, Home, Skull, Grid } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  coins: number;
  onRetry: () => void;
  onLevelSelect: () => void;
  onMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  coins,
  onRetry,
  onLevelSelect,
  onMenu,
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-40 animate-fade-in select-none">
      <div className="w-full max-w-sm bg-slate-900 border-4 border-rose-600 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6">
        {/* Skull Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border-2 border-rose-500/80 flex items-center justify-center text-rose-500 shadow-lg animate-pulse">
          <Skull className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-pixel text-rose-500 tracking-wider drop-shadow-[0_2px_0_#4c0519]">
            GAME OVER
          </h2>
          <p className="text-[10px] font-pixel text-slate-400 mt-2">DON'T GIVE UP, HERO!</p>
        </div>

        {/* Stats */}
        <div className="w-full bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex justify-around text-center font-pixel">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">SCORE</span>
            <span className="text-sm text-amber-300">{score.toLocaleString()}</span>
          </div>
          <div className="w-px bg-slate-800" />
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">COINS</span>
            <span className="text-sm text-yellow-300">{coins}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 border-b-4 border-rose-800 active:border-b-0 active:translate-y-1 text-white font-pixel text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>

          <button
            onClick={onLevelSelect}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 text-slate-200 font-pixel text-xs flex items-center justify-center gap-2 shadow transition"
          >
            <Grid className="w-4 h-4 text-indigo-400" />
            <span>LEVEL SELECT</span>
          </button>

          <button
            onClick={onMenu}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 text-slate-200 font-pixel text-xs flex items-center justify-center gap-2 shadow transition"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
