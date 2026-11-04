'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Target, Zap, Calendar, ChevronDown, Check } from 'lucide-react';
import { sound } from '@/lib/soundFx';

export type GameMode = 'focus' | 'survival' | 'daily';

interface ModeDropdownProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

export const ModeDropdown: React.FC<ModeDropdownProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
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

  const modes: {
    id: GameMode;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: 'focus',
      label: 'Focus',
      description: 'Entraînement zen, sans compte à rebours',
      icon: <Target className="w-3.5 h-3.5 text-stone-600" />,
      color: 'text-stone-800',
    },
    {
      id: 'survival',
      label: 'Survie 60s',
      description: 'Chrono rush : +4s par succès, -5s par faute',
      icon: <Zap className="w-3.5 h-3.5 text-teal-600 fill-teal-600/20" />,
      color: 'text-teal-700',
    },
    {
      id: 'daily',
      label: 'Daily (7)',
      description: 'Sprint quotidien de 7 phrases pour ta série',
      icon: <Calendar className="w-3.5 h-3.5 text-amber-600" />,
      color: 'text-amber-700',
    },
  ];

  const currentModeInfo = modes.find((m) => m.id === currentMode) || modes[0];

  const handleSelect = (mode: GameMode) => {
    sound.playSoftClick();
    onSelectMode(mode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200/90 text-stone-800 text-xs font-semibold shadow-2xs hover:bg-stone-50 transition-all active:scale-95 cursor-pointer"
        title="Changer de mode de jeu"
      >
        <span>{currentModeInfo.icon}</span>
        <span className={currentModeInfo.color}>{currentModeInfo.label}</span>
        <ChevronDown
          className={`w-3 h-3 text-stone-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-stone-200/90 shadow-xl p-1.5 z-40 animate-in fade-in slide-in-from-top-1 duration-150 text-left">
          <span className="block px-3 py-1 text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
            Mode de session
          </span>

          {modes.map((m) => {
            const isSelected = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelect(m.id)}
                className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-stone-100/80 font-semibold' : 'hover:bg-stone-50'
                }`}
              >
                <div className="p-1 rounded-lg bg-white border border-stone-200/60 shadow-2xs shrink-0 mt-0.5">
                  {m.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900">{m.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                  </div>
                  <span className="block text-[11px] text-stone-500 font-normal leading-tight mt-0.5">
                    {m.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
