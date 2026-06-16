import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert, Box, Button, Card, CardContent, Grid, MenuItem, Stack, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import { createTransaction, deleteTransaction, fetchTransactions, updateTransaction } from '../features/transactions/transactionSlice.js';
import { showToast } from '../features/ui/toastSlice.js';
import LoadingBox from '../components/LoadingBox.jsx';
import { CATEGORIES, formatCurrency, today, TRANSACTION_TYPES } from '../utils/constants.js';

const emptyForm = { amount: '', description: '', category: 'FOOD', type: 'EXPENSE', transactionDate: today() };

export default function Transactions() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.transactions);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => { dispatch(fetchTransactions()); }, [dispatch]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, categoryFilter]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };

    const result = editingId
      ? await dispatch(updateTransaction({ id: editingId, payload }))
      : await dispatch(createTransaction(payload));

    if (createTransaction.fulfilled.match(result) || updateTransaction.fulfilled.match(result)) {
      dispatch(showToast({ message: editingId ? 'Transaction updated' : 'Transaction added', severity: 'success' }));
      setForm(emptyForm);
      setEditingId(null);
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(deleteTransaction(id));
    if (deleteTransaction.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Transaction deleted', severity: 'success' }));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      amount: item.amount,
      description: item.description,
      category: item.category,
      type: item.type,
      transactionDate: item.transactionDate
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Transactions</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Add, edit, search, filter, and manage income and expenses.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} lg={4}>
          <Card className="hover-card">
            <CardContent>
              <Typography variant="h6" gutterBottom>{editingId ? 'Edit Transaction' : 'Add Transaction'}</Typography>
              <Box component="form" onSubmit={handleSubmit} className="form-grid">
                <TextField label="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required fullWidth />
                <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required fullWidth />
                <TextField select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth>
                  {CATEGORIES.map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
                </TextField>
                <TextField select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} fullWidth>
                  {TRANSACTION_TYPES.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>
                <TextField label="Date" type="date" value={form.transactionDate} onChange={(e) => setForm({ ...form, transactionDate: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
                <Button variant="contained" size="large" type="submit">{editingId ? 'Update' : 'Add'}</Button>
                {editingId && <Button variant="outlined" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</Button>}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card className="hover-card">
            <CardContent>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField label="Search description" value={search} onChange={(e) => setSearch(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField select label="Filter category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} fullWidth>
                    <MenuItem value="">All</MenuItem>
                    {CATEGORIES.map((category) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
                  </TextField>
                </Grid>
              </Grid>

              {loading ? <LoadingBox text="Loading transactions..." /> : (
                <TableContainer className="mobile-table">
                  <Table size="small" sx={{ minWidth: 760 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.transactionDate}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button size="small" onClick={() => handleEdit(item)}>Edit</Button>
                              <Button size="small" color="error" onClick={() => handleDelete(item.id)}>Delete</Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredItems.length === 0 && <TableRow><TableCell colSpan={6}>No transactions found.</TableCell></TableRow>}
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
