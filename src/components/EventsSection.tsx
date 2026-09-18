import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { UnitEvent } from '../types';
import { EventRegisterModal } from './EventRegisterModal';

interface EventsSectionProps {
  events: UnitEvent[];
  onOpenAdmin: () => void;
  onRefreshEvents?: () => void;
  onRegisterEvent?: (event: UnitEvent) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  events,
  onOpenAdmin,
  onRefreshEvents,
  onRegisterEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [registeringEvent, setRegisteringEvent] = useState<UnitEvent | null>(null);

  const filteredEvents = events.filter((e) => e.category === activeTab);

  return (
    <section id="events" className="py-16 sm:py-20 bg-white text-slate-900 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span>Campus Programs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
              Events & Youth Conclaves
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Educational seminars, social drives, blood donation camps, and cultural events organized by the unit.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {/* Filter Tabs */}
            <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('Upcoming')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'Upcoming'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming Events
              </button>
              <button
                onClick={() => setActiveTab('Past')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'Past'
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Past Events
              </button>
            </div>

            <button
              onClick={onOpenAdmin}
              className="text-xs text-orange-600 hover:text-orange-700 font-semibold px-3 py-1.5 rounded-lg border border-orange-200 hover:border-orange-300 bg-orange-50 transition-colors shrink-0"
            >
              + Manage (Admin)
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="group bg-stone-50 rounded-2xl border border-stone-200 hover:border-orange-300 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                {/* Poster / Image */}
                <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-stone-200">
                  <img
                    src={event.posterUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Date badge */}
                  <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-sm border border-slate-800 text-white rounded-xl p-2.5 text-center min-w-[58px] shadow-lg">
                    <span className="block text-[10px] font-bold uppercase text-amber-400">
                      {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="block text-xl font-black font-display text-white leading-none">
                      {new Date(event.date).getDate() || '15'}
                    </span>
                  </div>

                  {/* Status pill */}
                  <div className="absolute top-4 right-4">
                    {event.category === 'Upcoming' ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-orange-600 text-white shadow-md">
                        Upcoming
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800/90 text-slate-300 backdrop-blur-sm">
                        Concluded
                      </span>
                    )}
                  </div>

                  {/* Title overlay in image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-bold text-lg sm:text-xl font-display leading-tight drop-shadow-md">
                      {event.title}
                    </h3>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Time & Venue */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                        <span className="font-medium text-slate-800">{event.time}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{event.venue}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  {/* Footer CTAs & Registration */}
                  <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-700">
                        {event.registrationCount || 40}+ Attending
                      </span>
                    </div>

                    {event.isRegistrationOpen && event.category === 'Upcoming' ? (
                      <button
                        onClick={() => setRegisteringEvent(event)}
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5 transform active:scale-95"
                      >
                        <span>Register Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 italic">
                        {event.category === 'Past' ? 'Report available' : 'Open Walk-in / Entry'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-300 p-8">
            <Calendar className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-slate-600 font-medium text-sm">
              No {activeTab.toLowerCase()} events listed currently.
            </p>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <EventRegisterModal
        event={registeringEvent}
        onClose={() => setRegisteringEvent(null)}
        onSuccess={() => {
          setRegisteringEvent(null);
          onRefreshEvents();
        }}
      />
    </section>
  );
};
