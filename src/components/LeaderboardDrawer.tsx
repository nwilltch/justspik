'use client';
import React, { useState, useEffect } from 'react';
import { X, Trophy, Zap, Timer, Flame, Medal } from 'lucide-react';
import { sound } from '@/lib/soundFx';

interface LeaderboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userBestSurvivalScore: number;
  userBestSpeedSeconds: number | null;
  userStreak: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  flag: string;
  score: string;
  grade: 'S' | 'A' | 'B';
  isUser?: boolean;
}

export const LeaderboardDrawer: React.FC<LeaderboardDrawerProps> = ({
  isOpen,
  onClose,
  userBestSurvivalScore,
  userBestSpeedSeconds,
  userStreak,
}) => {
  const [tab, setTab] = useState<'survival' | 'speed'>('survival');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Realistic curated leaderboard community entries
  const survivalEntries: LeaderboardEntry[] = [
    { rank: 1, name: 'Sébastien L.', flag: '🇫🇷', score: '31 phrases', grade: 'S' },
    { rank: 2, name: 'Clara Jenkins', flag: '🇬🇧', score: '27 phrases', grade: 'S' },
    { rank: 3, name: 'Mateo Rossi', flag: '🇮🇹', score: '24 phrases', grade: 'A' },
    {
      rank: 4,
      name: 'Toi',
      flag: '⚡',
      score: `${userBestSurvivalScore > 0 ? userBestSurvivalScore : 12} phrases`,
      grade: userBestSurvivalScore >= 20 ? 'S' : 'A',
      isUser: true,
    },
    { rank: 5, name: 'Lukas Weber', flag: '🇩🇪', score: '21 phrases', grade: 'A' },
    { rank: 6, name: 'Sofia Alvarez', flag: '🇪🇸', score: '19 phrases', grade: 'A' },
    { rank: 7, name: 'Thomas B.', flag: '🇫🇷', score: '17 phrases', grade: 'B' },
  ];

  const speedEntries: LeaderboardEntry[] = [
    { rank: 1, name: 'Clara Jenkins', flag: '🇬🇧', score: '1.38s', grade: 'S' },
    { rank: 2, name: 'Sébastien L.', flag: '🇫🇷', score: '1.45s', grade: 'S' },
    {
      rank: 3,
      name: 'Toi',
      flag: '⚡',
      score: `${userBestSpeedSeconds ? userBestSpeedSeconds.toFixed(2) : '1.85'}s`,
      grade: userBestSpeedSeconds && userBestSpeedSeconds <= 2.2 ? 'S' : 'A',
      isUser: true,
    },
    { rank: 4, name: 'Mateo Rossi', flag: '🇮🇹', score: '1.92s', grade: 'A' },
    { rank: 5, name: 'Lukas Weber', flag: '🇩🇪', score: '2.10s', grade: 'A' },
    { rank: 6, name: 'Sofia Alvarez', flag: '🇪🇸', score: '2.34s', grade: 'A' },
    { rank: 7, name: 'Thomas B.', flag: '🇫🇷', score: '2.80s', grade: 'B' },
  ];

  const currentList = tab === 'survival' ? survivalEntries : speedEntries;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Panel */}
      <aside className="relative w-full sm:w-[420px] h-full bg-white border-l border-stone-200/90 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 shadow-2xs">
                <Trophy className="w-4 h-4 fill-current" />
              </div>
              <h2 className="text-base font-bold text-stone-900 tracking-tight">
                Classement Réflexe
              </h2>
            </div>

            <button
              onClick={() => {
                sound.playSoftClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Fermer le tiroir"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-500 mb-4 leading-relaxed">
            Mesuré sur la rapidité d&apos;élocution et l&apos;endurance en mode Survie.
          </p>

          {/* Segmented Tab */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-stone-100 border border-stone-200/70 text-xs font-semibold">
            <button
              onClick={() => {
                sound.playSoftClick();
                setTab('survival');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full transition-all cursor-pointer ${
                tab === 'survival'
                  ? 'bg-white text-teal-700 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>Survie 60s</span>
            </button>

            <button
              onClick={() => {
                sound.playSoftClick();
                setTab('speed');
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full transition-all cursor-pointer ${
                tab === 'speed'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Timer className="w-3.5 h-3.5 text-stone-700" />
              <span>Vitesse Réflexe</span>
            </button>
          </div>
        </div>

        {/* List of Entries */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
          {currentList.map((entry) => {
            const isTop3 = entry.rank <= 3;
            const rankIcon =
              entry.rank === 1
                ? '🥇'
                : entry.rank === 2
                ? '🥈'
                : entry.rank === 3
                ? '🥉'
                : `#${entry.rank}`;

            return (
              <div
                key={`entry-${entry.rank}-${entry.name}`}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                  entry.isUser
                    ? 'bg-teal-50/80 border border-teal-200/80 shadow-2xs'
                    : 'bg-white hover:bg-stone-50 border border-stone-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 text-center font-mono text-xs font-bold ${
                      isTop3 ? 'text-sm' : 'text-stone-400'
                    }`}
                  >
                    {rankIcon}
                  </span>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{entry.flag}</span>
                      <span
                        className={`text-xs font-semibold ${
                          entry.isUser ? 'text-teal-900 font-bold' : 'text-stone-800'
                        }`}
                      >
                        {entry.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stone-900">
                    {entry.score}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      entry.grade === 'S'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : entry.grade === 'A'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {entry.grade}-Tier
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* User Summary Footer Card */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/60">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-1.5 font-medium">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Ta série active :</span>
            </div>
            <span className="font-mono font-bold text-stone-900">
              {userStreak} {userStreak > 1 ? 'jours' : 'jour'} d&apos;affilée
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
};
