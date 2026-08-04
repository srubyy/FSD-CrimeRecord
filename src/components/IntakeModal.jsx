import React, { useState } from 'react';
import { X, Plus, Shield, User, MapPin, AlertCircle, FileText, Lock } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 relative overflow-hidden font-sans">
        
        {/* Top Glow bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500 via-indigo-500 to-rose-500"></div>

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase">
                Intake New Prisoner Record
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                CrimeNet OS // Facility Control Registry
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vance, Marcus Vance"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            {/* Alias */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Alias / Street Name
              </label>
              <input
                type="text"
                placeholder="e.g. Spectre"
                value={formData.alias}
                onChange={e => setFormData({ ...formData, alias: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            {/* Security Tier */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Security Tier
              </label>
              <select
                value={formData.securityTier}
                onChange={e => setFormData({ ...formData, securityTier: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="Maximum">Maximum Security</option>
                <option value="Medium">Medium Security</option>
                <option value="Minimum">Minimum Security</option>
                <option value="Isolation">Isolation Wing</option>
              </select>
            </div>

            {/* Cell Block */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Cell Assignment
              </label>
              <input
                type="text"
                placeholder="e.g. Block Alpha-1 (A1-104)"
                value={formData.cellBlock}
                onChange={e => setFormData({ ...formData, cellBlock: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            {/* Crime Category */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Primary Crime Category *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cyber Extortion & Grand Larceny"
                value={formData.crimeCategory}
                onChange={e => setFormData({ ...formData, crimeCategory: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            {/* Medical Alert Badge */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Medical Alert Note
              </label>
              <input
                type="text"
                placeholder="e.g. Insulin Dependent"
                value={formData.medicalAlert}
                onChange={e => setFormData({ ...formData, medicalAlert: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            {/* Medical Alert Severity */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Medical Severity Level
              </label>
              <select
                value={formData.medicalAlertSeverity}
                onChange={e => setFormData({ ...formData, medicalAlertSeverity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="emerald">Low / Normal (Emerald)</option>
                <option value="amber">Medium Alert (Amber)</option>
                <option value="rose">Critical Alert (Rose)</option>
              </select>
            </div>

            {/* Sentence Length */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Sentence Length
              </label>
              <input
                type="text"
                placeholder="e.g. 15 Years"
                value={formData.sentenceLength}
                onChange={e => setFormData({ ...formData, sentenceLength: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            {/* Parole Eligibility */}
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
                Parole Eligibility Year
              </label>
              <input
                type="text"
                placeholder="e.g. 2034"
                value={formData.paroleEligible}
                onChange={e => setFormData({ ...formData, paroleEligible: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
              Officer Risk Notes & Instructions
            </label>
            <textarea
              rows="3"
              placeholder="Enter special guard instructions, behavior flags, or isolation requirements..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
            ></textarea>
          </div>

          {/* Buttons */}
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
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white border border-rose-500/50 shadow-lg shadow-rose-950/50 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Submit Prisoner Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
