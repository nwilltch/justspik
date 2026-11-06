'use client';
import React, { useState } from 'react';
import { Volume2, ArrowLeftRight, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { Challenge, SupportedLang } from '@/lib/types';
import { SUPPORTED_LANGUAGES, getLanguageInfo } from '@/lib/data';

interface PromptCardProps {
  challenge: Challenge;
  isRecording: boolean;
  onPlayPromptAudio: () => void;
  onSwapLanguages: () => void;
  onChangeSourceLang: (lang: SupportedLang) => void;
  onChangeTargetLang: (lang: SupportedLang) => void;
  onSkip?: () => void;
  ghostRecord?: number | null;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  challenge,
  isRecording,
  onPlayPromptAudio,
  onSwapLanguages,
  onChangeSourceLang,
  onChangeTargetLang,
  onSkip,
  ghostRecord,
}) => {
  const [showHint, setShowHint] = useState(false);
  const sourceInfo = getLanguageInfo(challenge.sourceLang);
  const targetInfo = getLanguageInfo(challenge.targetLang);

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-white border border-stone-200/80 p-6 md:p-8 shadow-sm transition-all text-center relative">
      {/* Top Bar with Combined Language Action Flow & Audio */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-stone-100">
        <div className="flex items-center gap-1.5 bg-stone-50/90 border border-stone-200/70 rounded-full px-3 py-1 shadow-2xs">
          {/* Source Lang Select */}
          <select
            value={challenge.sourceLang}
            onChange={(e) => onChangeSourceLang(e.target.value as SupportedLang)}
            className="appearance-none bg-transparent text-xs font-semibold text-stone-700 pr-1 cursor-pointer focus:outline-none hover:text-stone-900"
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
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 active:scale-90 transition-all cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>

          {/* Target Lang with Direct Action "Dis en" (Neutral, without active state) */}
          <div className="flex items-center gap-1 pl-1">
            <span className="text-xs text-stone-400 font-medium">Dis en</span>
            <select
              value={challenge.targetLang}
              onChange={(e) => onChangeTargetLang(e.target.value as SupportedLang)}
              className="appearance-none bg-transparent text-xs font-semibold text-stone-800 cursor-pointer focus:outline-none hover:text-stone-950"
              title="Langue d'arrivée"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={`card-tgt-${l.code}`} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Audio button to listen to source sentence */}
        <button
          onClick={onPlayPromptAudio}
          className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
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

        {/* Vocabulary Hint Toggle */}
        <div className="mt-3 flex items-center justify-center">
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
          <div className="mt-2 text-xs font-medium text-blue-700 bg-blue-50/60 border border-blue-100 rounded-xl py-1.5 px-3 inline-block animate-in fade-in duration-150">
            💡 {challenge.optimalAnswer}
          </div>
        )}
      </div>

      {/* Card Footer: Ghost Record on the left + Skip button on the right */}
      <div className="flex items-center justify-between mt-3 pt-2">
        <div className="flex items-center gap-2">
          {ghostRecord !== null && ghostRecord !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100/90 border border-stone-200/60 text-[11px] font-mono text-stone-600 shadow-2xs">
              <span>👻</span>
              <span>
                Record : <strong className="text-blue-700">{ghostRecord.toFixed(2)}s</strong>
              </span>
            </div>
          )}

          {isRecording && (
            <div className="flex items-center gap-1 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="w-1.5 h-3 rounded-full bg-blue-500 animate-pulse delay-75" />
              <span className="w-1.5 h-4 rounded-full bg-blue-500 animate-pulse delay-150" />
              <span className="w-1.5 h-2 rounded-full bg-blue-500 animate-pulse delay-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="ml-1.5 text-xs font-mono text-blue-600 font-medium">
                Écoute ({targetInfo.name})...
              </span>
            </div>
          )}
        </div>

        {onSkip && (
          <button
            onClick={onSkip}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer ml-auto"
            title="Passer à la phrase suivante"
          >
            <span>Passer</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
