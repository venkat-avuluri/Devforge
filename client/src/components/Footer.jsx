import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              DevForge
            </Link>
            <p className="text-slate-400 max-w-sm text-sm">
              The AI-powered no-code event website builder and unified campus discovery platform.
              Publish stunning event pages and deliver digital passes in seconds.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>B.Tech Final Year Engineering Capstone Project</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/events" className="hover:text-indigo-400 transition">
                  Discover Events
                </Link>
              </li>
              <li>
                <Link to="/organizer/login" className="hover:text-indigo-400 transition">
                  Host an Event
                </Link>
              </li>
              <li>
                <Link to="/participant/login" className="hover:text-indigo-400 transition">
                  Participant OTP Login
                </Link>
              </li>
              <li>
                <Link to="/organizer/register" className="hover:text-indigo-400 transition">
                  Organizer Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Administration & Security */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Access</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admin/login" className="hover:text-indigo-400 transition flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  Platform Admin
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-indigo-400 transition">
                  How DevForge Works
                </a>
              </li>
              <li>
                <span className="text-xs text-slate-500 block pt-1">
                  Built with React, Express, MongoDB & AI
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DevForge. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" /> for campus innovators
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
