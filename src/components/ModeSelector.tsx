'use client';
import React from 'react';
import { Target, Zap, Calendar, Volume2, VolumeX } from 'lucide-react';
import { sound } from '@/lib/soundFx';

export type GameMode = 'focus' | 'survival' | 'daily';

interface ModeSelectorProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-3 flex items-center justify-between px-2">
      {/* Modes Segmented Control */}
      <div className="flex items-center gap-1 p-1 rounded-full bg-stone-200/50 border border-stone-200/70 text-xs font-semibold">
        <button
          onClick={() => {
            sound.playSoftClick();
            onSelectMode('focus');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all active:scale-95 cursor-pointer ${
            currentMode === 'focus'
              ? 'bg-white text-stone-900 shadow-sm font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Mode Focus : phrase par phrase sans compte à rebours global"
        >
          <Target className="w-3.5 h-3.5 text-stone-600" />
          <span>Focus</span>
        </button>

        <button
          onClick={() => {
            sound.playSoftClick();
            onSelectMode('survival');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all active:scale-95 cursor-pointer ${
            currentMode === 'survival'
              ? 'bg-white text-teal-700 shadow-sm font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Mode Survie 60s : enchaîne les phrases, gagne du temps, survis au chrono !"
        >
          <Zap className="w-3.5 h-3.5 text-teal-600" />
          <span>Survie 60s</span>
        </button>

        <button
          onClick={() => {
            sound.playSoftClick();
            onSelectMode('daily');
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all active:scale-95 cursor-pointer ${
            currentMode === 'daily'
              ? 'bg-white text-amber-700 shadow-sm font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
          title="Sprint du jour : 7 phrases rapides pour booster ta série quotidienne"
        >
          <Calendar className="w-3.5 h-3.5 text-amber-600" />
          <span>Daily (7)</span>
        </button>
      </div>

      {/* Audio Mute / Unmute Toggle */}
      <button
        onClick={onToggleMute}
        className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
        title={isMuted ? 'Activer le son feutré' : 'Couper le son'}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
};
