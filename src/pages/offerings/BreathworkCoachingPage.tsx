import { Link } from 'react-router-dom';
import { User, CheckCircle2, ArrowRight, Clock, Wind, MessageCircle } from 'lucide-react';
import { Star } from 'lucide-react';

const PROTOCOLS = [
  { title: 'Nervous System Regulation', desc: 'Breathing patterns designed to shift your body out of fight-or-flight and into a calm, grounded state. Useful for anxiety, overwhelm, and chronic stress.' },
  { title: 'Energy & Focus Activation', desc: 'Functional breathwork protocols that increase alertness and mental clarity without stimulants — ideal before a demanding workday or creative session.' },
  { title: 'Transformational Breathwork', desc: 'Deeper, sustained breathing practices that access layers of the body and mind not easily reached through movement alone. Held in a safe, supported container.' },
  { title: 'Sleep & Recovery', desc: 'Protocols for down-regulating the nervous system before sleep, reducing evening cortisol, and building a consistent nighttime recovery ritual.' },
];

const WHO_ITS_FOR = [
  'Chronic stress, anxiety, or burnout',
  'Difficulty sleeping or recovering',
  'Mental fog or low energy',
  'Emotional processing and integration work',
  'Athletes or high-performers optimizing recovery',
  'Those curious about breathwork but unsure where to start',
];

const TESTIMONIALS = [
  {
    name: 'Alex T.',
    quote: "I've tried breathwork before and always felt like I was \"doing it wrong.\" Having a coach made all the difference — I finally understood what I was feeling.",
    stars: 5,
  },
  {
    name: 'Sam R.',
    quote: 'Two sessions in and my sleep has completely changed. I have a 10-minute protocol I do every night now.',
    stars: 5,
  },
  {
    name: 'Jordan K.',
    quote: 'The transformational session was one of the most unexpected experiences of my life. Incredibly well held.',
    stars: 5,
  },
];

const DURATIONS = [
  { label: '45 min', desc: 'Best for first-time clients and functional protocol sessions.', recommended: true },
  { label: '75 min', desc: 'Recommended for transformational or deeper integration sessions.', recommended: false },
];

export default function BreathworkCoachingPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 h-96">
          <img
            src="https://images.pexels.com/photos/3822668/pexels-photo-3822668.jpeg?auto=compress&cs=tinysrgb&w=1920&h=700&fit=crop"
            alt="Breathwork coaching session"
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
              Breathwork Coaching
            </h1>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mb-5 sm:mb-6">
              One-on-one guided sessions using specific breathing protocols to shift your state, regulate your nervous system, and access deeper awareness and calm.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-white/80"><Clock className="w-4 h-4" /> 45 or 75 min sessions</span>
              <span className="flex items-center gap-1.5 text-white/80"><Wind className="w-4 h-4" /> Guided breathing protocols</span>
              <span className="flex items-center gap-1.5 text-white/80"><MessageCircle className="w-4 h-4" /> Virtual via Zoom</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">

          <div className="lg:col-span-2 space-y-10 sm:space-y-12 order-2 lg:order-1">

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What is breathwork coaching?</h2>
              <div className="text-slate-600 leading-relaxed space-y-4 text-base">
                <p>
                  Breathwork coaching is a personalized, guided practice using specific breathing techniques to produce measurable shifts in your nervous system, energy, and mental clarity. Unlike group breathwork classes, these sessions are one-on-one — meaning the protocol, pacing, and support are completely adapted to you.
                </p>
                <p>
                  Sessions range from practical, functional protocols you can use daily — for sleep, focus, or stress — to deeper, transformational experiences that access the body and mind in ways that movement alone cannot reach.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Session protocols</h2>
              <div className="space-y-4">
                {PROTOCOLS.map((item, i) => (
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
                            <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Start here</span>
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
                      'Health history intake before your first session',
                      'Personalized protocol selection',
                      'Home practice breathing recommendations',
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

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-slate-700 mb-1">Also consider</p>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">Want breathwork woven into movement and somatic work? Explore integrated practice sessions.</p>
                <Link
                  to="/offerings/private-sessions/integrated-practice"
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Integrated Practice
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
