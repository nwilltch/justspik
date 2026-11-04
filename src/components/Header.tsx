'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, Sparkles, PenLine, Loader2, Volume2, VolumeX, Trophy } from 'lucide-react';
import { ModeDropdown, GameMode } from './ModeDropdown';
import { sound } from '@/lib/soundFx';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenCustomModal: () => void;
  onOpenLeaderboard: () => void;
  isGenerating: boolean;
  onGenerateNewPhrase: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  isMuted,
  onToggleMute,
  onOpenCustomModal,
  onOpenLeaderboard,
  isGenerating,
  onGenerateNewPhrase,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleActionGenerate = () => {
    setIsMenuOpen(false);
    onGenerateNewPhrase();
  };

  const handleActionCustom = () => {
    setIsMenuOpen(false);
    onOpenCustomModal();
  };

  return (
    <header className="w-full max-w-2xl mx-auto pt-6 pb-2 px-2 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
        <span className="text-lg font-bold tracking-tight text-stone-900">
          just<span className="text-teal-600">spik</span>
        </span>
      </div>

      {/* Right Controls: Mode Dropdown + Add Action + Leaderboard + Sound Toggle */}
      <div className="flex items-center gap-2">
        {/* Dropdown with icon for game modes */}
        <ModeDropdown currentMode={currentMode} onSelectMode={onSelectMode} />

        {/* Unified "+ Ajouter" Menu Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Ajouter une phrase"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>{isGenerating ? 'Création...' : 'Ajouter'}</span>
            <ChevronDown
              className={`w-3 h-3 text-teal-200 transition-transform duration-150 ${
                isMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Minimalist Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-stone-200/90 shadow-xl p-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                onClick={handleActionGenerate}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-stone-50 transition-colors cursor-pointer group"
              >
                <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-100/80 transition-colors mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-stone-900">
                    Nouvelle phrase du thème
                  </span>
                  <span className="block text-[11px] text-stone-500">
                    Génère une phrase pour la catégorie active
                  </span>
                </div>
              </button>

              <button
                onClick={handleActionCustom}
                className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-stone-50 transition-colors cursor-pointer group"
              >
                <div className="p-1.5 rounded-lg bg-stone-100 text-stone-700 group-hover:bg-stone-200 transition-colors mt-0.5">
                  <PenLine className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-stone-900">
                    Saisir ma propre phrase
                  </span>
                  <span className="block text-[11px] text-stone-500">
                    Écris ton texte personnel et sa traduction
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Leaderboard Drawer Button */}
        <button
          onClick={() => {
            sound.playSoftClick();
            onOpenLeaderboard();
          }}
          className="p-1.5 rounded-full text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
          title="Ouvrir le classement réflexe"
        >
          <Trophy className="w-4 h-4" />
        </button>

        {/* Mute button */}
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          title={isMuted ? 'Activer le son' : 'Couper le son'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
