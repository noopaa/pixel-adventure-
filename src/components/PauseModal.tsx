import React from 'react';
import { Play, RotateCcw, Home, Settings } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onQuit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onSettings,
  onQuit,
}) => {
  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-40 animate-fade-in select-none">
      <div className="w-full max-w-sm bg-slate-900 border-4 border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-pixel text-amber-300 tracking-wider drop-shadow-[0_2px_0_#78350f]">
            PAUSED
          </h2>
          <p className="text-[10px] font-pixel text-slate-400 mt-1">TAKE A BREATHER</p>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 text-slate-950 font-pixel text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>RESUME</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 text-slate-200 font-pixel text-xs flex items-center justify-center gap-2 shadow transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART LEVEL</span>
          </button>

          <button
            onClick={onSettings}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 text-slate-200 font-pixel text-xs flex items-center justify-center gap-2 shadow transition"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>SETTINGS</span>
          </button>

          <button
            onClick={onQuit}
            className="w-full py-3 px-4 rounded-xl bg-rose-900/60 hover:bg-rose-800 border-b-4 border-rose-950 active:border-b-0 active:translate-y-1 text-rose-200 font-pixel text-xs flex items-center justify-center gap-2 shadow transition"
          >
            <Home className="w-4 h-4" />
            <span>QUIT TO MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
