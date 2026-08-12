import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TopNav from './components/TopNav.jsx';
import InmateTable from './components/InmateTable.jsx';
import AuditSidebar from './components/AuditSidebar.jsx';
import IntakeModal from './components/IntakeModal.jsx';
import InmateDetailDrawer from './components/InmateDetailDrawer.jsx';
import IncidentModal from './components/IncidentModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import { AppContext } from './context/AppContext.jsx';
import { addInmate, deleteInmate } from './store/inmatesSlice.js';
import { addAuditLog } from './store/auditLogsSlice.js';

export default function App() {
  const dispatch = useDispatch();

  // Redux domain state
  const inmates = useSelector(state => state.inmates);
  const auditLogs = useSelector(state => state.auditLogs);
  const currentUser = useSelector(state => state.auth.user);

  // Consume global UI context (useContext)
  const { isDarkMode, searchTerm, securityFilter } = useContext(AppContext);

  // Modal & Drawer State (Local to App.jsx)
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [selectedInmate, setSelectedInmate] = useState(null);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidentInmateTarget, setIncidentInmateTarget] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  // Handler for adding a new inmate record via Redux dispatch
  const handleIntakeSubmit = (newRecord) => {
    dispatch(addInmate(newRecord));

    const auditEntry = {
      id: `LOG-${Math.floor(9000 + Math.random() * 999)}`,
      timestamp: 'Just now',
      user: `${currentUser?.username || 'Staff'} (${currentUser?.role || 'Officer'})`,
      action: 'New Prisoner Intake Registered',
      target: `Inmate ${newRecord.fullName} (${newRecord.id})`,
      type: 'intake',
      severity: newRecord.securityTier === 'Maximum' ? 'rose' : 'emerald',
      details: `Assigned to ${newRecord.cellBlock}. Security Tier: ${newRecord.securityTier}.`
    };

    dispatch(addAuditLog(auditEntry));
  };

  // Handler for deleting an inmate record (Admin only)
  const handleDeleteInmate = (inmateToDelete) => {
    if (currentUser?.role !== 'Admin') {
      alert('Access Denied: Only Admin users can expunge inmate records.');
      return;
    }

    if (window.confirm(`Are you sure you want to expunge record ${inmateToDelete.id} (${inmateToDelete.fullName})?`)) {
      dispatch(deleteInmate(inmateToDelete.id));

      const auditEntry = {
        id: `LOG-${Math.floor(9000 + Math.random() * 999)}`,
        timestamp: 'Just now',
        user: `${currentUser?.username} (Admin)`,
        action: 'Prisoner Record Permanently Expunged',
        target: `Inmate ${inmateToDelete.fullName} (${inmateToDelete.id})`,
        type: 'alert',
        severity: 'rose',
        details: `Record ${inmateToDelete.id} expunged from system DB by Admin.`
      };

      dispatch(addAuditLog(auditEntry));
    }
  };

  // Handler for posting a new incident log via Redux dispatch
  const handleIncidentSubmit = (newLog) => {
    const formattedLog = {
      ...newLog,
      user: `${currentUser?.username || 'Staff'} (${currentUser?.role || 'Officer'})`,
    };
    dispatch(addAuditLog(formattedLog));
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
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
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
              onDeleteInmate={handleDeleteInmate}
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
          onDeleteInmate={handleDeleteInmate}
        />

        <IncidentModal
          isOpen={isIncidentModalOpen}
          onClose={() => setIsIncidentModalOpen(false)}
          onSubmit={handleIncidentSubmit}
          selectedInmate={incidentInmateTarget}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />

      </div>
    </div>
  );
}
