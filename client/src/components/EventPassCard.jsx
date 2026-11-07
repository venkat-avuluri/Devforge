import React from 'react';
import { Calendar, Clock, MapPin, Building2, User, Ticket, Printer, CheckCircle, X } from 'lucide-react';

const EventPassCard = ({ pass, onClose }) => {
  if (!pass) return null;

  const handlePrint = () => {
    window.print();
  };

  const eventTitle = pass.eventTitle || pass.event?.title || 'DevForge Campus Event';
  const organizer = pass.organizer || pass.event?.organizer || 'Organizing Committee';
  const attendeeName = pass.name || pass.participantName || 'Registered Student';
  const attendeeCollege = pass.college || pass.participantCollege || 'Collegiate Participant';
  const attendeeEmail = pass.email || pass.participantEmail;
  const eventDate = pass.eventDate || pass.event?.date || 'Scheduled Date';
  const eventTime = pass.eventTime || pass.event?.time || 'Scheduled Time';
  const eventVenue = pass.eventVenue || pass.event?.venue || 'Campus Auditorium';
  const regId = pass.registrationId || 'DF-REG-PENDING';

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden max-w-md w-full mx-auto text-slate-800"
      id="printable-pass"
    >
      {/* 1. Compact Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 px-5 py-3.5 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-6 -mt-6 w-28 h-28 bg-white/10 rounded-full blur-lg pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-100">
              DevForge Verified Pass
            </span>
          </div>

          <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/30 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-300" />
            Confirmed
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight line-clamp-1">
          {eventTitle}
        </h2>
        <p className="text-indigo-100 text-[11px] font-medium flex items-center gap-1.5 mt-0.5 truncate">
          <Building2 className="w-3 h-3 opacity-80 shrink-0" />
          <span className="truncate">{organizer}</span>
        </p>
      </div>

      {/* 2. Main Ticket Body */}
      <div className="px-5 py-3.5 bg-white space-y-3">
        {/* Attendee Details */}
        <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="space-y-0.5 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <User className="w-3 h-3 text-indigo-500" />
              Attendee
            </div>
            <div className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate">
              {attendeeName}
            </div>
            <div className="text-[11px] text-slate-500 font-medium truncate">
              {attendeeCollege}
            </div>
            {attendeeEmail && (
              <div className="text-[10px] text-slate-400 truncate">
                {attendeeEmail}
              </div>
            )}
          </div>

          <div className="shrink-0 text-right">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md">
              Student Pass
            </span>
          </div>
        </div>

        {/* 2-Column Schedule & Venue Strip */}
        <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/80 grid grid-cols-2 gap-2.5 text-xs">
          {/* Column 1: Date & Time */}
          <div className="space-y-0.5 min-w-0 border-r border-slate-200/70 pr-2">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-500" />
              Date & Time
            </div>
            <div className="font-bold text-slate-800 text-[11px] leading-tight truncate">
              {eventDate}
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
              <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
              <span className="truncate">{eventTime}</span>
            </div>
          </div>

          {/* Column 2: Venue */}
          <div className="space-y-0.5 min-w-0 pl-1">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-500" />
              Venue
            </div>
            <div className="font-bold text-slate-800 text-[11px] leading-tight line-clamp-2">
              {eventVenue}
            </div>
          </div>
        </div>

        {/* Ticket Perforation Notch */}
        <div className="relative py-1 flex items-center">
          <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rounded-full print:hidden" />
          <div className="border-b border-dashed border-slate-300 w-full" />
          <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rounded-full print:hidden" />
        </div>

        {/* Stub: Registration ID & Barcode */}
        <div className="flex items-center justify-between gap-3 pt-0.5">
          <div className="space-y-0.5">
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Registration ID
            </div>
            <div className="font-mono font-black text-sm text-indigo-600 tracking-wider">
              {regId}
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">
              Present this pass at entrance check-in
            </p>
          </div>

          {/* Simulated Compact Barcode */}
          <div className="shrink-0 flex flex-col items-end">
            <div className="flex items-center justify-center gap-[2px] h-7 px-2.5 bg-slate-50 rounded-md border border-slate-200/90">
              <div className="w-[1.5px] h-full bg-slate-800" />
              <div className="w-[3px] h-full bg-slate-800" />
              <div className="w-[1px] h-full bg-slate-800" />
              <div className="w-[2px] h-full bg-slate-800" />
              <div className="w-[1.5px] h-full bg-slate-800" />
              <div className="w-[1px] h-full bg-slate-800" />
              <div className="w-[3px] h-full bg-slate-800" />
              <div className="w-[1.5px] h-full bg-slate-800" />
              <div className="w-[2px] h-full bg-slate-800" />
              <div className="w-[1px] h-full bg-slate-800" />
              <div className="w-[3px] h-full bg-slate-800" />
              <div className="w-[1px] h-full bg-slate-800" />
              <div className="w-[2px] h-full bg-slate-800" />
            </div>
            <span className="text-[8px] font-mono text-slate-400 mt-0.5 tracking-widest">
              PASS VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* 3. Action Footer (Hidden on print) */}
      <div className="px-5 py-3 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between gap-2.5 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 py-2 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save Pass</span>
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-3.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default EventPassCard;
