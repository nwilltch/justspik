'use client';
import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { SupportedLang } from '@/lib/types';
import { SUPPORTED_LANGUAGES } from '@/lib/data';

interface LanguageSelectorProps {
  sourceLang: SupportedLang;
  targetLang: SupportedLang;
  onSwapLanguages: () => void;
  onChangeSourceLang: (lang: SupportedLang) => void;
  onChangeTargetLang: (lang: SupportedLang) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLang,
  targetLang,
  onSwapLanguages,
  onChangeSourceLang,
  onChangeTargetLang,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-white border border-stone-200/80 shadow-sm">
        {/* Source Language Select */}
        <div className="relative">
          <select
            value={sourceLang}
            onChange={(e) => onChangeSourceLang(e.target.value as SupportedLang)}
            className="appearance-none pl-3 pr-2 py-1 rounded-full text-xs font-semibold text-stone-800 bg-transparent hover:bg-stone-50 cursor-pointer focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={`source-${lang.code}`} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Arrow Button */}
        <button
          onClick={onSwapLanguages}
          title="Inverser les langues"
          className="p-1.5 rounded-full text-stone-500 hover:text-blue-700 hover:bg-blue-50 active:scale-90 transition-all duration-150 cursor-pointer"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>

        {/* Target Language Select */}
        <div className="relative">
          <select
            value={targetLang}
            onChange={(e) => onChangeTargetLang(e.target.value as SupportedLang)}
            className="appearance-none pl-2 pr-3 py-1 rounded-full text-xs font-semibold text-blue-700 bg-transparent hover:bg-blue-50/50 cursor-pointer focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={`target-${lang.code}`} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
