'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Briefcase,
  Coffee,
  MessageCircle,
  Compass,
  Cpu,
  Flame,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Check,
  Plus,
  ChevronDown,
  PenLine,
  Loader2,
} from 'lucide-react';
import { PhraseCategory } from '@/lib/types';
import { sound } from '@/lib/soundFx';

export interface CategorySidebarProps {
  currentCategory: PhraseCategory;
  onSelectCategory: (cat: PhraseCategory) => void;
  counts: Record<PhraseCategory, number>;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
  onToggleCollapseDesktop: () => void;
  isGenerating?: boolean;
  onGenerateNewPhrase?: () => void;
  onOpenCustomModal?: () => void;
}

interface CategoryDefinition {
  id: PhraseCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const CATEGORIES_LIST: CategoryDefinition[] = [
  { id: 'routine', label: 'Routines', icon: Sun, description: 'Habitudes, matin, météo' },
  { id: 'work', label: 'Travail', icon: Briefcase, description: 'Bureau, réunions, emails' },
  { id: 'food', label: 'Cuisine', icon: Coffee, description: 'Restaurant, plats, commandes' },
  { id: 'social', label: 'Relations', icon: MessageCircle, description: 'Discussions, soirées' },
  { id: 'travel', label: 'Voyage', icon: Compass, description: 'Aéroports, gares, ville' },
  { id: 'tech', label: 'Tech', icon: Cpu, description: 'Digital, visio, outils' },
  { id: 'slang', label: 'Idiomes', icon: Flame, description: 'Expressions naturelles' },
  { id: 'custom', label: 'Mes phrases', icon: Sparkles, description: 'Phrases personnalisées' },
];

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  currentCategory,
  onSelectCategory,
  counts,
  isMobileOpen,
  onCloseMobile,
  isCollapsedDesktop,
  onToggleCollapseDesktop,
  isGenerating = false,
  onGenerateNewPhrase,
  onOpenCustomModal,
}) => {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isMobileAddMenuOpen, setIsMobileAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const mobileAddMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
      if (mobileAddMenuRef.current && !mobileAddMenuRef.current.contains(event.target as Node)) {
        setIsMobileAddMenuOpen(false);
      }
    };
    if (isAddMenuOpen || isMobileAddMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAddMenuOpen, isMobileAddMenuOpen]);

  const handleSelect = (catId: PhraseCategory) => {
    sound.playSoftClick();
    onSelectCategory(catId);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const totalPhrases = Object.values(counts).reduce((acc, curr) => acc + curr, 0);

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP SIDEBAR (Static sticky rail on md+ screens)    */}
      {/* ========================================================= */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out border-r border-stone-200/80 bg-white/70 backdrop-blur-md select-none ${
          isCollapsedDesktop ? 'w-18 px-2 py-6' : 'w-64 p-5'
        }`}
      >
        {/* Top: Brand Logo, Add Button & Categories List */}
        <div className="flex flex-col">
          {/* Header Row: Logo replacing Themes + Collapse Toggle */}
          <div
            className={`flex items-center mb-6 ${
              isCollapsedDesktop ? 'justify-center' : 'justify-between px-1'
            }`}
          >
            {!isCollapsedDesktop ? (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block animate-pulse shrink-0" />
                <span className="text-lg font-bold tracking-tight text-stone-900 leading-none">
                  just<span className="text-teal-600">spik</span>
                </span>
              </div>
            ) : (
              <div
                className="w-9 h-9 rounded-xl bg-stone-900 text-white font-bold flex items-center justify-center text-xs tracking-tighter shadow-2xs"
                title="justspik"
              >
                j<span className="text-teal-400">s</span>
              </div>
            )}

            {!isCollapsedDesktop && (
              <button
                onClick={onToggleCollapseDesktop}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Réduire la barre"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* "+ Ajouter" Button right above Routines */}
          <div className="relative mb-5" ref={addMenuRef}>
            {!isCollapsedDesktop ? (
              <button
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                disabled={isGenerating}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                title="Ajouter une phrase"
              >
                <div className="flex items-center gap-2">
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{isGenerating ? 'Création...' : 'Ajouter une phrase'}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-teal-200 transition-transform duration-150 ${
                    isAddMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            ) : (
              <button
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                disabled={isGenerating}
                className="w-12 h-12 mx-auto rounded-2xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                title="Ajouter une phrase"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Dropdown Menu */}
            {isAddMenuOpen && (
              <div
                className={`absolute ${
                  isCollapsedDesktop ? 'left-full ml-2 top-0' : 'left-0 right-0 top-full mt-2'
                } w-64 rounded-2xl bg-white border border-stone-200/90 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150`}
              >
                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    onGenerateNewPhrase?.();
                  }}
                  className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-stone-50 transition-colors cursor-pointer group"
                >
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-100/80 transition-colors mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-stone-900">
                      Nouvelle phrase du thème
                    </span>
                    <span className="block text-[11px] text-stone-400 leading-tight mt-0.5">
                      Générée instantanément par DeepSeek
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsAddMenuOpen(false);
                    onOpenCustomModal?.();
                  }}
                  className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-stone-50 transition-colors cursor-pointer group mt-1"
                >
                  <div className="p-1.5 rounded-lg bg-stone-100 text-stone-600 group-hover:bg-stone-200/70 transition-colors mt-0.5">
                    <PenLine className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-stone-900">
                      Phrase sur-mesure
                    </span>
                    <span className="block text-[11px] text-stone-400 leading-tight mt-0.5">
                      Écris ta propre phrase (traduite en 5 langues)
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Category Items */}
          <nav className="flex flex-col gap-1.5">
            {CATEGORIES_LIST.map((cat) => {
              const Icon = cat.icon;
              const isActive = currentCategory === cat.id;
              const count = counts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat.id)}
                  title={
                    isCollapsedDesktop
                      ? `${cat.label} (${count}) • ${cat.description}`
                      : cat.description
                  }
                  className={`group relative flex items-center rounded-2xl transition-all duration-150 cursor-pointer active:scale-98 ${
                    isCollapsedDesktop
                      ? 'w-12 h-12 justify-center mx-auto'
                      : 'w-full px-3 py-2.5 justify-between'
                  } ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/90 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-xl transition-colors shrink-0 ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-xs shadow-teal-600/30'
                          : 'bg-stone-100 text-stone-500 group-hover:text-stone-800 group-hover:bg-stone-200/70'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {!isCollapsedDesktop && (
                      <span className="text-xs truncate font-medium">{cat.label}</span>
                    )}
                  </div>

                  {!isCollapsedDesktop && (
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? 'bg-teal-100/70 text-teal-800 font-semibold'
                          : 'text-stone-400 bg-stone-100/80 group-hover:bg-stone-200/60'
                      }`}
                    >
                      {count}
                    </span>
                  )}

                  {/* Tooltip in collapsed mode */}
                  {isCollapsedDesktop && (
                    <div className="absolute left-full ml-2.5 z-50 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 text-stone-100 text-xs font-medium whitespace-nowrap shadow-md pointer-events-none animate-in fade-in duration-150">
                      <span>{cat.label}</span>
                      <span className="text-[10px] text-stone-400 font-mono">({count})</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Expand Toggle in collapsed mode or Footer */}
        {isCollapsedDesktop ? (
          <div className="flex justify-center pt-4 border-t border-stone-200/70">
            <button
              onClick={onToggleCollapseDesktop}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Déplier la barre latérale"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t border-stone-200/70 px-1 text-[11px] text-stone-400 text-center">
            <span>JustSpik — Reflex Speech Training</span>
          </div>
        )}
      </aside>

      {/* ========================================================= */}
      {/* 2. MOBILE DRAWER (Slide in modal for mobile screens)      */}
      {/* ========================================================= */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full bg-[#fafaf9] border-r border-stone-200 p-5 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header with Logo & Close button */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-lg font-bold tracking-tight text-stone-900">
                    just<span className="text-teal-600">spik</span>
                  </span>
                </div>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer "+ Ajouter" Button */}
              <div className="relative mb-5" ref={mobileAddMenuRef}>
                <button
                  onClick={() => setIsMobileAddMenuOpen(!isMobileAddMenuOpen)}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-2">
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>{isGenerating ? 'Création...' : 'Ajouter une phrase'}</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-teal-200 transition-transform duration-150 ${
                      isMobileAddMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isMobileAddMenuOpen && (
                  <div className="mt-2 w-full rounded-2xl bg-white border border-stone-200/90 shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
                    <button
                      onClick={() => {
                        setIsMobileAddMenuOpen(false);
                        onCloseMobile();
                        onGenerateNewPhrase?.();
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-stone-900">
                          Nouvelle phrase du thème
                        </span>
                        <span className="block text-[10px] text-stone-400 leading-tight mt-0.5">
                          Générée instantanément par DeepSeek
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsMobileAddMenuOpen(false);
                        onCloseMobile();
                        onOpenCustomModal?.();
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-stone-50 transition-colors cursor-pointer mt-1"
                    >
                      <div className="p-1.5 rounded-lg bg-stone-100 text-stone-600 mt-0.5">
                        <PenLine className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-stone-900">
                          Phrase sur-mesure
                        </span>
                        <span className="block text-[10px] text-stone-400 leading-tight mt-0.5">
                          Écris ta propre phrase (traduite en 5 langues)
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Categories List */}
              <nav className="flex flex-col gap-1.5">
                {CATEGORIES_LIST.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = currentCategory === cat.id;
                  const count = counts[cat.id] || 0;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelect(cat.id)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/90 shadow-2xs'
                          : 'text-stone-600 hover:bg-stone-100 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-1.5 rounded-xl shrink-0 ${
                            isActive
                              ? 'bg-teal-600 text-white shadow-xs'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-medium">{cat.label}</span>
                          <span className="text-[10px] text-stone-400 truncate max-w-[150px]">
                            {cat.description}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-teal-100 text-teal-800 font-semibold'
                              : 'text-stone-400 bg-stone-100'
                          }`}
                        >
                          {count}
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-teal-600" />}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-stone-200/80 text-[11px] text-stone-400 text-center">
              <span>JustSpik — Reflex Speech Training</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
