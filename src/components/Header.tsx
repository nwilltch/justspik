'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Trophy,
  User,
  LogOut,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { ModeDropdown, GameMode } from './ModeDropdown';
import { sound } from '@/lib/soundFx';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenLeaderboard: () => void;
  onOpenMobileSidebar?: () => void;
  currentCategoryLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  isMuted,
  onToggleMute,
  onOpenLeaderboard,
  onOpenMobileSidebar,
  currentCategoryLabel,
}) => {
  const { user, isLoading, openAuthModal, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <header className="w-full max-w-2xl mx-auto pt-6 pb-2 px-2 flex items-center justify-between">
      {/* Left: Mobile Theme/Sidebar Drawer Trigger (Hidden on Desktop since Sidebar is visible) */}
      <div>
        {onOpenMobileSidebar ? (
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200/90 shadow-2xs hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            title="Ouvrir le menu et les thèmes"
          >
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>{currentCategoryLabel || 'Thèmes'}</span>
          </button>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>

      {/* Right Controls: Mode Dropdown + Leaderboard + Sound + Auth */}
      <div className="flex items-center gap-2">
        {/* Dropdown with icon for game modes */}
        <ModeDropdown currentMode={currentMode} onSelectMode={onSelectMode} />

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
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="text-xs font-semibold text-stone-900 truncate">
                        {user.name || 'Apprenant'}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer mt-1 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>Connexion</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
