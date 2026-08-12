import React, { useContext } from 'react';
import { Search, Plus, Filter, Bell, Shield, Sun, Moon, UserCheck, KeyRound } from 'lucide-react';
import { useSelector } from 'react-redux';
import StatCard from './StatCard.jsx';
import { AppContext } from '../context/AppContext.jsx';

export default function TopNav({ 
  onOpenIntakeModal,
  onOpenIncidentModal,
  onOpenAuthModal,
  totalInmates,
  activeInCustody,
  highAlertFlags,
  onDutyGuards
}) {
  const { 
    isDarkMode, 
    setIsDarkMode, 
    searchTerm, 
    setSearchTerm, 
    securityFilter, 
    setSecurityFilter 
  } = useContext(AppContext);

  const currentUser = useSelector((state) => state.auth.user);
  const role = currentUser?.role || 'Officer';

  const roleStyle = 
    role === 'Admin'
      ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800'
      : role === 'Warden'
      ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800'
      : 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800';

  return (
    <header className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Brand & Auth Status */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
              CrimeNet OS <span className="text-slate-400 dark:text-slate-500 font-normal">// Facility Control</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                MAX-SEC-09
              </span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <button
                onClick={onOpenAuthModal}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border cursor-pointer ${roleStyle}`}
                title="Click to Switch User or Register Account"
              >
                <UserCheck className="w-3 h-3" />
                <span>{currentUser?.username || 'Guest'} ({role})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-center p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark / Light Theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Switch Staff / Auth Login Button */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            title="Switch User Role / Authenticate"
          >
            <KeyRound className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden md:inline">Switch Staff</span>
          </button>

          {/* Search */}
          <div className="relative flex-1 sm:w-56 min-w-[160px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, name, crime..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-slate-400 dark:focus:border-slate-700 font-sans placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Tier Filter */}
          <div className="relative">
            <select
              value={securityFilter}
              onChange={(e) => setSecurityFilter(e.target.value)}
              className="appearance-none bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:border-slate-400 dark:focus:border-slate-700 cursor-pointer font-sans"
            >
              <option value="ALL">All Tiers</option>
              <option value="Maximum">Maximum Tier</option>
              <option value="Medium">Medium Tier</option>
              <option value="Minimum">Minimum Tier</option>
              <option value="Isolation">Isolation Wing</option>
            </select>
            <Filter className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Log Incident */}
          <button
            onClick={onOpenIncidentModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">Log Event</span>
          </button>

          {/* Intake New Record */}
          <button
            onClick={onOpenIntakeModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-sans font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Intake New Record</span>
          </button>
        </div>
      </div>

      {/* Quiet Top Stat Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-2 border-b border-slate-200 dark:border-slate-800/60 pb-5">
        <StatCard
          title="Registered inmates"
          value={totalInmates}
          subtext="87.5% of capacity"
        />

        <StatCard
          title="Active in-custody"
          value={activeInCustody}
          subtext="Main blocks and isolation"
        />

        <StatCard
          title="High alert"
          value={highAlertFlags}
          subtext="Requires escort detail"
          isHighlighted={true}
        />

        <StatCard
          title="On-duty personnel"
          value={onDutyGuards}
          subtext="Shift alpha-3 armed"
        />
      </div>
    </header>
  );
}
