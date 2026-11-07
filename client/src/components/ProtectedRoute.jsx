import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated, getDashboardUrl } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium text-sm">Authenticating session...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to login choice or specific login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-6 text-sm">
            You are logged in as <span className="font-semibold capitalize text-slate-800">{user.role}</span>.
            This section is restricted to <span className="font-semibold text-slate-800">{allowedRoles.join(', ')}</span> accounts only.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href={getDashboardUrl(user.role)}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition text-center shadow-sm"
            >
              Go to Your Dashboard
            </a>
            <a
              href="/"
              className="w-full py-2.5 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl transition text-center"
            >
              Back to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
