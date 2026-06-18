import { Link } from 'react-router-dom';
import { User, CheckCircle2, ArrowRight, Clock, Layers, MessageCircle } from 'lucide-react';
import { Star } from 'lucide-react';

const HOW_IT_WORKS = [
  { title: 'Dynamic Check-in', desc: 'Each session begins with a conversation about where you are physically, mentally, and emotionally that day — shaping exactly what comes next.' },
  { title: 'Movement Foundation', desc: 'Yoga therapy-informed movement sequences warm and open the body, tuning your nervous system and preparing you to go deeper.' },
  { title: 'Breathwork Integration', desc: 'Breathwork is woven in fluidly — not bolted on at the end — to amplify and extend what the movement has already begun.' },
  { title: 'Somatic Exploration', desc: 'Space is held for what arises: sensation, emotion, insight, stillness. The session closes with integration time and a home practice recommendation.' },
];

const WHO_ITS_FOR = [
  'Clients who have experienced yoga therapy and breathwork separately',
  'Those with specific goals spanning multiple modalities',
  'People navigating significant stress, grief, or transition',
  'Anyone seeking the deepest level of personalized practice available',
  'Practitioners ready to move beyond technique into integration',
];

const TESTIMONIALS = [
  {
    name: 'Riley M.',
    quote: "I've never experienced anything quite like this. The way movement and breath weave together in a single session is unlike anything I've tried.",
    stars: 5,
  },
  {
    name: 'Avery J.',
    quote: 'After going through a difficult year, these sessions became my anchor. The integration time at the end alone was worth it.',
    stars: 5,
  },
  {
    name: 'Taylor B.',
    quote: "I came in with a long list of goals. What I got was something I didn't know how to ask for — but exactly what I needed.",
    stars: 5,
  },
];

const DURATIONS = [
  { label: '75 min', desc: 'A full integrated session with time for each modality and integration.', recommended: false },
  { label: '90 min', desc: 'The most spacious format — recommended for first sessions and deeper work.', recommended: true },
];

export default function IntegratedPracticePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 h-96">
          <img
            src="https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=1920&h=700&fit=crop"
            alt="Integrated practice session"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/75 via-slate-900/50 to-slate-900/85" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-8 sm:pb-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <User className="w-5 h-5 text-slate-300" />
              <span className="text-slate-300 font-medium tracking-widest uppercase text-xs sm:text-sm">Private Sessions</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Integrated Practice
            </h1>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mb-5 sm:mb-6">
              A fluid blend of yoga therapy, breathwork, and somatic movement in a single session. The deepest level of personalization — designed around what you need most that day.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-white/80"><Clock className="w-4 h-4" /> 75 or 90 min sessions</span>
              <span className="flex items-center gap-1.5 text-white/80"><Layers className="w-4 h-4" /> Multi-modality approach</span>
              <span className="flex items-center gap-1.5 text-white/80"><MessageCircle className="w-4 h-4" /> Virtual via Zoom</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">

          <div className="lg:col-span-2 space-y-10 sm:space-y-12 order-2 lg:order-1">

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What is integrated practice?</h2>
              <div className="text-slate-600 leading-relaxed space-y-4 text-base">
                <p>
                  Integrated practice sessions bring together yoga therapy, guided breathwork, and somatic movement into a single, fluid experience. Rather than treating these modalities as separate disciplines, the session is designed as one continuous journey — each element informing and deepening the next.
                </p>
                <p>
                  No two sessions are the same. Your instructor designs each one around what your body and mind need most that day. It is the most versatile, adaptive, and personally demanding format we offer — and the most transformational.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">How a session flows</h2>
              <div className="space-y-4">
                {HOW_IT_WORKS.map((item, i) => (
                  <div key={item.title} className="flex gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-slate-600">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-0.5">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Who is it for?</h2>
              <ul className="space-y-2.5">
                {WHO_ITS_FOR.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-slate-600 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What clients say</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TESTIMONIALS.map((t) => (
                  <div key={t.name} className="bg-white rounded-2xl border border-slate-200 p-5">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24 space-y-4">

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Session lengths</p>
                  <div className="space-y-3">
                    {DURATIONS.map((d) => (
                      <div key={d.label} className={`rounded-xl p-4 border ${d.recommended ? 'border-slate-300 bg-slate-50' : 'border-slate-200 bg-white'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{d.label}</span>
                          {d.recommended && (
                            <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Recommended</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{d.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Also included</p>
                  <ul className="space-y-3">
                    {[
                      'Personalized session design every time',
                      'Integration time and reflection at close',
                      'Home practice and follow-up guidance',
                      'Flow Series discount (if enrolled)',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6">
                  <Link
                    to="/contact"
                    className="group flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-base hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Book a Session
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <p className="text-center text-xs text-slate-400 mt-3">
                    Reach out and we'll find a time that works
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">New to private sessions?</p>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">Start with yoga therapy or breathwork coaching to build familiarity before moving to integrated practice.</p>
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/offerings/private-sessions/yoga-therapy"
                      className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      Yoga Therapy
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/offerings/private-sessions/breathwork-coaching"
                      className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      Breathwork Coaching
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
