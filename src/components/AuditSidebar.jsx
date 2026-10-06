import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function AuditSidebar({ logs, onOpenIncidentModal }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredLogs = logs.filter(log => {
    if (filterSeverity === 'ALL') return true;
    return log.severity === filterSeverity;
  });

  const getDotColor = (severity) => {
    switch (severity) {
      case 'rose':
        return 'bg-[#B4232C] dark:bg-[#E06A70]';
      case 'amber':
        return 'bg-[#A66A00] dark:bg-[#D6A34A]';
      case 'emerald':
      default:
        return 'bg-[#526176] dark:bg-[#AAB6C5]';
    }
  };

  return (
    <aside className="bg-white dark:bg-[#151C26] border border-[#D9E0E8] dark:border-[#293544] rounded-lg p-3.5 flex flex-col justify-between shadow-xs min-h-[580px]">
      {/* Header & Filter Controls */}
      <div className="space-y-3 pb-3 border-b border-[#D9E0E8] dark:border-[#293544]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#172033] dark:text-[#F1F4F8]">
            Audit Feed
          </h2>

          <span className="flex items-center gap-1.5 text-xs text-[#526176] dark:text-[#AAB6C5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#167A5B] dark:bg-[#4DB58B] animate-pulse" />
            Live
          </span>
        </div>

        {/* Minimalist Filter Tabs */}
        <div className="flex items-center gap-1 text-xs">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'rose', label: 'Critical' },
            { id: 'amber', label: 'Warning' },
            { id: 'emerald', label: 'System' }
          ].map((tab, idx) => (
            <React.Fragment key={tab.id}>
              {idx > 0 && <span className="text-[#D9E0E8] dark:text-[#293544]">|</span>}
              <button
                onClick={() => setFilterSeverity(tab.id)}
                className={`px-1.5 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                  filterSeverity === tab.id
                    ? 'font-semibold text-[#24527A] dark:text-[#6B9BC2]'
                    : 'text-[#526176] dark:text-[#AAB6C5] hover:text-[#172033] dark:hover:text-[#F1F4F8]'
                }`}
              >
                {tab.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Event Stream List (Separated by subtle dividers, not giant cards) */}
      <div className="flex-1 my-2 overflow-y-auto divide-y divide-[#D9E0E8] dark:divide-[#293544] pr-1 max-h-[420px]">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16 text-[#526176] dark:text-[#AAB6C5] text-xs">
            No audit records for this filter.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="py-2.5 first:pt-1 last:pb-1 space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotColor(log.severity)}`} />
                  <span className="text-xs font-medium text-[#172033] dark:text-[#F1F4F8] truncate">
                    {log.action}
                  </span>
                </div>
                
                <span className="text-[11px] text-[#526176] dark:text-[#AAB6C5] font-mono shrink-0">
                  {log.timestamp}
                </span>
              </div>

              <p className="text-[11px] text-[#526176] dark:text-[#AAB6C5] font-mono pl-3 truncate">
                {log.target}
              </p>

              <div className="text-xs text-[#526176] dark:text-[#AAB6C5] pl-3 leading-relaxed">
                {log.details}
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#526176] dark:text-[#AAB6C5] font-mono pl-3 pt-0.5 opacity-75">
                <span>By: {log.user}</span>
                <span>{log.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer CTA */}
      <div className="pt-2.5 border-t border-[#D9E0E8] dark:border-[#293544]">
        <button
          onClick={onOpenIncidentModal}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#F5F7FA] hover:bg-[#EAEFF5] dark:bg-[#0F141C] dark:hover:bg-[#151C26] text-[#172033] dark:text-[#F1F4F8] border border-[#D9E0E8] dark:border-[#293544] transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Manual Incident</span>
        </button>
      </div>
    </aside>
  );
}
