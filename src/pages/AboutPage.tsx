import { Heart, Wind, Brain, Activity, ArrowRight, Sparkles, Shield, Users, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import osirisImage from '../assets/Osiris.png';
import heroImage from '../assets/Osiris_Yoga_Therapy_Hero.png';

const pillars = [
  {
    icon: Heart,
    title: 'Yoga Therapy',
    subtitle: 'Body & Spirit',
    description: 'Therapeutic movement practices tailored to your body, addressing chronic pain, mobility, and physical resilience through evidence-based yoga methods.',
    bullets: ['Improved flexibility & strength', 'Stress reduction', 'Enhanced mindfulness', 'Pain management'],
  },
  {
    icon: Wind,
    title: 'Breathwork',
    subtitle: 'Energy & Balance',
    description: 'Structured breathing techniques that regulate your nervous system, reduce anxiety, improve sleep, and restore emotional equilibrium.',
    bullets: ['Reduced anxiety', 'Increased energy', 'Better sleep quality', 'Emotional regulation'],
  },
  {
    icon: Brain,
    title: 'Meditation',
    subtitle: 'Mind & Healing',
    description: 'Guided contemplative practices that cultivate mental clarity, emotional awareness, and the inner stillness needed for genuine transformation.',
    bullets: ['Mental clarity', 'Emotional healing', 'Personal growth', 'Coping strategies'],
  },
  {
    icon: Activity,
    title: 'Conditioning',
    subtitle: 'Growth & Mastery',
    description: 'Functional movement and strength training that builds the physical foundation your body needs to sustain long-term wellness.',
    bullets: ['Physical resilience', 'Improved stress response', 'Greater body awareness', 'Sustainable strength'],
  },
];

const corePrinciples = [
  {
    pillar: '01',
    title: 'Evidence-Based & Trauma-Informed',
    description: 'Clinical research. Felt safety. Never performance over regulation.',
  },
  {
    pillar: '02',
    title: 'Ancient Healing Traditions',
    description: 'Yogic philosophy, Ayurveda, and ancestral lineages thousands of years deep.',
  },
  {
    pillar: '03',
    title: 'Music, Sound & Movement',
    description: 'Rhythm and vibration as direct nervous system access. Unique to Osiris.',
  },
  {
    pillar: '04',
    title: 'Community-Focused Wellness',
    description: 'People of the Global Majority centered. Cultural identity as healing resource.',
  },
];

const values = [
  {
    icon: Sparkles,
    title: 'Integrative Practice',
    description: 'We treat the whole person. Every program weaves together movement, breath, and mindfulness because lasting change requires addressing body, mind, and spirit as one system.',
  },
  {
    icon: Shield,
    title: 'Accessible to Everyone',
    description: 'No prior experience is required for any of our offerings. We meet you exactly where you are and adapt every session to your abilities, goals, and comfort level.',
  },
  {
    icon: Users,
    title: 'Community & Connection',
    description: 'Healing happens in relationship. Our cohort programs, group sessions, and community forums create a supportive network that extends well beyond the mat.',
  },
  {
    icon: Heart,
    title: 'Guided by a Yoga Therapist',
    description: 'Every program is designed and led by a certified yoga therapist with deep expertise in breathwork, meditation, and somatic practice, ensuring clinical rigor and genuine care.',
  },
];

export default function AboutPage() {
const [principlesOpen, setPrinciplesOpen] = useState(false);
const [detailsOpen, setDetailsOpen] = useState(false);
const detailsSectionRef = useRef<HTMLDivElement | null>(null);
const mainSectionRef = useRef<HTMLDivElement | null>(null);
const primaryContentRef = useRef<HTMLDivElement | null>(null);
const primarySectionRef = useRef<HTMLDivElement | null>(null);
const secondaryButtonRef = useRef<HTMLDivElement | null>(null);
  
  return (
    <div>
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 md:pb-24 bg-stone-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-sage-600 font-medium tracking-widest uppercase text-lg mb-4">About Us</p>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-bold text-primary mb-6 sm:mb-8">
                Where movement drives healing
              </h1>

              <div className="prose-osiris">
                <p>
                  Osiris Yoga Therapy is a multi-modal health and wellness practice built on the conviction that the body, breath, and mind are inseparable. When you care for one, you strengthen them all.
                </p>
                <p>
                  We combine yoga therapy, breathwork, meditation, and conditioning into integrated programs for individuals and organizations. Whether you are looking for personal transformation or a wellness solution for your team, our approach meets you where you are and guides you toward lasting change.
                </p>
                <p>
                  Our programs are delivered live via Zoom and in person, making holistic wellness accessible regardless of location. From our flagship Flow Series cohort to custom organizational engagements, every offering is designed with clinical rigor and genuine care.
                </p>
              </div>
            </div>

            <div className="relative pb-4 sm:pb-0">
              <img
                src={osirisImage}
                alt="Osiris Yoga Therapy"
                className="w-full h-[280px] sm:h-[380px] lg:h-[520px] object-cover object-top rounded-2xl"
              />
              <div className="absolute -bottom-3 left-4 sm:-bottom-6 sm:-left-6 bg-gold-500 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl">
                <div className="text-2xl sm:text-4xl font-bold">4 Pillars</div>
                <div className="text-gold-100 text-xs sm:text-sm">Integrated wellness approach</div>
              </div>
            </div>
          </div>
        </div>
      </section>

<section
  ref={mainSectionRef}
  className="pt-6 sm:pt-8 md:pt-12 pb-6 sm:pb-8 md:pb-12 bg-white">
  <div className="container-wide">

    {/* Header */}
    <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
      <p className="text-sage-600 font-medium tracking-widest uppercase text-lg mb-3">
        Our Approach
      </p>

      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4">
        4 pillars of health and wellness
      </h2>

      <p className="text-secondary leading-relaxed">
        Each discipline works in harmony to carefully address every aspect of
        your biological system — body, breath, mind, and resilience.
      </p>
    </div>


    {/* Pillars */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      {pillars.map((pillar) => {
        const Icon = pillar.icon;

        return (
          <div
            key={pillar.title}
            className="bg-stone-50 rounded-2xl p-5 sm:p-7 border border-stone-200 hover:border-sage-200 hover:shadow-md transition-all duration-300"
          >
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-sage-600 rounded-xl flex items-center justify-center mb-4 sm:mb-5 shadow-md shadow-sage-600/20">
              <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
            </div>

            <h3 className="font-display text-base sm:text-lg font-bold text-primary mb-3">
              {pillar.title}
            </h3>

            <p className="text-secondary text-sm leading-relaxed mb-4">
              {pillar.description}
            </p>

            <ul className="space-y-1.5 pt-3 border-t border-stone-200">
              {pillar.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-xs text-secondary">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sage-400 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>


    {/* PRIMARY BUTTON */}
    <button
      className="w-full flex items-center justify-between gap-4 bg-stone-50 border border-stone-200 hover:border-sage-300 hover:bg-stone-100 rounded-2xl px-6 py-4 transition-all duration-200 cursor-pointer group"
onClick={() => {
  const next = !principlesOpen;
  setPrinciplesOpen(next);

  const headerHeight =
    document.querySelector("header")?.offsetHeight ?? 80;

  setTimeout(() => {
    if (next && primaryContentRef.current) {
      const y =
        primaryContentRef.current.getBoundingClientRect().bottom +
        window.pageYOffset -
        window.innerHeight +
        headerHeight +
        24;

      window.scrollTo({ top: y, behavior: "smooth" });
    }

    if (!next && mainSectionRef.current) {
      const y =
        mainSectionRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight -
        -40;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, 350);
}}
    >
      <p className="text-sm text-secondary text-left">
        Every practice above is delivered through{" "}
        <span className="text-amber-700 font-semibold">
          4 foundational principles
        </span>{" "}
        — not separate offerings, but the philosophy running through everything.
      </p>

      <ChevronDown
        className="w-5 h-5 text-sage-500 shrink-0 transition-transform duration-300 group-hover:text-sage-700"
        style={{
          transform: principlesOpen ? "rotate(180deg)" : "rotate(0deg)"
        }}
      />
    </button>


    {/* PRIMARY COLLAPSIBLE */}
<div
  ref={primarySectionRef}
  className={`overflow-hidden transition-all duration-500 ease-in-out ${
    principlesOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
  }`}
>
      <div className="pt-4 space-y-6">

        {/* PRINCIPLE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {corePrinciples.map((p) => (
            <div
              key={p.pillar}
              className="bg-stone-50 rounded-2xl p-5 sm:p-7 border border-stone-200 hover:border-sage-200 hover:shadow-md transition-all duration-300"
            >
              <p className="text-xs font-mono text-sage-500 tracking-widest mb-3">
                {p.pillar}
              </p>

              <h4 className="font-display text-base sm:text-lg font-bold text-primary mb-2 leading-snug">
                {p.title}
              </h4>

              <p className="text-secondary text-sm leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
        <div ref={primaryContentRef} />

        {/* SECONDARY BUTTON */}
        <div ref={secondaryButtonRef}>
        <button
          className="w-full flex items-center justify-between gap-4 bg-stone-50 border border-stone-200 hover:border-sage-300 hover:bg-stone-100 rounded-2xl px-6 py-4 transition-all duration-200 cursor-pointer group"
onClick={() => {
  const next = !detailsOpen;
  setDetailsOpen(next);

  const headerHeight =
    document.querySelector("header")?.offsetHeight ?? 80;

  setTimeout(() => {
    if (next && secondaryButtonRef.current && detailsSectionRef.current) {

const sectionRect =
  detailsSectionRef.current.getBoundingClientRect();

const sectionBottom =
  sectionRect.bottom + window.pageYOffset;

const sectionHeight =
  detailsSectionRef.current.scrollHeight;

const availableViewport =
  window.innerHeight - headerHeight - 24;

let y;

if (sectionHeight <= availableViewport) {
  // CASE A — matrix fits screen
  // align matrix bottom with viewport bottom
  y = sectionBottom - window.innerHeight + 24;
} else {
  // CASE B — matrix taller than viewport
  // align button under header
  const buttonTop =
    secondaryButtonRef.current.getBoundingClientRect().top +
    window.pageYOffset;

  y = buttonTop - headerHeight - 12;
}

      window.scrollTo({ top: y, behavior: "smooth" });
    }

if (!next && secondaryButtonRef.current) {
  const bottom =
    secondaryButtonRef.current.getBoundingClientRect().bottom +
    window.pageYOffset;

  const y =
    bottom - window.innerHeight + 12;

  window.scrollTo({
    top: y,
    behavior: "smooth"
  });
}

  }, 350);
}}
        >
          <p className="text-sm text-secondary text-left">
            See how these principles translate into real practice.
          </p>

          <ChevronDown
            className="w-5 h-5 text-sage-500 shrink-0 transition-transform duration-300 group-hover:text-sage-700"
            style={{
              transform: detailsOpen ? "rotate(180deg)" : "rotate(0deg)"
            }}
          />
        </button>
        </div>


        {/* SECONDARY COLLAPSIBLE */}
        <div
  ref={detailsSectionRef}
  className={`overflow-hidden transition-all duration-500 ease-in-out ${
    detailsOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
  }`}
>
  <div className="pt-4">
    <div className="w-full bg-stone-50 rounded-2xl p-4 sm:p-6 border border-stone-200 hover:border-sage-200 hover:shadow-md transition-all duration-300">

      <h4 className="font-display text-lg font-bold text-primary mb-4">
        Integrated Practice
      </h4>

      {/* Matrix Scroll Container */}
      <div className="w-full overflow-x-auto">

        {/* Matrix Grid */}
        <div className="min-w-[520px] grid grid-cols-[0.6fr,1fr,1fr,1fr,1fr] lg:grid-cols-[0.9fr,1fr,1fr,1fr,1fr] border border-stone-200 rounded-xl overflow-hidden text-[9px] sm:text-[10px] lg:text-sm leading-tight">

          {/* Corner */}
          <div className="bg-stone-100 p-2 sm:p-3"></div>

          {/* Headers */}
          <div className="bg-stone-100 p-2 sm:p-3 text-center text-primary">
            <b>Yoga Therapy</b>
            <p><i>Body & Spirit</i></p>
          </div>
          <div className="bg-stone-100 p-2 sm:p-3 text-center text-primary">
            <b>Breathwork</b>
            <p><i>Energy & Balance</i></p>
          </div>
          <div className="bg-stone-100 p-2 sm:p-3 text-center text-primary">
            <b>Meditation</b>
            <p><i>Mind & Healing</i></p>
          </div>
          <div className="bg-stone-100 p-2 sm:p-3 text-center text-primary">
            <b>Conditioning</b>
            <p><i>Growth & Mastery</i></p>
          </div>

          {/* Row 1 */}
          <div className="bg-stone-100 p-1.5 sm:p-2 text-primary text-[9px] sm:text-xs leading-normal text-center break-words">
            <div className="space-y-0.5">
            <b>Evidence-Based & Trauma-Informed</b>
            <p><i>Research-grounded. Felt safety over performance.</i></p>
            </div>
          </div>

          
          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Somatic state sequencing</b>
<p>Movement is prescribed based on the current state of the nervous system, not a fixed sequence. Regulation precedes challenge.</p>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Psychophysiological coherence</b>
            <p>Breathing patterns are selected for their measurable effect on autonomic balance. The goal is coherence, not activation or suppression.</p>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Titrated exposure to stillness</b>
            <p>Inward attention is introduced in small doses. Capacity for self-observation is built incrementally before depth is requested.</p>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Adaptive load tolerance</b>
            <p>Physical challenge is calibrated to the body's current stress threshold. Resilience is built without triggering a threat response.</p>
          </div>

          {/* Row 2 */}
          <div className="bg-stone-100 p-1.5 sm:p-2 text-primary text-[9px] sm:text-xs leading-normal text-center break-words">
            <div className="space-y-0.5">
            <b>Ancient Healing Traditions</b>
            <p><i>Ancestral frameworks as clinical context.</i></p>
            </div>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Whole-person mapping</b>
            <p>Ancestral wellness frameworks offer a multi-dimensional model of the body that holds physical, energetic, and relational dimensions together rather than separating them.</p>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Intergenerational breath memory</b>
            <p>Breath regulation carries ancestral knowledge about survival, rest, and restoration. These patterns are not invented. They are recovered.</p>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Contemplative epistemology</b>
            <p>Ancient contemplative traditions offer a theory of mind that predates modern neuroscience and in many ways exceeds it in relational and experiential precision.</p>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Cyclical resilience frameworks</b>
            <p>Ancestral models understand strength as seasonal and cyclical rather than linear. Training honors rest, transition, and renewal as equal to exertion.</p>
          </div>

          {/* Row 3 */}
          <div className="bg-stone-100 p-1.5 sm:p-2 text-primary text-[9px] sm:text-xs leading-normal text-center break-words">
          <div className="space-y-0.5">
          <b>Music, Sound, & Movement</b>
          <p><i>Vibrational access to subcortical regulation.</i></p>
          </div>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Auditory-motor entrainment</b>
            <p>Rhythm organizes movement at a subcortical level. The body synchronizes to sonic pattern before the thinking mind can intervene or resist.</p>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Vagal tone through vibration</b>
            <p>Vocalized sound during breath practice directly stimulates vagal pathways. The body uses its own resonance as a regulatory tool.</p>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Non-conceptual attention anchors</b>
            <p>Sound provides an attention anchor that bypasses narrative and cognitive looping. It is a pre-verbal entry point into present-moment awareness.</p>
          </div>
          
          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Somatic joy as training signal</b>
            <p>When movement is rhythmically organized and felt as pleasurable, the nervous system encodes it as safe. Joy becomes the mechanism of sustainable physical development.</p>
          </div>

          {/* Row 4 */}
          <div className="bg-stone-100 p-1.5 sm:p-2 text-primary text-[9px] sm:text-xs leading-normal text-center break-words">
          <div className="space-y-0.5">
          <b>Community-Focused Wellness</b>
          <p><i>Collective regulation and cultural coherence.</i></p>
          </div>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Relational body norming</b>
            <p>What bodies are seen, instructed toward, and held as capable shapes what participants believe is possible for their own bodies. Representation is a clinical variable.</p>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Co-regulation through shared practice</b>
            <p>Synchronized breath in a group context activates co-regulatory dynamics. Collective nervous system coherence is achievable and measurable.</p>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Narrative safety and belonging</b>
            <p>When the cultural context of a practice is named and honored, participants experience psychological safety at a deeper level. Identity coherence supports healing.</p>
          </div>

          <div className="p-2 sm:p-3 text-secondary border-t border-l border-dashed border-stone-200 break-words">
            <b>Collective efficacy as resilience</b>
            <p>Shared physical development builds not just individual capacity but group identity around strength. Community becomes a resilience infrastructure, not just a support network.</p>
          </div>

        </div>
      </div>


            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</section>

      <section id="mission" className="py-12 sm:py-16 md:py-24 bg-body scroll-mt-24">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
            <div className="lg:col-span-2 flex items-center justify-center">
              <div className="w-full max-w-sm overflow-hidden rounded-2xl">
                <img
                  src={heroImage}
                  alt="Osiris Yoga Therapy practice"
                  className="w-full h-[240px] sm:h-[300px] lg:h-[360px] object-cover object-center"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <p className="text-sage-600 font-medium tracking-widest uppercase text-lg mb-3">Our Mission</p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-6">
                Making holistic wellness accessible
              </h2>

              <div className="space-y-4 text-primary leading-relaxed text-sm sm:text-base">
                <p>
                  We believe that genuine wellness is not a luxury. It is a practice available to everyone willing to show up for themselves. Our mission is to make integrative, evidence-based wellness accessible to individuals and organizations of all sizes.
                </p>
                <p>
                  For individuals, we offer cohort-based programs like the Flow Series, private sessions, and immersive retreats. For organizations, we design custom programs for government agencies, corporate teams, nonprofits, and schools that build resilience, reduce stress, and strengthen team cohesion.
                </p>
              </div>

              <div className="mt-6 sm:mt-8 p-5 sm:p-6 bg-white rounded-xl border border-stone-200">
                <blockquote className="font-display text-base sm:text-lg text-primary italic leading-relaxed">
                  "True wellness is not a destination. It is a daily practice of showing up for yourself with compassion and intention."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="values" className="py-12 sm:py-16 md:py-24 bg-white scroll-mt-24">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
            <p className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-3">What We Stand For</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4">
              The principles behind our practice
            </h2>
            <p className="text-secondary leading-relaxed">
              These values shape every program, session, and interaction at Osiris Yoga Therapy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-stone-50 rounded-2xl p-5 sm:p-7 border border-stone-200 hover:border-sage-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-sage-100 rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-sage-600" />
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-primary mb-2">{value.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="who-we-serve" className="py-12 sm:py-16 md:py-24 bg-body scroll-mt-24">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
            <p className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-3">Who We Serve</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4">
              Programs for individuals and organizations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center mb-5">
                <Heart className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-primary mb-3">Personal Growth</h3>
              <p className="text-secondary text-sm leading-relaxed mb-5">
                Seasonal cohort programs, private sessions, and immersive retreats designed for individuals seeking personal transformation. Our flagship Flow Series combines all four pillars into an 8-week live experience.
              </p>
              <Link
                to="/offerings/personal"
                className="inline-flex items-center gap-2 text-sage-600 font-medium hover:text-sage-700 transition-colors text-sm"
              >
                Explore personal programs
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-primary mb-3">Team Wellness</h3>
              <p className="text-secondary text-sm leading-relaxed mb-5">
                Custom wellness programs for government agencies, corporate teams, nonprofits, and schools. We design engagements that build resilience, reduce burnout, and strengthen team cohesion through movement and mindfulness.
              </p>
              <Link
                to="/offerings/team"
                className="inline-flex items-center gap-2 text-sage-600 font-medium hover:text-sage-700 transition-colors text-sm"
              >
                Explore team programs
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-stone-50">
        <div className="container-wide text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-4">
            Ready to begin your journey?
          </h2>
          <p className="text-secondary mb-8 max-w-lg mx-auto">
            Browse our programs to find the path that resonates with you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/offerings"
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors w-full sm:w-auto justify-center"
            >
              View Offerings
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-medium border border-stone-300 hover:border-sage-300 hover:shadow-sm transition-all w-full sm:w-auto justify-center"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
