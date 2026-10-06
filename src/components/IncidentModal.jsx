import React, { useState, useEffect } from 'react';
import { X, Send, ShieldAlert } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function IncidentModal({ isOpen, onClose, onSubmit, selectedInmate }) {
  const currentUser = useSelector((state) => state.auth.user);
  
  const [action, setAction] = useState('Security Directive: Unscheduled Cell Inspection');
  const [target, setTarget] = useState('Block Alpha Sector 2');
  const [severity, setSeverity] = useState('rose');
  const [details, setDetails] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    if (selectedInmate) {
      setTarget(`Inmate ${selectedInmate.fullName} (${selectedInmate.id}) - ${selectedInmate.cellBlock}`);
      setAction(`Incident Alert: Inmate Observation (${selectedInmate.fullName})`);
    } else {
      setTarget('Facility Perimeter / Main Block Alpha');
      setAction('Security Directive: Sector Inspection');
    }
  }, [selectedInmate]);

  useEffect(() => {
    setUser(`${currentUser?.username || 'Staff'} (${currentUser?.role || 'Officer'})`);
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!action.trim() || !details.trim()) return;

    const newLog = {
      id: `LOG-${Math.floor(9000 + Math.random() * 999)}`,
      timestamp: 'Just now',
      user: user || `${currentUser?.username || 'Staff'} (${currentUser?.role || 'Officer'})`,
      action,
      target,
      severity,
      details
    };

    onSubmit(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#151C26] border border-[#D9E0E8] dark:border-[#293544] rounded-lg max-w-lg w-full p-5 space-y-4 shadow-lg animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E0E8] dark:border-[#293544]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#A66A00]/10 text-[#A66A00] dark:text-[#D6A34A]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F4F8]">
                File Operational Incident
              </h3>
              <p className="text-xs text-[#526176] dark:text-[#AAB6C5]">
                Facility telemetry and incident dispatch stream
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-white rounded cursor-pointer"
            aria-label="Close Incident Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
              Incident Classification Title <span className="text-[#B4232C]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Unscheduled Cell Lock Override or Altercation"
              value={action}
              onChange={e => setAction(e.target.value)}
              className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
              Target Location or Offender <span className="text-[#B4232C]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Inmate Marcus Vance (CN-8092) or Block Bravo Sector 3"
              value={target}
              onChange={e => setTarget(e.target.value)}
              className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
                Priority Level
              </label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value)}
                className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2] cursor-pointer"
              >
                <option value="rose">Critical Threat</option>
                <option value="amber">Warning Alert</option>
                <option value="emerald">Routine Telemetry</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
                Reporting Officer
              </label>
              <input
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
              Field Narrative & Response Taken <span className="text-[#B4232C]">*</span>
            </label>
            <textarea
              rows="3"
              required
              placeholder="Describe observation, response actions taken, and officer resolutions..."
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md p-2 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#D9E0E8] dark:border-[#293544]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#24527A] hover:bg-[#1B3E5C] dark:bg-[#6B9BC2] dark:hover:bg-[#85B2D6] text-white dark:text-[#0F141C] transition-colors cursor-pointer shadow-xs"
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
