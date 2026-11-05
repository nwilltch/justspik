'use client';

import React, { useState } from 'react';
import { Sparkles, X, Mic, Zap, BookOpen } from 'lucide-react';

interface ReflexGuidePillProps {
  targetLangName: string;
}

export const ReflexGuidePill: React.FC<ReflexGuidePillProps> = ({ targetLangName }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="w-full max-w-xl mx-auto mb-4 bg-white/80 backdrop-blur-xs border border-stone-200/90 rounded-2xl p-3 sm:px-4 shadow-2xs animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between gap-2">
        {/* Steps */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs text-stone-700">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-4 h-4 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span className="text-stone-600">Lis la phrase</span>
          </div>

          <span className="text-stone-300 hidden sm:inline">→</span>

          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-4 h-4 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span className="text-stone-600">Active le micro</span>
          </div>

          <span className="text-stone-300 hidden sm:inline">→</span>

          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <span className="text-teal-900 font-semibold">
              Dis-la en {targetLangName} avant le chrono !
            </span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-stone-400 hover:text-stone-600 p-1 rounded-md transition-colors cursor-pointer shrink-0"
          title="Masquer le guide"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
