
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import GroupingPage from './pages/GroupingPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/LoadingSpinner';

function ProtectedRoute({
  children,
  role
}: {
  children: React.ReactNode;
  role?: 'student' | 'admin';
}) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setCheckingAuth(false), 500); // simulate auth check
    return () => clearTimeout(timer);
  }, []);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/student"
        element={
          // <ProtectedRoute role="student">
            <StudentDashboard />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/grouping"
        element={
          // <ProtectedRoute role="student">
            <GroupingPage />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
