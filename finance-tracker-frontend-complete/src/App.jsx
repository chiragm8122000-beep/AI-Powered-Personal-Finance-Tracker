import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Budgets from './pages/Budgets.jsx';
import Layout from './components/Layout.jsx';
import ToastNotifier from './components/ToastNotifier.jsx';

function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App({ mode, toggleTheme }) {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login mode={mode} toggleTheme={toggleTheme} />} />
        <Route path="/register" element={<Register mode={mode} toggleTheme={toggleTheme} />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout mode={mode} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="budgets" element={<Budgets />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastNotifier />
    </>
  );
}
