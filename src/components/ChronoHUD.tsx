'use client';
import React from 'react';

interface ChronoHUDProps {
  timeSeconds: number;
  isRunning: boolean;
  targetBenchmark: number;
}

export const ChronoHUD: React.FC<ChronoHUDProps> = ({
  timeSeconds,
  isRunning,
  targetBenchmark,
}) => {
  const formattedSeconds = timeSeconds.toFixed(2);

  let colorClass = 'text-stone-900';
  if (isRunning) {
    colorClass = timeSeconds <= 2.8 ? 'text-teal-600' : 'text-stone-500';
  } else if (timeSeconds > 0) {
    colorClass = timeSeconds <= 2.8 ? 'text-teal-600' : 'text-stone-700';
  }

  return (
    <div className="flex flex-col items-center justify-center my-6 select-none">
      <div className="flex items-baseline justify-center gap-1 font-mono">
        <span
          className={`font-semibold text-5xl md:text-6xl tracking-tight tabular-numbers transition-colors duration-150 ${colorClass}`}
        >
          {formattedSeconds}
        </span>
        <span className="text-sm font-medium text-stone-400">s</span>
      </div>

      <span className="text-[11px] font-mono text-stone-400 mt-1">
        cible &lt; {targetBenchmark.toFixed(1)}s
      </span>
    </div>
  );
};
