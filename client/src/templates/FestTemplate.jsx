import React from 'react';
import { Calendar, Clock, MapPin, Ticket, Flame, Music, Sparkles, Star, ChevronRight, HelpCircle } from 'lucide-react';

const FestTemplate = ({ event, onRegister, isPreview = false }) => {
  const sections = event.sections || {};
  const about = sections.about || {};
  const schedule = sections.schedule || [];
  const speakers = sections.speakers || [];
  const sponsors = sections.sponsors || [];
  const faqs = sections.faqs || [];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Festive Hero with warm sunset glow */}
      <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20">
        <div className="absolute inset-0 z-0">
          <img
            src={event.heroImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80'}
            alt={event.title}
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-purple-950/80 to-slate-900" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-amber-500/20 border border-pink-500/30 text-pink-300 text-xs font-black uppercase tracking-widest backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            {event.category || 'Annual Fest'} • {event.organizer}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
            <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              {event.title}
            </span>
          </h1>

          {event.tagline && (
            <p className="text-lg sm:text-2xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
              🎉 {event.tagline}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
              <Calendar className="w-4 h-4 text-pink-400" />
              <span className="font-bold">{event.date}</span>
            </div>
            {event.time && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{event.time}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{event.venue}</span>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={onRegister}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-black text-base shadow-xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition flex items-center gap-2 mx-auto"
            >
              <Ticket className="w-5 h-5" />
              <span>Grab Your Fest Pass</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            {isPreview && (
              <p className="text-xs text-amber-300 mt-2 font-medium">
                [Live Preview — College Fest Mode]
              </p>
            )}
          </div>
        </div>
      </div>

      {/* About & Fest Highlights */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-pink-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Fest Experience & Vibes</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {about.title || 'About The Fest'}
            </h2>

            <div className="text-slate-300 text-base leading-relaxed whitespace-pre-line space-y-4">
              {about.content || event.description}
            </div>

            {about.highlights && about.highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {about.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-200"
                  >
                    <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 fill-amber-400" />
                    <span className="font-medium">{h}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-950/40 via-purple-950/30 to-slate-800 border border-pink-500/30 shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-pink-500/20">
                <Music className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Entry & Access</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Free entry pass for verified students with valid college ID
                </p>
              </div>
              <button
                onClick={onRegister}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold text-sm shadow-md transition"
              >
                Register For Free Pass
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fest Schedule / Stages */}
      {schedule && schedule.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
          <div className="text-center mb-16 space-y-2">
            <div className="text-xs font-black uppercase tracking-widest text-amber-400">
              Stage Lineup & Events
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Fest Schedule</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedule.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-pink-500/50 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    {item.time}
                  </span>
                  {item.location && (
                    <span className="text-[11px] text-pink-300 font-semibold">📍 {item.location}</span>
                  )}
                </div>
                <h3 className="font-black text-lg text-white group-hover:text-pink-300 transition">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>
                )}
                {item.speaker && (
                  <div className="mt-3 text-xs text-amber-300 font-semibold">
                    ⭐ Host/Performer: {item.speaker}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performers / Guests */}
      {speakers && speakers.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
          <div className="text-center mb-16 space-y-2">
            <div className="text-xs font-black uppercase tracking-widest text-pink-400">
              Stars & Judges
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Headline Performers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {speakers.map((spk, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 hover:border-pink-500/50 transition text-center flex flex-col items-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-pink-400 shadow-lg shadow-pink-500/20">
                  <img
                    src={spk.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                    alt={spk.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-base text-white">{spk.name}</h3>
                <p className="text-xs text-pink-400 font-bold">{spk.role}</p>
                <p className="text-xs text-slate-400 mt-0.5">{spk.organization}</p>
                {spk.bio && (
                  <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed">
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
        <div className="max-w-4xl mx-auto px-4 py-16 border-t border-slate-800 text-center">
          <h4 className="text-xs uppercase font-black text-slate-400 tracking-widest mb-6">
            Supported By
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {sponsors.map((sp, i) => (
              <div key={i} className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200">
                {sp.name} <span className="text-[10px] text-pink-400 font-semibold">({sp.tier})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800">
          <h2 className="text-2xl font-black text-white mb-8 text-center flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-pink-400" />
            Fest Queries & Guidelines
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700">
                <h4 className="font-bold text-sm text-white mb-1.5">{faq.question}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 py-16 text-center text-white px-4">
        <h2 className="text-3xl font-black mb-2">Be Part of {event.title}!</h2>
        <p className="text-xs text-pink-100 max-w-md mx-auto mb-6">
          Get your digital pass now and bring your campus crew along.
        </p>
        <button
          onClick={onRegister}
          className="py-3 px-8 rounded-xl bg-white text-slate-900 font-black text-sm shadow-xl hover:bg-slate-100 transition"
        >
          Register Free Pass
        </button>
      </div>

      <div className="py-6 text-center text-xs text-slate-500 border-t border-slate-800">
        Hosted with energy by {event.organizer} • DevForge
      </div>
    </div>
  );
};

export default FestTemplate;
