import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';

export default function IncidentModal({ isOpen, onClose, onSubmit }) {
  const [action, setAction] = useState('Security Alert: Cell Inspection');
  const [target, setTarget] = useState('Block Alpha Sector 2');
  const [severity, setSeverity] = useState('rose');
  const [details, setDetails] = useState('');
  const [user, setUser] = useState('Officer Blake (ID #402)');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!action || !details) return;

    const newLog = {
      id: `LOG-${Math.floor(9000 + Math.random() * 999)}`,
      timestamp: 'Just now',
      user,
      action,
      target,
      severity,
      details
    };

    onSubmit(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono uppercase">
                Log Security Incident Event
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                CrimeNet OS Audit System
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Action Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unscheduled Cell Lock Override"
              value={action}
              onChange={e => setAction(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Location or Inmate *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Inmate Marcus Vance Vane (CN-8092)"
              value={target}
              onChange={e => setTarget(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alert Severity
              </label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
              >
                <option value="rose">Critical Alert</option>
                <option value="amber">Warning Alert</option>
                <option value="emerald">System Info</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Logging Officer ID
              </label>
              <input
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Incident Description & Field Notes *
            </label>
            <textarea
              rows="3"
              required
              placeholder="Describe observation, response actions taken, and officer resolutions..."
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
            ></textarea>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold font-mono bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Log</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
