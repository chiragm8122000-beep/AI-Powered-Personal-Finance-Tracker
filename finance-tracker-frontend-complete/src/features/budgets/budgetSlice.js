import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient.js';

export const fetchBudgets = createAsyncThunk('budgets/fetchAll', async (month, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get(month ? `/budgets?month=${month}` : '/budgets');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to load budgets');
  }
});

export const createBudget = createAsyncThunk('budgets/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post('/budgets', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to create budget');
  }
});

export const updateBudget = createAsyncThunk('budgets/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put(`/budgets/${id}`, payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update budget');
  }
});

export const deleteBudget = createAsyncThunk('budgets/delete', async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/budgets/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete budget');
  }
});

const budgetSlice = createSlice({
  name: 'budgets',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBudgets.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchBudgets.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createBudget.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.items = state.items.map((item) => item.id === action.payload.id ? action.payload : item);
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  }
});

export default budgetSlice.reducer;
