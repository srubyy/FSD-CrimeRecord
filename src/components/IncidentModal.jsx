import React, { useState } from 'react';
import { X, AlertTriangle, Shield, Bell, Send } from 'lucide-react';

export default function IncidentModal({ isOpen, onClose, onSubmit, selectedInmate }) {
  const [action, setAction] = useState('Security Alert: Cell Inspection');
  const [target, setTarget] = useState(selectedInmate ? `Inmate ${selectedInmate.fullName} (${selectedInmate.id})` : 'Block Alpha Sector 2');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase">
                Log Security Incident Event
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                CrimeNet OS Audit System Telemetry
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
              Event Action Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unscheduled Cell Lock Override"
              value={action}
              onChange={e => setAction(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
              Target Location or Inmate *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Inmate Marcus Vance Vane (CN-8092)"
              value={target}
              onChange={e => setTarget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Alert Severity
              </label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="rose">Critical (Rose Alert)</option>
                <option value="amber">Warning (Amber Alert)</option>
                <option value="emerald">System Info (Emerald)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Logging Officer / Officer ID
              </label>
              <input
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
              Incident Description & Field Notes *
            </label>
            <textarea
              rows="3"
              required
              placeholder="Describe observation, response actions taken, and officer resolutions..."
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            ></textarea>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold font-mono bg-amber-600 hover:bg-amber-500 text-slate-950 transition-colors shadow-lg cursor-pointer"
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
