import { Waves, ArrowUp } from 'lucide-react';
import FlowSeriesCard from './FlowSeriesCard';


const COHORT = {
  season: 'Spring',
  year: '2026',
  theme: 'Career & Expansion',
  dates: 'March 22 – May 03, 2026',
  sessions: '8 weeks · Sundays 4–6pm PST',
  price: '$1200',
  spotsLeft: 3,
};

export default function SeasonalProgramsCard() {
  return (
    <section id="seasonal-programs" className="scroll-mt-0 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        <div className="flex items-start justify-between gap-3 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center shrink-0 mt-0.5">
              <Waves className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-sage-600 uppercase tracking-widest mb-1">
                Seasonal Programs
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                Flow Series
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
                A cohort-based 8-week program that runs each season with a unique theme. Live sessions,
                real community, lasting transformation.
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

        <FlowSeriesCard cohort={COHORT} />

      </div>
    </section>
  );
}
