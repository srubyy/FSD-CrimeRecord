import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, subtext, trend, trendValue, icon: Icon }) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700/80">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-100 font-mono">
              {value}
            </span>
          </div>
        </div>

        {Icon && (
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px] truncate">
          {subtext}
        </span>

        {trendValue && (
          <div className={`flex items-center gap-1 font-mono text-[11px] font-medium px-2 py-0.5 rounded border ${
            isPositive 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : isNegative 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
