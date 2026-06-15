"use client";

import { useState } from "react";
import { PieChart as PieChartIcon } from "lucide-react";

interface InteractivePieChartProps {
  title: string;
  icon?: React.ReactNode;
  data: { name: string; count: number }[];
  total: number;
  colors: string[];
  emptyMessage?: string;
}

export function InteractivePieChart({
  title,
  icon,
  data,
  total,
  colors,
  emptyMessage = "Belum ada data",
}: InteractivePieChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="w-full h-full">
        <h3 className="text-lg font-black mb-6 flex items-center gap-2">
          {icon || <PieChartIcon className="w-5 h-5 text-blue-600" />} {title}
        </h3>
        <div className="text-slate-500 font-bold text-center py-6">{emptyMessage}</div>
      </div>
    );
  }

  // Calculate SVG circle properties
  const radius = 25;
  const circumference = 2 * Math.PI * radius; // ~157.0796

  let accumulatedPercent = 0;

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-black mb-6 flex items-center gap-2">
        {icon || <PieChartIcon className="w-5 h-5 text-blue-600" />} {title}
      </h3>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 py-2 flex-1">
        {/* The Pie SVG */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 shrink-0 rounded-full border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {data.map((stat, i) => {
              const percent = (stat.count / total) * 100;
              const strokeLength = (percent / 100) * circumference;
              const offset = (accumulatedPercent / 100) * circumference;

              accumulatedPercent += percent;

              const isHovered = activeIdx === i;
              const isFaded = activeIdx !== null && activeIdx !== i;

              return (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={colors[i % colors.length]}
                  strokeWidth="50"
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={-offset}
                  className="transition-all duration-300 ease-out cursor-pointer"
                  style={{
                    opacity: isFaded ? 0.3 : 1,
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                />
              );
            })}
          </svg>
          
          {/* Inner cutout for donut effect if wanted, but user wanted pie. We keep it pie. */}
        </div>

        {/* Legend */}
        <div className="w-full md:w-auto flex-1 flex flex-col justify-center gap-3">
          {data.map((stat, idx) => {
            const isHovered = activeIdx === idx;
            const isFaded = activeIdx !== null && activeIdx !== idx;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between border-b-2 border-black/10 pb-2 last:border-0 last:pb-0 transition-all duration-300 cursor-pointer ${
                  isHovered ? "bg-slate-100 rounded px-2 -mx-2 translate-x-2" : ""
                } ${isFaded ? "opacity-30 grayscale" : ""}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 border-2 border-black rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-transform duration-300 ${
                      isHovered ? "scale-125" : ""
                    }`}
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  />
                  <span className="font-black uppercase text-sm tracking-tight text-slate-800" title={stat.name}>
                    {stat.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-black text-lg ${isHovered ? "text-blue-600" : ""}`}>{stat.count}</span>
                  <span className="text-xs text-slate-500 font-bold w-12 text-right">
                    {((stat.count / total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
