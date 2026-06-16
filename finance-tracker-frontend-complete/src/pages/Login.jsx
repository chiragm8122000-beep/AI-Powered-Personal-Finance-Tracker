import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert, Box, Button, Card, CardContent, IconButton, Stack, TextField, Typography
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { login } from '../features/auth/authSlice.js';
import { showToast } from '../features/ui/toastSlice.js';

export default function Login({ mode, toggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  if (token) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Login successful', severity: 'success' }));
      navigate('/dashboard');
    }
  };

  return (
    <Box className="auth-bg">
      <Card sx={{ width: '100%', maxWidth: 460 }} className="hover-card">
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4">Welcome back</Typography>
              <Typography color="text.secondary">Login to manage your money.</Typography>
            </Box>
            <IconButton onClick={toggleTheme}>{mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>
          </Stack>

          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} className="form-grid" sx={{ mt: 3 }}>
            <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required fullWidth />
            <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required fullWidth />
            <Button variant="contained" size="large" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Typography textAlign="center">New user? <Link to="/register">Create account</Link></Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
