import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient.js';

const savedAuth = localStorage.getItem('finance_auth');

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post('/auth/login', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post('/auth/register', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...(savedAuth ? JSON.parse(savedAuth) : { token: null, userId: null, name: null, email: null }),
    loading: false,
    error: null
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.userId = null;
      state.name = null;
      state.email = null;
      state.error = null;
      localStorage.removeItem('finance_auth');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.name = action.payload.name;
        state.email = action.payload.email;
        localStorage.setItem('finance_auth', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.name = action.payload.name;
        state.email = action.payload.email;
        localStorage.setItem('finance_auth', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
