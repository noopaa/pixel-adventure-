import React from 'react';
import { Star, Trophy, ArrowRight, RotateCcw, Home, Clock, Coins } from 'lucide-react';

interface LevelClearSummary {
  score: number;
  coins: number;
  timeBonus: number;
  totalScore: number;
  stars: number;
}

interface LevelClearModalProps {
  levelId: number;
  summary: LevelClearSummary;
  onNextLevel: () => void;
  onReplay: () => void;
  onMenu: () => void;
  isFinalLevel: boolean;
}

export const LevelClearModal: React.FC<LevelClearModalProps> = ({
  levelId,
  summary,
  onNextLevel,
  onReplay,
  onMenu,
  isFinalLevel,
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-40 animate-fade-in select-none">
      <div className="w-full max-w-md bg-slate-900 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6">
        {/* Banner */}
        <div className="text-center">
          <div className="inline-block bg-amber-400 text-slate-950 text-[10px] font-pixel px-3 py-1 rounded-full mb-2 uppercase font-bold">
            STAGE CLEAR!
          </div>
          <h2 className="text-2xl sm:text-3xl font-pixel text-amber-300 drop-shadow-[0_2px_0_#78350f]">
            LEVEL {levelId} COMPLETE
          </h2>
        </div>

        {/* 3 Stars Award */}
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`p-2 rounded-2xl border-2 transition-transform duration-500 ${
                starIdx <= summary.stars
                  ? 'bg-amber-400/20 border-amber-400 text-amber-400 scale-110 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-600 scale-90'
              }`}
            >
              <Star
                className={`w-8 h-8 ${
                  starIdx <= summary.stars ? 'fill-amber-400' : 'fill-slate-800'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Score Breakdown Box */}
        <div className="w-full bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col gap-2.5 font-pixel text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> BASE SCORE:
            </span>
            <span>+{summary.score}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> TIME BONUS:
            </span>
            <span>+{summary.timeBonus}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Coins className="w-3.5 h-3.5 text-yellow-400" /> COIN BONUS:
            </span>
            <span>+{summary.coins * 50}</span>
          </div>

          <div className="h-px bg-slate-800 my-1" />

          <div className="flex items-center justify-between text-amber-300 text-sm font-bold">
            <span>TOTAL SCORE:</span>
            <span className="text-base text-yellow-300 tracking-wider">
              {summary.totalScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 text-white font-pixel text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition"
          >
            <span>{isFinalLevel ? 'VIEW VICTORY' : 'NEXT LEVEL'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onReplay}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 text-slate-200 font-pixel text-xs flex items-center justify-center gap-2 shadow transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REPLAY</span>
            </button>

            <button
              onClick={onMenu}
              className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 text-slate-200 font-pixel text-xs flex items-center justify-center gap-2 shadow transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>MENU</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
