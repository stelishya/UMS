import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');

const initialState = {
  user: null,
  token: token || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => { state.loading = true; },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => { 
        state.loading = true;
        state.error = null;
      },
      registerSuccess: (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
      },
      registerFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    }
  }
});

export const { 
    loginStart, 
    loginSuccess, 
    loginFailure, 
    registerStart, 
    registerSuccess, 
    registerFailure, 
    logout
} = authSlice.actions;

export default authSlice.reducer;
