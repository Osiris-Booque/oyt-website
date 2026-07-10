import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowRight, MapPin, Clock, Users, ArrowUp, Waves, DollarSign } from 'lucide-react';
import NotifyModal from '../NotifyModal';

const COHORT = [
  {
    season: 'Summer',
    year: '2026',
    theme: 'Integration, Embodiment, Social Presence',
    description: 'Regulate activation through breathwork and tonification',
    dates: 'Two cohorts: Men (Jun 21 to Jul 26) and Women (Aug 2 to Sep 6)',
    sessions: '6 weeks · Sundays 4–6pm PST',
    location: 'Remote (Zoom)',
    price: '1200',
    spotsLeft: 0,
    link: '/purchase-summer-flow',
    linkLabel: 'Register Now',
    useModal: false,
  },
  {
    season: 'Fall',
    year: '2026',
    theme: 'Transition, Consolidation, Downregulation',
    description: 'Deepen relationships and expand connection through yin yoga',
    dates: 'Sep 27 to Nov 22 (one week break Oct 25)',
    sessions: '8 weeks · Sundays 4–6pm PST',
    location: 'Remote (Zoom)',
    price: '1200',
    spotsLeft: 12,
    link: '/notify',
    linkLabel: 'Join Early-Access List',
    useModal: true,
  },
  {
    season: 'Spring',
    year: '2027',
    theme: 'Upregulation, Activation, Growth',
    description: 'Awaken your nervous system and sharpen career focus',
    dates: 'March 22 to May 3',
    sessions: '8 weeks · Sundays 4–6pm PST',
    location: 'Remote (Zoom)',
    price: '1200',
    spotsLeft: 12,
    link: '/notify',
    linkLabel: 'Join Early-Access List',
    useModal: true,
  },
  {
    season: 'Winter',
    year: '2027',
    theme: 'Downregulation, Stillness, Shed',
    description: 'Rebuild your foundation through yoga therapy',
    dates: 'Jan 3 to Feb 28 (skip Super Bowl Sunday)',
    sessions: '8 weeks · Sundays 4–6pm PST',
    location: 'Remote (Zoom)',
    price: '1200',
    spotsLeft: 12,
    link: '/notify',
    linkLabel: 'Join Early-Access List',
    useModal: true,
  },
];

export default function CohortCards() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="seasonal-programs" className="scroll-mt-0 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        <div className="flex items-start justify-between gap-3 mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
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

              <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">
                {cohort.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
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
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-600">
                    {cohort.spotsLeft === 0 ? 'Sold out' : `${cohort.spotsLeft} spots left`}
                  </span>
                </div>
              </div>

                {cohort.useModal ? (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    {cohort.linkLabel}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : cohort.spotsLeft === 0 ? (
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                    Sold Out
                  </span>
                ) : (
                  <Link
                    to={cohort.link}
                    className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    {cohort.linkLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
            </div>
          ))}
        </div>

        <div className="border border-stone-200 rounded-2xl px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-grow">
            <h4 className="font-bold text-slate-900 mb-1">Be the first to know</h4>
            <p className="text-sm text-slate-500">
              Cohorts fill quickly and are announced to our community first. Join our early-access list.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 border border-slate-900 text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-900 hover:text-white transition-colors shrink-0"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      <NotifyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
