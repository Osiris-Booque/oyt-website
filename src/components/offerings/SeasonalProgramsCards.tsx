import { useState } from 'react';
import { CalendarDays, ArrowRight, MapPin, Clock, ArrowUp, Waves, DollarSign, ArrowDown } from 'lucide-react';
import { scrollToSection } from '../ScrollManager';
import NotifyModal from '../NotifyModal';

const COHORT = [
  {
    season: 'Summer',
    year: '2026',
    theme: 'Up-Regulation, Embodiment, Social Presence',
    description: 'Activate your nervous system sustainably through breath work and tonification',
    modality: 'Kundalini Kriya',
    dates: 'Two cohorts: Men (Jun 21 to Jul 26) and Women (Aug 2 to Sep 6)',
    sessions: '6 weeks · Sundays 4–6pm PST',
    location: 'Remote (Zoom)',
    price: '1200',
    url: 'https://flowthroughsummer.com',
  },
  {
    season: 'Fall',
    year: '2026',
    theme: 'Transition, Consolidation, Down-regulation',
    description: 'Deepen relationships and down regulate intentionally with this cooling and soothing program',
    modality: 'Yin Yoga Therapy',
    dates: 'Sep 27 to Nov 22 (one week break Oct 25)',
    sessions: '8 weeks · Sundays 4–6pm PST',
    location: 'Remote (Zoom)',
    price: '1200',
    url: 'https://flowthroughfall.com',
  },
  {
    season: 'Spring',
    year: '2027',
    theme: 'Growth, Emergence, Career Development',
    description: 'Stabilize your nervous system by refining purpose and career focus',
    modality: 'Yoga Asana',
    dates: 'March 22 to May 3',
    sessions: '8 weeks · Sundays 4–6pm PST',
    location: 'Remote (Zoom)',
    price: '1200',
    url: 'https://flowintospring.com',
  },
  {
    season: 'Winter',
    year: '2027',
    theme: 'Restoration, Stillness, Shed',
    description: 'Excavate and rebuild your foundation through yoga therapy',
    modality: 'Phoenix Rising Yoga Therapy',
    dates: 'Jan 3 to Feb 28 (skip Super Bowl Sunday)',
    sessions: '8 weeks · Sundays 4–6pm PST',
    location: 'Remote (Zoom)',
    price: '1200',
    url: 'https://flowthroughwinter.com',
  },
];

export default function CohortCards() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="seasonal-programs" className="scroll-mt-16 sm:scroll-mt-20 border-t border-stone-200 bg-stone-50 min-h-[calc(100vh-4rem)] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">

        <div className="flex items-start justify-between gap-3 mb-10 sm:mb-12">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center shrink-0 mt-0.5">
              <Waves className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-sage-600 uppercase tracking-widest mb-1">
                Flow Series
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Seasonal Experiences
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
                Seasonal yoga therapy programs that run with the year. Drop in wherever you are. The cycle carries you forward. These programs have outgrown this humble space and each season now has its own dedicated website. You can visit each website to learn more using the links below.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-sage-700 hover:text-sage-900 transition-colors"
              >
                Sign up for email updates about the Flow Series Program
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-sage-600 hover:text-sage-800 transition-colors group shrink-0 mt-0.5"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Back to top
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {COHORT.map((cohort) => (
            <div
              key={cohort.theme}
              className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold text-sage-600 uppercase tracking-widest bg-sage-50 px-2.5 py-1 rounded-full">
                  {cohort.season}
                </span>
                <span className="flex items-center gap-1 text-sm text-sage-600 font-medium">
                  <DollarSign className="w-4 h-4 text-sage-400" />
                  {cohort.price}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                {cohort.theme}
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed mb-3 flex-grow">
                {cohort.description}
              </p>

              <p className="text-xs font-semibold text-slate-600 mb-4">
                {cohort.modality}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-start gap-2">
                  <CalendarDays className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-600">{cohort.dates}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-600">{cohort.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-600">{cohort.sessions}</span>
                </div>
              </div>

                <a
                  href={cohort.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Visit {cohort.season} Website
                  <ArrowRight className="w-4 h-4" />
                </a>
            </div>
          ))}
        </div>

        <div className="mt-14 sm:mt-20 flex justify-center">
          <button
            onClick={() => scrollToSection('events-retreats')}
            className="inline-flex items-center gap-2 px-7 py-4 bg-amber-600 text-white rounded-xl font-semibold text-sm hover:bg-amber-500 transition-colors"
          >
            Check out Events &amp; Retreats
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

      </div>

      <NotifyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
