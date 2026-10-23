import React from 'react';
import { X, Keyboard, Smartphone, Zap, Shield, Heart, ArrowUp, Skull, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="w-full max-w-lg bg-slate-900 border-4 border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-xl font-pixel text-amber-300">HOW TO PLAY</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Desktop Controls */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-pixel text-cyan-400 mb-1">
              <Keyboard className="w-4 h-4" />
              <span>KEYBOARD</span>
            </div>
            <div className="text-[11px] font-silkscreen text-slate-300 flex justify-between">
              <span className="text-slate-400">Move Left / Right:</span>
              <span className="font-pixel text-[10px] text-amber-300">A / D or ◄ / ►</span>
            </div>
            <div className="text-[11px] font-silkscreen text-slate-300 flex justify-between">
              <span className="text-slate-400">Jump:</span>
              <span className="font-pixel text-[10px] text-amber-300">SPACE / W / ▲</span>
            </div>
            <div className="text-[11px] font-silkscreen text-slate-300 flex justify-between">
              <span className="text-slate-400">Run / Dash:</span>
              <span className="font-pixel text-[10px] text-amber-300">SHIFT</span>
            </div>
            <div className="text-[11px] font-silkscreen text-slate-300 flex justify-between">
              <span className="text-slate-400">Pause / Restart:</span>
              <span className="font-pixel text-[10px] text-amber-300">ESC / P / R</span>
            </div>
          </div>

          {/* Mobile Touch Controls */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-pixel text-indigo-400 mb-1">
              <Smartphone className="w-4 h-4" />
              <span>TOUCH CONTROLS</span>
            </div>
            <div className="text-[11px] font-silkscreen text-slate-300 flex justify-between">
              <span className="text-slate-400">D-Pad Buttons:</span>
              <span className="font-pixel text-[10px] text-amber-300">Left & Right</span>
            </div>
            <div className="text-[11px] font-silkscreen text-slate-300 flex justify-between">
              <span className="text-slate-400">Button A (Red):</span>
              <span className="font-pixel text-[10px] text-amber-300">Jump</span>
            </div>
            <div className="text-[11px] font-silkscreen text-slate-300 flex justify-between">
              <span className="text-slate-400">Button B (Yellow):</span>
              <span className="font-pixel text-[10px] text-amber-300">Sprint / Run</span>
            </div>
            <div className="text-[11px] font-silkscreen text-slate-300 flex justify-between">
              <span className="text-slate-400">Multi-Touch:</span>
              <span className="font-pixel text-[10px] text-emerald-400">Supported</span>
            </div>
          </div>
        </div>

        {/* Mechanics & Tips */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col gap-3 font-silkscreen text-xs text-slate-300">
          <div className="flex items-center gap-2 font-pixel text-[11px] text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>CORE MECHANICS</span>
          </div>

          <div className="flex items-start gap-2.5">
            <Skull className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-100">Defeating Enemies:</strong> Jump precisely on top of Slimes, Mushrooms, and Fire Beetles to squash them. Touching them from the side causes damage!
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="text-amber-400 font-pixel font-bold text-base shrink-0 leading-none">?</span>
            <p>
              <strong className="text-slate-100">Mystery Blocks:</strong> Bonk golden question blocks from underneath to reveal bonus coins, extra hearts, and power-up gems.
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <ArrowUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-100">Variable Jump:</strong> Tap jump lightly for a short hop, or hold jump down to reach maximum height.
            </p>
          </div>
        </div>

        {/* Power-ups Guide */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col gap-2.5 font-silkscreen text-xs text-slate-300">
          <span className="font-pixel text-[11px] text-yellow-300 mb-1">POWER-UPS</span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Speed Boost Gem</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-amber-400" />
              <span>High Jump Feather</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Star Shield (Invincible)</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Health Heart (+1 HP)</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs active:scale-95 transition shadow-lg"
        >
          GOT IT, LET'S PLAY!
        </button>
      </div>
    </div>
  );
};
