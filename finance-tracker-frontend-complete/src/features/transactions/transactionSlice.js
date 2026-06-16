import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient.js';

export const fetchTransactions = createAsyncThunk('transactions/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get('/transactions');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to load transactions');
  }
});

export const createTransaction = createAsyncThunk('transactions/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post('/transactions', payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to create transaction');
  }
});

export const updateTransaction = createAsyncThunk('transactions/update', async ({ id, payload }, { rejectWithValue }) => {
  try {
    const response = await axiosClient.put(`/transactions/${id}`, payload);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update transaction');
  }
});

export const deleteTransaction = createAsyncThunk('transactions/delete', async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/transactions/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete transaction');
  }
});

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTransactions.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchTransactions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTransaction.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.items = state.items.map((item) => item.id === action.payload.id ? action.payload : item);
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  }
});

export default transactionSlice.reducer;
