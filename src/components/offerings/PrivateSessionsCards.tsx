import { Link } from 'react-router-dom';
import { User, ArrowRight, CheckCircle2, Clock, Star, ArrowUp } from 'lucide-react';

const SESSION_TYPES = [
  {
    title: 'The Body',
    price: 'From $400',
    duration: '4 sessions • 35 min each',
    description:
      'A yoga therapy track for those whose relationship with their physical self is where the deepest work lives. We move through foundational somatic awareness, embodied strength, structural balance, and nervous system regulation building from the inside out.',
    highlights: [
      'Interoceptive awareness and somatic grounding',
      'Embodied strength and proprioceptive stability',
      'Parasympathetic nervous system regulation',
    ],
    link: '/offerings/private-sessions/the-body',
  },
  {
    title: 'The Mind',
    price: 'From $300',
    duration: '3 sessions • 35 min each',
    description:
      'A yoga therapy track for those whose relationship with their emotional and mental experience is where the deepest work lives. We apply the full yoga therapy framework through the lens of somatic-emotional and somatic-cognitive awareness.',
    highlights: [
      'Somatic-emotional awareness and regulation',
      'Metacognitive observation of thought patterns',
      'Embodied mental and emotional yoga therapy practice',
    ],
    link: '/offerings/private-sessions/the-mind',
  },
  {
    title: 'The Soul',
    price: 'From $400',
    duration: '4 sessions • 35 min each',
    description:
      'A yoga therapy track for those whose relationship with their energetic identity, inner dualities, and spiritual self is where the deepest work lives. We explore how the energies you carry shape how you inhabit your body and move through the world.',
    highlights: [
      'Integration of inner dualities and energetic identity',
      'Somatic exploration of feminine, masculine, and Two Spirit energies',
      'Embodied soul work grounded in yoga therapy principles',
    ],
    link: '/offerings/private-sessions/the-soul',
  },
];

export default function PrivateSessionsCard() {
  return (
    <section id="private-sessions" className="scroll-mt-0 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        <div className="flex items-start justify-between gap-3 mb-8">
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
                These sessions are built for you. Your nervous system. Your history. Our pace.
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
            <Link
              key={session.title}
              to={session.link}
              className="group bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  {session.duration}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">{session.title}</h3>
              <p className="text-sm font-semibold text-slate-700 mb-2">{session.price}</p>
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

              <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                Learn more
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
