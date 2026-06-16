import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Grid, TextField, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import { fetchDashboard } from '../features/dashboard/dashboardSlice.js';
import SummaryCard from '../components/SummaryCard.jsx';
import ExpensePieChart from '../components/ExpensePieChart.jsx';
import BudgetActualTable from '../components/BudgetActualTable.jsx';
import LoadingBox from '../components/LoadingBox.jsx';
import { currentMonth } from '../utils/constants.js';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);
  const [month, setMonth] = useState(currentMonth());

  useEffect(() => {
    dispatch(fetchDashboard(month));
  }, [dispatch, month]);

  return (
    <Box>
      <Box className="gradient-hero">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4">Financial Dashboard</Typography>
            <Typography sx={{ opacity: 0.9 }}>
              Track income, expenses, budget health, and category-wise spending.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="month"
              label="Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
            />
          </Grid>
        </Grid>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <LoadingBox text="Loading dashboard..." />}

      {!loading && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard title="Income" value={data?.totalIncome} icon={<TrendingUpIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard title="Expenses" value={data?.totalExpense} icon={<TrendingDownIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard title="Balance" value={data?.balance} icon={<AccountBalanceWalletIcon />} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryCard title="Remaining Budget" value={data?.remainingBudget} icon={<SavingsIcon />} />
          </Grid>
          <Grid item xs={12} lg={5}>
            <ExpensePieChart expenseByCategory={data?.expenseByCategory} />
          </Grid>
          <Grid item xs={12} lg={7}>
            <BudgetActualTable rows={data?.budgetVsActual || []} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
