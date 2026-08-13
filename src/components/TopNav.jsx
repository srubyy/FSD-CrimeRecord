import React, { useContext, useState } from 'react';
import { Search, Plus, Filter, Bell, Shield, Sun, Moon, UserCheck, KeyRound, Wifi, Users } from 'lucide-react';
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
  onDutyGuards,
  onlineStaff = [],
  isSocketConnected = false
}) {
  const { 
    isDarkMode, 
    setIsDarkMode, 
    searchTerm, 
    setSearchTerm, 
    securityFilter, 
    setSecurityFilter 
  } = useContext(AppContext);

  const [showPresenceDropdown, setShowPresenceDropdown] = useState(false);

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
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                MAX-SEC-09
              </span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              
              {/* Auth User Badge */}
              <button
                onClick={onOpenAuthModal}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border cursor-pointer ${roleStyle}`}
                title="Click to Switch User or Register Account"
              >
                <UserCheck className="w-3 h-3" />
                <span>{currentUser?.username || 'Guest'} ({role})</span>
              </button>

              <span className="text-slate-400 dark:text-slate-600">•</span>

              {/* Real-Time Socket Presence Indicator */}
              <div className="relative">
                <button
                  onClick={() => setShowPresenceDropdown(!showPresenceDropdown)}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                  title="Real-Time Staff Presence (WebSockets Active)"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Wifi className="w-3 h-3 text-emerald-500" />
                  <span>{onlineStaff.length > 0 ? `${onlineStaff.length} Staff Online` : 'Socket Ready'}</span>
                </button>

                {/* Dropdown displaying online staff */}
                {showPresenceDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-lg bg-slate-900 text-slate-100 border border-slate-800 shadow-xl z-50 p-3 text-xs font-sans">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 font-mono font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-400" /> Online Staff
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">
                        WebSockets
                      </span>
                    </div>

                    {onlineStaff.length === 0 ? (
                      <p className="text-slate-500 italic py-1">No active staff connected to socket.</p>
                    ) : (
                      <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                        {onlineStaff.map((staff, idx) => (
                          <li key={idx} className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-800/60 font-mono">
                            <span className="font-medium text-slate-200">{staff.username}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              {staff.role}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
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
