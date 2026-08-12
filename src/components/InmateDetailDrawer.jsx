import React, { useContext } from 'react';
import { X, Shield, FileText, AlertOctagon, HeartPulse, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import StatusBadge from './StatusBadge.jsx';
import { AppContext } from '../context/AppContext.jsx';

export default function InmateDetailDrawer({ inmate, onClose, onLogIncident }) {
  const { isDarkMode } = useContext(AppContext);
  const currentUser = useSelector((state) => state.auth.user);
  if (!inmate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 shadow-2xl overflow-y-auto space-y-6 flex flex-col justify-between font-sans z-10">
        
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img 
                src={inmate.avatar} 
                alt={inmate.fullName}
                className="w-14 h-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {inmate.fullName}
                </h2>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    ID: {inmate.id}
                  </span>
                  <span className="text-slate-400 dark:text-slate-600">•</span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Alias: "{inmate.alias}"
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge type="tier" value={inmate.securityTier} isDarkMode={isDarkMode} />
                  <StatusBadge type="status" value={inmate.status} isDarkMode={isDarkMode} />
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">Cell Assignment</span>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{inmate.cellBlock}</span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5">Door {inmate.cellNumber}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">Danger Rating</span>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{inmate.dangerRating || 8.5} / 10.0</span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5">Escort Required</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 block">Admission Date</span>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{inmate.admissionDate}</span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5">Parole: {inmate.paroleEligible}</span>
            </div>
          </div>

          {/* Legal & Crime Profile */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Criminal Conviction Profile</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Primary Offense:</span>
                <span className="text-slate-900 dark:text-slate-200 font-semibold">{inmate.crimeCategory}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Sentence Length:</span>
                <span className="text-slate-800 dark:text-slate-200">{inmate.sentenceLength}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Parole Eligibility:</span>
                <span className="text-slate-800 dark:text-slate-200">{inmate.paroleEligible}</span>
              </div>
            </div>
          </div>

          {/* Medical & Health Record */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold uppercase tracking-wider">
              <HeartPulse className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Medical Record</span>
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-mono text-slate-900 dark:text-slate-200 font-medium block">
                  {inmate.medicalAlert}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">
                  Verified by Facility Medical Unit
                </span>
              </div>
              <StatusBadge type="medical" value={inmate.medicalAlert} severity={inmate.medicalAlertSeverity} isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Guard Risk Notes */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Guard Directives</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 leading-relaxed">
              {inmate.notes || "No special directives logged. Standard surveillance active."}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={() => {
              onClose();
              onLogIncident(inmate);
            }}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold font-mono bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>Log Incident</span>
          </button>

          {currentUser?.role === 'Admin' && (
            <button
              onClick={() => {
                if (onDeleteInmate) onDeleteInmate(inmate);
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold font-mono bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/80 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
              title="Expunge Inmate Record (Admin Permission Required)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Expunge</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
