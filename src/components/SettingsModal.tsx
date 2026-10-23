import React from 'react';
import { X, Volume2, Music, VolumeX, Smartphone, Vibrate, Trash2 } from 'lucide-react';
import { GameSettings } from '../game/types';
import { audio } from '../game/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onClose: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onResetProgress,
}) => {
  const handleVolumeChange = (field: 'masterVolume' | 'musicVolume' | 'sfxVolume', value: number) => {
    const updated = { ...settings, [field]: value };
    onUpdateSettings(updated);
    audio.setVolumes(updated.masterVolume, updated.musicVolume, updated.sfxVolume);
    if (field === 'sfxVolume') {
      audio.playCoin();
    }
  };

  const handleToggle = (field: 'screenShake' | 'touchControlsVisible') => {
    const updated = { ...settings, [field]: !settings[field] };
    onUpdateSettings(updated);
  };

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="w-full max-w-md bg-slate-900 border-4 border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-xl font-pixel text-amber-300">SETTINGS</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Sliders */}
        <div className="flex flex-col gap-4 font-pixel text-xs">
          {/* Master Volume */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" /> MASTER VOLUME
              </span>
              <span>{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.masterVolume}
              onChange={(e) => handleVolumeChange('masterVolume', parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Music Volume */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <Music className="w-4 h-4 text-cyan-400" /> CHIPTUNE BGM
              </span>
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => handleVolumeChange('musicVolume', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* SFX Volume */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <VolumeX className="w-4 h-4 text-amber-400" /> SOUND FX
              </span>
              <span>{Math.round(settings.sfxVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => handleVolumeChange('sfxVolume', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Gameplay Toggles */}
        <div className="flex flex-col gap-3 pt-2 border-t border-slate-800 font-pixel text-xs">
          <label className="flex items-center justify-between cursor-pointer text-slate-300">
            <span className="flex items-center gap-2">
              <Vibrate className="w-4 h-4 text-rose-400" /> SCREEN SHAKE
            </span>
            <input
              type="checkbox"
              checked={settings.screenShake}
              onChange={() => handleToggle('screenShake')}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer text-slate-300">
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" /> TOUCH CONTROLS
            </span>
            <input
              type="checkbox"
              checked={settings.touchControlsVisible}
              onChange={() => handleToggle('touchControlsVisible')}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </label>
        </div>

        {/* Reset Progress & Close */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              if (window.confirm('Reset all level progress and scores?')) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-400 hover:text-rose-300 font-pixel text-[10px] active:scale-95 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>RESET DATA</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs active:scale-95 transition shadow-lg"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
