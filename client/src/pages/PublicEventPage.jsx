import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TemplateRenderer from '../templates/TemplateRenderer';
import EventPassCard from '../components/EventPassCard';
import {
  Ticket,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
} from 'lucide-react';

const PublicEventPage = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Registration Modal State
  const [showRegModal, setShowRegModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [regError, setRegError] = useState('');
  const [passData, setPassData] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
  });

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/api/public/events/${slug}`);
        if (res.data.success) {
          setEvent(res.data.event);
        } else {
          setError(res.data.message || 'Event not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load event page');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        college: user.college || '',
      });
    }
  }, [user]);

  const handleOpenRegister = () => {
    setRegError('');
    setShowRegModal(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setRegError('');

    try {
      const res = await api.post(`/api/public/events/${slug}/register`, formData);
      if (res.data.success) {
        setPassData(res.data.pass);
      } else {
        setRegError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      if (err.response?.data?.alreadyRegistered) {
        setRegError(err.response.data.message);
      } else {
        setRegError(err.response?.data?.message || 'Failed to complete registration');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
          <p className="text-sm text-slate-400">Loading event website...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Event Unavailable</h2>
          <p className="text-sm text-slate-600">
            {error || 'This event does not exist, has been removed, or is still in draft mode.'}
          </p>
          <div className="pt-2">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 py-2.5 px-5 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Discovery Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Template Component */}
      <TemplateRenderer event={event} onRegister={handleOpenRegister} />

      {/* Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-lg w-full">
            {passData ? (
              /* Success Digital Pass View */
              <div className="space-y-4 animate-scaleUp">
                <EventPassCard pass={passData} onClose={() => setShowRegModal(false)} />
              </div>
            ) : (
              /* Registration Form */
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-white">Event Registration</h3>
                      <p className="text-xs text-indigo-100 line-clamp-1">{event.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRegModal(false)}
                    className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
                  {regError && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {isAuthenticated && user?.role === 'participant' && (
                    <div className="p-3 bg-indigo-50 text-indigo-800 text-xs rounded-xl flex items-center gap-2 border border-indigo-200">
                      <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>
                        Logged in as <strong>{user.name}</strong>. Details pre-filled below.
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Rivera"
                      className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. student@university.edu"
                      className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        College / Institution
                      </label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        placeholder="e.g. MIT, Stanford, IIT"
                        className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRegModal(false)}
                      className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating Pass...</span>
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4" />
                          <span>Confirm & Get Pass</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicEventPage;
