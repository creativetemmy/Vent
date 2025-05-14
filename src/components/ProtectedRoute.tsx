
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFarcasterAuth } from '@/hooks/useFarcasterAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, status, isLoading } = useFarcasterAuth();

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen bg-vent-bg flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, redirect to auth page
  if (status !== 'connected' || !user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
