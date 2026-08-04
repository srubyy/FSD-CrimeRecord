import React, { useState } from 'react';
import { Activity, Bell, AlertOctagon, ShieldAlert, CheckCircle2, Clock, Filter, Plus, Terminal } from 'lucide-react';

export default function AuditSidebar({ logs, onOpenIncidentModal }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    if (filterSeverity === 'ALL') return true;
    return log.severity === filterSeverity;
  });

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'rose':
        return <AlertOctagon className="w-4 h-4 text-rose-500 animate-pulse" />;
      case 'amber':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'emerald':
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <aside className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-2xl flex flex-col justify-between h-full space-y-4">
      {/* Header & Live Indicator */}
      <div className="space-y-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wide">
              Facility Audit Feed
            </h2>
          </div>

          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            LIVE
          </span>
        </div>

        <p className="text-xs text-slate-400 font-mono">
          Real-time security telemetry & officer audit stream.
        </p>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
          {[
            { id: 'ALL', label: 'All Logs' },
            { id: 'rose', label: 'Critical' },
            { id: 'amber', label: 'Warning' },
            { id: 'emerald', label: 'System' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterSeverity(tab.id)}
              className={`flex-1 py-1 rounded-lg text-center font-medium transition-all cursor-pointer ${
                filterSeverity === tab.id
                  ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed Items */}
      <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1 scrollbar-thin">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-mono text-xs">
            No audit logs found for selected filter.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(log.severity)}
                  <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-rose-400 transition-colors">
                    {log.action}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-mono">
                {log.target}
              </p>

              <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800/60 leading-relaxed font-sans">
                {log.details}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                <span>By: {log.user}</span>
                <span className="uppercase text-slate-600">ID: {log.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log Incident Quick CTA */}
      <div className="pt-2">
        <button
          onClick={onOpenIncidentModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold font-mono bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-900/40 transition-all duration-200 shadow-md hover:border-rose-700 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Manual Incident Log</span>
        </button>
      </div>
    </aside>
  );
}
