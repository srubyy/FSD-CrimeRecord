import { createSlice } from '@reduxjs/toolkit';

// Default initial demo admin user session for practical convenience
const defaultUser = {
  username: 'admin_vance',
  role: 'Admin',
};

const loadInitialAuth = () => {
  try {
    const savedToken = localStorage.getItem('crimenet_token');
    const savedUser = localStorage.getItem('crimenet_user');
    if (savedToken && savedUser) {
      return {
        token: savedToken,
        user: JSON.parse(savedUser),
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error reading auth state from localStorage:', error);
  }
  return {
    token: 'demo_token_admin_vance',
    user: defaultUser,
    isAuthenticated: true,
  };
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialAuth(),
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      try {
        localStorage.setItem('crimenet_token', action.payload.token);
        localStorage.setItem('crimenet_user', JSON.stringify(action.payload.user));
      } catch (error) {
        console.error('Error persisting auth state to localStorage:', error);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem('crimenet_token');
        localStorage.removeItem('crimenet_user');
      } catch (error) {
        console.error('Error clearing auth state from localStorage:', error);
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
