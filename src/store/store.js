import { configureStore } from '@reduxjs/toolkit';
import inmatesReducer from './inmatesSlice.js';
import auditLogsReducer from './auditLogsSlice.js';

export const store = configureStore({
  reducer: {
    inmates: inmatesReducer,
    auditLogs: auditLogsReducer,
  },
});

// Subscribe to store updates to persist inmates and auditLogs to localStorage
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem('crimenet_inmates', JSON.stringify(state.inmates));
    localStorage.setItem('crimenet_audit_logs', JSON.stringify(state.auditLogs));
  } catch (error) {
    console.error('Error persisting Redux store state to localStorage:', error);
  }
});
