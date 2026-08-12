import React, { useState, useContext } from 'react';
import { Eye, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { AppContext } from '../context/AppContext.jsx';

export default function InmateTable({ 
  inmates, 
  onSelectInmate, 
  onLogIncidentForInmate
}) {
  const { activeTab, setActiveTab } = useContext(AppContext);
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
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between h-[540px] shadow-sm">
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Directory Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
              Active prisoner directory
            </h2>
            <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-sans">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'ALPHA', label: 'Alpha' },
                { id: 'BRAVO', label: 'Bravo' },
                { id: 'CHARLIE', label: 'Charlie' },
                { id: 'ISO', label: 'Isolation' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-sans text-slate-500 dark:text-slate-400">
            {filteredInmates.length} records
          </span>
        </div>

        {/* Data Table Container */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs font-sans text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-950/90 text-slate-500 dark:text-slate-400 font-sans font-medium text-xs border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
              <tr>
                <th scope="col" className="py-3 px-4 font-normal w-24">ID</th>
                <th scope="col" className="py-3 px-4 font-normal w-48">Name</th>
                <th scope="col" className="py-3 px-4 font-normal w-40">Cell / tier</th>
                <th scope="col" className="py-3 px-4 font-normal min-w-[200px]">Crime category</th>
                <th scope="col" className="py-3 px-4 font-normal min-w-[180px]">Medical alert</th>
                <th scope="col" className="py-3 px-4 font-normal text-right w-24">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {paginatedInmates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 dark:text-slate-500 font-sans text-xs">
                    No prisoner records found.
                  </td>
                </tr>
              ) : (
                paginatedInmates.map((inmate) => (
                  <tr 
                    key={inmate.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectInmate(inmate)}
                  >
                    {/* ID - Monospace */}
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 text-xs">
                      {inmate.id}
                    </td>

                    {/* Name & Bio - Sans Serif */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                          {inmate.fullName}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          "{inmate.alias}" · {inmate.age}
                        </div>
                      </div>
                    </td>

                    {/* Cell / Tier */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {inmate.cellBlock.replace('Block ', '')} ({inmate.cellNumber})
                        </div>
                        <div>
                          <StatusBadge type="tier" value={inmate.securityTier} />
                        </div>
                      </div>
                    </td>

                    {/* Crime Category */}
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-normal leading-snug">
                      {inmate.crimeCategory}
                    </td>

                    {/* Medical Alert */}
                    <td className="py-3 px-4">
                      <StatusBadge 
                        type="medical" 
                        value={inmate.medicalAlert} 
                        severity={inmate.medicalAlertSeverity} 
                      />
                    </td>

                    {/* Inline Action Buttons */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectInmate(inmate)}
                          className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                          title="View Inmate File"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onLogIncidentForInmate(inmate)}
                          className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 transition-colors cursor-pointer"
                          title="Log Security Incident"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
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
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-sans">
        <div>
          Showing {paginatedInmates.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredInmates.length)} of {filteredInmates.length} records
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300 font-mono">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
