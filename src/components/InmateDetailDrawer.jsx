import React from 'react';
import { X, Shield, FileText, AlertOctagon, HeartPulse, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import StatusBadge from './StatusBadge.jsx';

export default function InmateDetailDrawer({ inmate, onClose, onLogIncident, onDeleteInmate }) {
  const currentUser = useSelector((state) => state.auth.user);
  
  if (!inmate) return null;

  const dangerRating = inmate.dangerRating || 8.5;
  const dangerPercent = Math.min(Math.max((dangerRating / 10) * 100, 5), 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose} aria-label="Close modal overlay" />

      <div className="relative w-full max-w-lg h-full bg-white dark:bg-[#151C26] border-l border-[#D9E0E8] dark:border-[#293544] p-6 shadow-xl overflow-y-auto space-y-5 flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#D9E0E8] dark:border-[#293544]">
            <div className="flex items-center gap-3">
              <img 
                src={inmate.avatar} 
                alt={inmate.fullName}
                className="w-12 h-12 rounded-full object-cover border border-[#D9E0E8] dark:border-[#293544] shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";
                }}
              />
              <div>
                <h2 className="text-base font-semibold text-[#172033] dark:text-[#F1F4F8]">
                  {inmate.fullName}
                </h2>

                <div className="flex items-center gap-2 mt-0.5 text-xs text-[#526176] dark:text-[#AAB6C5]">
                  <span className="font-mono text-[#172033] dark:text-[#F1F4F8]">
                    {inmate.id}
                  </span>
                  <span>•</span>
                  <span>Alias: "{inmate.alias}"</span>
                  <span>•</span>
                  <span>Age {inmate.age}</span>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge type="tier" value={inmate.securityTier} />
                  <StatusBadge type="status" value={inmate.status} />
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-1 text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-white rounded cursor-pointer"
              aria-label="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Threat Metric */}
          <div className="p-3.5 rounded-md bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#172033] dark:text-[#F1F4F8] uppercase tracking-wider text-[11px]">
                Threat Rating
              </span>
              <span className="font-mono font-semibold text-[#B4232C] dark:text-[#E06A70]">
                {dangerRating.toFixed(1)} / 10.0
              </span>
            </div>
            
            <div className="w-full bg-[#D9E0E8] dark:bg-[#293544] h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  dangerRating >= 8 
                    ? 'bg-[#B4232C] dark:bg-[#E06A70]' 
                    : dangerRating >= 5 
                    ? 'bg-[#A66A00] dark:bg-[#D6A34A]' 
                    : 'bg-[#167A5B] dark:bg-[#4DB58B]'
                }`}
                style={{ width: `${dangerPercent}%` }}
              />
            </div>
            <p className="text-xs text-[#526176] dark:text-[#AAB6C5] flex items-center justify-between pt-0.5">
              <span>{dangerRating >= 8 ? '2-Officer Tactical Escort Required' : 'Standard Routine Surveillance'}</span>
              <span className="font-mono">{inmate.securityTier} Tier</span>
            </p>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div className="bg-[#F5F7FA] dark:bg-[#0F141C] p-2.5 rounded-md border border-[#D9E0E8] dark:border-[#293544]">
              <span className="text-[11px] uppercase text-[#526176] dark:text-[#AAB6C5] font-semibold block">Housing</span>
              <span className="font-semibold text-[#172033] dark:text-[#F1F4F8] block mt-0.5">{inmate.cellBlock}</span>
              <span className="text-[11px] text-[#526176] dark:text-[#AAB6C5] font-mono">Cell {inmate.cellNumber}</span>
            </div>

            <div className="bg-[#F5F7FA] dark:bg-[#0F141C] p-2.5 rounded-md border border-[#D9E0E8] dark:border-[#293544]">
              <span className="text-[11px] uppercase text-[#526176] dark:text-[#AAB6C5] font-semibold block">Admission</span>
              <span className="font-semibold text-[#172033] dark:text-[#F1F4F8] block mt-0.5 font-mono">{inmate.admissionDate}</span>
              <span className="text-[11px] text-[#526176] dark:text-[#AAB6C5]">Active Status</span>
            </div>

            <div className="bg-[#F5F7FA] dark:bg-[#0F141C] p-2.5 rounded-md border border-[#D9E0E8] dark:border-[#293544]">
              <span className="text-[11px] uppercase text-[#526176] dark:text-[#AAB6C5] font-semibold block">Parole Date</span>
              <span className="font-semibold text-[#172033] dark:text-[#F1F4F8] block mt-0.5 font-mono">{inmate.paroleEligible}</span>
              <span className="text-[11px] text-[#526176] dark:text-[#AAB6C5]">Term: {inmate.sentenceLength}</span>
            </div>
          </div>

          {/* Legal Profile */}
          <div className="p-3.5 rounded-md bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#172033] dark:text-[#F1F4F8] text-[11px] uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-[#526176] dark:text-[#AAB6C5]" />
              <span>Criminal Conviction Profile</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between border-b border-[#D9E0E8] dark:border-[#293544] pb-1.5">
                <span className="text-[#526176] dark:text-[#AAB6C5]">Primary Charge:</span>
                <span className="text-[#172033] dark:text-[#F1F4F8] font-medium text-right">{inmate.crimeCategory}</span>
              </div>
              <div className="flex justify-between border-b border-[#D9E0E8] dark:border-[#293544] pb-1.5">
                <span className="text-[#526176] dark:text-[#AAB6C5]">Sentence Length:</span>
                <span className="text-[#172033] dark:text-[#F1F4F8]">{inmate.sentenceLength}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#526176] dark:text-[#AAB6C5]">Parole Eligibility:</span>
                <span className="text-[#172033] dark:text-[#F1F4F8] font-mono">{inmate.paroleEligible}</span>
              </div>
            </div>
          </div>

          {/* Medical Directives */}
          <div className="p-3.5 rounded-md bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#172033] dark:text-[#F1F4F8] text-[11px] uppercase tracking-wider">
              <HeartPulse className="w-3.5 h-3.5 text-[#B4232C] dark:text-[#E06A70]" />
              <span>Medical & Health Protocol</span>
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-[#151C26] p-2.5 rounded border border-[#D9E0E8] dark:border-[#293544]">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-[#172033] dark:text-[#F1F4F8] block">
                  {inmate.medicalAlert}
                </span>
                <span className="text-[11px] text-[#526176] dark:text-[#AAB6C5] block">
                  Verified by Facility Medical Unit
                </span>
              </div>
              <StatusBadge type="medical" value={inmate.medicalAlert} severity={inmate.medicalAlertSeverity} />
            </div>
          </div>

          {/* Guard Directives */}
          <div className="p-3.5 rounded-md bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#172033] dark:text-[#F1F4F8] text-[11px] uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-[#526176] dark:text-[#AAB6C5]" />
              <span>Surveillance Directives</span>
            </div>
            <p className="text-[#526176] dark:text-[#AAB6C5] leading-relaxed bg-white dark:bg-[#151C26] p-2.5 rounded border border-[#D9E0E8] dark:border-[#293544]">
              {inmate.notes || "Standard surveillance active. No special disciplinary directives registered."}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#D9E0E8] dark:border-[#293544] flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onClose();
              onLogIncident(inmate);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-white dark:bg-[#151C26] hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] text-[#172033] dark:text-[#F1F4F8] border border-[#D9E0E8] dark:border-[#293544] transition-colors cursor-pointer"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-[#A66A00] dark:text-[#D6A34A]" />
            <span>File Incident</span>
          </button>

          {currentUser?.role === 'Admin' && (
            <button
              onClick={() => {
                if (onDeleteInmate) onDeleteInmate(inmate);
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-[#FCEBEC] hover:bg-[#F8D7DA] dark:bg-[#E06A70]/15 text-[#B4232C] dark:text-[#E06A70] border border-[#F5C2C7] dark:border-[#E06A70]/30 transition-colors cursor-pointer"
              title="Expunge Inmate Record (Admin Permission Required)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Expunge</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-md text-xs font-medium text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-white border border-[#D9E0E8] dark:border-[#293544] hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
