import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_INMATES } from '../data/mockInmates.js';

// Helper to load initial inmates from localStorage or fallback to mock data
const loadInitialInmates = () => {
  try {
    const saved = localStorage.getItem('crimenet_inmates');
    if (saved !== null) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error reading crimenet_inmates from localStorage:', error);
  }
  return INITIAL_INMATES;
};

export const inmatesSlice = createSlice({
  name: 'inmates',
  initialState: loadInitialInmates(),
  reducers: {
    addInmate: (state, action) => {
      // Check if inmate already exists to prevent duplicate insertion
      const exists = state.some((i) => i.id === action.payload.id);
      if (!exists) {
        state.unshift(action.payload);
      }
    },
    updateInmate: (state, action) => {
      const index = state.findIndex((i) => i.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    deleteInmate: (state, action) => {
      return state.filter((inmate) => inmate.id !== action.payload);
    },
  },
});

export const { addInmate, updateInmate, deleteInmate } = inmatesSlice.actions;
export default inmatesSlice.reducer;
