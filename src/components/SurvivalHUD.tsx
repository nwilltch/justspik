'use client';
import React from 'react';
import { Zap, Heart, AlertTriangle } from 'lucide-react';
import { GameMode } from './ModeSelector';

interface SurvivalHUDProps {
  mode: GameMode;
  survivalSecondsLeft: number;
  survivalScore: number;
  dailyStep: number;
  dailyTotal: number;
  timeBonusDelta: number | null; // e.g. +4 or -5
}

export const SurvivalHUD: React.FC<SurvivalHUDProps> = ({
  mode,
  survivalSecondsLeft,
  survivalScore,
  dailyStep,
  dailyTotal,
  timeBonusDelta,
}) => {
  if (mode === 'focus') return null;

  if (mode === 'daily') {
    return (
      <div className="w-full max-w-xl mx-auto mb-4 flex items-center justify-between px-4 py-2 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-900">Sprint Quotidien</span>
          <span className="text-[11px] font-mono text-stone-400">
            {dailyStep} / {dailyTotal}
          </span>
        </div>

        {/* 7 step dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: dailyTotal }).map((_, i) => (
            <span
              key={`dot-${i}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i < dailyStep
                  ? 'bg-teal-500 scale-100 shadow-2xs'
                  : i === dailyStep
                  ? 'bg-teal-300 ring-2 ring-teal-500/30 animate-pulse'
                  : 'bg-stone-200'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Survival Mode HUD
  const isUrgent = survivalSecondsLeft <= 10;
  const isCritical = survivalSecondsLeft <= 5;

  return (
    <div className="w-full max-w-xl mx-auto mb-4 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white border border-stone-200/80 shadow-sm relative overflow-hidden">
      {/* Background danger tint when urgent */}
      {isUrgent && (
        <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none" />
      )}

      {/* Score */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <div>
          <span className="text-xs font-bold text-stone-900">
            {survivalScore} {survivalScore > 1 ? 'phrases' : 'phrase'}
          </span>
          <span className="block text-[10px] text-stone-400">survécues</span>
        </div>
      </div>

      {/* Big Countdown with Delta bonus indicator */}
      <div className="flex items-center gap-3">
        {timeBonusDelta !== null && (
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full animate-bounce ${
              timeBonusDelta > 0
                ? 'bg-teal-100 text-teal-800 border border-teal-200'
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            {timeBonusDelta > 0 ? `+${timeBonusDelta}s` : `${timeBonusDelta}s`}
          </span>
        )}

        <div className="flex items-baseline gap-1 font-mono">
          <span
            className={`text-2xl md:text-3xl font-black tabular-numbers transition-colors ${
              isCritical
                ? 'text-rose-600 animate-pulse'
                : isUrgent
                ? 'text-amber-500'
                : 'text-stone-900'
            }`}
          >
            {Math.max(0, Math.ceil(survivalSecondsLeft))}
          </span>
          <span className="text-xs text-stone-400 font-semibold">s</span>
        </div>
      </div>
    </div>
  );
};
