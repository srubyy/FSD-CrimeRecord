import React, { useState } from 'react';
import { X, Plus, Shield } from 'lucide-react';

export default function IntakeModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    alias: '',
    age: '32',
    cellBlock: 'Block Alpha-1',
    cellNumber: 'A1-105',
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
    if (!formData.fullName.trim() || !formData.crimeCategory.trim()) return;
    
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#151C26] border border-[#D9E0E8] dark:border-[#293544] rounded-lg max-w-lg w-full p-5 space-y-4 shadow-lg animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E0E8] dark:border-[#293544]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-[#24527A]/10 dark:bg-[#6B9BC2]/20 text-[#24527A] dark:text-[#6B9BC2]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#172033] dark:text-[#F1F4F8]">
                Offender Custody Intake
              </h3>
              <p className="text-xs text-[#526176] dark:text-[#AAB6C5]">
                Formal facility directory admission record
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-white rounded cursor-pointer"
            aria-label="Close Intake Form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
                Full Legal Name <span className="text-[#B4232C]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vance, Marcus"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
                Age
              </label>
              <input
                type="number"
                min="18"
                max="90"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2] font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
                Alias / Moniker
              </label>
              <input
                type="text"
                placeholder="e.g. Spectre"
                value={formData.alias}
                onChange={e => setFormData({ ...formData, alias: e.target.value })}
                className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
                Security Classification
              </label>
              <select
                value={formData.securityTier}
                onChange={e => setFormData({ ...formData, securityTier: e.target.value })}
                className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2] cursor-pointer"
              >
                <option value="Maximum">Maximum Security</option>
                <option value="Medium">Medium Security</option>
                <option value="Minimum">Minimum Security</option>
                <option value="Isolation">Isolation Sector</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
                Housing Unit
              </label>
              <input
                type="text"
                placeholder="e.g. Block Alpha-1"
                value={formData.cellBlock}
                onChange={e => setFormData({ ...formData, cellBlock: e.target.value })}
                className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
                Primary Statutory Offense <span className="text-[#B4232C]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cyber Extortion & Conspiracy to Defraud"
                value={formData.crimeCategory}
                onChange={e => setFormData({ ...formData, crimeCategory: e.target.value })}
                className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
                Medical & Behavioral Directives
              </label>
              <input
                type="text"
                placeholder="e.g. Insulin Dependent / Severe Penicillin Allergy"
                value={formData.medicalAlert}
                onChange={e => setFormData({ ...formData, medicalAlert: e.target.value })}
                className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
                Alert Severity
              </label>
              <select
                value={formData.medicalAlertSeverity}
                onChange={e => setFormData({ ...formData, medicalAlertSeverity: e.target.value })}
                className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md px-2.5 py-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2] cursor-pointer"
              >
                <option value="emerald">Standard / Cleared</option>
                <option value="amber">Moderate Alert</option>
                <option value="rose">Critical Health Alert</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#172033] dark:text-[#F1F4F8] mb-1">
              Surveillance Directives & Custody Notes
            </label>
            <textarea
              rows="2"
              placeholder="Enter guard escort requirements, behavioral orders, or isolation conditions..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] rounded-md p-2 text-xs text-[#172033] dark:text-[#F1F4F8] focus:border-[#24527A] dark:focus:border-[#6B9BC2]"
            />
          </div>

          {/* Buttons */}
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
              <Plus className="w-3.5 h-3.5" />
              <span>Admit Offender</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
