import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import transactionReducer from '../features/transactions/transactionSlice.js';
import budgetReducer from '../features/budgets/budgetSlice.js';
import dashboardReducer from '../features/dashboard/dashboardSlice.js';
import toastReducer from '../features/ui/toastSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    budgets: budgetReducer,
    dashboard: dashboardReducer,
    toast: toastReducer
  }
});
