import React, { useState } from 'react';
import { Activity, Plus, Clock } from 'lucide-react';

export default function AuditSidebar({ logs, onOpenIncidentModal }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    if (filterSeverity === 'ALL') return true;
    return log.severity === filterSeverity;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'rose':
        return <span className="w-2 h-2 rounded-full bg-rose-500"></span>;
      case 'amber':
        return <span className="w-2 h-2 rounded-full bg-amber-500"></span>;
      case 'emerald':
      default:
        return <span className="w-2 h-2 rounded-full bg-emerald-500"></span>;
    }
  };

  return (
    <aside className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[540px] shadow-sm">
      {/* Header & Live Status */}
      <div className="space-y-3 pb-3 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
              Facility audit feed
            </h2>
          </div>

          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-sans font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE
          </span>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-sans">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'rose', label: 'Critical' },
            { id: 'amber', label: 'Warning' },
            { id: 'emerald', label: 'System' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterSeverity(tab.id)}
              className={`flex-1 py-0.5 rounded text-center text-xs font-medium transition-colors cursor-pointer ${
                filterSeverity === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log Stream Items */}
      <div className="flex-1 my-3 overflow-y-auto space-y-2.5 pr-1">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-sans text-xs">
            No audit logs found.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSeverityBadge(log.severity)}
                  <span className="font-sans text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {log.action}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-sans">
                {log.target}
              </p>

              <div className="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/80 p-2 rounded border border-slate-200 dark:border-slate-800/60 leading-relaxed font-sans">
                {log.details}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-0.5">
                <span>By: {log.user}</span>
                <span>ID: {log.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer CTA */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onOpenIncidentModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold font-sans bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Manual Incident Log</span>
        </button>
      </div>
    </aside>
  );
}
