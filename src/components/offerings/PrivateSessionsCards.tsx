import { useState } from 'react';
import { Link } from 'react-router-dom';
import SeriesPurchaseModal from '../checkout/SeriesPurchaseModal';
import { SERIES, priceLabel, perSessionLabel } from '../../config/series';
import type { Series } from '../../config/series';
import { User, ArrowRight, CheckCircle2, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { scrollToSection } from '../ScrollManager';

const SESSION_TYPES = [
  {
    series: SERIES.body,
    title: 'The Body',
    duration: '4 sessions • 35 min each',
    description:
      'A yoga therapy track for those whose relationship with their physical self is where the deepest work lives. We move through foundational somatic awareness, embodied strength, structural balance, and nervous system regulation building from the inside out.',
    highlights: [
      'Interoceptive awareness and somatic grounding',
      'Embodied strength and proprioceptive stability',
      'Parasympathetic nervous system regulation',
    ],
    link: '/offerings/personal/the-body',
  },
  {
    series: SERIES.mind,
    title: 'The Mind',
    duration: '3 sessions • 35 min each',
    description:
      'A yoga therapy track for those whose relationship with their emotional and mental experience is where the deepest work lives. We apply the full yoga therapy framework through the lens of somatic-emotional and somatic-cognitive awareness.',
    highlights: [
      'Somatic-emotional awareness and regulation',
      'Metacognitive observation of thought patterns',
      'Embodied mental and emotional yoga therapy practice',
    ],
    link: '/offerings/personal/the-mind',
  },
  {
    series: SERIES.soul,
    title: 'The Soul',
    duration: '4 sessions • 35 min each',
    description:
      'A yoga therapy track for those whose relationship with their energetic identity, inner dualities, and spiritual self is where the deepest work lives. We explore how the energies you carry shape how you inhabit your body and move through the world.',
    highlights: [
      'Integration of inner dualities and energetic identity',
      'Somatic exploration of feminine, masculine, and Two Spirit energies',
      'Embodied soul work grounded in yoga therapy principles',
    ],
    link: '/offerings/personal/the-soul',
  },
];

export default function PrivateSessionsCard() {
  const [purchasing, setPurchasing] = useState<Series | null>(null);

  return (
    <section id="private-sessions" className="scroll-mt-16 sm:scroll-mt-20 border-t border-stone-200 bg-white min-h-[calc(100vh-4rem)] flex items-center">
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
              <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
                These sessions are built for you. Your nervous system. Your history. Your pace.<br /> 
                Private sessions are {perSessionLabel(SERIES.body)} each and offered only as a complete program. Each program is one portion of the series, start with the program you feel called to most. After completing it we will discuss which feels best for you to focus on next.
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SESSION_TYPES.map((session) => (
            <div
              key={session.title}
              className="group bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  {session.duration}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">{session.title}</h3>
              <p className="text-sm font-semibold text-slate-700 mb-2">{session.series.marketingPrice}</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-grow">
                {session.description}
              </p>

              <ul className="space-y-2 mb-6">
                {session.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Same split as the team offering cards: two equal halves, each
                  action centred in its own half, button a third of the card. */}
              <div className="mt-auto grid grid-cols-2 items-center gap-2">
                <div className="flex justify-center">
                  <Link
                    to={session.link}
                    className="flex items-center gap-1.5 py-3 text-sm font-semibold text-sage-700 hover:text-sage-900 transition-colors"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                </div>
              
                <div className="flex justify-center">
                  <button
                    onClick={() => setPurchasing(session.series)}
                    className="flex items-center justify-center text-center w-2/3 py-3 bg-sage-600 text-white rounded-lg text-sm font-semibold hover:bg-sage-500 transition"
                  >
                    Start This Series
                  </button>
                </div>
              </div>
            </div>
          ))}
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
          onClose={() => setPurchasing(null)}
          seriesName={purchasing.name}
          sessionCount={purchasing.sessionCount}
          price={priceLabel(purchasing)}
          perSession={perSessionLabel(purchasing)}
        />
      )}
    </section>
  );
}
