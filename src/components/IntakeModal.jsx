import React, { useState } from 'react';
import { X, Plus, Shield } from 'lucide-react';

export default function IntakeModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    alias: '',
    age: '30',
    cellBlock: 'Block Alpha-1',
    cellNumber: 'A1-101',
    securityTier: 'Maximum',
    crimeCategory: '',
    medicalAlert: 'None / Cleared',
    medicalAlertSeverity: 'emerald',
    sentenceLength: '5 Years',
    paroleEligible: '2029',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.crimeCategory) return;
    
    const newRecord = {
      ...formData,
      id: `CN-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active',
      admissionDate: new Date().toISOString().split('T')[0],
      dangerRating: formData.securityTier === 'Maximum' ? 9.1 : formData.securityTier === 'Medium' ? 6.2 : 2.5,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&q=80&w=200`
    };

    onSubmit(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl w-full p-5 space-y-4 font-sans shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono uppercase">
                Intake New Prisoner Record
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                CrimeNet OS Facility Control Registry
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vance, Marcus Vance"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alias / Street Name
              </label>
              <input
                type="text"
                placeholder="e.g. Spectre"
                value={formData.alias}
                onChange={e => setFormData({ ...formData, alias: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Security Tier
              </label>
              <select
                value={formData.securityTier}
                onChange={e => setFormData({ ...formData, securityTier: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
              >
                <option value="Maximum">Maximum Security</option>
                <option value="Medium">Medium Security</option>
                <option value="Minimum">Minimum Security</option>
                <option value="Isolation">Isolation Wing</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cell Assignment
              </label>
              <input
                type="text"
                placeholder="e.g. Block Alpha-1 (A1-104)"
                value={formData.cellBlock}
                onChange={e => setFormData({ ...formData, cellBlock: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Crime Category *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cyber Extortion & Grand Larceny"
                value={formData.crimeCategory}
                onChange={e => setFormData({ ...formData, crimeCategory: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Medical Alert Note
              </label>
              <input
                type="text"
                placeholder="e.g. Insulin Dependent"
                value={formData.medicalAlert}
                onChange={e => setFormData({ ...formData, medicalAlert: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Medical Severity Level
              </label>
              <select
                value={formData.medicalAlertSeverity}
                onChange={e => setFormData({ ...formData, medicalAlertSeverity: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
              >
                <option value="emerald">Low / Normal</option>
                <option value="amber">Medium Alert</option>
                <option value="rose">Critical Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Officer Risk Notes & Instructions
            </label>
            <textarea
              rows="2"
              placeholder="Enter special guard instructions or isolation requirements..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 font-mono"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold font-mono bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
