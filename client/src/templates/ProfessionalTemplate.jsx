import React from 'react';
import { Calendar, Clock, MapPin, Building2, CheckCircle, Ticket, ChevronRight, Award, HelpCircle } from 'lucide-react';

const ProfessionalTemplate = ({ event, onRegister, isPreview = false }) => {
  const sections = event.sections || {};
  const about = sections.about || {};
  const schedule = sections.schedule || [];
  const speakers = sections.speakers || [];
  const sponsors = sections.sponsors || [];
  const faqs = sections.faqs || [];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Banner Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{event.organizer}</span>
            <span>presents</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Official Event Portal</span>
            <span>•</span>
            <span>Status: Verified</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                {event.category || 'Executive Summit'}
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {event.title}
              </h1>

              {event.tagline && (
                <p className="text-lg text-slate-600 font-normal leading-relaxed">
                  {event.tagline}
                </p>
              )}

              {/* Event Metadata Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Date</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{event.date}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Time</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{event.time || 'All Day'}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Venue</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5 truncate">{event.venue}</div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={onRegister}
                  className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Register Delegate Pass</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                {isPreview && (
                  <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    Live Builder Preview
                  </span>
                )}
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 aspect-video lg:aspect-square">
                <img
                  src={event.heroImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80'}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl space-y-6">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
            About the Conference
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            {about.title || 'Event Overview'}
          </h2>
          <div className="text-slate-600 text-base leading-relaxed whitespace-pre-line space-y-4">
            {about.content || event.description}
          </div>

          {about.highlights && about.highlights.length > 0 && (
            <div className="pt-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3">
                Key Focus Areas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {about.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Table */}
      {schedule && schedule.length > 0 && (
        <div className="bg-slate-50 border-y border-slate-200 py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                Program Schedule
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">Conference Agenda</h2>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {schedule.map((item, index) => (
                <div key={index} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="sm:w-44 shrink-0">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {item.time}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    )}
                    {(item.speaker || item.location) && (
                      <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                        {item.speaker && <span>Speaker: <strong className="text-slate-700">{item.speaker}</strong></span>}
                        {item.location && <span>Location: <strong className="text-slate-700">{item.location}</strong></span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Speakers Grid */}
      {speakers && speakers.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
              Faculty & Industry Leaders
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Distinguished Keynote Speakers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((spk, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
                <div className="w-20 h-20 rounded-xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={spk.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'}
                    alt={spk.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-base text-slate-900">{spk.name}</h3>
                <p className="text-xs text-blue-700 font-semibold">{spk.role}</p>
                <p className="text-xs text-slate-500 mt-0.5">{spk.organization}</p>
                {spk.bio && (
                  <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 line-clamp-3">
                    {spk.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sponsors */}
      {sponsors && sponsors.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-16">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-6">
              Official Corporate Partners
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {sponsors.map((sp, i) => (
                <div key={i} className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800">
                  {sp.name} <span className="text-[10px] text-slate-400 font-normal">({sp.tier})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            General Information & FAQ
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <h4 className="font-bold text-sm text-slate-900 mb-1">{faq.question}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registration Strip */}
      <div className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Register for {event.title}</h3>
            <p className="text-xs text-slate-400 mt-1">Receive immediate digital credentials and venue pass.</p>
          </div>
          <button
            onClick={onRegister}
            className="py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shrink-0 transition"
          >
            Claim Delegate Pass
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-xs text-slate-400 border-t border-slate-200">
        Published by {event.organizer} via DevForge Platform
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
