import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Users, ArrowRight,
  CheckCircle2, Star, Waves
} from 'lucide-react';

const CURRICULUM = [
  { week: '1–2', title: 'Befriending Awareness', desc: 'Learn to notice where you are without judgment, turning self-awareness into your greatest ally for growth.' },
  { week: '3–4', title: 'Accepting Choice', desc: 'Recognize that where you are now is the result of choices, and that you hold the power to choose differently.' },
  { week: '5–6', title: 'Discerning Truth', desc: 'Cut through the noise of fear and expectation to identify what is genuinely true about who you are and where you are headed.' },
  { week: '7–8', title: 'Truth Flows into Action', desc: 'Pranayama and breathwork ceremonies. Exploring the connection between breath, emotion, and transformation.' },
];

const TESTIMONIALS = [
  {
    name: 'Morgan K.',
    cohort: 'Fall 2025',
    quote: 'Flow Series gave me tools I use every single day. The community aspect was unexpected and profoundly moving.',
    stars: 5,
  },
  {
    name: 'Jamie L.',
    cohort: 'Summer 2025',
    quote: 'I\'ve done a lot of wellness programs. This was the first one that actually changed how I relate to my own body.',
    stars: 5,
  },
  {
    name: 'Taylor R.',
    cohort: 'Fall 2025',
    quote: 'The live Sunday sessions became the highlight of my week. I didn\'t expect to make friends in a yoga cohort — I did.',
    stars: 5,
  },
];

const WHATS_INCLUDED = [
  '4 bi-weekly live zoom based sessions with your entire cohort',
  'Community forum for you and your cohort members to connect 1:1 and as a group',
  'Weekly reflection guides and video practices with journaling prompts and at home exercises',
  'Certificate of completion and automatic acceptance into join future cohorts (space permitting)',
  'Lifetime access to downloadable session recordings',
  'Discounted pricing for all 1:1 private sessions for 1 year',
];

export default function FlowSeriesPage() {
  return (
    <div>
      <section id="overview" className="relative overflow-hidden">
        <div className="absolute inset-0 h-96">
          <img
            src="https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1920&h=700&fit=crop"
            alt="Flow Series"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-8 sm:pb-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Waves className="w-5 h-5 text-sage-400" />
              <span className="text-sage-400 font-medium tracking-widest uppercase text-xs sm:text-sm">Flow Series</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Spring 2026
              <span className="block text-sage-400 text-xl sm:text-3xl lg:text-4xl font-semibold mt-1">"Career & Expansion"</span>
            </h1>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mb-5 sm:mb-6">
              8-week cohort experience weaving movement, breath, and community into a practice that transforms how you approach your goals.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-white/80"><Calendar className="w-4 h-4" /> March 22 - May 3, 2026</span>
              <span className="flex items-center gap-1.5 text-white/80"><Clock className="w-4 h-4" /> Sundays, 4-6pm PST</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          <div className="lg:col-span-2 space-y-10 sm:space-y-12 order-2 lg:order-1">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">What is the Flow Series?</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4 text-base">
                <p>
                  The Flow Series is a live, cohort-based program that meets bi-weekly for 8 weeks. This is not one of those pre-recorded programs you watch alone — it's a living breathing community with engaging sessions filled with vibrant energy. Each module combines yoga movements and pranayama, with reflective inquiry and group interaction. You'll move your body, learn to connect with your nervous system, and build new connections for sustainable personal growth you can continue to use as you expland in your daily life.
                </p>
              </div>
              <br>
              </br>
                <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-5">Who is the Spring cohort designed for?</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4 text-base">
                <p>
                  This module has been carefully crafted to help you improve your professional path, deepen your creative intuition, and engage your fullest self for future pursuits. 
                </p>
              <br>
              </br>
                <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-5">What is the theme for the Spring cohort?</h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4 text-base">
              </div>
                </div>
                <p>
                <strong>Career development and personal expansion</strong>, our Spring theme explores how we approach returning to ourselves after two seasons of depletion, change, and hibernation. Perfect for stepping into Spring ready to begin anew. Spring is the time for new beginnings and powerful activations. Flow into Spring's modules help you develop the habits you'll need to succeed, as you learn to integrate sustainable regulation skills with powerful action mechanisms that lead to progress and expansion. 
                </p>
                <p>
                  For members continuing their practice from the Winter cohort, your foundational downregulation practices will be revisited as they are applied to career, entrepreneurial, and growth-oriented contexts. 
                </p>
              </div>
              </div>
            </div>

            <div id="curriculum">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">8-Week Curriculum</h2>
              <div className="space-y-3">
                                <strong>Focus</strong>
                <ul>
                <li> - Activation</li> 
                <li> - Upregulation</li>
                <li> - Growth</li>
                </ul>
                <br></br>
                <strong>Goals</strong>
                <ul>
                <li> - Expand your energy</li>
                <li> - Stimulate your curiosity</li>
                <li> - Establish agency</li>
                <li> - Build resilience within your nervous system</li>
                </ul>
                <br></br>
               <strong>Practice Areas</strong>
                <ul>
                <li> - Flow-based movement</li>
                <li> - Breathwork for energy mobilization</li>
                <li> - Goal setting for career and/or entrepreneurial accomplishments</li>
                <li> - Creative expression from learning to listen to your inner voice and create from your visions</li>
                </ul>
                  <br></br>
                {CURRICULUM.map((c, i) => (
                  <div key={c.week} className="flex gap-4 p-4 bg-white rounded-xl border border-stone-200 hover:border-sage-200 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-sage-50 group-hover:bg-sage-100 flex items-center justify-center shrink-0 transition-colors">
                      <span className="text-xs font-bold text-sage-700">S{i + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weeks {c.week}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900">{c.title}</h3>
                      <p className="text-slate-500 text-sm mt-0.5">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="testimonials">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What past cohort members say</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {TESTIMONIALS.map((t) => (
                  <div key={t.name} className="bg-white rounded-2xl border border-stone-200 p-5">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.cohort} Cohort</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="pricing" className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-stone-100">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-bold text-slate-900">$1200</span>
                    <span className="text-slate-400 text-sm">one-time</span>
                  </div>
                  <p className="text-slate-500 text-sm">Spring 2026 · 8-week cohort</p>
                </div>

                <div className="p-6 border-b border-stone-100">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Everything included</h3>
                  <ul className="space-y-3">
                    {WHATS_INCLUDED.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-sage-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6">
                  <Link
                    to="../checkout/SpringCohortCheckout"
                    className="group flex items-center justify-center gap-2 w-full py-4 bg-sage-600 text-white rounded-xl font-bold text-base hover:bg-sage-700 transition-colors shadow-sm shadow-sage-900/10"
                  >
                    Enroll Now — $1200
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <p className="text-center text-xs text-slate-400 mt-3">
                    Secure checkout · Sign-in or Create an account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center mt-10 sm:mt-16 pb-12 sm:pb-20">
        <p className="text-slate-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-sage-600 font-semibold hover:text-sage-700">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
