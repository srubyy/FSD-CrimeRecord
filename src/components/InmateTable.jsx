import React, { useState } from 'react';
import { Eye, AlertTriangle, FileText, ChevronLeft, ChevronRight, Hash, Lock, MapPin } from 'lucide-react';
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between h-[580px]">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Table Filter Tabs & Header */}
        <div className="p-3.5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
              Active Prisoner Directory
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
              {filteredInmates.length} RECORDS
            </span>
          </div>

          {/* Cell Block Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Blocks' },
              { id: 'ALPHA', label: 'Block Alpha' },
              { id: 'BRAVO', label: 'Block Bravo' },
              { id: 'CHARLIE', label: 'Block Charlie' },
              { id: 'ISO', label: 'Isolation' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-slate-100 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table Container with Fixed Height Scroll */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th scope="col" className="py-3 px-4 font-semibold">Inmate ID</th>
                <th scope="col" className="py-3 px-4 font-semibold">Full Name & Bio</th>
                <th scope="col" className="py-3 px-4 font-semibold">Cell & Tier</th>
                <th scope="col" className="py-3 px-4 font-semibold">Crime Category</th>
                <th scope="col" className="py-3 px-4 font-semibold">Medical Alert</th>
                <th scope="col" className="py-3 px-4 font-semibold">Status</th>
                <th scope="col" className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50">
              {paginatedInmates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-500 font-mono">
                    <Lock className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                    No inmate records matching current filters.
                  </td>
                </tr>
              ) : (
                paginatedInmates.map((inmate) => (
                  <tr 
                    key={inmate.id}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => onSelectInmate(inmate)}
                  >
                    {/* Inmate ID */}
                    <td className="py-3 px-4 font-mono font-semibold text-slate-200 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-slate-500" />
                        {inmate.id}
                      </span>
                    </td>

                    {/* Full Name & Avatar */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={inmate.avatar} 
                          alt={inmate.fullName}
                          className="w-7 h-7 rounded object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-slate-100 group-hover:text-slate-300 transition-colors">
                            {inmate.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Alias: "{inmate.alias}" • Age {inmate.age}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cell Block & Security Tier */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-slate-300 font-mono text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{inmate.cellBlock} ({inmate.cellNumber})</span>
                        </div>
                        <div>
                          <StatusBadge type="tier" value={inmate.securityTier} />
                        </div>
                      </div>
                    </td>

                    {/* Crime Category */}
                    <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                      <div className="truncate max-w-[170px]" title={inmate.crimeCategory}>
                        {inmate.crimeCategory}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Sentence: {inmate.sentenceLength}
                      </div>
                    </td>

                    {/* Medical Alert Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge 
                        type="medical" 
                        value={inmate.medicalAlert} 
                        severity={inmate.medicalAlertSeverity} 
                      />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge type="status" value={inmate.status} />
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectInmate(inmate)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
                          title="View Inmate File"
                        >
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span className="hidden xl:inline">File</span>
                        </button>

                        <button
                          onClick={() => onLogIncidentForInmate(inmate)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
                          title="Log Security Incident"
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
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
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div>
          Showing {paginatedInmates.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredInmates.length)} of {filteredInmates.length} records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-[11px]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
