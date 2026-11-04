'use client';
import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { SupportedLang, MultilingualEntry } from '@/lib/types';
import { SUPPORTED_LANGUAGES, getLanguageInfo } from '@/lib/data';

interface CustomPhraseModalProps {
  isOpen: boolean;
  currentSourceLang: SupportedLang;
  onClose: () => void;
  onPhraseAdded: (entry: MultilingualEntry) => void;
}

export const CustomPhraseModal: React.FC<CustomPhraseModalProps> = ({
  isOpen,
  currentSourceLang,
  onClose,
  onPhraseAdded,
}) => {
  const [sourceLang, setSourceLang] = useState<SupportedLang>(currentSourceLang);
  const [sourceText, setSourceText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceText.trim()) {
      setError('Veuillez entrer une phrase.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/translate-custom-phrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText: sourceText.trim(),
          sourceLang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la traduction.');
      }

      if (data.entry) {
        onPhraseAdded(data.entry);
        setSourceText('');
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-stone-200/80 p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <h3 className="text-base font-bold text-stone-900 tracking-tight">
              Ajouter une phrase
            </h3>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Saisis ta phrase dans ta langue : elle sera automatiquement polie et traduite dans les 5 langues avec ses astuces.
          </p>
        </div>

        {error && (
          <p className="mb-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source Language Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Langue de la phrase
            </label>
            <div className="relative">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value as SupportedLang)}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={`custom-lang-${l.code}`} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Text input */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Ta phrase brute ({getLanguageInfo(sourceLang).name})
            </label>
            <textarea
              rows={3}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              disabled={isLoading}
              placeholder="Ex: J'aimerais qu'on cale un point rapide demain matin si tu es disponible..."
              className="w-full px-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Traitement &amp; Traduction...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Traduire &amp; Intégrer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
