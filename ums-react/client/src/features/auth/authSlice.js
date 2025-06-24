import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import * as authAPI from './authAPI';
// const token = localStorage.getItem('token');

// Async Thunks
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await authAPI.registerUser(userData);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authAPI.loginUser(credentials);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    const response = await authAPI.updateUserProfile(userData);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Profile update failed');
  }
});

export const adminLogin = createAsyncThunk('auth/adminLogin', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authAPI.adminLoginUser(credentials);
    console.log("response in adminLogin",response)
    return response;
  } catch (error) {
    console.log("error in adminLogin",error)
    return rejectWithValue(error.response?.data?.message || 'Admin login failed');
  }
});

const initialState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // loginStart: (state) => { 
    //   state.loading = true;
    //   state.error = null;
    //  },
    // loginSuccess: (state, action) => {
    //   state.loading = false;
    //   state.accessToken = action.payload.accessToken;
    //   state.user = action.payload.user;
    //   state.error = null;
    //   // localStorage.setItem('accessToken', action.payload.accessToken);
    // },
    // loginFailure: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    //   state.user = null;
    //   state.accessToken = null;
    // },
    // registerStart: (state) => { 
    //     state.loading = true;
    //     state.error = null;
    //   },
    //   registerSuccess: (state, action) => {
    //     state.loading = false;
    //     state.accessToken = action.payload.accessToken;
    //     state.user = action.payload.user;
    //     state.error = null;
    //     // localStorage.setItem('token', action.payload.token);
    //   },
    //   registerFailure: (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      // localStorage.removeItem('token');
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
    },
    extraReducers: (builder) => {
      builder
        .addCase(register.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
        })
        .addCase(register.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(login.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
        })
        .addCase(login.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.user = null;
          state.accessToken = null;
        })
        .addCase(updateProfile.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(updateProfile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(adminLogin.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(adminLogin.fulfilled, (state, action) => {
          console.log('Admin login fulfilled. Payload:',action.payload)
          state.loading = false;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
        })
        .addCase(adminLogin.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.user = null;
          state.accessToken = null;
        });
    },
});

export const { 
    // loginStart, 
    // loginSuccess, 
    // loginFailure, 
    // registerStart, 
    // registerSuccess, 
    // registerFailure, 
    logout,
    setTokens,
} = authSlice.actions;

export default authSlice.reducer;
