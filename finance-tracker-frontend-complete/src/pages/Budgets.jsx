import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert, Box, Button, Card, CardContent, Grid, MenuItem, Stack, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import { createBudget, deleteBudget, fetchBudgets, updateBudget } from '../features/budgets/budgetSlice.js';
import { showToast } from '../features/ui/toastSlice.js';
import LoadingBox from '../components/LoadingBox.jsx';
import { CATEGORIES, currentMonth, formatCurrency } from '../utils/constants.js';

const emptyForm = { category: 'FOOD', limitAmount: '', month: currentMonth() };

export default function Budgets() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.budgets);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [monthFilter, setMonthFilter] = useState(currentMonth());

  useEffect(() => { dispatch(fetchBudgets(monthFilter)); }, [dispatch, monthFilter]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form, limitAmount: Number(form.limitAmount) };

    const result = editingId
      ? await dispatch(updateBudget({ id: editingId, payload }))
      : await dispatch(createBudget(payload));

    if (createBudget.fulfilled.match(result) || updateBudget.fulfilled.match(result)) {
      dispatch(showToast({ message: editingId ? 'Budget updated' : 'Budget created', severity: 'success' }));
      setEditingId(null);
      setForm({ ...emptyForm, month: monthFilter });
      dispatch(fetchBudgets(monthFilter));
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteBudget(id));
    if (deleteBudget.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Budget deleted', severity: 'success' }));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ category: item.category, limitAmount: item.limitAmount, month: item.month });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Budgets</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Create monthly category-wise budgets and compare actual spending.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} lg={4}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>{editingId ? 'Edit Budget' : 'Create Budget'}</Typography>
              <Box component="form" onSubmit={handleSubmit} className="form-grid">
                <TextField select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth>
                  {CATEGORIES.map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
                </TextField>
                <TextField label="Limit Amount" type="number" value={form.limitAmount} onChange={(e) => setForm({ ...form, limitAmount: e.target.value })} required fullWidth />
                <TextField label="Month" type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} InputLabelProps={{ shrink: true }} required fullWidth />
                <Button variant="contained" size="large" type="submit">{editingId ? 'Update' : 'Create'}</Button>
                {editingId && <Button variant="outlined" onClick={() => { setEditingId(null); setForm({ ...emptyForm, month: monthFilter }); }}>Cancel</Button>}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card className="hover-card">
            <CardContent>
              <TextField
                label="Filter Month"
                type="month"
                value={monthFilter}
                onChange={(e) => {
                  setMonthFilter(e.target.value);
                  setForm((prev) => ({ ...prev, month: e.target.value }));
                }}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />

              {loading ? <LoadingBox text="Loading budgets..." /> : (
                <TableContainer className="mobile-table">
                  <Table size="small" sx={{ minWidth: 620 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Month</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Limit</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.month}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{formatCurrency(item.limitAmount)}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button size="small" onClick={() => handleEdit(item)}>Edit</Button>
                              <Button size="small" color="error" onClick={() => handleDelete(item.id)}>Delete</Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      {items.length === 0 && <TableRow><TableCell colSpan={4}>No budgets found.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
