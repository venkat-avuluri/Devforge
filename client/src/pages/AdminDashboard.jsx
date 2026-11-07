import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Building2,
  Users,
  Calendar,
  Globe,
  Trash2,
  Lock,
  Unlock,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [organizers, setOrganizers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'organizers' | 'participants'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, orgsRes, partsRes, evsRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/organizers'),
        api.get('/api/admin/participants'),
        api.get('/api/admin/events'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (orgsRes.data.success) setOrganizers(orgsRes.data.organizers);
      if (partsRes.data.success) setParticipants(partsRes.data.participants);
      if (evsRes.data.success) setEvents(evsRes.data.events);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await api.put(`/api/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        setOrganizers(
          organizers.map((o) => (o._id === userId ? { ...o, isActive: res.data.isActive } : o))
        );
        setParticipants(
          participants.map((p) => (p._id === userId ? { ...p, isActive: res.data.isActive } : p))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDeleteEvent = async (eventId, title) => {
    if (!window.confirm(`Admin Action: Permanently remove event "${title}"?`)) return;

    try {
      const res = await api.delete(`/api/admin/events/${eventId}`);
      if (res.data.success) {
        setEvents(events.filter((e) => e._id !== eventId));
        if (stats) setStats({ ...stats, totalEvents: stats.totalEvents - 1 });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove event');
    }
  };

  const handleToggleEventPublish = async (eventId) => {
    try {
      const res = await api.put(`/api/admin/events/${eventId}/toggle-publish`);
      if (res.data.success) {
        setEvents(
          events.map((e) => (e._id === eventId ? { ...e, status: res.data.event.status } : e))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle event publish status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-700/60 text-purple-300 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              Platform Owner Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Platform Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage platform organizers, student attendees, and enforce event safety policies.
            </p>
          </div>

          <div className="text-xs text-slate-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
            <span>Root Admin: </span>
            <strong className="text-purple-300">{user?.email}</strong>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs uppercase font-bold text-slate-400">Organizers</div>
            <div className="text-2xl font-black text-white mt-1">{stats?.totalOrganizers ?? '—'}</div>
            <div className="text-[10px] text-slate-500 mt-1">Verified clubs</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs uppercase font-bold text-cyan-400">Participants</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">{stats?.totalParticipants ?? '—'}</div>
            <div className="text-[10px] text-slate-500 mt-1">Active students</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs uppercase font-bold text-slate-400">Total Events</div>
            <div className="text-2xl font-black text-white mt-1">{stats?.totalEvents ?? '—'}</div>
            <div className="text-[10px] text-slate-500 mt-1">Created on platform</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs uppercase font-bold text-emerald-400">Published</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{stats?.publishedEvents ?? '—'}</div>
            <div className="text-[10px] text-slate-500 mt-1">Live in discovery</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="text-xs uppercase font-bold text-purple-400">Registrations</div>
            <div className="text-2xl font-black text-purple-400 mt-1">{stats?.totalRegistrations ?? '—'}</div>
            <div className="text-[10px] text-slate-500 mt-1">Total passes issued</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('events')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'events'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events Directory ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('organizers')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'organizers'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Organizers ({organizers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('participants')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'participants'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Participants ({participants.length})</span>
          </button>
        </div>

        {/* Tab 1: Events */}
        {activeTab === 'events' && (
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-6">Event Details</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Organizer / Host</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Attendees</th>
                    <th className="py-3.5 px-6 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {events.map((ev) => (
                    <tr key={ev._id} className="hover:bg-slate-900/60 transition">
                      <td className="py-4 px-6 space-y-0.5">
                        <div className="font-bold text-white text-sm">{ev.title}</div>
                        <div className="text-[11px] text-slate-400">📅 {ev.date} • {ev.venue}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {ev.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {ev.organizer}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ev.status === 'published'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-200 font-bold">
                        {ev.registrationCount || 0}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {ev.publicSlug && (
                          <Link
                            to={`/events/${ev.publicSlug}`}
                            target="_blank"
                            className="p-1.5 inline-block text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800"
                            title="Open live link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleToggleEventPublish(ev._id)}
                          className="py-1 px-2 text-[10px] font-bold rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                        >
                          {ev.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev._id, ev.title)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/60 rounded border border-red-900 transition"
                          title="Delete inappropriate event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Organizers */}
        {activeTab === 'organizers' && (
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-6">Organizer Name</th>
                    <th className="py-3.5 px-6">College / Organization</th>
                    <th className="py-3.5 px-6">Email & Phone</th>
                    <th className="py-3.5 px-6">Hosted Events</th>
                    <th className="py-3.5 px-6">Account Status</th>
                    <th className="py-3.5 px-6 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {organizers.map((org) => (
                    <tr key={org._id} className="hover:bg-slate-900/60 transition">
                      <td className="py-4 px-6 font-bold text-white">
                        {org.name}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {org.college || '—'}
                      </td>
                      <td className="py-4 px-6 space-y-0.5">
                        <div className="text-white">{org.email}</div>
                        {org.phone && <div className="text-slate-400 text-[11px]">{org.phone}</div>}
                      </td>
                      <td className="py-4 px-6 font-bold text-purple-300">
                        {org.eventCount || 0}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            org.isActive
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                        >
                          {org.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(org._id)}
                          className={`py-1 px-2.5 text-[10px] font-bold rounded-lg border transition ${
                            org.isActive
                              ? 'border-red-900 text-red-400 hover:bg-red-950/60'
                              : 'border-emerald-800 text-emerald-400 hover:bg-emerald-950/60'
                          }`}
                        >
                          {org.isActive ? 'Block Account' : 'Unblock Account'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Participants */}
        {activeTab === 'participants' && (
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-6">Student Name</th>
                    <th className="py-3.5 px-6">College / University</th>
                    <th className="py-3.5 px-6">Contact Email / Phone</th>
                    <th className="py-3.5 px-6">Passes Claimed</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {participants.map((pt) => (
                    <tr key={pt._id} className="hover:bg-slate-900/60 transition">
                      <td className="py-4 px-6 font-bold text-white">
                        {pt.name}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        {pt.college || '—'}
                      </td>
                      <td className="py-4 px-6 space-y-0.5">
                        <div className="text-white">{pt.email}</div>
                        {pt.phone && <div className="text-slate-400 text-[11px]">{pt.phone}</div>}
                      </td>
                      <td className="py-4 px-6 font-bold text-cyan-300">
                        {pt.registrationCount || 0}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            pt.isActive
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                        >
                          {pt.isActive ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(pt._id)}
                          className={`py-1 px-2.5 text-[10px] font-bold rounded-lg border transition ${
                            pt.isActive
                              ? 'border-red-900 text-red-400 hover:bg-red-950/60'
                              : 'border-emerald-800 text-emerald-400 hover:bg-emerald-950/60'
                          }`}
                        >
                          {pt.isActive ? 'Block' : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
