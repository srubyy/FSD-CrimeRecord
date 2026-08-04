import React, { useState } from 'react';
import { Eye, AlertTriangle, FileText, ChevronLeft, ChevronRight, Hash, Shield, Activity, UserCheck, Lock, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export default function InmateTable({ 
  inmates, 
  onSelectInmate, 
  onLogIncidentForInmate,
  activeTab,
  setActiveTab
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter by cell block tab
  const filteredInmates = inmates.filter(inmate => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ALPHA') return inmate.cellBlock.includes('Alpha');
    if (activeTab === 'BRAVO') return inmate.cellBlock.includes('Bravo');
    if (activeTab === 'CHARLIE') return inmate.cellBlock.includes('Charlie');
    if (activeTab === 'ISO') return inmate.cellBlock.includes('Isolation');
    return true;
  });

  const totalPages = Math.ceil(filteredInmates.length / itemsPerPage) || 1;
  const paginatedInmates = filteredInmates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col justify-between">
      <div>
        {/* Table Filter Tabs & Header */}
        <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wide">
              Active Prisoner Directory
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">
              {filteredInmates.length} RECORDS
            </span>
          </div>

          {/* Cell Block Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 text-xs font-mono overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Blocks' },
              { id: 'ALPHA', label: 'Block Alpha' },
              { id: 'BRAVO', label: 'Block Bravo' },
              { id: 'CHARLIE', label: 'Block Charlie' },
              { id: 'ISO', label: 'Isolation Wing' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/90 text-slate-400 font-mono uppercase text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th scope="col" className="py-3.5 px-4 font-semibold">Inmate ID</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">Full Name & Bio</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">Cell & Tier</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">Crime Category</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">Medical Alert</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
                <th scope="col" className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {paginatedInmates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-500 font-mono">
                    <Lock className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    No inmate records matching current filters.
                  </td>
                </tr>
              ) : (
                paginatedInmates.map((inmate) => (
                  <tr 
                    key={inmate.id}
                    className="hover:bg-slate-800/40 transition-colors duration-150 group cursor-pointer"
                    onClick={() => onSelectInmate(inmate)}
                  >
                    {/* Inmate ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-400 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-slate-500" />
                        {inmate.id}
                      </span>
                    </td>

                    {/* Full Name & Avatar */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={inmate.avatar} 
                          alt={inmate.fullName}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-700 shadow-inner group-hover:border-rose-500/50 transition-colors"
                        />
                        <div>
                          <div className="font-semibold text-slate-100 group-hover:text-rose-400 transition-colors">
                            {inmate.fullName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Alias: "{inmate.alias}" • Age {inmate.age}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cell Block & Security Tier */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{inmate.cellBlock} ({inmate.cellNumber})</span>
                        </div>
                        <div>
                          <StatusBadge type="tier" value={inmate.securityTier} />
                        </div>
                      </div>
                    </td>

                    {/* Crime Category */}
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                      <div className="truncate max-w-[180px]" title={inmate.crimeCategory}>
                        {inmate.crimeCategory}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Sentence: {inmate.sentenceLength}
                      </div>
                    </td>

                    {/* Medical Alert Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge 
                        type="medical" 
                        value={inmate.medicalAlert} 
                        severity={inmate.medicalAlertSeverity} 
                      />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge type="status" value={inmate.status} />
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectInmate(inmate)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 transition-all duration-200 hover:border-slate-600 cursor-pointer"
                          title="View Inmate File"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-400" />
                          <span className="hidden xl:inline">File</span>
                        </button>

                        <button
                          onClick={() => onLogIncidentForInmate(inmate)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-mono font-medium border border-rose-800/40 transition-all duration-200 hover:border-rose-700 cursor-pointer"
                          title="Log Security Incident"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span className="hidden xl:inline">Incident</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div>
          Showing {paginatedInmates.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredInmates.length)} of {filteredInmates.length} records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-bold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
