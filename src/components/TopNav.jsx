import React, { useState, useEffect } from 'react';
import { Shield, Search, Plus, Filter, Bell, Users, ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';
import StatCard from './StatCard.jsx';

export default function TopNav({ 
  searchTerm, 
  setSearchTerm, 
  securityFilter, 
  setSecurityFilter, 
  onOpenIntakeModal,
  onOpenIncidentModal,
  totalInmates,
  activeInCustody,
  highAlertFlags,
  onDutyGuards
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="space-y-4">
      {/* Upper Operating Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
        
        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-200">
            <Shield className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold tracking-tight text-white font-mono uppercase">
                CrimeNet OS <span className="text-slate-600">//</span> <span className="text-slate-300 font-normal">Facility Control</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                SYSTEM ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
              <span>FACILITY ID: MAX-SEC-09</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{time} IST</span>
            </p>
          </div>
        </div>

        {/* Quick Action Bar & CTA */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search inmate ID, name, crime..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-slate-600 placeholder-slate-500 font-mono transition-colors"
            />
          </div>

          {/* Security Tier Filter */}
          <div className="relative">
            <select
              value={securityFilter}
              onChange={(e) => setSecurityFilter(e.target.value)}
              className="appearance-none bg-slate-950/80 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-slate-600 cursor-pointer font-mono transition-colors"
            >
              <option value="ALL">All Security Tiers</option>
              <option value="Maximum">Maximum Tier</option>
              <option value="Medium">Medium Tier</option>
              <option value="Minimum">Minimum Tier</option>
              <option value="Isolation">Isolation Wing</option>
            </select>
            <Filter className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Incident Log Action */}
          <button
            onClick={onOpenIncidentModal}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold font-mono bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Log Event</span>
          </button>

          {/* Intake New Record CTA */}
          <button
            onClick={onOpenIntakeModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold font-mono bg-slate-100 hover:bg-white text-slate-950 border border-slate-200 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Intake New Record</span>
          </button>
        </div>
      </div>

      {/* Operational Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Registered Inmates"
          value={totalInmates}
          subtext="Capacity 1,200 (87.5%)"
          trend="up"
          trendValue="+2.4%"
          icon={Users}
        />

        <StatCard
          title="Active In-Custody"
          value={activeInCustody}
          subtext="Main Blocks & Isolation"
          trend="neutral"
          trendValue="Normal"
          icon={ShieldCheck}
        />

        <StatCard
          title="High-Alert / Isolation"
          value={highAlertFlags}
          subtext="Requires Escort Detail"
          trend="up"
          trendValue="+1 Flag"
          icon={ShieldAlert}
        />

        <StatCard
          title="On-Duty Personnel"
          value={onDutyGuards}
          subtext="Shift Alpha-3 Armed"
          trend="up"
          trendValue="98.6%"
          icon={UserCheck}
        />
      </div>
    </header>
  );
}
