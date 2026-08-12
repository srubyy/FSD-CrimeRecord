import React, { useState, useEffect, useContext } from 'react';
import TopNav from './components/TopNav.jsx';
import InmateTable from './components/InmateTable.jsx';
import AuditSidebar from './components/AuditSidebar.jsx';
import IntakeModal from './components/IntakeModal.jsx';
import InmateDetailDrawer from './components/InmateDetailDrawer.jsx';
import IncidentModal from './components/IncidentModal.jsx';
import { INITIAL_INMATES, INITIAL_AUDIT_LOGS } from './data/mockInmates.js';
import { AppContext } from './context/AppContext.jsx';
import usePersistedState from './hooks/usePersistedState.js';

export default function App() {
  // Persisted state stored in localStorage via custom hook (useEffect + localStorage)
  const [inmates, setInmates] = usePersistedState('crimenet_inmates', INITIAL_INMATES);
  const [auditLogs, setAuditLogs] = usePersistedState('crimenet_audit_logs', INITIAL_AUDIT_LOGS);

  // Consume global UI context (useContext)
  const { isDarkMode, searchTerm, securityFilter } = useContext(AppContext);

  // Modal & Drawer State (Local to App.jsx)
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [selectedInmate, setSelectedInmate] = useState(null);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidentInmateTarget, setIncidentInmateTarget] = useState(null);

  // Sync dark class on html root element (useEffect)
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Derived metrics
  const totalInmates = inmates.length;
  const activeInCustody = inmates.filter(i => i.status === 'Active').length;
  const highAlertFlags = inmates.filter(i => i.securityTier === 'Maximum' || i.securityTier === 'Isolation').length;
  const onDutyGuards = 42;

  // Filtered inmates by search and dropdown
  const searchedInmates = inmates.filter(inmate => {
    const matchesSearch = 
      inmate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inmate.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inmate.crimeCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inmate.cellBlock.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSecurity = 
      securityFilter === 'ALL' || inmate.securityTier === securityFilter;

    return matchesSearch && matchesSecurity;
  });

  // Handler for adding a new inmate record
  const handleIntakeSubmit = (newRecord) => {
    setInmates(prev => [newRecord, ...prev]);

    const auditEntry = {
      id: `LOG-${Math.floor(9000 + Math.random() * 999)}`,
      timestamp: 'Just now',
      user: 'Intake Officer (Terminal #01)',
      action: 'New Prisoner Intake Registered',
      target: `Inmate ${newRecord.fullName} (${newRecord.id})`,
      type: 'intake',
      severity: newRecord.securityTier === 'Maximum' ? 'rose' : 'emerald',
      details: `Assigned to ${newRecord.cellBlock}. Security Tier: ${newRecord.securityTier}.`
    };

    setAuditLogs(prev => [auditEntry, ...prev]);
  };

  // Handler for posting a new incident log
  const handleIncidentSubmit = (newLog) => {
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Open incident modal for a specific inmate
  const handleOpenIncidentForInmate = (inmate) => {
    setIncidentInmateTarget(inmate);
    setIsIncidentModalOpen(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
        
        {/* Top Header & Quiet Stat Row */}
        <TopNav
          onOpenIntakeModal={() => setIsIntakeOpen(true)}
          onOpenIncidentModal={() => {
            setIncidentInmateTarget(null);
            setIsIncidentModalOpen(true);
          }}
          totalInmates={totalInmates}
          activeInCustody={activeInCustody}
          highAlertFlags={highAlertFlags}
          onDutyGuards={onDutyGuards}
        />

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Content Area (Directory Table) */}
          <section className="lg:col-span-8">
            <InmateTable
              inmates={searchedInmates}
              onSelectInmate={setSelectedInmate}
              onLogIncidentForInmate={handleOpenIncidentForInmate}
            />
          </section>

          {/* Audit Stream Sidebar */}
          <section className="lg:col-span-4">
            <AuditSidebar
              logs={auditLogs}
              onOpenIncidentModal={() => {
                setIncidentInmateTarget(null);
                setIsIncidentModalOpen(true);
              }}
            />
          </section>

        </main>

        {/* Interactive Modals */}
        <IntakeModal
          isOpen={isIntakeOpen}
          onClose={() => setIsIntakeOpen(false)}
          onSubmit={handleIntakeSubmit}
        />

        <InmateDetailDrawer
          inmate={selectedInmate}
          onClose={() => setSelectedInmate(null)}
          onLogIncident={handleOpenIncidentForInmate}
        />

        <IncidentModal
          isOpen={isIncidentModalOpen}
          onClose={() => setIsIncidentModalOpen(false)}
          onSubmit={handleIncidentSubmit}
          selectedInmate={incidentInmateTarget}
        />

      </div>
    </div>
  );
}

