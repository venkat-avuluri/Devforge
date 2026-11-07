import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TemplateRenderer from '../templates/TemplateRenderer';
import AiGeneratorModal from '../components/AiGeneratorModal';
import {
  Sparkles,
  Save,
  Globe,
  Eye,
  Layout,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Building2,
  ArrowLeft,
  Loader2,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const bannerPresets = [
  {
    name: 'Hackathon / Tech',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Conference / Auditorium',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cultural / Fest / Concert',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Academic Summit',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80',
  },
];

const EventBuilderPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [previewMode, setPreviewMode] = useState('split'); // 'split' | 'editor' | 'preview'

  // Accordion section collapse state
  const [activeSection, setActiveSection] = useState('basic');

  // Event Data State
  const [eventData, setEventData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Technical Fest',
    date: new Date().toISOString().split('T')[0],
    endDate: '',
    time: '09:00 AM - 05:00 PM',
    venue: 'Campus Main Auditorium',
    organizer: user?.college || 'College Department',
    template: 'modern',
    heroImage: bannerPresets[0].url,
    contact: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
    sections: {
      about: {
        title: 'About The Event',
        content: 'Join us for an inspiring gathering bringing together students and mentors.',
        highlights: ['Hands-on Challenges', 'Direct Mentorship', 'Official Certificates'],
      },
      schedule: [
        {
          time: '09:00 AM - 10:00 AM',
          title: 'Opening Ceremony & Welcome',
          description: 'Introduction to themes and keynote address.',
          speaker: 'Department Chair',
          location: 'Main Auditorium',
        },
        {
          time: '10:30 AM - 01:00 PM',
          title: 'Core Competition Track',
          description: 'Interactive problem solving and sprint.',
          speaker: 'Track Leads',
          location: 'Lab 101',
        },
      ],
      speakers: [
        {
          name: 'Dr. Jane Miller',
          role: 'Keynote Speaker',
          organization: 'Tech Innovations Lab',
          photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
          bio: 'Leader in student innovation programs and modern software engineering.',
        },
      ],
      sponsors: [
        { name: 'DevForge Partners', tier: 'Title', logo: '', website: '' },
      ],
      faqs: [
        {
          question: 'Who can register for this event?',
          answer: 'All enrolled undergraduate and graduate college students with valid IDs.',
        },
        {
          question: 'Are there any entry fees?',
          answer: 'Participation is completely free of cost for student attendees.',
        },
      ],
    },
    status: 'draft',
    publicSlug: '',
  });

  // Fetch event if editing
  useEffect(() => {
    if (isEditing) {
      const fetchEvent = async () => {
        try {
          const res = await api.get(`/api/events/${id}`);
          if (res.data.success) {
            setEventData(res.data.event);
          } else {
            setError(res.data.message || 'Event not found');
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Error fetching event');
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEditing]);

  // Handle AI Generated Content Application
  const handleApplyAiData = (ai) => {
    setEventData((prev) => ({
      ...prev,
      title: ai.title || prev.title,
      tagline: ai.tagline || prev.tagline,
      description: ai.description || prev.description,
      category: ai.category || prev.category,
      sections: {
        ...prev.sections,
        about: {
          title: ai.about?.title || `About ${ai.title}`,
          content: ai.about?.content || ai.description,
          highlights: ai.about?.highlights || prev.sections.about?.highlights || [],
        },
        schedule: ai.schedule && ai.schedule.length > 0 ? ai.schedule : prev.sections.schedule,
        speakers: ai.speakers && ai.speakers.length > 0 ? ai.speakers : prev.sections.speakers,
        faqs: ai.faqs && ai.faqs.length > 0 ? ai.faqs : prev.sections.faqs,
      },
    }));
  };

  // Save Event (as draft or keeping current status)
  const handleSave = async (publishStatus = null) => {
    if (!eventData.title.trim()) {
      setError('Event Title is required');
      return;
    }

    setSaving(true);
    setError('');
    setSaveSuccess(false);

    const payload = {
      ...eventData,
      status: publishStatus !== null ? publishStatus : eventData.status,
    };

    try {
      let res;
      if (isEditing) {
        res = await api.put(`/api/events/${id}`, payload);
      } else {
        res = await api.post('/api/events', payload);
      }

      if (res.data.success) {
        setEventData(res.data.event);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        if (!isEditing) {
          navigate(`/organizer/events/${res.data.event._id}/edit`, { replace: true });
        }
      } else {
        setError(res.data.message || 'Failed to save event');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving event');
    } finally {
      setSaving(false);
    }
  };

  // Schedule Helpers
  const addScheduleItem = () => {
    setEventData({
      ...eventData,
      sections: {
        ...eventData.sections,
        schedule: [
          ...eventData.sections.schedule,
          { time: '11:00 AM - 12:00 PM', title: 'New Agenda Track', description: '', speaker: '', location: '' },
        ],
      },
    });
  };

  const updateScheduleItem = (index, field, value) => {
    const updated = [...eventData.sections.schedule];
    updated[index][field] = value;
    setEventData({
      ...eventData,
      sections: { ...eventData.sections, schedule: updated },
    });
  };

  const removeScheduleItem = (index) => {
    const updated = eventData.sections.schedule.filter((_, i) => i !== index);
    setEventData({
      ...eventData,
      sections: { ...eventData.sections, schedule: updated },
    });
  };

  // Speaker Helpers
  const addSpeaker = () => {
    setEventData({
      ...eventData,
      sections: {
        ...eventData.sections,
        speakers: [
          ...eventData.sections.speakers,
          { name: 'Guest Speaker', role: 'Distinguished Guest', organization: 'Institution', photo: '', bio: '' },
        ],
      },
    });
  };

  const updateSpeaker = (index, field, value) => {
    const updated = [...eventData.sections.speakers];
    updated[index][field] = value;
    setEventData({
      ...eventData,
      sections: { ...eventData.sections, speakers: updated },
    });
  };

  const removeSpeaker = (index) => {
    const updated = eventData.sections.speakers.filter((_, i) => i !== index);
    setEventData({
      ...eventData,
      sections: { ...eventData.sections, speakers: updated },
    });
  };

  // FAQ Helpers
  const addFaq = () => {
    setEventData({
      ...eventData,
      sections: {
        ...eventData.sections,
        faqs: [
          ...eventData.sections.faqs,
          { question: 'What are the event requirements?', answer: 'Participants must carry college student ID.' },
        ],
      },
    });
  };

  const updateFaq = (index, field, value) => {
    const updated = [...eventData.sections.faqs];
    updated[index][field] = value;
    setEventData({
      ...eventData,
      sections: { ...eventData.sections, faqs: updated },
    });
  };

  const removeFaq = (index) => {
    const updated = eventData.sections.faqs.filter((_, i) => i !== index);
    setEventData({
      ...eventData,
      sections: { ...eventData.sections, faqs: updated },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Builder Control Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <Link
              to="/organizer/dashboard"
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base">
                  {eventData.title || 'Untitled Event'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    eventData.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {eventData.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Template: <strong className="capitalize text-slate-700">{eventData.template}</strong>
              </p>
            </div>
          </div>

          {/* Center: Template & View Controls */}
          <div className="flex items-center gap-2">
            {/* Template Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 px-2">Template:</span>
              {['modern', 'professional', 'fest'].map((tmpl) => (
                <button
                  key={tmpl}
                  type="button"
                  onClick={() => setEventData({ ...eventData, template: tmpl })}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold capitalize transition ${
                    eventData.template === tmpl
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tmpl}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewMode('editor')}
                className={`py-1 px-2.5 rounded-lg transition ${
                  previewMode === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('split')}
                className={`py-1 px-2.5 rounded-lg transition ${
                  previewMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('preview')}
                className={`py-1 px-2.5 rounded-lg transition ${
                  previewMode === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* AI Generator Button */}
            <button
              type="button"
              onClick={() => setShowAiModal(true)}
              className="py-2 px-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Content</span>
            </button>

            {/* Save Draft */}
            <button
              type="button"
              onClick={() => handleSave(eventData.status)}
              disabled={saving}
              className="py-2 px-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>

            {/* Publish / Unpublish */}
            <button
              type="button"
              onClick={() => handleSave(eventData.status === 'published' ? 'draft' : 'published')}
              disabled={saving}
              className={`py-2 px-4 font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 ${
                eventData.status === 'published'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{eventData.status === 'published' ? 'Unpublish' : 'Publish Live'}</span>
            </button>

            {/* View Live Page */}
            {eventData.status === 'published' && eventData.publicSlug && (
              <Link
                to={`/events/${eventData.publicSlug}`}
                target="_blank"
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                title="View live website"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Notifications */}
      {saveSuccess && (
        <div className="bg-emerald-500 text-white text-xs font-semibold py-2 px-4 text-center">
          ✓ Changes saved successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-500 text-white text-xs font-semibold py-2 px-4 text-center">
          ⚠ {error}
        </div>
      )}

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Structured Form Editor */}
        <div
          className={`overflow-y-auto p-4 sm:p-6 space-y-6 ${
            previewMode === 'preview'
              ? 'hidden'
              : previewMode === 'split'
              ? 'w-full lg:w-1/2 border-r border-slate-200'
              : 'w-full max-w-4xl mx-auto'
          }`}
        >
          {/* Section 1: Basic Event Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                1. Basic Event Details
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Event Title *</label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="e.g. HackNova 2026: 36-Hour Hackathon"
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Tagline / Catchphrase</label>
              <input
                type="text"
                value={eventData.tagline}
                onChange={(e) => setEventData({ ...eventData, tagline: e.target.value })}
                placeholder="e.g. Code, Innovate, and Deploy the Future"
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                <select
                  value={eventData.category}
                  onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl bg-white outline-none"
                >
                  <option value="Technical Fest">Technical Fest</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Conference">Conference</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Competition">Competition</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Host College / Club</label>
                <input
                  type="text"
                  value={eventData.organizer}
                  onChange={(e) => setEventData({ ...eventData, organizer: e.target.value })}
                  placeholder="e.g. Dept of CSE / Tech Club"
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={eventData.endDate}
                  onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Time</label>
                <input
                  type="text"
                  value={eventData.time}
                  onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                  placeholder="09:00 AM - 05:00 PM"
                  className="w-full text-sm p-2.5 border border-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Venue Location</label>
              <input
                type="text"
                value={eventData.venue}
                onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
                placeholder="e.g. Main Auditorium, Block C"
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Section 2: Hero Banner Image */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layout className="w-4 h-4 text-indigo-600" />
              2. Banner Hero Image
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Custom Image URL</label>
              <input
                type="url"
                value={eventData.heroImage}
                onChange={(e) => setEventData({ ...eventData, heroImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Or pick a curated preset:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {bannerPresets.map((b, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setEventData({ ...eventData, heroImage: b.url })}
                    className={`p-2 rounded-xl border text-left text-xs transition flex items-center gap-2 ${
                      eventData.heroImage === b.url
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img src={b.url} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    <span className="truncate">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: About & Highlights */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              3. About Section & Highlights
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">About Title</label>
              <input
                type="text"
                value={eventData.sections.about?.title || ''}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    sections: {
                      ...eventData.sections,
                      about: { ...eventData.sections.about, title: e.target.value },
                    },
                  })
                }
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Detailed Event Description
              </label>
              <textarea
                rows={4}
                value={eventData.sections.about?.content || eventData.description}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    description: e.target.value,
                    sections: {
                      ...eventData.sections,
                      about: { ...eventData.sections.about, content: e.target.value },
                    },
                  })
                }
                className="w-full text-sm p-2.5 border border-slate-300 rounded-xl outline-none resize-none"
              />
            </div>
          </div>

          {/* Section 4: Schedule Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                4. Schedule Timeline ({eventData.sections.schedule?.length || 0})
              </h3>
              <button
                type="button"
                onClick={addScheduleItem}
                className="py-1 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Slot
              </button>
            </div>

            <div className="space-y-3">
              {eventData.sections.schedule?.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => updateScheduleItem(idx, 'time', e.target.value)}
                      placeholder="09:00 AM - 10:00 AM"
                      className="text-xs font-mono font-bold p-1.5 bg-white border border-slate-200 rounded-lg w-40"
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateScheduleItem(idx, 'title', e.target.value)}
                      placeholder="Session Title"
                      className="flex-1 text-xs font-bold p-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeScheduleItem(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateScheduleItem(idx, 'description', e.target.value)}
                    placeholder="Short description of this session..."
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      value={item.speaker}
                      onChange={(e) => updateScheduleItem(idx, 'speaker', e.target.value)}
                      placeholder="Speaker / Host"
                      className="p-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => updateScheduleItem(idx, 'location', e.target.value)}
                      placeholder="Room / Hall"
                      className="p-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Keynote Speakers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                5. Featured Speakers ({eventData.sections.speakers?.length || 0})
              </h3>
              <button
                type="button"
                onClick={addSpeaker}
                className="py-1 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Speaker
              </button>
            </div>

            <div className="space-y-3">
              {eventData.sections.speakers?.map((spk, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={spk.name}
                      onChange={(e) => updateSpeaker(idx, 'name', e.target.value)}
                      placeholder="Speaker Full Name"
                      className="flex-1 text-xs font-bold p-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpeaker(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      value={spk.role}
                      onChange={(e) => updateSpeaker(idx, 'role', e.target.value)}
                      placeholder="Role (e.g. Lead Researcher)"
                      className="p-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      value={spk.organization}
                      onChange={(e) => updateSpeaker(idx, 'organization', e.target.value)}
                      placeholder="Company / Institution"
                      className="p-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <input
                    type="url"
                    value={spk.photo}
                    onChange={(e) => updateSpeaker(idx, 'photo', e.target.value)}
                    placeholder="Photo URL"
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={spk.bio}
                    onChange={(e) => updateSpeaker(idx, 'bio', e.target.value)}
                    placeholder="Short bio..."
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: FAQs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                6. FAQs ({eventData.sections.faqs?.length || 0})
              </h3>
              <button
                type="button"
                onClick={addFaq}
                className="py-1 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add FAQ
              </button>
            </div>

            <div className="space-y-3">
              {eventData.sections.faqs?.map((faq, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                      placeholder="Question"
                      className="flex-1 text-xs font-bold p-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFaq(idx)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                    placeholder="Answer"
                    className="w-full text-xs p-1.5 bg-white border border-slate-200 rounded-lg resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Real-Time Live Preview */}
        <div
          className={`flex-1 overflow-y-auto bg-slate-900 border-l border-slate-800 ${
            previewMode === 'editor' ? 'hidden' : 'block'
          }`}
        >
          <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <Eye className="w-4 h-4 text-cyan-400" />
              Live Interactive Website Preview
            </span>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase font-bold">
              {eventData.template} mode
            </span>
          </div>

          {/* Renders Selected Template Live! */}
          <div className="preview-container">
            <TemplateRenderer
              event={eventData}
              onRegister={() => alert('Registration action triggered! (Active on public website)')}
              isPreview={true}
            />
          </div>
        </div>
      </div>

      {/* AI Generator Modal */}
      <AiGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        onApply={handleApplyAiData}
        currentTitle={eventData.title}
        currentCategory={eventData.category}
      />
    </div>
  );
};

export default EventBuilderPage;
