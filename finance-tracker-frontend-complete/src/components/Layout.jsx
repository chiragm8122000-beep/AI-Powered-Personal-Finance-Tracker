import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar, Avatar, Box, Button, Container, Divider, Drawer, IconButton,
  List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar,
  Tooltip, Typography, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SavingsIcon from '@mui/icons-material/Savings';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { logout } from '../features/auth/authSlice.js';
import { showToast } from '../features/ui/toastSlice.js';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Transactions', path: '/transactions', icon: <ReceiptLongIcon /> },
  { label: 'Budgets', path: '/budgets', icon: <SavingsIcon /> }
];

export default function Layout({ mode, toggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:900px)');
  const { name, email } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast({ message: 'Logged out successfully', severity: 'success' }));
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ width: 280, p: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
        <Avatar>{name?.[0]?.toUpperCase() || 'U'}</Avatar>
        <Box>
          <Typography fontWeight={800}>{name}</Typography>
          <Typography variant="body2" color="text.secondary">{email}</Typography>
        </Box>
      </Stack>

      <Divider sx={{ mb: 1 }} />

      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            component={Link}
            to={item.path}
            onClick={() => setDrawerOpen(false)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        <ListItemButton onClick={toggleTheme} sx={{ borderRadius: 2, mb: 0.5 }}>
          <ListItemIcon>{mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}</ListItemIcon>
          <ListItemText primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
        </ListItemButton>

        <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ backdropFilter: 'blur(12px)' }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 900 }}>
            Finance Tracker
          </Typography>

          {!isMobile && (
            <Stack direction="row" spacing={1} alignItems="center">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  variant={location.pathname === item.path ? 'outlined' : 'text'}
                >
                  {item.label}
                </Button>
              ))}

              <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                <IconButton color="inherit" onClick={toggleTheme}>
                  {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>

              <Avatar sx={{ width: 34, height: 34 }}>{name?.[0]?.toUpperCase() || 'U'}</Avatar>
              <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                Logout
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>

      <Box className="page">
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </>
  );
}
