'use client';
import React, { useEffect } from 'react';
import { EvaluationResult } from '@/lib/types';
import { ArrowRight, RotateCcw, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultDrawerProps {
  result: EvaluationResult;
  onRetry: () => void;
  onNext: () => void;
  onPlaySolutionAudio: () => void;
}

export const ResultDrawer: React.FC<ResultDrawerProps> = ({
  result,
  onRetry,
  onNext,
  onPlaySolutionAudio,
}) => {
  useEffect(() => {
    if (result.isCorrect && result.speedRating === 'lightning') {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#0d9488', '#14b8a6', '#2dd4bf'],
      });
    }
  }, [result]);

  return (
    <div className="w-full max-w-xl mx-auto mt-6 rounded-2xl bg-white border border-stone-200/80 p-6 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Header: Score & Time */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <span
            className={`font-mono text-xl font-bold ${
              result.isCorrect ? 'text-teal-600' : 'text-rose-500'
            }`}
          >
            {result.accuracy}%
          </span>
          <span className="text-sm font-semibold text-stone-900">
            {result.isCorrect ? 'Correct' : 'À perfectionner'}
          </span>
        </div>

        <span className="font-mono text-xs text-stone-500">
          {result.timeSeconds.toFixed(2)}s
        </span>
      </div>

      {/* Spoken vs Expected with Audio Listen Button */}
      <div className="space-y-3 text-sm">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
            Ce que tu as dit
          </span>
          <p className="text-stone-700 font-medium">
            {result.transcript || '(aucun son)'}
          </p>
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-xl bg-teal-50/50 border border-teal-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider">
              Bonne réponse &amp; prononciation
            </span>
            <button
              onClick={onPlaySolutionAudio}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Écouter la prononciation correcte"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Écouter</span>
            </button>
          </div>
          <p className="text-stone-900 font-semibold text-base">
            « {result.optimalAnswer} »
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-600 leading-relaxed">
        {result.explanation}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réessayer</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm shadow-teal-600/20 transition-all cursor-pointer active:scale-95"
        >
          <span>Suivant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
