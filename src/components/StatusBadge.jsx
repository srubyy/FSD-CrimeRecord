import React from 'react';

export default function StatusBadge({ type = 'status', value, severity, isDarkMode = true }) {
  if (type === 'tier') {
    let style = "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    switch (value?.toLowerCase()) {
      case 'maximum':
        style = "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800/50";
        break;
      case 'medium':
        style = "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/50";
        break;
      case 'minimum':
        style = "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/50";
        break;
      case 'isolation':
        style = "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800/50";
        break;
      default:
        break;
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium ${style}`}>
        {value}
      </span>
    );
  }

  if (type === 'status') {
    let style = "text-slate-500 dark:text-slate-400";
    if (value?.toLowerCase() === 'active') style = "text-emerald-600 dark:text-emerald-400";
    if (value?.toLowerCase() === 'transferred') style = "text-amber-600 dark:text-amber-400";
    return (
      <span className={`text-xs font-sans font-medium ${style}`}>
        {value}
      </span>
    );
  }

  if (type === 'medical') {
    let textColor = "text-slate-700 dark:text-slate-300";
    if (severity === 'rose') textColor = "text-rose-600 dark:text-rose-400 font-medium";
    if (severity === 'amber') textColor = "text-amber-600 dark:text-amber-400 font-medium";
    if (severity === 'emerald') textColor = "text-slate-700 dark:text-slate-300";

    return (
      <span className={`text-xs font-sans ${textColor}`}>
        {value}
      </span>
    );
  }

  return <span className="text-xs text-slate-700 dark:text-slate-300">{value}</span>;
}
