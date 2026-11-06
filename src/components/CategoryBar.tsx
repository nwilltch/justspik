'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, ChevronDown, Check } from 'lucide-react';
import { PhraseCategory } from '@/lib/types';
import { CATEGORIES_CONFIG } from '@/lib/data';

interface CategoryBarProps {
  currentCategory: PhraseCategory;
  onSelectCategory: (cat: PhraseCategory) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  currentCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Show top 4 categories directly
  const visibleCategories = CATEGORIES_CONFIG.slice(0, 4);

  // The rest in the "..." overflow menu
  const overflowCategories: { id: PhraseCategory; label: string; description?: string }[] = [
    ...CATEGORIES_CONFIG.slice(4),
    { id: 'custom', label: 'Mes phrases', description: 'Phrases personnalisées' },
  ];

  const activeOverflowItem = overflowCategories.find((c) => c.id === currentCategory);
  const isOverflowActive = Boolean(activeOverflowItem);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (catId: PhraseCategory) => {
    onSelectCategory(catId);
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-3 flex items-center justify-center px-2">
      <div className="flex items-center gap-1 p-1 rounded-full bg-stone-200/60 border border-stone-200/80">
        {/* Main 4 Visible Pills */}
        {visibleCategories.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer active:scale-95 whitespace-nowrap ${
                isActive
                  ? 'bg-white text-stone-900 shadow-sm font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title={cat.description}
            >
              {cat.label}
            </button>
          );
        })}

        {/* Overflow "..." pill with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer active:scale-95 whitespace-nowrap ${
              isOverflowActive
                ? 'bg-white text-blue-700 shadow-sm font-semibold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            title="Autres catégories"
          >
            {isOverflowActive ? (
              <>
                <span>{activeOverflowItem?.label}</span>
                <ChevronDown className="w-3 h-3 text-blue-600" />
              </>
            ) : (
              <MoreHorizontal className="w-4 h-4" />
            )}
          </button>

          {/* Minimal Dropdown Popover */}
          {isOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 rounded-2xl bg-white border border-stone-200/90 shadow-xl p-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
              <span className="block px-3 py-1 text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                Autres thématiques
              </span>

              {overflowCategories.map((cat) => {
                const isSelected = currentCategory === cat.id;
                return (
                  <button
                    key={`overflow-${cat.id}`}
                    onClick={() => handleSelect(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-blue-800 font-semibold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
