import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider.jsx';


export default function RequireAuth({ children }) {

  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-6 text-gray-700">Loading…</div>;
  return isAuthenticated ? children : <Navigate to="/" replace />; // login is at "/"
}