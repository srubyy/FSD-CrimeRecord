import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TopNav from './components/TopNav.jsx';
import InmateTable from './components/InmateTable.jsx';
import AuditSidebar from './components/AuditSidebar.jsx';
import IntakeModal from './components/IntakeModal.jsx';
import InmateDetailDrawer from './components/InmateDetailDrawer.jsx';
import IncidentModal from './components/IncidentModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import ToastNotification from './components/ToastNotification.jsx';
import { AppContext } from './context/AppContext.jsx';
import { addInmate, updateInmate, deleteInmate } from './store/inmatesSlice.js';
import { addAuditLog } from './store/auditLogsSlice.js';
import { useSocket } from './hooks/useSocket.js';

export default function App() {
  const dispatch = useDispatch();

  // Redux domain state
  const inmates = useSelector((state) => state.inmates);
  const auditLogs = useSelector((state) => state.auditLogs);
  const currentUser = useSelector((state) => state.auth.user);

  // Global UI context
  const { isDarkMode, searchTerm, securityFilter } = useContext(AppContext);

  // Modal & Drawer State
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [selectedInmate, setSelectedInmate] = useState(null);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
  const [incidentInmateTarget, setIncidentInmateTarget] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((toastData) => {
    setToast(toastData);
    setTimeout(() => {
      setToast(prev => (prev === toastData ? null : prev));
    }, 4500);
  }, []);

  // WebSockets Real-Time Integration
  const { socket, isConnected } = useSocket();
  const [onlineStaff, setOnlineStaff] = useState([]);

  // Socket event subscriptions for live multi-client broadcast
  useEffect(() => {
    if (!socket) return;

    const handleInmateCreated = (newInmate) => {
      dispatch(addInmate(newInmate));
      showToast({
        type: 'info',
        title: 'Registry Broadcast',
        message: `Offender ${newInmate.fullName} admitted via network terminal.`
      });
    };

    const handleInmateUpdated = (updatedInmate) => {
      dispatch(updateInmate(updatedInmate));
    };

    const handleInmateDeleted = (inmateId) => {
      dispatch(deleteInmate(inmateId));
    };

    const handleAuditLogCreated = (newLog) => {
      dispatch(addAuditLog(newLog));
      if (newLog.severity === 'rose') {
        showToast({
          type: 'error',
          title: 'Critical Alert',
          message: newLog.action
        });
      }
    };

    const handlePresenceUpdate = (staffList) => {
      setOnlineStaff(staffList);
    };

    socket.on('inmate:created', handleInmateCreated);
    socket.on('inmate:updated', handleInmateUpdated);
    socket.on('inmate:deleted', handleInmateDeleted);
    socket.on('auditlog:created', handleAuditLogCreated);
    socket.on('presence:update', handlePresenceUpdate);

    return () => {
      socket.off('inmate:created', handleInmateCreated);
      socket.off('inmate:updated', handleInmateUpdated);
      socket.off('inmate:deleted', handleInmateDeleted);
      socket.off('auditlog:created', handleAuditLogCreated);
      socket.off('presence:update', handlePresenceUpdate);
    };
  }, [socket, dispatch, showToast]);

  // Sync dark class on html root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Derived metrics
  const totalInmates = inmates.length;
  const activeInCustody = inmates.filter((i) => i.status === 'Active').length;
  const highAlertFlags = inmates.filter((i) => i.securityTier === 'Maximum' || i.securityTier === 'Isolation').length;
  const onDutyGuards = 42;

  // Filtered inmates by search and dropdown
  const searchedInmates = inmates.filter((inmate) => {
    const matchesSearch =
      inmate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inmate.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inmate.crimeCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inmate.cellBlock.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSecurity = securityFilter === 'ALL' || inmate.securityTier === securityFilter;

    return matchesSearch && matchesSecurity;
  });

  // Handler for adding a new inmate record via Redux dispatch
  const handleIntakeSubmit = (newRecord) => {
    dispatch(addInmate(newRecord));

    const auditEntry = {
      id: `LOG-${Math.floor(9000 + Math.random() * 999)}`,
      timestamp: 'Just now',
      user: `${currentUser?.username || 'Staff'} (${currentUser?.role || 'Officer'})`,
      action: 'Offender Custody Intake Completed',
      target: `Inmate ${newRecord.fullName} (${newRecord.id})`,
      type: 'intake',
      severity: newRecord.securityTier === 'Maximum' || newRecord.securityTier === 'Isolation' ? 'rose' : 'emerald',
      details: `Assigned to ${newRecord.cellBlock} (${newRecord.cellNumber}). Tier: ${newRecord.securityTier}.`,
    };

    dispatch(addAuditLog(auditEntry));
    showToast({
      type: 'success',
      title: 'Offender Intake Registered',
      message: `${newRecord.fullName} (${newRecord.id}) booked into ${newRecord.cellBlock}.`
    });
  };

  // Handler for deleting an inmate record (Admin only)
  const handleDeleteInmate = (inmateToDelete) => {
    if (currentUser?.role !== 'Admin') {
      showToast({
        type: 'error',
        title: 'Access Denied',
        message: 'Expungement requires Administrator credentials.'
      });
      return;
    }

    if (window.confirm(`Expunge custody record for ${inmateToDelete.id} (${inmateToDelete.fullName})? This action cannot be reversed.`)) {
      dispatch(deleteInmate(inmateToDelete.id));

      const auditEntry = {
        id: `LOG-${Math.floor(9000 + Math.random() * 999)}`,
        timestamp: 'Just now',
        user: `${currentUser?.username} (Admin)`,
        action: 'Custody Record Expunged from Registry',
        target: `Inmate ${inmateToDelete.fullName} (${inmateToDelete.id})`,
        type: 'alert',
        severity: 'rose',
        details: `Official custody record ${inmateToDelete.id} expunged by Administrator authorization.`,
      };

      dispatch(addAuditLog(auditEntry));
      showToast({
        type: 'info',
        title: 'Record Expunged',
        message: `Custody record ${inmateToDelete.id} permanently removed.`
      });
    }
  };

  // Handler for posting a new incident log via Redux dispatch
  const handleIncidentSubmit = (newLog) => {
    const formattedLog = {
      ...newLog,
      user: `${currentUser?.username || 'Staff'} (${currentUser?.role || 'Officer'})`,
    };
    dispatch(addAuditLog(formattedLog));
    showToast({
      type: 'success',
      title: 'Incident Telemetry Dispatched',
      message: `${formattedLog.action} successfully broadcast.`
    });
  };

  // Open incident modal for a specific inmate
  const handleOpenIncidentForInmate = (inmate) => {
    setIncidentInmateTarget(inmate);
    setIsIncidentModalOpen(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-150 ${isDarkMode ? 'dark bg-[#0F141C] text-[#F1F4F8]' : 'bg-[#F5F7FA] text-[#172033]'}`}>
      {/* Top Header full-bleed */}
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
        onlineStaff={onlineStaff}
        isSocketConnected={isConnected}
      />

      {/* Main Body - Full Width Edge-to-Edge with minimal margin waste */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5 font-sans">
        {/* Main Content Grid (Primary Directory / Audit Stream) */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
          {/* Main Directory Table */}
          <section className="lg:col-span-8 xl:col-span-8 2xl:col-span-9">
            <InmateTable
              inmates={searchedInmates}
              onSelectInmate={setSelectedInmate}
              onLogIncidentForInmate={handleOpenIncidentForInmate}
              onDeleteInmate={handleDeleteInmate}
            />
          </section>

          {/* Secondary Audit Stream */}
          <section className="lg:col-span-4 xl:col-span-4 2xl:col-span-3">
            <AuditSidebar
              logs={auditLogs}
              onOpenIncidentModal={() => {
                setIncidentInmateTarget(null);
                setIsIncidentModalOpen(true);
              }}
            />
          </section>
        </main>

        {/* Modals & Drawers */}
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
          onShowToast={showToast}
        />

        {/* Minimalist Toast Feedback */}
        <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
      </div>
    </div>
  );
}
