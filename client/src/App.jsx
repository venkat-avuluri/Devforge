import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import ExploreEventsPage from './pages/ExploreEventsPage';
import PublicEventPage from './pages/PublicEventPage';
import LoginChoicePage from './pages/LoginChoicePage';
import OrganizerLoginPage from './pages/OrganizerLoginPage';
import OrganizerRegisterPage from './pages/OrganizerRegisterPage';
import ParticipantOtpPage from './pages/ParticipantOtpPage';
import AdminLoginPage from './pages/AdminLoginPage';
import OrganizerDashboard from './pages/OrganizerDashboard';
import EventBuilderPage from './pages/EventBuilderPage';
import EventRegistrationsPage from './pages/EventRegistrationsPage';
import ParticipantDashboard from './pages/ParticipantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

// Layout wrapper to selectively hide DevForge navbar on builder or standalone event pages
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isBuilderPage = location.pathname.includes('/organizer/events/') && (location.pathname.endsWith('/edit') || location.pathname.endsWith('/new'));
  const isPublicEventPage = location.pathname.startsWith('/events/') && location.pathname !== '/events';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {!isBuilderPage && !isPublicEventPage && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isBuilderPage && !isPublicEventPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/events" element={<ExploreEventsPage />} />
            <Route path="/events/:slug" element={<PublicEventPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginChoicePage />} />
            <Route path="/organizer/login" element={<OrganizerLoginPage />} />
            <Route path="/organizer/register" element={<OrganizerRegisterPage />} />
            <Route path="/participant/login" element={<ParticipantOtpPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Organizer Routes */}
            <Route
              path="/organizer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/new"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <EventBuilderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <EventBuilderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:id/registrations"
              element={
                <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                  <EventRegistrationsPage />
                </ProtectedRoute>
              }
            />

            {/* Participant Routes */}
            <Route
              path="/participant/dashboard"
              element={
                <ProtectedRoute allowedRoles={['participant', 'admin']}>
                  <ParticipantDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
