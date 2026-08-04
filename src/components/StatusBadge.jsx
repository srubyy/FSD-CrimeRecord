import React from 'react';

export default function StatusBadge({ type = 'status', value, severity }) {
  let badgeStyle = "bg-slate-800/80 text-slate-300 border-slate-700/60";
  let dotColor = "bg-slate-400";

  // Handle Security Tiers (Linear / Stripe muted style)
  if (type === 'tier') {
    switch (value?.toLowerCase()) {
      case 'maximum':
        badgeStyle = "bg-rose-500/10 text-rose-400 border-rose-500/20";
        dotColor = "bg-rose-400";
        break;
      case 'medium':
        badgeStyle = "bg-amber-500/10 text-amber-400 border-amber-500/20";
        dotColor = "bg-amber-400";
        break;
      case 'minimum':
        badgeStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        dotColor = "bg-emerald-400";
        break;
      case 'isolation':
        badgeStyle = "bg-purple-500/10 text-purple-400 border-purple-500/20";
        dotColor = "bg-purple-400";
        break;
      default:
        badgeStyle = "bg-slate-800 text-slate-300 border-slate-700";
        dotColor = "bg-slate-400";
    }
  }

  // Handle Active/Transferred Status
  if (type === 'status') {
    switch (value?.toLowerCase()) {
      case 'active':
        badgeStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        dotColor = "bg-emerald-400";
        break;
      case 'transferred':
        badgeStyle = "bg-sky-500/10 text-sky-400 border-sky-500/20";
        dotColor = "bg-sky-400";
        break;
      default:
        badgeStyle = "bg-slate-800 text-slate-300 border-slate-700";
    }
  }

  // Handle Medical Alerts
  if (type === 'medical') {
    switch (severity) {
      case 'rose':
        badgeStyle = "bg-rose-500/10 text-rose-300 border-rose-500/20 font-mono text-[11px]";
        dotColor = "bg-rose-400";
        break;
      case 'amber':
        badgeStyle = "bg-amber-500/10 text-amber-300 border-amber-500/20 font-mono text-[11px]";
        dotColor = "bg-amber-400";
        break;
      case 'emerald':
      default:
        badgeStyle = "bg-slate-800/80 text-slate-300 border-slate-700/60 font-mono text-[11px]";
        dotColor = "bg-slate-400";
        break;
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <span>{value}</span>
    </span>
  );
}
