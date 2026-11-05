'use client';
import React, { useState } from 'react';
import { Volume2, ArrowLeftRight, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { Challenge, SupportedLang } from '@/lib/types';
import { SUPPORTED_LANGUAGES, getLanguageInfo } from '@/lib/data';

interface PromptCardProps {
  challenge: Challenge;
  isRecording: boolean;
  onPlayPromptAudio: () => void;
  onSwapLanguages: () => void;
  onChangeSourceLang: (lang: SupportedLang) => void;
  onChangeTargetLang: (lang: SupportedLang) => void;
  ghostRecord?: number | null;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  challenge,
  isRecording,
  onPlayPromptAudio,
  onSwapLanguages,
  onChangeSourceLang,
  onChangeTargetLang,
  ghostRecord,
}) => {
  const [showHint, setShowHint] = useState(false);
  const sourceInfo = getLanguageInfo(challenge.sourceLang);
  const targetInfo = getLanguageInfo(challenge.targetLang);

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-white border border-stone-200/80 p-6 md:p-8 shadow-sm transition-all text-center">
      {/* Top Bar with Language Selectors & Audio */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
        <div className="flex items-center gap-1.5 bg-stone-50/80 border border-stone-200/70 rounded-full px-2.5 py-1">
          {/* Source Lang Select */}
          <select
            value={challenge.sourceLang}
            onChange={(e) => onChangeSourceLang(e.target.value as SupportedLang)}
            className="appearance-none bg-transparent text-xs font-semibold text-stone-800 pr-1 cursor-pointer focus:outline-none hover:text-stone-950"
            title="Langue de départ"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={`card-src-${l.code}`} value={l.code}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>

          {/* Swap Arrow Button */}
          <button
            onClick={onSwapLanguages}
            title="Inverser les langues"
            className="p-1 rounded-full text-stone-400 hover:text-teal-700 hover:bg-teal-50 active:scale-90 transition-all cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>

          {/* Target Lang Select */}
          <select
            value={challenge.targetLang}
            onChange={(e) => onChangeTargetLang(e.target.value as SupportedLang)}
            className="appearance-none bg-transparent text-xs font-semibold text-teal-700 pl-1 cursor-pointer focus:outline-none hover:text-teal-800"
            title="Langue d'arrivée"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={`card-tgt-${l.code}`} value={l.code}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Audio button to listen to source sentence */}
        <button
          onClick={onPlayPromptAudio}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          title={`Écouter la phrase en ${sourceInfo.name}`}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Explicit Action Label */}
      <div className="flex items-center justify-center gap-1.5 mb-2.5">
        <span className="text-[11px] font-medium tracking-tight text-stone-400">
          Traduis en
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded-full">
          <span>{targetInfo.flag}</span>
          <span>{targetInfo.name}</span>
        </span>
      </div>

      {/* Target Phrase */}
      <div className="py-2">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-stone-900 leading-snug">
          « {challenge.sourceText} »
        </h2>

        {/* Vocabulary Hint Toggle */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {ghostRecord !== null && ghostRecord !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-stone-100 border border-stone-200/60 text-[11px] font-mono text-stone-600">
              <span>👻</span>
              <span>
                Record : <strong className="text-teal-700">{ghostRecord.toFixed(2)}s</strong>
              </span>
            </div>
          )}

          <button
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Besoin d'un indice ?"
          >
            {showHint ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{showHint ? 'Masquer l’indice' : 'Un doute ? Voir l’indice'}</span>
          </button>
        </div>

        {/* Hint Revealed */}
        {showHint && (
          <div className="mt-2 text-xs font-medium text-teal-700 bg-teal-50/60 border border-teal-100 rounded-xl py-1.5 px-3 inline-block animate-in fade-in duration-150">
            💡 {challenge.optimalAnswer}
          </div>
        )}
      </div>

      {/* Subtle indicator while listening */}
      <div className="h-6 flex items-center justify-center mt-3">
        {isRecording ? (
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="w-1.5 h-3 rounded-full bg-teal-500 animate-pulse delay-75" />
            <span className="w-1.5 h-4 rounded-full bg-teal-500 animate-pulse delay-150" />
            <span className="w-1.5 h-2 rounded-full bg-teal-500 animate-pulse delay-75" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="ml-2 text-xs font-mono text-teal-600 font-medium">
              Écoute en cours ({targetInfo.name})...
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-stone-400 font-medium">
            Maintiens <kbd className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-600 font-mono text-[10px]">Espace</kbd> ou clique sur le micro pour parler
          </span>
        )}
      </div>
    </div>
  );
};
