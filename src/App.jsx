import React, { useState } from 'react';
import TopNav from './components/TopNav.jsx';
import InmateTable from './components/InmateTable.jsx';
import AuditSidebar from './components/AuditSidebar.jsx';
import IntakeModal from './components/IntakeModal.jsx';
import InmateDetailDrawer from './components/InmateDetailDrawer.jsx';
import IncidentModal from './components/IncidentModal.jsx';
import { INITIAL_INMATES, INITIAL_AUDIT_LOGS } from './data/mockInmates.js';

export default function App() {
  const [inmates, setInmates] = useState(INITIAL_INMATES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  
  // Filtering & Tab state
  const [searchTerm, setSearchTerm] = useState('');
  const [securityFilter, setSecurityFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('ALL');

  // Modal & Drawer State
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [selectedInmate, setSelectedInmate] = useState(null);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidentInmateTarget, setIncidentInmateTarget] = useState(null);

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

    // Also log to audit stream
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-5">
      
      {/* Top Header & Operational Metrics */}
      <TopNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        securityFilter={securityFilter}
        setSecurityFilter={setSecurityFilter}
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

      {/* Main Grid: Directory Table & Audit Sidebar matching heights */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Main Content Area (Table Grid) */}
        <section className="lg:col-span-8">
          <InmateTable
            inmates={searchedInmates}
            onSelectInmate={setSelectedInmate}
            onLogIncidentForInmate={handleOpenIncidentForInmate}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
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

      {/* Interactive Modals & Slide-Over Drawers */}
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
  );
}
