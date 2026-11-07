import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import {
  Sparkles,
  Compass,
  Calendar,
  Layers,
  Wand2,
  Ticket,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';

const categories = [
  'All',
  'Hackathon',
  'Technical Fest',
  'Workshop',
  'Conference',
  'Cultural',
  'Competition',
];

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/api/public/events');
        if (res.data.success) {
          setEvents(res.data.events);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory !== 'All' && ev.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ev.title?.toLowerCase().includes(q) ||
        ev.organizer?.toLowerCase().includes(q) ||
        ev.venue?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-cyan-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-200 shadow-sm text-xs font-bold text-indigo-700">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Next-Gen Campus Event Operating System</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] max-w-4xl mx-auto">
            Discover & Create College Events{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              In One Unified Platform.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Stop juggling fragmented Google Forms, WhatsApp groups, and Instagram posters.
            DevForge empowers college organizers to build professional event websites with AI in minutes,
            while students discover and register with instant digital passes.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center bg-white p-2 rounded-2xl shadow-xl shadow-indigo-500/5 border border-slate-200"
          >
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathons, fests, workshops, or college names..."
              className="flex-1 text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400 px-2"
            />
            <button
              type="submit"
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
            >
              Explore Events
            </button>
          </form>

          {/* Role CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/organizer/login"
              className="py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4 text-cyan-400" />
              <span>Host & Build an Event Website</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/participant/login"
              className="py-3.5 px-6 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 font-bold text-xs border border-indigo-200 shadow-sm transition flex items-center gap-2"
            >
              <Ticket className="w-4 h-4 text-indigo-600" />
              <span>Student OTP Login & Passes</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="text-2xl font-black text-slate-900">30+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Campus Events Hosted</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="text-2xl font-black text-indigo-600">3 Templates</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Modern, Pro & Fest</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="text-2xl font-black text-slate-900">100% Instant</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">OTP & Pass Issuance</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <div className="text-2xl font-black text-purple-600">AI Powered</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Auto Content Generation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Events Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 mb-1">
              Live & Upcoming
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Explore Campus Events</h2>
            <p className="text-slate-500 text-sm mt-1">
              Browse verified college hackathons, technical conferences, fests, and workshops.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-200/60 animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No events matching criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try switching category or clear your search to explore all college events.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 py-2 px-4 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl hover:bg-indigo-100"
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 font-semibold text-xs text-slate-700 shadow-sm transition"
          >
            <span>View All Campus Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-600">
              Dual Operating Model
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How DevForge Powers Campus Events
            </h2>
            <p className="text-slate-600 text-sm">
              One unified platform serving both event creators and eager student attendees.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Organizers */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">For Organizers & Clubs</h3>
                  <p className="text-xs text-slate-500">From concept to published website in 5 minutes</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">AI-Assisted Content Generation</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Enter a one-line prompt. DevForge generates comprehensive descriptions, schedules, speaker bios, and FAQs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Select Professional Template</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Pick between Modern, Professional Conference, or Vibrant College Fest layouts with real-time live preview.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">1-Click Publish & Manage Attendees</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Publish to a dedicated public slug. Track registrations in real-time, inspect student rosters, and export to CSV.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/organizer/register"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition block text-center"
                >
                  Create Organizer Account
                </Link>
              </div>
            </div>

            {/* For Students / Participants */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">For Students & Participants</h3>
                  <p className="text-xs text-slate-500">Zero hassle discovery & digital pass management</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Discover College Opportunities</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Filter campus hackathons, technical conferences, workshops, and sports tournaments across colleges in one place.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Passwordless OTP Verification</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      No tedious passwords to remember. Login seamlessly with your email or phone via secure 6-digit OTP codes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Instant Digital Event Pass</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Receive an official digital event pass complete with unique ID and print-ready format for venue check-ins.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/participant/login"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition block text-center"
                >
                  Participant OTP Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer Strip */}
      <section className="py-16 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Elevate Your College Event?</h2>
          <p className="text-indigo-200 text-sm max-w-xl mx-auto leading-relaxed">
            Join collegiate clubs, departments, and thousands of students building and attending events with DevForge.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/organizer/register"
              className="py-3.5 px-8 rounded-xl bg-white text-slate-900 hover:bg-indigo-50 font-bold text-xs shadow-lg transition"
            >
              Start Building Event (Free)
            </Link>
            <Link
              to="/events"
              className="py-3.5 px-8 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold text-xs border border-indigo-500/50 transition"
            >
              Browse Event Calendar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
