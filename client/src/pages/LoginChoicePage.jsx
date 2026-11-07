import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Building2, Ticket, Shield, ArrowRight } from 'lucide-react';

const LoginChoicePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Welcome to DevForge
          </h1>
          <p className="text-slate-500 text-sm">
            Select your account type to proceed to your dedicated portal.
          </p>
        </div>

        <div className="space-y-4">
          {/* Participant Portal */}
          <Link
            to="/participant/login"
            className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-200 hover:border-cyan-500 bg-white hover:bg-cyan-50/30 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-105 transition">
                <Ticket className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 group-hover:text-cyan-700 transition">
                  Participant / Student
                </h3>
                <p className="text-xs text-slate-500">
                  Passwordless OTP login to discover events & view digital passes
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 transition shrink-0" />
          </Link>

          {/* Organizer Portal */}
          <Link
            to="/organizer/login"
            className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 bg-white hover:bg-indigo-50/30 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  Event Organizer / College Club
                </h3>
                <p className="text-xs text-slate-500">
                  Create, build AI-assisted websites, and manage attendees
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition shrink-0" />
          </Link>

          {/* Platform Admin */}
          <Link
            to="/admin/login"
            className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-200 hover:border-purple-600 bg-white hover:bg-purple-50/30 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition">
                  Platform Administrator
                </h3>
                <p className="text-xs text-slate-500">
                  Platform owners & system administration controls
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition shrink-0" />
          </Link>
        </div>

        <div className="text-center text-xs text-slate-400">
          Need an organizer account?{' '}
          <Link to="/organizer/register" className="text-indigo-600 font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginChoicePage;
