import React from 'react';
import { ArrowLeft, Lock, Play, Star, Trophy, Clock } from 'lucide-react';
import { GameSaveData } from '../game/storage';

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  saveData: GameSaveData;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  onSelectLevel,
  onBack,
  saveData,
}) => {
  const levels = [
    {
      id: 1,
      name: 'Green Meadows',
      subtitle: 'Chapter 1: The Sunny Beginning',
      difficulty: 'NORMAL',
      themeColor: 'from-emerald-600 to-green-800',
      borderColor: 'border-emerald-400',
      badgeColor: 'bg-emerald-500 text-white',
      desc: 'Rolling green hills, gentle platforms, question blocks, and bouncing slimes.',
    },
    {
      id: 2,
      name: 'Mystic Forest',
      subtitle: 'Chapter 2: Shifting Branches',
      difficulty: 'HARD',
      themeColor: 'from-indigo-700 to-purple-950',
      borderColor: 'border-purple-400',
      badgeColor: 'bg-purple-500 text-white',
      desc: 'Twilight canopy, swooping bats, crumbling bridges, and high spring pads.',
    },
    {
      id: 3,
      name: 'Lava Cavern',
      subtitle: 'Chapter 3: The Molten Core',
      difficulty: 'EXPERT',
      themeColor: 'from-orange-700 to-red-950',
      borderColor: 'border-orange-500',
      badgeColor: 'bg-red-500 text-white',
      desc: 'Bubbling magma, deadly fire beetles, moving basalt slabs, and tight jumps.',
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col p-4 sm:p-8 bg-slate-950 overflow-y-auto select-none z-10">
      {/* Header */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-pixel transition active:scale-95 shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <h2 className="text-xl sm:text-2xl font-pixel text-amber-300 drop-shadow-[0_2px_0_#78350f]">
          SELECT LEVEL
        </h2>

        <div className="w-16" />
      </div>

      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full my-auto">
        {levels.map((lvl) => {
          const progress = saveData.levels[lvl.id] || {
            unlocked: lvl.id === 1,
            completed: false,
            highScore: 0,
            bestTime: 0,
            stars: 0,
          };
          const isUnlocked = progress.unlocked;

          return (
            <div
              key={lvl.id}
              className={`relative rounded-2xl overflow-hidden border-2 shadow-2xl transition flex flex-col justify-between ${
                isUnlocked
                  ? `${lvl.borderColor} bg-gradient-to-b ${lvl.themeColor} hover:scale-[1.02]`
                  : 'border-slate-800 bg-slate-900/60 opacity-60'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-pixel px-2 py-0.5 rounded-full ${lvl.badgeColor}`}>
                    {lvl.difficulty}
                  </span>
                  {/* Stars Display */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-4 h-4 ${
                          starIdx <= progress.stars
                            ? 'text-yellow-300 fill-yellow-300'
                            : 'text-slate-600 fill-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-pixel text-white mt-1">
                  {lvl.name}
                </h3>
                <p className="text-[10px] font-pixel text-slate-300 opacity-80">
                  {lvl.subtitle}
                </p>

                <p className="text-xs text-slate-200/90 font-silkscreen mt-2 leading-relaxed">
                  {lvl.desc}
                </p>
              </div>

              {/* Stats Footer */}
              <div className="p-4 bg-slate-950/70 border-t border-slate-700/50 flex flex-col gap-3">
                {isUnlocked ? (
                  <>
                    <div className="flex items-center justify-between text-[11px] font-pixel text-slate-300">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>{progress.highScore > 0 ? progress.highScore.toLocaleString() : '---'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{progress.bestTime > 0 ? `${Math.round(progress.bestTime)}s` : '---'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectLevel(lvl.id)}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 border-b-4 border-amber-700 active:border-b-0 text-slate-950 font-pixel text-xs flex items-center justify-center gap-2 shadow-lg transition"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>{progress.completed ? 'PLAY AGAIN' : 'START LEVEL'}</span>
                    </button>
                  </>
                ) : (
                  <div className="py-4 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Lock className="w-6 h-6 text-slate-500" />
                    <span className="text-[10px] font-pixel text-slate-500">
                      LOCKED (COMPLETE LEVEL {lvl.id - 1})
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
