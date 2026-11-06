'use client';
import React, { useState, useEffect, useRef } from 'react';
import { EvaluationResult } from '@/lib/types';
import { ArrowRight, RotateCcw, Volume2, Play, Pause, Mic } from 'lucide-react';
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
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (result.isCorrect && result.speedRating === 'lightning') {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#3b82f6', '#60a5fa'],
      });
    }
  }, [result]);

  // Réinitialiser la lecture audio quand le résultat change
  useEffect(() => {
    setIsPlayingUserAudio(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
  }, [result]);

  const handleTogglePlayUserAudio = () => {
    if (!result.userAudioUrl) return;

    if (isPlayingUserAudio && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlayingUserAudio(false);
      return;
    }

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(result.userAudioUrl);
      audioPlayerRef.current.onended = () => setIsPlayingUserAudio(false);
      audioPlayerRef.current.onerror = () => setIsPlayingUserAudio(false);
    }

    audioPlayerRef.current.play().catch(() => {
      setIsPlayingUserAudio(false);
    });
    setIsPlayingUserAudio(true);
  };

  const handleCleanAndNext = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    onNext();
  };

  const handleCleanAndRetry = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    onRetry();
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6 rounded-3xl bg-white border border-stone-200/80 p-6 sm:p-7 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {/* Header: Score & Time */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <span
            className={`font-mono text-2xl font-black ${
              result.isCorrect ? 'text-blue-600' : 'text-rose-500'
            }`}
          >
            {result.accuracy}%
          </span>
          <span className="text-sm font-semibold text-stone-900">
            {result.isCorrect ? 'Réflexe validé' : 'À perfectionner'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-stone-100 font-mono text-xs font-semibold text-stone-600 border border-stone-200/60">
            ⚡ {result.timeSeconds.toFixed(2)}s
          </span>
        </div>
      </div>

      {/* Spoken vs Expected */}
      <div className="space-y-3 text-sm">
        {/* Ce que l'utilisateur a dit */}
        <div className="flex flex-col gap-1 p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1">
              <Mic className="w-3.5 h-3.5 text-stone-400" />
              <span>Ta prononciation</span>
            </span>

            {/* Bouton de réécoute de sa propre voix */}
            {result.userAudioUrl && (
              <button
                onClick={handleTogglePlayUserAudio}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-2xs border ${
                  isPlayingUserAudio
                    ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/25 ring-2 ring-amber-100'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
                title="Réécouter ma voix"
              >
                {isPlayingUserAudio ? (
                  <>
                    <Pause className="w-3 h-3 fill-current" />
                    <span>Pause</span>
                    <span className="flex items-center gap-0.5 ml-1">
                      <span className="w-1 h-2 bg-white rounded-full animate-pulse" />
                      <span className="w-1 h-3.5 bg-white rounded-full animate-pulse delay-75" />
                      <span className="w-1 h-2 bg-white rounded-full animate-pulse delay-150" />
                    </span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current text-blue-600" />
                    <span>Réécouter ma voix</span>
                  </>
                )}
              </button>
            )}
          </div>

          <p className="text-stone-800 font-medium text-base mt-1">
            {result.transcript ? `« ${result.transcript} »` : '(aucun son détecté)'}
          </p>
        </div>

        {/* Modèle natif attendu */}
        <div className="flex flex-col gap-1 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">
              Modèle natif recommandé
            </span>
            <button
              onClick={onPlaySolutionAudio}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Écouter la prononciation du natif"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Modèle natif</span>
            </button>
          </div>
          <p className="text-stone-900 font-bold text-base mt-1">
            « {result.optimalAnswer} »
          </p>
        </div>
      </div>

      {/* Explanation */}
      {result.explanation && (
        <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60 text-xs text-stone-600 leading-relaxed">
          💡 {result.explanation}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={handleCleanAndRetry}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réessayer</span>
        </button>

        <button
          onClick={handleCleanAndNext}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
        >
          <span>Suivant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
