'use client';
import React, { useEffect } from 'react';
import { Mic, MicOff, ChevronRight, Lock } from 'lucide-react';
import { sound } from '@/lib/soundFx';

interface VoiceTriggerProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSimulateAnswer: (preset: 'perfect' | 'with-error') => void;
  onSkip: () => void;
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
    <div className="w-full max-w-sm mx-auto mt-6 flex flex-col items-center gap-3">
      {/* Central Spik Button with Guidance Pill */}
      <div className="relative flex flex-col items-center">
        {/* Floating invitation pill */}
        {isLimitReached ? (
          <button
            onClick={onLimitReached}
            className="mb-3 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer animate-bounce"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>5 essais terminés • Crée ton compte pour continuer</span>
          </button>
        ) : (
          <div
            className={`mb-3 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${
              isRecording
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-white text-stone-600 border-stone-200/90 shadow-2xs'
            }`}
          >
            {isRecording ? '🔴 Parle maintenant...' : '🎙️ Clique pour parler'}
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
              : 'Parler maintenant'
          }
          className={`w-18 h-18 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
            isLimitReached
              ? 'bg-stone-800 hover:bg-stone-900 text-amber-400 shadow-md shadow-stone-900/20 ring-4 ring-amber-100'
              : isRecording
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105'
              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/25 hover:shadow-lg hover:shadow-teal-600/30'
          } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {isLimitReached ? (
            <Lock className="w-7 h-7" />
          ) : isRecording ? (
            <MicOff className="w-7 h-7 animate-pulse" />
          ) : (
            <Mic className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Discrete minimal test & skip bar */}
      <div className="flex items-center gap-2 text-xs text-stone-400 mt-2">
        <button
          onClick={() => onSimulateAnswer('perfect')}
          className="hover:text-stone-700 transition-colors cursor-pointer"
          title="Tester le rendu sans micro"
        >
          Simuler juste
        </button>
        <span>•</span>
        <button
          onClick={() => onSimulateAnswer('with-error')}
          className="hover:text-stone-700 transition-colors cursor-pointer"
          title="Tester une erreur"
        >
          Simuler faute
        </button>
        <span>•</span>
        <button
          onClick={onSkip}
          className="hover:text-stone-700 transition-colors cursor-pointer flex items-center gap-0.5"
          title="Passer à la phrase suivante"
        >
          <span>Passer</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
