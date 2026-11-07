import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Compass,
  CalendarPlus,
  Ticket,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Layers,
  ChevronRight,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, getDashboardUrl } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                DevForge
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                Campus Events
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/events"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
            >
              <Compass className="w-4 h-4" />
              Discover Events
            </Link>

            {/* Authenticated Role Specific Links */}
            {isAuthenticated && user?.role === 'organizer' && (
              <>
                <Link
                  to="/organizer/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
                >
                  <Layers className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/organizer/events/new"
                  className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Create Event
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'participant' && (
              <>
                <Link
                  to="/participant/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
                >
                  <Layers className="w-4 h-4" />
                  My Dashboard
                </Link>
                <Link
                  to="/participant/dashboard#passes"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
                >
                  <Ticket className="w-4 h-4" />
                  Event Passes
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition"
              >
                <Shield className="w-4 h-4" />
                Admin Console
              </Link>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100/80 rounded-full border border-slate-200 text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="font-semibold text-slate-700 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold bg-white text-indigo-700 border border-slate-200">
                    {user?.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/participant/login"
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3.5 py-2 rounded-xl transition"
                >
                  Participant Login (OTP)
                </Link>
                <Link
                  to="/organizer/login"
                  className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-sm hover:shadow-indigo-500/20 transition flex items-center gap-1.5"
                >
                  Host Event
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-indigo-600"
          >
            Discover Events
          </Link>

          {isAuthenticated ? (
            <>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Logged in as {user?.name} ({user?.role})
                </p>
                <Link
                  to={getDashboardUrl(user?.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium text-indigo-600"
                >
                  Go to Dashboard
                </Link>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-base font-medium text-red-600 hover:text-red-700"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/participant/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm"
              >
                Participant Login (OTP)
              </Link>
              <Link
                to="/organizer/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 text-center rounded-xl bg-indigo-600 text-white font-semibold text-sm"
              >
                Organizer Sign In / Register
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-800"
              >
                Admin Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
