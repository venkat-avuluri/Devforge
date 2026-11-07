import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { Compass, Search, Filter, RefreshCw } from 'lucide-react';

const categories = [
  'All',
  'Hackathon',
  'Technical Fest',
  'Workshop',
  'Conference',
  'Cultural',
  'Sports',
  'Competition',
  'Seminar',
  'Other',
];

const ExploreEventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/public/events');
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory !== 'All' && ev.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        ev.title?.toLowerCase().includes(q) ||
        ev.organizer?.toLowerCase().includes(q) ||
        ev.venue?.toLowerCase().includes(q) ||
        ev.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              Event Discovery Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explore Published Campus Events
            </h1>
            <p className="text-slate-600 text-sm">
              Discover verified technical fests, hackathons, academic conferences, and cultural events happening across premier colleges.
            </p>
          </div>

          {/* Search bar and filters */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by event title, organizer, campus or keyword..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-3 px-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      Category: {c}
                    </option>
                  ))}
                </select>
              </div>

              {(search || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('All');
                  }}
                  className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition"
                  title="Clear filters"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips */}
          <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1 px-3 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-medium">
          <span>
            Showing <strong className="text-slate-800">{filteredEvents.length}</strong> published event{filteredEvents.length !== 1 ? 's' : ''}
          </span>
          {selectedCategory !== 'All' && (
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold">
              Filter: {selectedCategory}
            </span>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => (
              <EventCard key={ev._id} event={ev} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Compass className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">No published events found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any events matching "{search || selectedCategory}". Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="py-2.5 px-5 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 transition"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreEventsPage;
