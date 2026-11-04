'use client';
import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Share2, RotateCcw, Check, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '@/lib/soundFx';

interface SummaryModalProps {
  isOpen: boolean;
  mode: 'survival' | 'daily';
  score: number;
  totalAttempted: number;
  avgTimeSeconds: number;
  accuracyRate: number;
  historySymbols: ('lightning' | 'normal' | 'error')[];
  streak: number;
  onReplay: () => void;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  isOpen,
  mode,
  score,
  totalAttempted,
  avgTimeSeconds,
  accuracyRate,
  historySymbols,
  streak,
  onReplay,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  // Compute Reflex Grade
  let grade = 'S-Tier';
  let gradeLabel = 'Réflexe Natif';
  let gradeColor = 'text-teal-600 bg-teal-50 border-teal-200';
  let gradeIcon = '💎';

  if (avgTimeSeconds > 4.2 || accuracyRate < 60) {
    grade = 'C-Tier';
    gradeLabel = 'Traduction lente';
    gradeColor = 'text-stone-600 bg-stone-100 border-stone-200';
    gradeIcon = '🐢';
  } else if (avgTimeSeconds > 3.2 || accuracyRate < 75) {
    grade = 'B-Tier';
    gradeLabel = 'Hésitation';
    gradeColor = 'text-amber-700 bg-amber-50 border-amber-200';
    gradeIcon = '🏃';
  } else if (avgTimeSeconds > 2.2) {
    grade = 'A-Tier';
    gradeLabel = 'Conversation Fluide';
    gradeColor = 'text-teal-700 bg-teal-50 border-teal-200';
    gradeIcon = '⚡';
  }

  useEffect(() => {
    if (isOpen) {
      sound.playVictoryFanfare();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#14b8a6', '#2dd4bf', '#f59e0b'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build Wordle-style text to copy
  const emojiGrid = historySymbols
    .map((s) => (s === 'lightning' ? '🟩' : s === 'normal' ? '🟨' : '🟥'))
    .join(' ');

  const handleCopyShare = () => {
    const text = `JustSpik ${mode === 'survival' ? '⚡ Survie' : '📅 Sprint'} #Reflex
Vitesse : ${avgTimeSeconds.toFixed(2)}s (${grade})
Précision : ${accuracyRate}%
${emojiGrid}
🔥 Série : ${streak} jours
Entraîne tes réflexes d'élocution !`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-stone-200/90 p-6 md:p-8 shadow-2xl text-center">
        {/* Top Grade Badge */}
        <div className="flex flex-col items-center justify-center mb-4">
          <span className="text-4xl mb-1">{gradeIcon}</span>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${gradeColor}`}
          >
            <span>{grade}</span>
            <span>•</span>
            <span>{gradeLabel}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-stone-900 mb-1">
          {mode === 'survival' ? 'Session Survie Terminée !' : 'Sprint Quotidien Réussi !'}
        </h3>
        <p className="text-xs text-stone-500 mb-6">
          {mode === 'survival'
            ? `Tu as survécu à ${score} phrases sous pression.`
            : `Tes 7 phrases quotidiennes sont validées.`}
        </p>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center">
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Vitesse Moy.
            </span>
            <span className="font-mono text-base font-bold text-stone-900">
              {avgTimeSeconds.toFixed(2)}s
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Précision
            </span>
            <span className="font-mono text-base font-bold text-teal-600">
              {accuracyRate}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/60">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Série
            </span>
            <span className="font-mono text-base font-bold text-amber-600 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {streak} j
            </span>
          </div>
        </div>

        {/* Wordle-style visual summary */}
        <div className="p-3 rounded-2xl bg-stone-100/70 border border-stone-200/60 mb-6">
          <span className="block text-[10px] font-semibold text-stone-500 mb-1.5">
            Tableau de tir réflexe :
          </span>
          <div className="text-xl tracking-widest">{emojiGrid}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleCopyShare}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-600" />
                <span className="text-teal-700">Copié !</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Partager mon score</span>
              </>
            )}
          </button>

          <button
            onClick={onReplay}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rejouer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
