import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert, Box, Button, Card, CardContent, IconButton, Stack, TextField, Typography
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { register } from '../features/auth/authSlice.js';
import { showToast } from '../features/ui/toastSlice.js';

export default function Register({ mode, toggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (token) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Account created successfully', severity: 'success' }));
      navigate('/dashboard');
    }
  };

  return (
    <Box className="auth-bg">
      <Card sx={{ width: '100%', maxWidth: 480 }} className="hover-card">
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4">Create account</Typography>
              <Typography color="text.secondary">Start tracking your finances today.</Typography>
            </Box>
            <IconButton onClick={toggleTheme}>{mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}</IconButton>
          </Stack>

          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} className="form-grid" sx={{ mt: 3 }}>
            <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required fullWidth />
            <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required fullWidth />
            <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required fullWidth helperText="Minimum 6 characters" />
            <Button variant="contained" size="large" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
            <Typography textAlign="center">Already registered? <Link to="/login">Login</Link></Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
