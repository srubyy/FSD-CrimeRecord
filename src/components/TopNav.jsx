import React, { useState, useEffect } from 'react';
import { Shield, Search, Plus, Filter, RefreshCw, Radio, Bell, Terminal, Users, ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';
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
    <header className="space-y-5">
      {/* Upper Brand & Operating Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent"></div>

        {/* Title & Status */}
        <div className="flex items-center gap-3.5">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-slate-900 border border-rose-500/30 text-rose-400 shadow-lg glow-rose">
            <Shield className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-wider text-white font-mono uppercase">
                CrimeNet OS <span className="text-rose-500 font-normal text-base">//</span> <span className="text-slate-300">Facility Control</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                DEFCON 4 ONLINE
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
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-64 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search inmate ID, name, crime..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 placeholder-slate-500 transition-all font-mono"
            />
          </div>

          {/* Security Tier Filter */}
          <div className="relative">
            <select
              value={securityFilter}
              onChange={(e) => setSecurityFilter(e.target.value)}
              className="appearance-none bg-slate-950/80 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 cursor-pointer font-mono"
            >
              <option value="ALL">All Security Tiers</option>
              <option value="Maximum">Maximum Tier</option>
              <option value="Medium">Medium Tier</option>
              <option value="Minimum">Minimum Tier</option>
              <option value="Isolation">Isolation Wing</option>
            </select>
            <Filter className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Incident Log Action */}
          <button
            onClick={onOpenIncidentModal}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold font-mono bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all duration-200 hover:border-slate-600 shadow-md active:scale-95"
            title="Log Incident Event"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Log Event</span>
          </button>

          {/* Intake New Record CTA */}
          <button
            onClick={onOpenIntakeModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white border border-rose-500/50 transition-all duration-200 shadow-lg shadow-rose-950/50 hover:shadow-rose-900/60 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Intake New Record</span>
          </button>
        </div>
      </div>

      {/* Operational Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Inmates"
          value={totalInmates}
          subtext="Capacity 1,200 (87.5%)"
          trend="up"
          trendValue="+2.4%"
          icon={Users}
          badgeColor="indigo"
        />

        <StatCard
          title="Active In-Custody"
          value={activeInCustody}
          subtext="Main Blocks & Isolation"
          trend="neutral"
          trendValue="Normal"
          icon={ShieldCheck}
          badgeColor="emerald"
        />

        <StatCard
          title="High-Alert / Isolation"
          value={highAlertFlags}
          subtext="Requires Escort Detail"
          trend="up"
          trendValue="+1 Flag"
          icon={ShieldAlert}
          badgeColor="rose"
        />

        <StatCard
          title="On-Duty Personnel"
          value={onDutyGuards}
          subtext="Shift Alpha-3 Armed"
          trend="up"
          trendValue="98.6%"
          icon={UserCheck}
          badgeColor="amber"
        />
      </div>
    </header>
  );
}
