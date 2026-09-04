import { Link } from 'react-router-dom';
import { CalendarDays, ArrowRight, MapPin, Clock, Users, ArrowUp } from 'lucide-react';

const EVENTS = [
  {
    type: 'Workshop',
    title: 'Breath & Body: A Half-Day Immersion',
    description:
      'A focused half-day exploring the relationship between breath and movement. Open to all levels — no prior experience required.',
    date: 'Coming Spring 2026',
    location: 'Virtual (Zoom)',
    duration: '4 hours',
    capacity: '12 participants',
    link: '/contact',
    linkLabel: 'Express Interest',
  },
  {
    type: 'Retreat',
    title: 'Summer Stillness Retreat',
    description:
      'A multi-day residential retreat weaving together yoga therapy, breathwork, somatic movement, and restorative practices in a natural setting.',
    date: 'Summer 2026 — TBD',
    location: 'Location TBD',
    duration: '3 days / 2 nights',
    capacity: '8 participants',
    link: '/contact',
    linkLabel: 'Join Waitlist',
  },
];

export default function EventsCard() {
  return (
    <section id="events-retreats" className="scroll-mt-16 sm:scroll-mt-20 border-t border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">

        <div className="flex items-start justify-between gap-3 mb-10 sm:mb-12">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
              <CalendarDays className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">
                Events &amp; Retreats
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Immersive Experiences
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
                Single-day workshops, multi-day retreats, and special gatherings designed to deepen
                your practice in a focused, intentional container. Small groups, high impact.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-800 transition-colors group shrink-0 mt-0.5"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Back to top
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {EVENTS.map((event) => (
            <div
              key={event.title}
              className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full">
                  {event.type}
                </span>
                <span className="text-xs text-stone-400 font-medium">Announcing soon</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                {event.title}
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">
                {event.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-start gap-2">
                  <CalendarDays className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-600">{event.date}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-600">{event.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-600">{event.duration}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-600">{event.capacity}</span>
                </div>
              </div>

              <Link
                to={event.link}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                {event.linkLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="border border-stone-200 rounded-2xl px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-grow">
            <h4 className="font-bold text-slate-900 mb-1">Be the first to know</h4>
            <p className="text-sm text-slate-500">
              Events and retreats fill quickly and are announced to our community first. Get in
              touch to be added to the early-access list.
            </p>
          </div>
          <Link
            to="/contact"
            className="flex items-center gap-2 px-5 py-3 border border-slate-900 text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-900 hover:text-white transition-colors shrink-0"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
