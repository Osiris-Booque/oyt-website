import { useState } from 'react';
import { Link } from 'react-router-dom';
import SeriesPurchaseModal from '../checkout/SeriesPurchaseModal';
import {
  PROGRAM,
  FOCAL_POINT_LIST,
  regularTotal,
  promoPerSession,
  promoTotal,
  totalDurationLabel,
  money,
} from '../../config/series';
import {
  User,
  ArrowRight,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  Layers,
  Tag,
} from 'lucide-react';
import { scrollToSection } from '../ScrollManager';

export default function PrivateSessionsCard() {
  const [purchasing, setPurchasing] = useState(false);

  return (
    <section
      id="private-sessions"
      className="scroll-mt-16 sm:scroll-mt-20 border-t border-stone-200 bg-white min-h-[calc(100vh-4rem)] flex items-start"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">

        <div className="flex items-start justify-between gap-3 mb-10 sm:mb-12">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
              <User className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
                Private Sessions
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                One-on-One
              </h2>
              <p className="text-slate-500 text-sm mt-2 max-w-xl leading-relaxed">
                These sessions are built for you. Your nervous system. Your history. Your pace.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors group shrink-0 mt-0.5"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            Back to top
          </button>
        </div>

        {/* ── THE PROGRAM CARD ──────────────────────────────────────────────
            One purchasable program. The three focal points sit inside it as
            informational cards, not separate offerings. */}
        <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm">

          {/* Program header: what it is, and what it costs */}
          <div className="bg-slate-900 text-white px-6 sm:px-10 py-8 sm:py-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    Private Yoga Therapy Program
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold leading-tight mb-3 text-white">
                  {PROGRAM.name}
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5">
                  One program, three focal points, {PROGRAM.sessionCount} sessions. Every session
                  works the same three strands — movement, probing questions, and concepts to
                  implement — and each pass takes them deeper. You finish with awareness you
                  did not have, movement your body remembers, and conclusions you reached yourself.
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    {PROGRAM.sessionCount} sessions &middot; {PROGRAM.sessionMinutes} min each
                  </span>
                  <span className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
                    {totalDurationLabel()} of 1:1 practice
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="shrink-0 lg:text-right">
                <p className="text-sm text-slate-400 mb-1">
                  <span className="line-through">{money(regularTotal)}</span>
                  <span className="ml-2 text-sage-400 font-semibold">
                    {PROGRAM.promoPercent}% off at launch
                  </span>
                </p>

                <p className="text-4xl sm:text-5xl font-extrabold leading-none mb-1">
                  {money(promoPerSession)}
                </p>
                <p className="text-sm text-slate-400 mb-4">
                  per session &middot; {money(promoTotal)} total
                </p>

                <button
                  onClick={() => setPurchasing(true)}
                  className="w-full lg:w-auto px-8 py-3.5 bg-sage-600 text-white rounded-xl text-sm font-semibold hover:bg-sage-500 transition-colors"
                >
                  Start the Program
                </button>

                <p className="text-xs text-slate-400 mt-3 max-w-xs lg:ml-auto">
                  {money(promoPerSession)} to get started &mdash; sessions are paid at time of
                  booking. Pay in full at signup for {money(PROGRAM.payInFullTotal)}.
                </p>
              </div>
            </div>

            {/* Promo code */}
            <div className="mt-7 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-3 gap-y-2">
              <Tag className="w-4 h-4 text-sage-400 shrink-0" />
              <span className="text-sm text-slate-300">
                Use code{' '}
                <code className="px-2 py-0.5 bg-white/10 rounded font-mono font-semibold text-white">
                  {PROGRAM.promoCode}
                </code>{' '}
                at checkout for {PROGRAM.promoPercent}% off.
              </span>
              <span className="text-sm text-slate-400">
                Offer ends {PROGRAM.promoEnds}.
              </span>
            </div>
          </div>

          {/* Focal points, embedded inside the program */}
          <div className="bg-slate-50 px-6 sm:px-10 py-8 sm:py-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
              Three focal points
            </p>
            <p className="text-slate-500 text-sm mb-6 max-w-2xl leading-relaxed">
              Equal parts of the same program, not separate purchases. Each one is a lens the
              four sessions move through.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {FOCAL_POINT_LIST.map((fp) => (
                <Link
                  key={fp.key}
                  to={fp.path}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 flex flex-col hover:border-slate-400 hover:shadow-sm transition-all"
                >
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    {fp.lens}
                  </span>

                  <h4 className="text-lg font-bold text-slate-900 mb-2">{fp.name}</h4>

                  <p className="text-sm text-slate-500 leading-relaxed mb-5">
                    {fp.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {fp.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                    Learn more
                    <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                to={PROGRAM.path}
                className="inline-flex items-center gap-2 px-7 py-4 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors"
              >
                See the full program
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Styled in the destination section's colour so the jump is legible. */}
        <div className="mt-14 sm:mt-20 flex justify-center">
          <button
            onClick={() => scrollToSection('seasonal-programs')}
            className="inline-flex items-center gap-2 px-7 py-4 bg-sage-600 text-white rounded-xl font-semibold text-sm hover:bg-sage-500 transition-colors"
          >
            Check out the Flow Series
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

      </div>

      {purchasing && (
        <SeriesPurchaseModal
          onClose={() => setPurchasing(false)}
          seriesName={PROGRAM.name}
          sessionCount={PROGRAM.sessionCount}
          price={money(promoTotal)}
          perSession={money(promoPerSession)}
        />
      )}
    </section>
  );
}
