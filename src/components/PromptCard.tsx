'use client';
import React from 'react';
import { Volume2, ArrowLeftRight } from 'lucide-react';
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
  const sourceInfo = getLanguageInfo(challenge.sourceLang);
  const targetInfo = getLanguageInfo(challenge.targetLang);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-white border border-stone-200/80 p-6 md:p-8 shadow-sm transition-all text-center">
      {/* Top Bar with Language Selectors & Swap Arrow inside the Card */}
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

      {/* Target Phrase */}
      <div className="py-2">
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-stone-900 leading-snug">
          « {challenge.sourceText} »
        </h2>

        {/* Ghost Mode: Previous best record */}
        {ghostRecord !== null && ghostRecord !== undefined && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-stone-100 border border-stone-200/60 text-[11px] font-mono text-stone-600">
            <span>👻</span>
            <span>Record personnel : <strong className="text-teal-700">{ghostRecord.toFixed(2)}s</strong></span>
          </div>
        )}
      </div>

      {/* Subtle indicator while listening */}
      <div className="h-6 flex items-center justify-center mt-4">
        {isRecording ? (
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="w-1.5 h-3 rounded-full bg-teal-500 animate-pulse delay-75" />
            <span className="w-1.5 h-4 rounded-full bg-teal-500 animate-pulse delay-150" />
            <span className="w-1.5 h-2 rounded-full bg-teal-500 animate-pulse delay-75" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="ml-2 text-xs font-mono text-teal-600 font-medium">écoute ({targetInfo.name})...</span>
          </div>
        ) : (
          <span className="text-[11px] text-stone-400">
            espace ou clic pour parler en {targetInfo.name}
          </span>
        )}
      </div>
    </div>
  );
};
