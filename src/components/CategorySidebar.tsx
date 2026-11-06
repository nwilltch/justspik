'use client';

import React from 'react';
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
}) => {
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
        {/* Top: Header & Categories List */}
        <div className="flex flex-col">
          {/* Header Row */}
          <div
            className={`flex items-center mb-6 ${
              isCollapsedDesktop ? 'justify-center' : 'justify-between px-1'
            }`}
          >
            {!isCollapsedDesktop && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Thèmes
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200/60">
                  {totalPhrases}
                </span>
              </div>
            )}
            <button
              onClick={onToggleCollapseDesktop}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title={isCollapsedDesktop ? 'Déplier la barre latérale' : 'Réduire la barre'}
            >
              {isCollapsedDesktop ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
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

        {/* Bottom indicator when expanded */}
        {!isCollapsedDesktop && (
          <div className="pt-4 border-t border-stone-200/70 px-1 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Phrases totales</span>
            <span className="font-mono font-medium text-stone-600">{totalPhrases}</span>
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
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-sm font-bold text-stone-900">Choisir un thème</span>
                </div>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
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
              <span>{totalPhrases} phrases prêtes à l’entraînement</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
