import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ title, value, subtext, trend, trendValue, icon: Icon, badgeColor = "indigo" }) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  const glowClasses = {
    indigo: "hover:border-indigo-500/50 hover:shadow-indigo-950/40",
    emerald: "hover:border-emerald-500/50 hover:shadow-emerald-950/40",
    rose: "hover:border-rose-500/50 hover:shadow-rose-950/40",
    amber: "hover:border-amber-500/50 hover:shadow-amber-950/40"
  }[badgeColor] || "hover:border-slate-700";

  const iconBgClasses = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-400/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  }[badgeColor];

  return (
    <div className={`relative overflow-hidden bg-slate-900/70 border border-slate-800/80 rounded-xl p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${glowClasses} group`}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-700 to-transparent group-hover:via-indigo-500/50 transition-colors duration-300"></div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 font-mono">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white font-mono">
              {value}
            </span>
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg border backdrop-blur-md ${iconBgClasses}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <span className="text-slate-400 truncate max-w-[130px]">
          {subtext}
        </span>

        {trendValue && (
          <div className={`flex items-center gap-1 font-mono font-medium px-2 py-0.5 rounded-full border ${
            isPositive 
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' 
              : isNegative 
              ? 'bg-rose-950/40 text-rose-400 border-rose-800/40' 
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
