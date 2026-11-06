'use client';
import React, { useEffect } from 'react';
import { Mic, MicOff, Lock } from 'lucide-react';
import { sound } from '@/lib/soundFx';

interface VoiceTriggerProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSimulateAnswer?: (preset: 'perfect' | 'with-error') => void;
  onSkip?: () => void;
  disabled?: boolean;
  isLimitReached?: boolean;
  onLimitReached?: () => void;
}

export const VoiceTrigger: React.FC<VoiceTriggerProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onSimulateAnswer,
  onSkip,
  disabled = false,
  isLimitReached = false,
  onLimitReached,
}) => {
  // Push to talk with space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !e.repeat &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        if (isLimitReached) {
          onLimitReached?.();
          return;
        }
        if (!isRecording && !disabled) {
          onStartRecording();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        if (isRecording) {
          onStopRecording();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRecording, disabled, isLimitReached, onStartRecording, onStopRecording, onLimitReached]);

  return (
    <div className="w-full max-w-sm mx-auto mt-6 flex flex-col items-center">
      {/* Central Spik Button with Guidance Tooltip on Hover */}
      <div className="relative group flex flex-col items-center">
        {/* Floating invitation tooltip on hover / active indicator */}
        {isLimitReached ? (
          <button
            onClick={onLimitReached}
            className="mb-4 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer animate-bounce"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>5 essais terminés • Crée ton compte pour continuer</span>
          </button>
        ) : (
          <div
            className={`absolute -top-12 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap pointer-events-none transition-all duration-200 shadow-sm border ${
              isRecording
                ? 'opacity-100 translate-y-0 bg-rose-600 text-white border-rose-500 shadow-rose-600/20 animate-pulse'
                : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 bg-stone-900/90 text-stone-100 border-stone-800 backdrop-blur-xs'
            }`}
          >
            {isRecording ? '🔴 Parle maintenant...' : '🎙️ Clique pour parler ou maintiens Espace appuyé'}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent ${
                isRecording ? 'border-t-rose-600' : 'border-t-stone-900/90'
              }`}
            />
          </div>
        )}

        <button
          onClick={() => {
            sound.playSoftClick();
            if (isLimitReached) {
              onLimitReached?.();
              return;
            }
            if (isRecording) {
              onStopRecording();
            } else {
              onStartRecording();
            }
          }}
          disabled={disabled}
          title={
            isLimitReached
              ? 'Crée ton compte pour continuer'
              : isRecording
              ? 'Arrêter et analyser'
              : 'Parler maintenant (ou maintenir Espace)'
          }
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
            isLimitReached
              ? 'bg-stone-800 hover:bg-stone-900 text-amber-400 shadow-md shadow-stone-900/20 ring-4 ring-amber-100'
              : isRecording
              ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/35 scale-105 ring-8 ring-rose-100 animate-pulse'
              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/35 ring-6 ring-stone-100 hover:ring-teal-100/70'
          } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {isLimitReached ? (
            <Lock className="w-9 h-9 sm:w-11 sm:h-11" />
          ) : isRecording ? (
            <MicOff className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
          ) : (
            <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
          )}
        </button>
      </div>
    </div>
  );
};
