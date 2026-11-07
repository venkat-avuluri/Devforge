import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Users,
  Search,
  Download,
  ArrowLeft,
  Calendar,
  Building2,
  Mail,
  Phone,
  Ticket,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const EventRegistrationsPage = () => {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/events/${id}/registrations`);
        if (res.data.success) {
          setRegistrations(res.data.registrations);
          setEventTitle(res.data.eventTitle);
        } else {
          setError(res.data.message || 'Failed to load registrations');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [id]);

  const filteredRegistrations = registrations.filter((reg) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      reg.name?.toLowerCase().includes(q) ||
      reg.email?.toLowerCase().includes(q) ||
      reg.phone?.toLowerCase().includes(q) ||
      reg.college?.toLowerCase().includes(q) ||
      reg.registrationId?.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (registrations.length === 0) return;

    const headers = ['Registration ID', 'Participant Name', 'Email', 'Phone', 'College', 'Registered Date'];
    const rows = registrations.map((r) => [
      `"${r.registrationId || ''}"`,
      `"${r.name || ''}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.college || ''}"`,
      `"${new Date(r.registeredAt).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            to="/organizer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Organizer Dashboard</span>
          </Link>
        </div>

        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              Event Registrations Roster
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {eventTitle || 'Event Attendee List'}
            </h1>
            <p className="text-xs text-slate-500">
              Official verified attendee roster and digital pass records
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={registrations.length === 0}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Row & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Attendees:
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-800">
              {registrations.length}
            </span>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, pass ID..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span>Loading attendee database...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 text-xs flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ) : filteredRegistrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-6">Attendee Name</th>
                    <th className="py-3.5 px-6">Pass ID</th>
                    <th className="py-3.5 px-6">College / Institution</th>
                    <th className="py-3.5 px-6">Contact Details</th>
                    <th className="py-3.5 px-6">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {reg.name}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[11px]">
                          {reg.registrationId}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {reg.college || '—'}
                      </td>
                      <td className="py-4 px-6 space-y-0.5">
                        <div className="text-slate-900 font-semibold">{reg.email}</div>
                        {reg.phone && <div className="text-slate-400 text-[11px]">{reg.phone}</div>}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(reg.registeredAt).toLocaleDateString()}{' '}
                        <span className="text-[10px] text-slate-400">
                          {new Date(reg.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center space-y-2">
              <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-base">No registrations found</h3>
              <p className="text-xs text-slate-400">
                {search ? 'Try adjusting your search criteria.' : 'When students register, their details and passes appear here.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationsPage;
