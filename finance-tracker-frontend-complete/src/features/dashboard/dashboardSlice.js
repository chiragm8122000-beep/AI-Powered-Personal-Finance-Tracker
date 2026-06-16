import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient.js';

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async (month, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get(month ? `/dashboard/summary?month=${month}` : '/dashboard/summary');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to load dashboard');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDashboard.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
      .addCase(fetchDashboard.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export default dashboardSlice.reducer;
