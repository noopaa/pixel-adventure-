import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Zap } from 'lucide-react';
import { InputState } from '../game/types';

interface VirtualControlsProps {
  inputState: React.MutableRefObject<InputState>;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({ inputState }) => {
  // Multitouch tracking via active pointer IDs
  const activePointers = useRef<Map<number, keyof InputState>>(new Map());

  const handlePointerDown = (key: keyof InputState) => (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if not supported
    }
    activePointers.current.set(e.pointerId, key);
    inputState.current[key] = true;
  };

  const handlePointerUpOrLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const key = activePointers.current.get(e.pointerId);
    if (key) {
      inputState.current[key] = false;
      activePointers.current.delete(e.pointerId);
    }
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 flex items-end justify-between pointer-events-none z-30 select-none touch-none">
      {/* D-Pad: Left & Right */}
      <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
        {/* Left Button */}
        <button
          type="button"
          onPointerDown={handlePointerDown('left')}
          onPointerUp={handlePointerUpOrLeave}
          onPointerCancel={handlePointerUpOrLeave}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900/80 active:bg-cyan-500/80 border-2 border-slate-600 active:border-cyan-300 shadow-2xl backdrop-blur-md flex items-center justify-center transition active:scale-95 text-slate-200 active:text-white"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>

        {/* Right Button */}
        <button
          type="button"
          onPointerDown={handlePointerDown('right')}
          onPointerUp={handlePointerUpOrLeave}
          onPointerCancel={handlePointerUpOrLeave}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900/80 active:bg-cyan-500/80 border-2 border-slate-600 active:border-cyan-300 shadow-2xl backdrop-blur-md flex items-center justify-center transition active:scale-95 text-slate-200 active:text-white"
          aria-label="Move Right"
        >
          <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10" />
        </button>
      </div>

      {/* Action Buttons: Run (B) & Jump (A) */}
      <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
        {/* Run / Dash Button (B) */}
        <button
          type="button"
          onPointerDown={handlePointerDown('run')}
          onPointerUp={handlePointerUpOrLeave}
          onPointerCancel={handlePointerUpOrLeave}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-600/80 active:bg-amber-500 border-2 border-amber-400/80 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center transition active:scale-90 text-white font-pixel"
          aria-label="Run or Dash"
        >
          <Zap className="w-5 h-5 fill-white text-white" />
          <span className="text-[9px] mt-0.5">RUN</span>
        </button>

        {/* Jump Button (A) */}
        <button
          type="button"
          onPointerDown={handlePointerDown('jump')}
          onPointerUp={handlePointerUpOrLeave}
          onPointerCancel={handlePointerUpOrLeave}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/85 active:bg-rose-500 border-2 border-rose-400 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center transition active:scale-90 text-white font-pixel"
          aria-label="Jump"
        >
          <ArrowUp className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
          <span className="text-[10px] mt-0.5">JUMP</span>
        </button>
      </div>
    </div>
  );
};
