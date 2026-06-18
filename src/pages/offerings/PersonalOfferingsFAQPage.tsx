import { useState } from 'react';
import { ChevronDown, ArrowRight, Waves, User, CalendarDays, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQ {
  question: string;
  answer: string;
}

interface SubSection {
  label: string;
  faqs: FAQ[];
}

interface Section {
  id: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  accentColor: string;
  label: string;
  subheading: string;
  categoryFaqs: FAQ[];
  subSections: SubSection[];
}

const SECTIONS: Section[] = [
  {
    id: 'seasonal-programs',
    icon: Waves,
    color: 'text-sage-600',
    bgColor: 'bg-sage-50',
    accentColor: 'bg-sage-100',
    label: 'Seasonal Programs',
    subheading: 'Cohort-based 8-week programs with a new theme each season.',
    categoryFaqs: [
      {
        question: 'What are seasonal programs?',
        answer: 'Seasonal programs are cohort-based, themed programs that run each season and follow the natural rhythm of the year. Each program has a unique seasonal theme and combines live group sessions, weekly materials, and community connection. The Flow Series is our current seasonal program offering.',
      },
      {
        question: 'How are seasonal programs different from private sessions or events?',
        answer: 'Seasonal programs are ongoing, multi-week experiences with a cohort of participants. Unlike private sessions — which are personalized 1:1 — or events and retreats — which are shorter and more intensive — seasonal programs build depth over time through a sustained community container.',
      },
      {
        question: 'When do new seasonal programs launch?',
        answer: 'New cohorts are announced quarterly and align with the four seasons. Enrollment opens several weeks before each cohort begins. Subscribe to our newsletter or watch the offerings page to be notified when a new cohort goes live.',
      },
      {
        question: 'Do I need experience to join a seasonal program?',
        answer: 'No experience is required. Seasonal programs are designed to meet participants wherever they are. All movement, breathwork, and reflection practices are guided with options for every ability level.',
      },
    ],
    subSections: [
      {
        label: 'Flow Series',
        faqs: [
          {
            question: 'What is the Flow Series?',
            answer: 'The Flow Series is our flagship seasonal program — an 8-week, cohort-based live experience delivered via Zoom. Each cohort is themed around a seasonal focus and weaves together yoga therapy, breathwork, meditation, and group inquiry. Participants move through the program as a community, building practice and connection over eight weeks.',
          },
          {
            question: 'What is the Spring 2026 cohort theme?',
            answer: 'The Spring 2026 cohort is themed around Career and Expansion. Practices focus on activation, growth, and stepping into the season ready to begin anew — helping you improve your professional path, deepen creative intuition, and engage your fullest self for future pursuits.',
          },
          {
            question: 'How often does the cohort meet live?',
            answer: 'The cohort meets bi-weekly (every two weeks) for four live 2-hour Zoom sessions across the 8 weeks. Between live sessions, you receive weekly reflection guides, video practices, and journaling prompts to work through on your own.',
          },
          {
            question: 'What if I miss a live session?',
            answer: 'All live sessions are recorded and made available within 24 hours. You have lifetime access to these recordings. Attending live is strongly encouraged for the community experience, but the recordings ensure you never fall behind.',
          },
          {
            question: 'How much does the Flow Series cost?',
            answer: 'The Spring 2026 cohort is $1,200 for the full 8-week program. This includes all four live Zoom sessions, weekly reflection guides and video practices, community forum access, a certificate of completion, lifetime access to session recordings, and discounted pricing on private sessions for one year.',
          },
          {
            question: 'What is the refund policy?',
            answer: 'We offer a full refund if you cancel within 7 days of enrollment and before the first live session. After the program begins, refunds are handled on a case-by-case basis. Please reach out and we will work with you.',
          },
        ],
      },
    ],
  },
  {
    id: 'private-sessions',
    icon: User,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    accentColor: 'bg-slate-200',
    label: 'Private Sessions',
    subheading: 'Fully personalized 1:1 sessions built around your body and goals.',
    categoryFaqs: [
      {
        question: 'What are private sessions?',
        answer: 'Private sessions are personalized 1:1 appointments with your instructor. Unlike group programs, private sessions are entirely tailored to you — your body, history, goals, and pace. Sessions are available in yoga therapy, breathwork coaching, and an integrated practice that blends both.',
      },
      {
        question: 'Do I need experience to book a private session?',
        answer: 'No prior experience is required. Private sessions are ideal for beginners who prefer a personalized environment, and for experienced practitioners looking to deepen or refocus their practice. Your instructor will adapt everything to your needs from the first session.',
      },
      {
        question: 'How do I book a private session?',
        answer: 'Use the contact form on our website or the booking section inside your member dashboard. Reach out to connect and your instructor will confirm a session type, duration, and scheduling.',
      },
      {
        question: 'Are private sessions available virtually?',
        answer: 'Yes. All private sessions are currently offered virtually via Zoom. This makes them accessible regardless of where you are located.',
      },
      {
        question: 'How do Flow Series members receive discounted pricing?',
        answer: 'Enrolling in or completing the Flow Series grants you discounted pricing on private sessions for one full year. This discount is applied automatically when you book through your member dashboard.',
      },
    ],
    subSections: [
      {
        label: 'Yoga Therapy',
        faqs: [
          {
            question: 'What is yoga therapy and how is it different from a regular yoga class?',
            answer: 'Yoga therapy is a therapeutic, one-on-one approach to movement that addresses specific physical or emotional patterns. Unlike a group yoga class, a yoga therapy session is structured around a personalized assessment of your posture, movement, breath, and history. It is intentional, adaptive, and designed to create lasting change.',
          },
          {
            question: 'What does a yoga therapy session involve?',
            answer: 'Sessions typically include a brief check-in and assessment, targeted movement sequences adapted to your body, breathwork and nervous-system regulation techniques, and guidance for a home practice. Sessions are 60 or 90 minutes.',
          },
          {
            question: 'Can yoga therapy help with injury recovery or chronic pain?',
            answer: 'Yoga therapy can be a valuable complement to recovery and pain management. Your instructor will work within your range of ability and coordinate with any existing care. Always consult your healthcare provider before beginning any new movement practice.',
          },
        ],
      },
      {
        label: 'Breathwork Coaching',
        faqs: [
          {
            question: 'What is breathwork coaching?',
            answer: 'Breathwork coaching sessions guide you through specific breathing protocols designed to shift your nervous system state, improve focus and calm, and access deeper layers of awareness. Sessions are personalized and may include both functional everyday breathing practices and transformational protocols.',
          },
          {
            question: 'How long is a breathwork coaching session?',
            answer: 'Sessions are available in 45 or 75-minute formats. First-time clients typically start with the 45-minute option to experience the practice before committing to a longer session.',
          },
          {
            question: 'Is breathwork safe for everyone?',
            answer: 'Most people can participate safely in guided breathwork. Some protocols are contraindicated for certain health conditions. Your instructor will discuss your health history before your first session. If you have cardiovascular conditions, epilepsy, or are pregnant, please consult your healthcare provider in advance.',
          },
        ],
      },
      {
        label: 'Integrated Practice',
        faqs: [
          {
            question: 'What is an integrated practice session?',
            answer: 'An integrated practice session blends yoga therapy, breathwork, and somatic movement into a single fluid experience. Your instructor designs each session around what your body and mind need most that day. It offers the deepest level of personalization available.',
          },
          {
            question: 'Who is the integrated practice best suited for?',
            answer: 'Integrated practice sessions are ideal for returning clients who have experienced both yoga therapy and breathwork separately, or for those with specific goals that span multiple modalities. It is the most versatile and adaptive session type we offer.',
          },
          {
            question: 'How long is an integrated practice session?',
            answer: 'Integrated practice sessions are available in 75 or 90-minute formats to allow time to move fluidly between modalities without feeling rushed.',
          },
        ],
      },
    ],
  },
  {
    id: 'events-retreats',
    icon: CalendarDays,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    accentColor: 'bg-amber-50',
    label: 'Events & Retreats',
    subheading: 'Workshops, immersions, and multi-day retreats in small, focused groups.',
    categoryFaqs: [
      {
        question: 'What types of events and retreats do you offer?',
        answer: 'We offer half-day workshops, full-day immersions, and multi-day residential retreats. Events are thematic, focused, and kept intentionally small to preserve a high-quality, connected experience for every participant.',
      },
      {
        question: 'How are events different from the Flow Series or private sessions?',
        answer: 'Events and retreats are contained, intensive experiences — they are a single gathering rather than an ongoing program. They are ideal for people who want a deep, focused immersion without an extended multi-week commitment.',
      },
      {
        question: 'How many participants attend each event?',
        answer: 'Events are capped at small group sizes — typically 8 to 12 participants — to ensure each person receives real attention and the group dynamic stays intimate and focused.',
      },
      {
        question: 'How do I find out about upcoming events?',
        answer: 'Events are announced to our community first, often before they are listed publicly. Get in touch via the contact form to be added to the early-access list, or subscribe to our newsletter.',
      },
      {
        question: 'Can I attend an event without prior yoga or breathwork experience?',
        answer: 'Yes. Events like the Breath & Body half-day immersion are designed to be open to all levels. Each event listing specifies whether prior experience is needed or recommended.',
      },
    ],
    subSections: [
      {
        label: 'Breath & Body: Half-Day Immersion',
        faqs: [
          {
            question: 'What is the Breath & Body half-day immersion?',
            answer: 'Breath & Body is a focused half-day workshop exploring the relationship between breath and movement. It is open to all levels with no prior experience required. The immersion is structured around guided breathwork and accessible yoga-based movement, with time for reflection and integration.',
          },
          {
            question: 'How long is the Breath & Body immersion?',
            answer: 'The immersion is 4 hours and is delivered virtually via Zoom. It is designed to be deeply focused without requiring a full day or overnight commitment.',
          },
          {
            question: 'When is the Breath & Body immersion happening?',
            answer: 'The Breath & Body immersion is currently planned for Spring 2026. Exact dates will be announced to the early-access list first. Use the contact form to express interest and be notified when enrollment opens.',
          },
        ],
      },
      {
        label: 'Summer Stillness Retreat',
        faqs: [
          {
            question: 'What is the Summer Stillness Retreat?',
            answer: 'Summer Stillness is a multi-day residential retreat weaving together yoga therapy, breathwork, somatic movement, and restorative practices in a natural setting. It is designed for deep rest, reconnection, and a sustained practice container away from daily life.',
          },
          {
            question: 'How long is the Summer Stillness Retreat?',
            answer: 'The retreat is 3 days and 2 nights. The intimate format — limited to 8 participants — is intentional. Fewer people means more personalized attention, a deeper group dynamic, and a more nourishing experience overall.',
          },
          {
            question: 'Where is the Summer Stillness Retreat held?',
            answer: 'The retreat location for Summer 2026 is to be determined. We are committed to a natural, restorative setting. Location details will be shared when enrollment opens. Use the contact form to join the waitlist.',
          },
          {
            question: 'How do I join the waitlist for the retreat?',
            answer: 'Reach out via the contact form on our website and let us know you are interested in the Summer Stillness Retreat. You will be added to the waitlist and notified when enrollment opens and the location is confirmed.',
          },
        ],
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-stone-50 transition-colors"
      >
        <span className="font-semibold text-primary text-sm sm:text-base">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1">
          <p className="text-secondary text-sm sm:text-base leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function PersonalOfferingsFAQPage() {
  return (
    <div className="min-h-screen bg-body">
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 bg-stone-50">
        <div className="container-wide">
          <p className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-3">
            Personal Programs
          </p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-bold text-primary mb-4">
            Personal Programs FAQs
          </h1>
          <p className="text-secondary text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            Questions and answers organized by offering category — seasonal programs, private sessions, and events and retreats.
          </p>

          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-stone-200 text-sm font-medium text-slate-600 hover:border-sage-300 hover:text-sage-700 transition-colors"
              >
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-wide max-w-3xl space-y-16 sm:space-y-24">
          {SECTIONS.map((s) => (
            <div key={s.id} id={s.id} className="scroll-mt-24">
              <div className="flex items-start justify-between gap-3 mb-7">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${s.bgColor} flex items-center justify-center shrink-0 mt-0.5`}>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-primary leading-tight">
                      {s.label}
                    </h2>
                    <p className="text-secondary text-sm mt-0.5">{s.subheading}</p>
                  </div>
                </div>
                {s.id !== 'seasonal-programs' && (
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-400 hover:text-stone-600 transition-colors group shrink-0 mt-0.5"
                  >
                    <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    Back to top
                  </button>
                )}
              </div>

              <div className="space-y-3 mb-10">
                {s.categoryFaqs.map((faq) => (
                  <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>

              {s.subSections.length > 0 && (
                <div className="space-y-8">
                  {s.subSections.map((sub) => (
                    <div key={sub.label}>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full ${s.accentColor} mb-4`}>
                        <span className={`text-xs font-semibold ${s.color} uppercase tracking-widest`}>
                          {sub.label}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {sub.faqs.map((faq) => (
                          <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-stone-50">
        <div className="container-wide text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-4">
            Still have questions?
          </h2>
          <p className="text-secondary mb-8 max-w-lg mx-auto">
            Visit our help center for a complete list of FAQs, or send us a message.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors w-full sm:w-auto justify-center"
            >
              Visit Help Center
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-medium border border-stone-300 hover:border-sage-300 hover:shadow-sm transition-all w-full sm:w-auto justify-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
