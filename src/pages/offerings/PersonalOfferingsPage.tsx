import { Waves, User, CalendarDays } from 'lucide-react';
import SeasonalProgramsCards from '../../components/offerings/SeasonalProgramsCards';
import PrivateSessionsCards from '../../components/offerings/PrivateSessionsCards';
import EventsCards from '../../components/offerings/EventsCards';

const CATEGORIES = [
   {
    icon: User,
    label: 'One-on-One',
    title: 'Private Sessions',
    description: 'Private Yoga Therapy, breathwork, or integrated practice, fully personalized to your body and goals.',
    anchor: '#private-sessions',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    labelColor: 'text-slate-500',
  },
  {
    icon: Waves,
    label: 'Seasonal',
    title: 'Season Specific Programs',
    description: 'Seasonal cohort programs built around a new theme each season, with live sessions and real community.',
    anchor: '#seasonal-programs',
    iconBg: 'bg-sage-100',
    iconColor: 'text-sage-600',
    labelColor: 'text-sage-600',
  },
  {
    icon: CalendarDays,
    label: 'Immersive',
    title: 'Events & Retreats',
    description: 'Workshops, multi-day retreats, and special gatherings for deep practice.',
    anchor: '#events-retreats',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    labelColor: 'text-amber-600',
  },
];

export default function PersonalOfferingsPage() {
  return (
    <div className="pb-16 sm:pb-24">

      {/* ── DESKTOP HERO (md+): full-viewport with background image ── */}
      <div className="hidden md:block relative min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1800&h=1200&fit=crop"
          alt="Yoga and meditation practice"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlay — dark at top and bottom, clear in middle so the image shows */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/20 to-slate-900/60" />

        {/* Inner content wrapper — fills the hero, positions text top and tiles bottom */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col min-h-[calc(100vh-4rem)]">
          {/* Text — near top, matches offerings page pt-12 spacing */}
          <div className="pt-20 pl-12">
            <p className="text-sage-400 font-medium tracking-widest uppercase text-base mb-3">
              Personal Growth &amp; Wellness
            </p>
            <h1 className="text-5xl font-serif font-normal text-white mb-4 leading-tight">
              Your Practice, Your Path
            </h1>
            <p className="text-stone-300 leading-relaxed text-lg font-medium md:max-w-[50%]">
              Deepen your wellbeing with programs designed around your schedule, your body, and your
              growth edge. Three ways to practice — choose what calls to you.
            </p>
          </div>

          {/* Spacer pushes tiles toward the bottom */}
          <div className="flex-grow" />

          {/* Tiles — anchored near the bottom */}
          <div className="grid grid-cols-3 gap-4 pb-10">
            {CATEGORIES.map(({ icon: Icon, label, title, description, anchor, iconBg, iconColor, labelColor }) => (
              <a
                key={title}
                href={anchor}
                onClick={(e) => {
                  e.preventDefault();
                  const id = anchor.replace('#', '');
                  const el = document.getElementById(id);
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
                className="group flex flex-col bg-white/90 backdrop-blur-sm border border-white/30 rounded-2xl p-6 hover:bg-white hover:shadow-card transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <span className={`text-xs font-semibold ${labelColor} uppercase tracking-widest`}>
                    {label}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">{title}</h2>
                <p className="text-sm text-slate-500 leading-relaxed flex-grow">{description}</p>
                <div className="flex items-center gap-1 mt-4 text-slate-400 text-xs font-semibold group-hover:text-slate-600 transition-colors">
                  Learn more ↓
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE LAYOUT (below md): solid background, text + 3-col tiles ── */}
      <div className="md:hidden bg-stone-50 px-4 pt-10 pb-10">
        <p className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-3">
          Personal Growth &amp; Wellness
        </p>
        <h1 className="text-3xl font-serif font-normal text-slate-900 mb-3 leading-tight">
          Your Practice, Your Path
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xl mb-8">
          Deepen your wellbeing with programs designed around your schedule, your body, and your
          growth edge. Three ways to practice — choose what calls to you.
        </p>

        {/* 3-col grid — no stacking on mobile */}
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map(({ icon: Icon, label, title, description, anchor, iconBg, iconColor, labelColor }) => (
            <a
              key={title}
              href={anchor}
              onClick={(e) => {
                e.preventDefault();
                const id = anchor.replace('#', '');
                const el = document.getElementById(id);
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY;
                  window.scrollTo({ top, behavior: 'smooth' });
                }
              }}
              className="group flex flex-col bg-white border border-stone-200 rounded-2xl p-4 hover:border-sage-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <span className={`text-[10px] font-semibold ${labelColor} uppercase tracking-widest leading-tight`}>
                  {label}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed flex-grow">{description}</p>
              <div className="mt-3 text-slate-400 text-[10px] font-semibold group-hover:text-slate-600 transition-colors">
                Learn more ↓
              </div>
            </a>
          ))}
        </div>
      </div>
      
      {/* Section 1: Private Sessions */}
      <PrivateSessionsCards />
      
      {/* Section 2: Seasonal Programs (Flow Series) */}
      <SeasonalProgramsCards />

      {/* Section 3: Events & Retreats */}
      <EventsCards />

    </div>
  );
}
