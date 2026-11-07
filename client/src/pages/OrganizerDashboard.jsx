import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  CalendarPlus,
  Layers,
  Globe,
  Edit,
  Trash2,
  Users,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/events');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleTogglePublish = async (event) => {
    setActionLoading(event._id);
    try {
      const endpoint =
        event.status === 'published'
          ? `/api/events/${event._id}/unpublish`
          : `/api/events/${event._id}/publish`;
      const res = await api.post(endpoint);
      if (res.data.success) {
        setEvents(events.map((e) => (e._id === event._id ? { ...e, status: res.data.event.status } : e)));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update publish state');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await api.delete(`/api/events/${id}`);
      if (res.data.success) {
        setEvents(events.filter((e) => e._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  // Metrics
  const totalEvents = events.length;
  const publishedCount = events.filter((e) => e.status === 'published').length;
  const draftCount = events.filter((e) => e.status === 'draft').length;
  const totalRegistrations = events.reduce((sum, e) => sum + (e.registrationCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              Organizer Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Organization: <strong className="text-slate-800">{user?.college || 'College Club'}</strong> • Account Email: {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/organizer/events/new"
              className="py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Create New Event</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="text-xs uppercase font-bold text-slate-400">Total Events</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalEvents}</div>
            <div className="text-[11px] text-slate-500 mt-1">Managed under this club</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="text-xs uppercase font-bold text-emerald-600">Published Live</div>
            <div className="text-3xl font-black text-emerald-600 mt-1">{publishedCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">Live on discovery page</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="text-xs uppercase font-bold text-amber-500">Drafts</div>
            <div className="text-3xl font-black text-amber-500 mt-1">{draftCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">In design / editing</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="text-xs uppercase font-bold text-indigo-600">Total Attendees</div>
            <div className="text-3xl font-black text-indigo-600 mt-1">{totalRegistrations}</div>
            <div className="text-[11px] text-slate-500 mt-1">Registered participants</div>
          </div>
        </div>

        {/* Event List Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Hosted Events</h2>
              <p className="text-xs text-slate-500">Manage event websites, templates, and view attendee lists</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {events.length} event{events.length !== 1 ? 's' : ''} listed
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
              Loading your hosted events...
            </div>
          ) : events.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/60 transition"
                >
                  {/* Left: Event Details */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={event.heroImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{event.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            event.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {event.status}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                          Template: {event.template || 'modern'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                        {event.tagline || event.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                        <span>📅 {event.date}</span>
                        <span>📍 {event.venue}</span>
                        <span className="text-indigo-600 font-semibold flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {event.registrationCount || 0} Registered
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* View Registrations */}
                    <Link
                      to={`/organizer/events/${event._id}/registrations`}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                      title="View attendee registrations"
                    >
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Registrations ({event.registrationCount || 0})</span>
                    </Link>

                    {/* Edit Website in Builder */}
                    <Link
                      to={`/organizer/events/${event._id}/edit`}
                      className="py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Website</span>
                    </Link>

                    {/* Live URL */}
                    {event.status === 'published' && (
                      <Link
                        to={`/events/${event.publicSlug || event._id}`}
                        target="_blank"
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
                        title="Open public website in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}

                    {/* Publish / Unpublish Toggle */}
                    <button
                      onClick={() => handleTogglePublish(event)}
                      disabled={actionLoading === event._id}
                      className={`py-2 px-3 text-xs font-bold rounded-xl transition ${
                        event.status === 'published'
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {event.status === 'published' ? 'Unpublish' : 'Publish Live'}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(event._id, event.title)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">No events created yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first college event website with our AI builder in just a few minutes.
              </p>
              <Link
                to="/organizer/events/new"
                className="inline-flex items-center gap-2 py-3 px-6 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-md transition"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Launch First Event</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
