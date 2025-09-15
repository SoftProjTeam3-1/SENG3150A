import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-6 text-gray-700">Loading…</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />; // login is at "/"
} 