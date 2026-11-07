import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('devforge_token') || null);
  const [loading, setLoading] = useState(true);

  // Check current session on mount or token change
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('devforge_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/api/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        localStorage.removeItem('devforge_token');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Login for Organizer or Admin (email + password)
  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('devforge_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true, user: newUser };
    }
    return { success: false, message: res.data.message };
  };

  // Register Organizer
  const registerOrganizer = async (data) => {
    const res = await api.post('/api/auth/register', data);
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('devforge_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true, user: newUser };
    }
    return { success: false, message: res.data.message };
  };

  // Request Participant OTP
  const requestOtp = async (identifier) => {
    const res = await api.post('/api/auth/participant/request-otp', { identifier });
    return res.data;
  };

  // Verify Participant OTP
  const verifyOtp = async (payload) => {
    const res = await api.post('/api/auth/participant/verify-otp', payload);
    if (res.data.success) {
      const { token: newToken, user: newUser, isNewUser } = res.data;
      localStorage.setItem('devforge_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return { success: true, user: newUser, isNewUser };
    }
    return { success: false, message: res.data.message };
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('devforge_token');
    setToken(null);
    setUser(null);
  };

  // Helper helper to get dashboard route for user role
  const getDashboardUrl = (targetRole) => {
    const currentRole = targetRole || (user ? user.role : null);
    if (currentRole === 'admin') return '/admin/dashboard';
    if (currentRole === 'organizer') return '/organizer/dashboard';
    if (currentRole === 'participant') return '/participant/dashboard';
    return '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        registerOrganizer,
        requestOtp,
        verifyOtp,
        logout,
        getDashboardUrl,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isOrganizer: user?.role === 'organizer',
        isParticipant: user?.role === 'participant',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
