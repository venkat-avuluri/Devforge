import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import EventPassCard from '../components/EventPassCard';
import {
  Ticket,
  Compass,
  Calendar,
  Building2,
  MapPin,
  Clock,
  Printer,
  User,
  ShieldCheck,
  ExternalLink,
  Loader2,
  X,
} from 'lucide-react';

const ParticipantDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePass, setActivePass] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/public/participant/registrations');
        if (res.data.success) {
          setRegistrations(res.data.registrations);
        }
      } catch (err) {
        console.error('Failed to fetch participant registrations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold">
              <Ticket className="w-3.5 h-3.5" />
              Student Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Hello, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your registered events, access digital passes, and explore new college opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/events"
              className="py-3 px-5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Discover More Events</span>
            </Link>
          </div>
        </div>

        {/* Profile Card & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="text-xs uppercase font-bold text-slate-400 flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyan-600" />
              Participant Profile
            </div>
            <div className="font-extrabold text-base text-slate-900">{user?.name}</div>
            <div className="text-xs text-slate-600 font-medium">{user?.college || 'College / University'}</div>
            <div className="text-xs text-slate-400">{user?.email}</div>
            {user?.phone && <div className="text-xs text-slate-400">{user?.phone}</div>}
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="text-xs uppercase font-bold text-slate-400">Total Registered Events</div>
            <div className="text-3xl font-black text-cyan-700">{registrations.length}</div>
            <div className="text-xs text-slate-500">Confirmed attendance spots</div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <div className="text-xs uppercase font-bold text-slate-400">Digital Passes Issued</div>
            <div className="text-3xl font-black text-emerald-600">{registrations.length}</div>
            <div className="text-xs text-slate-500">Ready for entrance check-in</div>
          </div>
        </div>

        {/* My Registrations & Event Passes */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden" id="passes">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Registrations & Event Passes</h2>
              <p className="text-xs text-slate-500">
                Click any pass to view the full verified boarding pass and print it
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {registrations.length} Pass{registrations.length !== 1 ? 'es' : ''}
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
              <span>Loading your passes...</span>
            </div>
          ) : registrations.length > 0 ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map((reg) => {
                const ev = reg.event || {};
                return (
                  <div
                    key={reg._id}
                    className="bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-cyan-500/50 p-5 shadow-sm transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded border border-cyan-200">
                          {reg.registrationId}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Confirmed
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-slate-900 line-clamp-1">
                        {ev.title || 'Campus Event'}
                      </h3>

                      <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span>{ev.date || 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{ev.venue || 'Campus Auditorium'}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{ev.organizer || 'Organizing Body'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                      <button
                        onClick={() =>
                          setActivePass({
                            registrationId: reg.registrationId,
                            eventTitle: ev.title,
                            organizer: ev.organizer,
                            eventDate: ev.date,
                            eventTime: ev.time,
                            eventVenue: ev.venue,
                            name: reg.name,
                            college: reg.college || user?.college,
                            email: reg.email,
                            registeredAt: reg.registeredAt,
                          })
                        }
                        className="flex-1 py-2 px-3 bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>View Pass</span>
                      </button>

                      {ev.publicSlug && (
                        <Link
                          to={`/events/${ev.publicSlug}`}
                          className="p-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition"
                          title="Open event website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center space-y-3">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-900 text-lg">No event registrations yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore campus hackathons, technical conferences, and fests to claim your digital event passes.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 py-2.5 px-5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                <Compass className="w-4 h-4" />
                <span>Browse Campus Events</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Pass Modal */}
      {activePass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-lg w-full">
            <EventPassCard pass={activePass} onClose={() => setActivePass(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantDashboard;
