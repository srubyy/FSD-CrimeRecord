import React, { useState, useContext } from 'react';
import { Eye, AlertTriangle, ChevronLeft, ChevronRight, Trash2, ArrowUpDown, UserX, Search, Filter } from 'lucide-react';
import { useSelector } from 'react-redux';
import StatusBadge from './StatusBadge.jsx';
import { AppContext } from '../context/AppContext.jsx';

export default function InmateTable({ 
  inmates, 
  onSelectInmate, 
  onLogIncidentForInmate,
  onDeleteInmate
}) {
  const { activeTab, setActiveTab, searchTerm, setSearchTerm, securityFilter, setSecurityFilter } = useContext(AppContext);
  const currentUser = useSelector((state) => state.auth.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 7;

  // Filter by cell block tab
  const filteredInmates = inmates.filter(inmate => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ALPHA') return inmate.cellBlock.toLowerCase().includes('alpha');
    if (activeTab === 'BRAVO') return inmate.cellBlock.toLowerCase().includes('bravo');
    if (activeTab === 'CHARLIE') return inmate.cellBlock.toLowerCase().includes('charlie');
    if (activeTab === 'ISO') return inmate.cellBlock.toLowerCase().includes('isolation');
    return true;
  });

  // Sort inmates
  const sortedInmates = [...filteredInmates].sort((a, b) => {
    let result = 0;
    if (sortBy === 'name') {
      result = a.fullName.localeCompare(b.fullName);
    } else if (sortBy === 'id') {
      result = a.id.localeCompare(b.id);
    } else if (sortBy === 'danger') {
      result = (b.dangerRating || 0) - (a.dangerRating || 0);
    }
    return sortOrder === 'asc' ? result : -result;
  });

  const totalPages = Math.ceil(sortedInmates.length / itemsPerPage) || 1;
  const paginatedInmates = sortedInmates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleResetFilters = () => {
    setActiveTab('ALL');
    setSearchTerm('');
    setSecurityFilter('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-[#151C26] border border-[#D9E0E8] dark:border-[#293544] rounded-lg overflow-hidden flex flex-col justify-between shadow-xs min-h-[580px]">
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-3.5 border-b border-[#D9E0E8] dark:border-[#293544] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#151C26]">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#172033] dark:text-[#F1F4F8]">
              Active Custodial Directory
            </h2>
            <span className="text-xs text-[#526176] dark:text-[#AAB6C5]">
              ({filteredInmates.length} inmates)
            </span>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Unit Filter */}
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => {
                  setActiveTab(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] text-[#172033] dark:text-[#F1F4F8] text-xs rounded-md pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-[#24527A] dark:focus:border-[#6B9BC2] cursor-pointer"
              >
                <option value="ALL">All Housing Units</option>
                <option value="ALPHA">Block Alpha</option>
                <option value="BRAVO">Block Bravo</option>
                <option value="CHARLIE">Block Charlie</option>
                <option value="ISO">Isolation Wing</option>
              </select>
              <Filter className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#526176] dark:text-[#AAB6C5] pointer-events-none" />
            </div>

            {/* Tier Filter */}
            <div className="relative">
              <select
                value={securityFilter}
                onChange={(e) => setSecurityFilter(e.target.value)}
                className="appearance-none bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] text-[#172033] dark:text-[#F1F4F8] text-xs rounded-md pl-2.5 pr-7 py-1.5 focus:outline-none focus:border-[#24527A] dark:focus:border-[#6B9BC2] cursor-pointer"
              >
                <option value="ALL">All Tiers</option>
                <option value="Maximum">Maximum Tier</option>
                <option value="Medium">Medium Tier</option>
                <option value="Minimum">Minimum Tier</option>
                <option value="Isolation">Isolation Tier</option>
              </select>
              <Filter className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#526176] dark:text-[#AAB6C5] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-xs text-[#172033] dark:text-[#F1F4F8]">
            <thead className="bg-[#F5F7FA] dark:bg-[#0F141C] text-[#526176] dark:text-[#AAB6C5] font-semibold text-[11px] uppercase tracking-wider border-b border-[#D9E0E8] dark:border-[#293544] sticky top-0 z-10">
              <tr>
                <th scope="col" className="py-2.5 px-4 font-mono w-24">
                  <button 
                    onClick={() => toggleSort('id')} 
                    className="flex items-center gap-1 hover:text-[#172033] dark:hover:text-[#F1F4F8] cursor-pointer"
                  >
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3 text-[#526176]" />
                  </button>
                </th>
                <th scope="col" className="py-2.5 px-4 min-w-[180px]">
                  <button 
                    onClick={() => toggleSort('name')} 
                    className="flex items-center gap-1 hover:text-[#172033] dark:hover:text-[#F1F4F8] cursor-pointer"
                  >
                    <span>Offender</span>
                    <ArrowUpDown className="w-3 h-3 text-[#526176]" />
                  </button>
                </th>
                <th scope="col" className="py-2.5 px-4 min-w-[150px]">Housing & Tier</th>
                <th scope="col" className="py-2.5 px-4 min-w-[200px]">Primary Charge</th>
                <th scope="col" className="py-2.5 px-4 min-w-[170px]">Medical Directives</th>
                <th scope="col" className="py-2.5 px-4 text-right w-20">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#D9E0E8] dark:divide-[#293544]">
              {paginatedInmates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto">
                      <UserX className="w-6 h-6 text-[#526176] dark:text-[#AAB6C5]" />
                      <p className="text-sm font-semibold text-[#172033] dark:text-[#F1F4F8]">
                        No Inmate Records Found
                      </p>
                      <p className="text-xs text-[#526176] dark:text-[#AAB6C5] text-center">
                        No records match the active filter or search criteria.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 px-3 py-1.5 rounded-md text-xs font-medium bg-white dark:bg-[#151C26] hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] text-[#172033] dark:text-[#F1F4F8] border border-[#D9E0E8] dark:border-[#293544] transition-colors cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedInmates.map((inmate) => (
                  <tr 
                    key={inmate.id}
                    className="hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] transition-colors cursor-pointer"
                    onClick={() => onSelectInmate(inmate)}
                  >
                    {/* Booking ID */}
                    <td className="py-3 px-4 font-mono text-[#526176] dark:text-[#AAB6C5] text-xs">
                      {inmate.id}
                    </td>

                    {/* Offender Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={inmate.avatar} 
                          alt={inmate.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-[#D9E0E8] dark:border-[#293544] shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-medium text-[#172033] dark:text-[#F1F4F8] truncate">
                            {inmate.fullName}
                          </div>
                          <div className="text-[11px] text-[#526176] dark:text-[#AAB6C5] truncate">
                            "{inmate.alias}" · Age {inmate.age}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Housing Assignment & Security Tier */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="text-xs text-[#172033] dark:text-[#F1F4F8]">
                          {inmate.cellBlock.replace('Block ', '')} · {inmate.cellNumber}
                        </div>
                        <div>
                          <StatusBadge type="tier" value={inmate.securityTier} />
                        </div>
                      </div>
                    </td>

                    {/* Conviction / Offense */}
                    <td className="py-3 px-4 text-[#172033] dark:text-[#F1F4F8] leading-snug">
                      <span className="line-clamp-2">{inmate.crimeCategory}</span>
                    </td>

                    {/* Medical Directives */}
                    <td className="py-3 px-4">
                      <StatusBadge 
                        type="medical" 
                        value={inmate.medicalAlert} 
                        severity={inmate.medicalAlertSeverity} 
                      />
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectInmate(inmate)}
                          className="p-1 rounded text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] transition-colors cursor-pointer"
                          title="View Inmate Dossier"
                          aria-label={`View dossier for ${inmate.fullName}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onLogIncidentForInmate(inmate)}
                          className="p-1 rounded text-[#526176] hover:text-[#A66A00] dark:text-[#AAB6C5] dark:hover:text-[#D6A34A] hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] transition-colors cursor-pointer"
                          title="File Security Incident"
                          aria-label={`File incident for ${inmate.fullName}`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteInmate && onDeleteInmate(inmate)}
                          disabled={currentUser?.role !== 'Admin'}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            currentUser?.role === 'Admin'
                              ? 'text-[#526176] hover:text-[#B4232C] dark:text-[#AAB6C5] dark:hover:text-[#E06A70] hover:bg-[#FCEBEC] dark:hover:bg-[#E06A70]/10'
                              : 'opacity-25 cursor-not-allowed text-[#526176]'
                          }`}
                          title={currentUser?.role === 'Admin' ? "Expunge Record (Admin Only)" : "Expunge Restricted to Admin"}
                          aria-label={`Expunge record for ${inmate.fullName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
      <div className="p-3 border-t border-[#D9E0E8] dark:border-[#293544] bg-[#F5F7FA] dark:bg-[#0F141C] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#526176] dark:text-[#AAB6C5]">
        <div>
          Showing {paginatedInmates.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, sortedInmates.length)} of {sortedInmates.length} records
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-white dark:bg-[#151C26] text-[#172033] dark:text-[#F1F4F8] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] transition-colors cursor-pointer"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 py-0.5 text-xs text-[#172033] dark:text-[#F1F4F8] font-mono">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1 rounded bg-white dark:bg-[#151C26] text-[#172033] dark:text-[#F1F4F8] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] transition-colors cursor-pointer"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
