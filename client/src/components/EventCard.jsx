import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Building2, ArrowRight } from 'lucide-react';

const categoryColors = {
  Hackathon: 'bg-violet-100 text-violet-700 border-violet-200',
  'Technical Fest': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Workshop: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Conference: 'bg-sky-100 text-sky-700 border-sky-200',
  Cultural: 'bg-pink-100 text-pink-700 border-pink-200',
  Sports: 'bg-amber-100 text-amber-700 border-amber-200',
  Competition: 'bg-rose-100 text-rose-700 border-rose-200',
  Seminar: 'bg-teal-100 text-teal-700 border-teal-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
};

const EventCard = ({ event }) => {
  const badgeClass =
    categoryColors[event.category] || 'bg-indigo-100 text-indigo-700 border-indigo-200';

  const defaultImage =
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col overflow-hidden group">
      {/* Banner Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={event.heroImage || defaultImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-md ${badgeClass}`}
          >
            {event.category}
          </span>
        </div>

        {event.template && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white/90 backdrop-blur-md">
              {event.template} template
            </span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
            {event.title}
          </h3>

          <p className="text-slate-600 text-sm mt-1.5 line-clamp-2 min-h-[2.5rem]">
            {event.tagline || event.description}
          </p>

          {/* Metadata Grid */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="font-medium text-slate-700">{event.date}</span>
              {event.time && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {event.time}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>

            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate font-medium text-slate-600">{event.organizer}</span>
            </div>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={`/events/${event.publicSlug || event._id}`}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-xl transition shadow-sm group-hover:shadow-indigo-500/20"
          >
            <span>View Event & Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
