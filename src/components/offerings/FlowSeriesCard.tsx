import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Check, Clock, Waves } from 'lucide-react';

type Cohort = {
  season: string;
  year: string;
  theme: string;
  dates: string;
  sessions: string;
  price: string;
  spotsLeft: number;
};

type Props = {
  cohort: Cohort;
};

export default function FlowSeriesCard({ cohort }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">

      <div className="bg-sage-600 px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-sage-200" />
          <span className="text-sage-100 text-sm font-semibold tracking-widest uppercase">
            Flow Series — {cohort.season} {cohort.year}
          </span>
        </div>
        <div className="sm:text-right">
          <div className="text-2xl font-bold text-white">{cohort.price}</div>
          <div className="text-xs text-sage-200 mt-0.5">one-time</div>
        </div>
      </div>

      <div className="p-6 sm:p-8">

        <div className="mb-8">
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
              "{cohort.theme}"
            </h3>
            <div className="flex flex-col sm:grid gap-6" style={{ gridTemplateColumns: 'repeat(3, auto)' }}>
              {[
                {
                  label: 'Focus',
                  items: ['Activation', 'Upregulation', 'Growth'],
                },
                {
                  label: 'Goals',
                  items: ['Expand your energy', 'Stimulate your curiosity', 'Establish agency', 'Build resilience within your nervous system'],
                },
                {
                  label: 'Practice Areas',
                  items: ['Flow-based movement', 'Breathwork for energy mobilization', 'Goal setting for career and/or entrepreneurial accomplishments', 'Creative expression from learning to listen to your inner voice and create from your visions'],
                },
              ].map(({ label, items }) => (
                <div key={label} className="bg-stone-50 rounded-xl p-4 border border-stone-100 flex flex-col">
                  <p className="text-xs font-bold text-sage-600 uppercase tracking-widest mb-3">{label}</p>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-sage-100 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-sage-600" strokeWidth={3} />
                        </span>
                        <span className="text-sm text-slate-600 leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-sage-500 shrink-0" />
            {cohort.dates}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="w-4 h-4 text-sage-500 shrink-0" />
            {cohort.sessions}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-base font-semibold text-slate-800 mb-2">
            What is the Flow Series?
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            The Flow Series is a live, cohort-based program that meets bi-weekly for 8 weeks. This is not one of those pre-recorded programs you watch alone — it's a living breathing community with engaging sessions filled with vibrant energy. Each module combines yoga movements and pranayama, with reflective inquiry and group interaction. You'll move your body, learn to connect with your nervous system, and build new connections for sustainable personal growth you can continue to use as you expand in your daily life.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/checkout/spring-cohort/register"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-sage-600 text-white rounded-xl font-semibold text-sm hover:bg-sage-700 transition-colors"
          >
            Enroll Today — {cohort.price}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/offerings/flow-series"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-stone-200 text-slate-700 rounded-xl font-semibold text-sm hover:border-sage-300 hover:text-sage-700 transition-colors"
          >
            Full program details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
