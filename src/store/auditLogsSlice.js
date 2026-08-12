import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_AUDIT_LOGS } from '../data/mockInmates.js';

// Helper to load initial audit logs from localStorage or fallback to mock data
const loadInitialAuditLogs = () => {
  try {
    const saved = localStorage.getItem('crimenet_audit_logs');
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error reading crimenet_audit_logs from localStorage:', error);
  }
  return INITIAL_AUDIT_LOGS;
};

export const auditLogsSlice = createSlice({
  name: 'auditLogs',
  initialState: loadInitialAuditLogs(),
  reducers: {
    addAuditLog: (state, action) => {
      state.unshift(action.payload);
    },
  },
});

export const { addAuditLog } = auditLogsSlice.actions;
export default auditLogsSlice.reducer;
