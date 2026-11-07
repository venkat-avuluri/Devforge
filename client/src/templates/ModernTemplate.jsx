import React from 'react';
import { Calendar, Clock, MapPin, Building2, CheckCircle2, Ticket, ChevronRight, HelpCircle, Mail, Phone } from 'lucide-react';

const ModernTemplate = ({ event, onRegister, isPreview = false }) => {
  const sections = event.sections || {};
  const about = sections.about || {};
  const schedule = sections.schedule || [];
  const speakers = sections.speakers || [];
  const sponsors = sections.sponsors || [];
  const faqs = sections.faqs || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20">
        {/* Background Image & Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={event.heroImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80'}
            alt={event.title}
            className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {event.category || 'Featured Event'} • {event.organizer || 'Campus Innovation'}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            <span className="bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent">
              {event.title}
            </span>
          </h1>

          {event.tagline && (
            <p className="text-lg sm:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
              {event.tagline}
            </p>
          )}

          {/* Key Event Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{event.date}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{event.time}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{event.venue}</span>
            </div>
          </div>

          {/* Hero CTA */}
          <div className="pt-6">
            <button
              onClick={onRegister}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-base shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition flex items-center gap-2 mx-auto"
            >
              <Ticket className="w-5 h-5" />
              <span>Register & Claim Digital Pass</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            {isPreview && (
              <p className="text-xs text-amber-400 mt-2 font-medium">
                [Live Preview Mode - Builder Changes Reflected Instantly]
              </p>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs uppercase tracking-widest font-extrabold text-cyan-400">
              Overview & Objectives
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {about.title || 'About The Event'}
            </h2>
            <div className="text-slate-300 text-base leading-relaxed whitespace-pre-line space-y-4">
              {about.content || event.description}
            </div>

            {about.highlights && about.highlights.length > 0 && (
              <div className="space-y-3 pt-4">
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Key Event Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {about.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 shadow-2xl space-y-6">
              <h3 className="font-bold text-lg text-white">Event Information</h3>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-xs text-slate-400">Host Organization</div>
                    <div className="font-semibold text-white">{event.organizer}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-xs text-slate-400">Date & Schedule</div>
                    <div className="font-semibold text-white">{event.date} {event.endDate ? `- ${event.endDate}` : ''}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-rose-400" />
                  <div>
                    <div className="text-xs text-slate-400">Venue Location</div>
                    <div className="font-semibold text-white">{event.venue}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={onRegister}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition text-center"
              >
                Get Your Pass Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Timeline */}
      {schedule && schedule.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-900">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <div className="text-xs uppercase tracking-widest font-extrabold text-cyan-400">
              Agenda & Timeline
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Event Schedule</h2>
          </div>

          <div className="relative border-l-2 border-indigo-900/60 ml-4 sm:ml-32 space-y-8">
            {schedule.map((item, index) => (
              <div key={index} className="relative pl-6 sm:pl-8 group">
                {/* Node icon */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:bg-cyan-400 transition" />

                {/* Time badge for desktop left */}
                <div className="sm:absolute sm:-left-36 sm:top-1 text-xs font-mono font-bold text-cyan-300 mb-1 sm:mb-0">
                  {item.time}
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/40 transition">
                  <h3 className="font-bold text-base text-white">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>
                  )}
                  {(item.speaker || item.location) && (
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-indigo-300">
                      {item.speaker && <span>🎤 {item.speaker}</span>}
                      {item.location && <span>📍 {item.location}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Speakers Section */}
      {speakers && speakers.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-900">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <div className="text-xs uppercase tracking-widest font-extrabold text-cyan-400">
              Distinguished Guests
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Featured Speakers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {speakers.map((spk, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition group flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-indigo-500 group-hover:scale-105 transition">
                  <img
                    src={spk.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                    alt={spk.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-base text-white">{spk.name}</h3>
                <p className="text-xs text-cyan-400 font-semibold">{spk.role}</p>
                <p className="text-xs text-slate-400 mt-0.5">{spk.organization}</p>
                {spk.bio && (
                  <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {spk.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sponsors Section */}
      {sponsors && sponsors.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900 text-center">
          <div className="text-xs uppercase tracking-widest font-extrabold text-slate-400 mb-8">
            Event Partners & Sponsors
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {sponsors.map((sp, idx) => (
              <div
                key={idx}
                className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2"
              >
                <span className="text-xs font-bold text-slate-300">{sp.name}</span>
                <span className="text-[10px] text-indigo-400 uppercase font-semibold">({sp.tier})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-900">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-indigo-400" />
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-bold text-sm text-white mb-2">{faq.question}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registration Bottom Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 py-16 border-t border-indigo-700/50">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-white">Secure Your Pass for {event.title}</h2>
          <p className="text-indigo-200 text-sm max-w-xl mx-auto">
            Instant digital confirmation pass issued directly to your DevForge dashboard upon registration.
          </p>
          <div className="pt-2">
            <button
              onClick={onRegister}
              className="py-3.5 px-8 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-400/20 hover:scale-105 transition"
            >
              Register Now (Free)
            </button>
          </div>
        </div>
      </div>

      {/* Contact & Footer */}
      <div className="border-t border-slate-900 py-8 text-center text-xs text-slate-500 space-y-2">
        <p>Organized by <span className="text-slate-300 font-medium">{event.organizer}</span></p>
        {event.contact && (
          <p className="flex items-center justify-center gap-4 text-slate-400">
            {event.contact.email && <span>📧 {event.contact.email}</span>}
            {event.contact.phone && <span>📞 {event.contact.phone}</span>}
          </p>
        )}
        <p className="text-slate-600 pt-2">Powered by DevForge No-Code Event Platform</p>
      </div>
    </div>
  );
};

export default ModernTemplate;
