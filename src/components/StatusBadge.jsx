import React from 'react';

export default function StatusBadge({ type = 'status', value, severity }) {
  let badgeStyle = "bg-slate-800/80 text-slate-300 border-slate-700/60";
  let dotColor = "bg-slate-400";

  // Handle Security Tiers
  if (type === 'tier') {
    switch (value?.toLowerCase()) {
      case 'maximum':
        badgeStyle = "bg-rose-950/60 text-rose-300 border-rose-800/50 glow-rose";
        dotColor = "bg-rose-500 animate-pulse";
        break;
      case 'medium':
        badgeStyle = "bg-amber-950/60 text-amber-300 border-amber-800/50 glow-amber";
        dotColor = "bg-amber-500";
        break;
      case 'minimum':
        badgeStyle = "bg-emerald-950/60 text-emerald-300 border-emerald-800/50 glow-emerald";
        dotColor = "bg-emerald-500";
        break;
      case 'isolation':
        badgeStyle = "bg-purple-950/60 text-purple-300 border-purple-800/50";
        dotColor = "bg-purple-500 animate-ping";
        break;
      default:
        badgeStyle = "bg-slate-800 text-slate-300 border-slate-700";
        dotColor = "bg-slate-400";
    }
  }

  // Handle Active/Transferred/Lockdown Status
  if (type === 'status') {
    switch (value?.toLowerCase()) {
      case 'active':
        badgeStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
        dotColor = "bg-emerald-400";
        break;
      case 'transferred':
        badgeStyle = "bg-sky-500/10 text-sky-400 border-sky-500/30";
        dotColor = "bg-sky-400";
        break;
      case 'lockdown':
        badgeStyle = "bg-rose-500/10 text-rose-400 border-rose-500/30";
        dotColor = "bg-rose-400 animate-pulse";
        break;
      default:
        badgeStyle = "bg-slate-800 text-slate-300 border-slate-700";
    }
  }

  // Handle Medical Alerts
  if (type === 'medical') {
    switch (severity) {
      case 'rose':
        badgeStyle = "bg-rose-950/40 text-rose-300 border-rose-800/40 font-mono text-[11px]";
        dotColor = "bg-rose-500";
        break;
      case 'amber':
        badgeStyle = "bg-amber-950/40 text-amber-300 border-amber-800/40 font-mono text-[11px]";
        dotColor = "bg-amber-500";
        break;
      case 'emerald':
      default:
        badgeStyle = "bg-emerald-950/40 text-emerald-300 border-emerald-800/40 font-mono text-[11px]";
        dotColor = "bg-emerald-500";
        break;
    }
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all duration-200 ${badgeStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <span>{value}</span>
    </span>
  );
}
