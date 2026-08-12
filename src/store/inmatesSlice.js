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
      state.unshift(action.payload);
    },
    deleteInmate: (state, action) => {
      return state.filter((inmate) => inmate.id !== action.payload);
    },
  },
});

export const { addInmate, deleteInmate } = inmatesSlice.actions;
export default inmatesSlice.reducer;
