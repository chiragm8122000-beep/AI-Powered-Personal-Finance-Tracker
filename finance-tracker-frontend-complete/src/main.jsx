import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';
import { store } from './store/store.js';
import './styles.css';

function Root() {
  const [mode, setMode] = useState(localStorage.getItem('theme_mode') || 'light');

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#2563eb' },
      secondary: { main: '#10b981' },
      background: {
        default: mode === 'light' ? '#f5f7fb' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#111827'
      }
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: 'Inter, system-ui, Arial, sans-serif',
      h4: { fontWeight: 800 },
      h5: { fontWeight: 800 },
      h6: { fontWeight: 700 }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light'
              ? '0 10px 30px rgba(15, 23, 42, 0.08)'
              : '0 10px 30px rgba(0, 0, 0, 0.35)'
          }
        }
      }
    }
  }), [mode]);

  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    localStorage.setItem('theme_mode', next);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App mode={mode} toggleTheme={toggleTheme} />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
