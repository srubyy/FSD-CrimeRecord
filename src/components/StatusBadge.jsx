import React from 'react';

export default function StatusBadge({ type = 'status', value, severity }) {
  if (type === 'tier') {
    let style = "bg-slate-800 text-slate-300";
    switch (value?.toLowerCase()) {
      case 'maximum':
        style = "bg-rose-950/80 text-rose-300 border border-rose-800/50";
        break;
      case 'medium':
        style = "bg-amber-950/80 text-amber-300 border border-amber-800/50";
        break;
      case 'minimum':
        style = "bg-emerald-950/80 text-emerald-300 border border-emerald-800/50";
        break;
      case 'isolation':
        style = "bg-purple-950/80 text-purple-300 border border-purple-800/50";
        break;
      default:
        style = "bg-slate-800 text-slate-300";
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-medium ${style}`}>
        {value}
      </span>
    );
  }

  if (type === 'status') {
    let style = "text-slate-400";
    if (value?.toLowerCase() === 'active') style = "text-emerald-400";
    if (value?.toLowerCase() === 'transferred') style = "text-amber-400";
    return (
      <span className={`text-xs font-sans font-medium ${style}`}>
        {value}
      </span>
    );
  }

  if (type === 'medical') {
    let textColor = "text-slate-300";
    if (severity === 'rose') textColor = "text-rose-400 font-medium";
    if (severity === 'amber') textColor = "text-amber-400 font-medium";
    if (severity === 'emerald') textColor = "text-slate-300";

    return (
      <span className={`text-xs font-sans ${textColor}`}>
        {value}
      </span>
    );
  }

  return <span className="text-xs text-slate-300">{value}</span>;
}
