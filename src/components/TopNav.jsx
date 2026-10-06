import React, { useContext, useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Shield, 
  Sun, 
  Moon, 
  X,
  Command,
  ChevronDown
} from 'lucide-react';
import { useSelector } from 'react-redux';
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
  const [systemTime, setSystemTime] = useState(new Date().toUTCString().slice(17, 25) + ' UTC');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toUTCString().slice(17, 25) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentUser = useSelector((state) => state.auth.user);
  const role = currentUser?.role || 'Officer';

  return (
    <div>
      {/* 1. Restrained Global Header (~64px) - Full Bleed Edge to Edge */}
      <header className="bg-white dark:bg-[#151C26] border-b border-[#D9E0E8] dark:border-[#293544] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between transition-colors sticky top-0 z-30 w-full">
        <div className="w-full flex items-center justify-between gap-4">
          
          {/* Brand Identification */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#24527A] dark:bg-[#6B9BC2] text-white dark:text-[#0F141C]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-[#172033] dark:text-[#F1F4F8]">
                  APEX CORRECTIONS
                </span>
                <span className="text-xs text-[#526176] dark:text-[#AAB6C5]">
                  / Facility 09
                </span>
              </div>
              <p className="text-xs text-[#526176] dark:text-[#AAB6C5] hidden sm:block">
                Custodial Intelligence & Operations
              </p>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#526176] dark:text-[#AAB6C5]" />
              <input
                type="text"
                placeholder="Search inmate roster..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F5F7FA] dark:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] text-[#172033] dark:text-[#F1F4F8] text-xs rounded-md pl-8 pr-8 py-1.5 focus:outline-none focus:border-[#24527A] dark:focus:border-[#6B9BC2] placeholder-[#526176] dark:placeholder-[#AAB6C5]"
              />
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#526176] dark:text-[#AAB6C5] border border-[#D9E0E8] dark:border-[#293544] rounded px-1 py-0.2">
                  /
                </span>
              )}
            </div>
          </div>

          {/* Right System Controls & User Menu */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Telemetry Status */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowPresenceDropdown(!showPresenceDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-[#526176] dark:text-[#AAB6C5] hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] border border-transparent hover:border-[#D9E0E8] dark:hover:border-[#293544] transition-colors cursor-pointer"
                title="System Telemetry Status"
              >
                <span className={`w-2 h-2 rounded-full ${isSocketConnected ? 'bg-[#167A5B] dark:bg-[#4DB58B]' : 'bg-[#A66A00] dark:bg-[#D6A34A]'}`} />
                <span className="font-medium text-[#172033] dark:text-[#F1F4F8]">
                  {onlineStaff.length > 0 ? `${onlineStaff.length} On Duty` : 'Online'}
                </span>
                <span className="font-mono text-[11px] opacity-75">{systemTime}</span>
              </button>

              {/* Online Personnel Popover */}
              {showPresenceDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-md bg-white dark:bg-[#151C26] border border-[#D9E0E8] dark:border-[#293544] shadow-md z-50 p-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[#D9E0E8] dark:border-[#293544] pb-2 mb-2 font-medium text-[#526176] dark:text-[#AAB6C5]">
                    <span>Connected Terminals</span>
                    <span className="text-[10px] font-mono">WebSocket</span>
                  </div>

                  {onlineStaff.length === 0 ? (
                    <p className="text-[#526176] dark:text-[#AAB6C5] py-1 text-xs">Standard broadcast active.</p>
                  ) : (
                    <ul className="space-y-1 max-h-40 overflow-y-auto">
                      {onlineStaff.map((staff, idx) => (
                        <li key={idx} className="flex items-center justify-between py-1 px-1.5 rounded bg-[#F5F7FA] dark:bg-[#0F141C] text-xs">
                          <span className="font-medium text-[#172033] dark:text-[#F1F4F8]">{staff.username}</span>
                          <span className="text-[10px] text-[#526176] dark:text-[#AAB6C5]">
                            {staff.role}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 rounded-md text-[#526176] hover:text-[#172033] dark:text-[#AAB6C5] dark:hover:text-[#F1F4F8] hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] transition-colors cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#D6A34A]" /> : <Moon className="w-4 h-4 text-[#526176]" />}
            </button>

            {/* User Session Profile */}
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#172033] dark:text-[#F1F4F8] hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] border border-[#D9E0E8] dark:border-[#293544] transition-colors cursor-pointer"
              title="Access Control / Switch User"
            >
              <div className="w-5 h-5 rounded bg-[#24527A]/10 dark:bg-[#6B9BC2]/20 text-[#24527A] dark:text-[#6B9BC2] flex items-center justify-center text-[10px] font-bold">
                {currentUser?.username?.charAt(0).toUpperCase() || 'O'}
              </div>
              <span>{currentUser?.username || 'Officer'}</span>
              <span className="text-[11px] text-[#526176] dark:text-[#AAB6C5] font-normal">
                ({role})
              </span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Container for Page Title and Operational Strip */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-5 space-y-4">
        {/* 2. Page Header + Primary Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#172033] dark:text-[#F1F4F8] tracking-tight">
              Custodial Operations & Inmate Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#526176] dark:text-[#AAB6C5] mt-0.5">
              Active facility rosters, security classifications, health directives, and telemetry audits.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Secondary Action */}
            <button
              onClick={onOpenIncidentModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-white dark:bg-[#151C26] hover:bg-[#F5F7FA] dark:hover:bg-[#0F141C] text-[#172033] dark:text-[#F1F4F8] border border-[#D9E0E8] dark:border-[#293544] shadow-xs transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-[#526176] dark:text-[#AAB6C5]" />
              <span>File Incident</span>
            </button>

            {/* Primary Action */}
            <button
              onClick={onOpenIntakeModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-medium bg-[#24527A] hover:bg-[#1B3E5C] dark:bg-[#6B9BC2] dark:hover:bg-[#85B2D6] text-white dark:text-[#0F141C] shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Intake Offender</span>
            </button>
          </div>
        </div>

        {/* 3. Compact Operational Summary Strip */}
        <div className="bg-white dark:bg-[#151C26] border border-[#D9E0E8] dark:border-[#293544] rounded-lg p-4 shadow-xs w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#D9E0E8] dark:divide-[#293544]">
            
            {/* Metric 1 */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#526176] dark:text-[#AAB6C5] font-semibold block">
                TOTAL IN CUSTODY
              </span>
              <div className="text-2xl font-semibold text-[#172033] dark:text-[#F1F4F8]">
                {totalInmates}
              </div>
              <p className="text-xs text-[#526176] dark:text-[#AAB6C5]">
                87.5% capacity · 120 facility beds
              </p>
            </div>

            {/* Metric 2 */}
            <div className="space-y-1 lg:pl-6 pt-3 lg:pt-0">
              <span className="text-[11px] uppercase tracking-wider text-[#526176] dark:text-[#AAB6C5] font-semibold block">
                ACTIVE IN FACILITY
              </span>
              <div className="text-2xl font-semibold text-[#172033] dark:text-[#F1F4F8]">
                {activeInCustody}
              </div>
              <p className="text-xs text-[#526176] dark:text-[#AAB6C5]">
                Nominal operational status
              </p>
            </div>

            {/* Metric 3 */}
            <div className="space-y-1 lg:pl-6 pt-3 lg:pt-0">
              <span className="text-[11px] uppercase tracking-wider text-[#526176] dark:text-[#AAB6C5] font-semibold block">
                HIGH ALERT / ISOLATION
              </span>
              <div className="text-2xl font-semibold text-[#B4232C] dark:text-[#E06A70]">
                {highAlertFlags}
              </div>
              <p className="text-xs text-[#526176] dark:text-[#AAB6C5]">
                2-officer tactical escort required
              </p>
            </div>

            {/* Metric 4 */}
            <div className="space-y-1 lg:pl-6 pt-3 lg:pt-0">
              <span className="text-[11px] uppercase tracking-wider text-[#526176] dark:text-[#AAB6C5] font-semibold block">
                ACTIVE SHIFT PERSONNEL
              </span>
              <div className="text-2xl font-semibold text-[#172033] dark:text-[#F1F4F8]">
                {onDutyGuards}
              </div>
              <p className="text-xs text-[#526176] dark:text-[#AAB6C5]">
                Shift Alpha-3 · Armed detail
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
