import { Link } from 'react-router-dom';
import { useState } from 'react';
import SeriesPurchaseModal from '../../components/checkout/SeriesPurchaseModal';
import {
  PROGRAM,
  FOCAL_POINT_LIST,
  SESSION_ARC,
  PROGRAM_STRANDS,
  PROGRAM_OUTCOMES,
  NEXT_STEPS,
  regularTotal,
  promoPerSession,
  promoTotal,
  payInFullSaving,
  totalDurationLabel,
  money,
} from '../../config/series';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Tag,
  Layers,
  Repeat,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

const STRAND_ICONS = [Repeat, HelpCircle, Lightbulb];

export default function ProgramPage() {
  const [purchasing, setPurchasing] = useState(false);

  return (
    <div className="bg-stone-50">

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Link
            to="/offerings/personal#private-sessions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Personal Offerings
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-sage-400" />
            <span className="text-xs font-semibold text-sage-400 uppercase tracking-widest">
              Private Yoga Therapy Program
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 text-white">
            {PROGRAM.name}
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
            A {PROGRAM.sessionCount}-session private yoga therapy program built around three
            focal points — the body, the mind, and the soul. You may arrive with no exposure to
            any of it. You leave with awareness, muscle memory, and conclusions that are yours.
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <span className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              {PROGRAM.sessionCount} sessions &middot; {PROGRAM.sessionMinutes} minutes each
            </span>
            <span className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
              {totalDurationLabel()} of one-to-one practice
            </span>
            <span className="flex items-center gap-2 text-sm text-slate-300">
              <Layers className="w-4 h-4 text-slate-500 shrink-0" />
              Three focal points, one program
            </span>
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Pay per session */}
            <div className="p-8 sm:p-10 border-b md:border-b-0 md:border-r border-stone-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Pay as you go
              </p>

              <p className="text-sm text-slate-400 mb-1">
                <span className="line-through">{money(PROGRAM.perSessionRegular)}</span>
                <span className="ml-2 text-sage-700 font-semibold">
                  {PROGRAM.promoPercent}% off
                </span>
              </p>

              <p className="text-5xl font-extrabold text-slate-900 leading-none mb-2">
                {money(promoPerSession)}
              </p>
              <p className="text-sm text-slate-500 mb-6">
                per session &middot; {money(promoTotal)} across the program
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                {money(promoPerSession)} to get started. Each session is paid at the time you
                book it, so nothing is owed in advance.
              </p>
            </div>

            {/* Pay in full */}
            <div className="p-8 sm:p-10 bg-sage-50">
              <p className="text-xs font-semibold text-sage-700 uppercase tracking-widest mb-3">
                Pay in full &middot; best value
              </p>

              <p className="text-sm text-slate-400 mb-1">
                <span className="line-through">{money(regularTotal)}</span>
                <span className="ml-2 text-sage-700 font-semibold">
                  save {money(regularTotal - PROGRAM.payInFullTotal)}
                </span>
              </p>

              <p className="text-5xl font-extrabold text-slate-900 leading-none mb-2">
                {money(PROGRAM.payInFullTotal)}
              </p>
              <p className="text-sm text-slate-500 mb-6">
                the whole program &middot; a further {money(payInFullSaving)} off
              </p>

              <button
                onClick={() => setPurchasing(true)}
                className="w-full px-8 py-4 bg-sage-600 text-white rounded-xl text-sm font-semibold hover:bg-sage-500 transition-colors"
              >
                Start the Program
              </button>
            </div>
          </div>

          {/* Promo code */}
          <div className="px-8 sm:px-10 py-5 bg-slate-900 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Tag className="w-4 h-4 text-sage-400 shrink-0" />
            <span className="text-sm text-slate-200">
              Use code{' '}
              <code className="px-2 py-0.5 bg-white/10 rounded font-mono font-semibold text-white">
                {PROGRAM.promoCode}
              </code>{' '}
              at checkout to apply {PROGRAM.promoPercent}% off.
            </span>
            <span className="text-sm text-slate-400">
              Launch offer &mdash; ends {PROGRAM.promoEnds}.
            </span>
          </div>
        </div>
      </section>

      {/* ── APPROACH: the three strands ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <p className="text-xs font-semibold text-sage-700 uppercase tracking-widest mb-2">
          The approach
        </p>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Every session works the same three strands
        </h2>
        <p className="text-slate-500 leading-relaxed max-w-2xl mb-10">
          What changes from session to session is not the ingredients. It is the depth you
          bring to them. The structure stays constant on purpose, because repetition is what
          turns instruction into capability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROGRAM_STRANDS.map((strand, i) => {
            const Icon = STRAND_ICONS[i];
            return (
              <div
                key={strand.title}
                className="bg-white border border-stone-200 rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-sage-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{strand.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{strand.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── STRUCTURE: the four-session arc ────────────────────────────── */}
      <section className="bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-xs font-semibold text-sage-700 uppercase tracking-widest mb-2">
            The structure
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Four sessions, each one deeper than the last
          </h2>
          <p className="text-slate-500 leading-relaxed max-w-2xl mb-10">
            You may start session one with no awareness of the concepts, no exposure to the
            movements, and no view on the questions. That is the expected starting point. Each
            subsequent session deepens all three.
          </p>

          <ol className="space-y-5">
            {SESSION_ARC.map((session) => (
              <li
                key={session.number}
                className="flex gap-5 bg-stone-50 border border-stone-200 rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {session.number}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">{session.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{session.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── THE THREE FOCAL POINTS ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <p className="text-xs font-semibold text-sage-700 uppercase tracking-widest mb-2">
          The focal points
        </p>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Three equal parts of one program
        </h2>
        <p className="text-slate-500 leading-relaxed max-w-2xl mb-10">
          The body, the mind, and the soul are not three separate offerings. They are three
          lenses the same four sessions move through. Each has its own depth, and each has a
          page of its own if you want to understand it properly before you begin.
        </p>

        <div className="space-y-5">
          {FOCAL_POINT_LIST.map((fp, i) => (
            <div
              key={fp.key}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-56 shrink-0 bg-slate-900 text-white p-6 flex md:flex-col md:justify-center gap-3 md:gap-1 items-center md:items-start">
                <span className="text-4xl font-extrabold text-slate-700 leading-none">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-bold leading-tight text-white">{fp.name}</h3>
                  <p className="text-xs text-sage-400 uppercase tracking-widest mt-1">
                    {fp.lens}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-grow">
                <p className="text-sm text-slate-500 leading-relaxed mb-5">{fp.description}</p>

                <ul className="space-y-2 mb-6">
                  {fp.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-sage-600 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  to={fp.path}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Explore {fp.name}
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── OUTCOMES ───────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-semibold text-sage-700 uppercase tracking-widest mb-2">
                The goal
              </p>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                What you leave with
              </h2>
              <p className="text-slate-500 leading-relaxed">
                The end state is not a feeling. It is a capability. By the fourth session the
                movements are held in muscle memory, the concepts have been deliberated over
                long enough to be genuinely yours, and the awareness that was absent at the
                start is now something you can apply without being guided through it.
              </p>
              <p className="text-slate-500 leading-relaxed mt-4">
                That is what makes the program a foundation rather than an experience — it is
                built to be carried forward into whatever comes next.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {PROGRAM_OUTCOMES.map((outcome) => (
                <div
                  key={outcome}
                  className="flex items-start gap-3 bg-stone-50 border border-stone-200 rounded-xl p-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-sage-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-700 leading-relaxed">{outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT COMES NEXT ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <p className="text-xs font-semibold text-sage-700 uppercase tracking-widest mb-2">
          After the program
        </p>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Where it goes next</h2>
        <p className="text-slate-500 leading-relaxed max-w-2xl mb-10">
          The foundation is built to be applied forward. Once the four sessions are complete,
          we discuss which direction fits what surfaced during the work.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {NEXT_STEPS.map((step) => (
            <div key={step.title} className="bg-white border border-stone-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CLOSING CTA ────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="bg-slate-900 rounded-3xl px-8 sm:px-12 py-10 sm:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-white mb-2">Ready to begin?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {money(promoPerSession)} to get started, paid at the time you book. Or{' '}
              {money(PROGRAM.payInFullTotal)} for the whole program at signup. Use code{' '}
              <code className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-white">
                {PROGRAM.promoCode}
              </code>{' '}
              before {PROGRAM.promoEnds}.
            </p>
          </div>

          <button
            onClick={() => setPurchasing(true)}
            className="shrink-0 px-8 py-4 bg-sage-600 text-white rounded-xl font-semibold text-sm hover:bg-sage-500 transition-colors whitespace-nowrap"
          >
            Start the Program
          </button>
        </div>
      </section>

      {purchasing && (
        <SeriesPurchaseModal
          onClose={() => setPurchasing(false)}
          seriesName={PROGRAM.name}
          sessionCount={PROGRAM.sessionCount}
          price={money(promoTotal)}
          perSession={money(promoPerSession)}
        />
      )}
    </div>
  );
}
