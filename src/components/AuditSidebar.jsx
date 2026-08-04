import React, { useState } from 'react';
import { Activity, AlertOctagon, ShieldAlert, CheckCircle2, Clock, Plus } from 'lucide-react';

export default function AuditSidebar({ logs, onOpenIncidentModal }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    if (filterSeverity === 'ALL') return true;
    return log.severity === filterSeverity;
  });

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'rose':
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />;
      case 'amber':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />;
      case 'emerald':
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <aside className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[580px]">
      {/* Header & Live Indicator */}
      <div className="space-y-3 pb-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
              Facility Audit Feed
            </h2>
          </div>

          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            LIVE
          </span>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
          {[
            { id: 'ALL', label: 'All Logs' },
            { id: 'rose', label: 'Critical' },
            { id: 'amber', label: 'Warning' },
            { id: 'emerald', label: 'System' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterSeverity(tab.id)}
              className={`flex-1 py-1 rounded text-center font-medium transition-colors cursor-pointer ${
                filterSeverity === tab.id
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed Items with Scrollable Container */}
      <div className="flex-1 my-3 overflow-y-auto space-y-2.5 pr-1">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            No audit logs found for selected filter.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition-colors space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(log.severity)}
                  <span className="font-mono text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {log.action}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-mono">
                {log.target}
              </p>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800/60 leading-relaxed">
                {log.details}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                <span>By: {log.user}</span>
                <span className="uppercase text-slate-500">ID: {log.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer CTA Button */}
      <div className="pt-2 border-t border-slate-800">
        <button
          onClick={onOpenIncidentModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold font-mono bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-slate-400" />
          <span>Post Manual Incident Log</span>
        </button>
      </div>
    </aside>
  );
}
