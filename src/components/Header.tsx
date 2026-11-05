'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  ChevronDown,
  Sparkles,
  PenLine,
  Loader2,
  Volume2,
  VolumeX,
  Trophy,
  User,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { ModeDropdown, GameMode } from './ModeDropdown';
import { sound } from '@/lib/soundFx';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, isLoading, openAuthModal, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isMenuOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isUserMenuOpen]);

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
        <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block animate-pulse" />
        <span className="text-lg font-bold tracking-tight text-stone-900">
          just<span className="text-teal-600">spik</span>
        </span>
      </div>

      {/* Right Controls: Mode Dropdown + Add Action + Leaderboard + Sound + Auth */}
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

        {/* Authentication Button / User Profile */}
        {!isLoading && (
          <div className="relative ml-1" ref={userMenuRef}>
            {user ? (
              <>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-8 h-8 rounded-full bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold flex items-center justify-center hover:bg-teal-200/80 transition-colors cursor-pointer shadow-xs"
                  title={user.name || user.email}
                >
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-stone-200/90 shadow-xl p-2 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 border-b border-stone-100 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-stone-900 truncate">
                          {user.name}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <span className="text-[11px] text-stone-400 truncate block">
                        {user.email}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-stone-200 hover:border-teal-600 bg-white hover:bg-teal-50/50 text-stone-700 hover:text-teal-800 text-xs font-medium transition-all cursor-pointer shadow-2xs"
                title="Se connecter ou s'inscrire"
              >
                <User className="w-3.5 h-3.5 text-stone-400 group-hover:text-teal-600" />
                <span>Connexion</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
