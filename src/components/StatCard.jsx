import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  subtext, 
  icon: Icon,
  badgeText,
  badgeVariant = 'default',
  progressPercent
}) {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  if (badgeVariant === 'success') {
    badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
  } else if (badgeVariant === 'danger') {
    badgeStyle = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60';
  } else if (badgeVariant === 'warning') {
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-sans">
            {title}
          </span>
          <div className="text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight font-sans">
            {value}
          </div>
        </div>

        {Icon && (
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700/60 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans">
          <span>{subtext}</span>
          {badgeText && (
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${badgeStyle}`}>
              {badgeText}
            </span>
          )}
        </div>

        {typeof progressPercent === 'number' && (
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-slate-800 dark:bg-slate-200 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
