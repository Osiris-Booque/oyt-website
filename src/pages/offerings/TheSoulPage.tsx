import { Link } from 'react-router-dom';
import { User, CheckCircle2, ArrowRight, Clock, Star, MessageCircle } from 'lucide-react';

const WHAT_TO_EXPECT = [
  { title: 'Befriending the Body', desc: 'Spiritual and energetic identity is not separate from the body · it is expressed through it. This opening yoga therapy session grounds the soul work in somatic reality, developing interoceptive awareness and establishing a compassionate relationship with physical experience as the foundation for the deeper energetic work ahead.' },
  { title: 'Befriending the Two Spirit', desc: 'Both sides of you are real. Both deserve space. Drawing on the Two-Spirit concept as a framework for exploring inner duality · this yoga therapy session guides you in recognizing, honoring, and integrating the opposites you carry. Research in psychosynthesis and Jungian somatic psychology supports the therapeutic value of engaging with inner dualities rather than suppressing them.' },
  { title: 'Befriending the Feminine', desc: 'Your feminine energy is not a phase. It is a frequency. This yoga therapy session draws on somatic and depth psychology frameworks to guide you in reconnecting with feminine qualities · receptivity, intuition, cyclical awareness, self-compassion, and creative expression. These are universal therapeutic capacities present in all people.' },
  { title: 'Befriending the Masculine', desc: 'Grounded presence is the most powerful thing you can offer. This yoga therapy session draws on somatic and depth psychology frameworks to guide you in reconnecting with masculine qualities · focus, clarity, assertive expression, and aligned action. These are universal therapeutic capacities available to all people regardless of gender. The masculine here is not about dominance. It is about alignment.' },
];

const INTENDED_OUTCOMES = [
  'Recognition and embodied integration of inner dualities and energies',
  'Deeper somatic connection to feminine and masculine therapeutic capacities',
  'Greater parasympathetic nervous system regulation and capacity for rest',
  'Reduced internal conflict between contrasting energies or identities',
  'Embodied alignment between inner experience and outward expression',
];

const TESTIMONIALS = [
  {
    name: 'Dana M.',
    quote: 'After two years of back pain, this was the first thing that actually helped. The sessions are thoughtful, unhurried, and completely adapted to my body.',
    stars: 5,
  },
  {
    name: 'Chris W.',
    quote: 'I came in skeptical. I left with a completely different relationship to how I move. The assessment alone was worth it.',
    stars: 5,
  },
  {
    name: 'Priya S.',
    quote: "Not like any yoga class I've taken before. This feels like working with someone who actually sees you.",
    stars: 5,
  },
];

export default function TheSoulPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 h-96">
          <img
            src="https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1920&h=700&fit=crop"
            alt="Yoga therapy session"
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
              The Soul
            </h1>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mb-5 sm:mb-6">
              This is where we begin.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-white/80"><Clock className="w-4 h-4" /> 35 min sessions</span>
              <span className="flex items-center gap-1.5 text-white/80"><User className="w-4 h-4" /> 1:1 with your instructor</span>
              <span className="flex items-center gap-1.5 text-white/80"><MessageCircle className="w-4 h-4" /> Virtual via Zoom</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 sm:gap-10">

          <div className="lg:col-span-2 space-y-10 sm:space-y-12 order-2 lg:order-1">

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Why the soul?</h2>
              <div className="text-slate-600 leading-relaxed space-y-4 text-base">
                <p>
                  The Soul track is a 4-session yoga therapy series for people whose relationship with their energetic identity, inner dualities, and spiritual self is where the deepest work lives. Each session is 35 minutes. We move through the Two Spirit essence, the feminine, and the masculine · exploring how the energies you carry and the dualities within you shape how you inhabit your body and move through the world.</p>
                <p>
                  At Osiris Yoga Therapy, I work directly with the somatic architecture of how you hold and release, how you brace and open, how your nervous system has learned to protect you. Drawing from Phoenix Rising Yoga Therapy and research in interoception the brain's capacity to sense internal body states these sessions develop the kind of self-awareness that changes how you move through every room, every relationship, every decision. Not by fixing what's wrong. By coming home to what's already there.</p>
                <p>This is not a spiritual bypass. It is embodied soul work, grounded in yoga therapy principles and somatic psychology.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What to expect in a session</h2>
              <div className="space-y-4">
                {WHAT_TO_EXPECT.map((item, i) => (
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
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Intended outcomes</h2>
              <ul className="space-y-2.5">
                {INTENDED_OUTCOMES.map((item) => (
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

            </div>
      </section>
    </div>
  );
}
