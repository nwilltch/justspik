'use client';
import React, { useEffect } from 'react';
import { Mic, MicOff, ChevronRight } from 'lucide-react';
import { sound } from '@/lib/soundFx';

interface VoiceTriggerProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSimulateAnswer: (preset: 'perfect' | 'with-error') => void;
  onSkip: () => void;
  disabled?: boolean;
}

export const VoiceTrigger: React.FC<VoiceTriggerProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onSimulateAnswer,
  onSkip,
  disabled = false,
}) => {
  // Push to talk with space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (!isRecording && !disabled) {
          onStartRecording();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
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
  }, [isRecording, disabled, onStartRecording, onStopRecording]);

  return (
    <div className="w-full max-w-sm mx-auto mt-8 flex flex-col items-center gap-4">
      {/* Central Clean Spik Button */}
      <div className="relative">
        <button
          onClick={() => {
            sound.playSoftClick();
            if (isRecording) {
              onStopRecording();
            } else {
              onStartRecording();
            }
          }}
          disabled={disabled}
          title={isRecording ? 'Arrêter et analyser' : 'Parler en anglais'}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
            isRecording
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25 scale-105'
              : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
          } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {isRecording ? (
            <MicOff className="w-6 h-6 animate-pulse" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Discrete minimal test & skip bar */}
      <div className="flex items-center gap-2 text-xs text-stone-400">
        <button
          onClick={() => onSimulateAnswer('perfect')}
          className="hover:text-stone-700 transition-colors cursor-pointer"
        >
          Simuler juste
        </button>
        <span>•</span>
        <button
          onClick={() => onSimulateAnswer('with-error')}
          className="hover:text-stone-700 transition-colors cursor-pointer"
        >
          Simuler faute
        </button>
        <span>•</span>
        <button
          onClick={onSkip}
          className="hover:text-stone-700 transition-colors cursor-pointer flex items-center gap-0.5"
          title="Passer"
        >
          <span>Passer</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
