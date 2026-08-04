import React from 'react';

export default function StatCard({ title, value, subtext, isHighlighted = false }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">
        {title}
      </p>
      <div className="text-2xl font-bold font-sans tracking-tight">
        <span className={isHighlighted ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}>
          {value}
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
        {subtext}
      </p>
    </div>
  );
}
