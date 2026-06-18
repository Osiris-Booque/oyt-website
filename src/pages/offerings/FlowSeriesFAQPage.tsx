import { useState } from 'react';
import { ChevronDown, ArrowRight, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    heading: 'About the Flow Series',
    faqs: [
      {
        question: 'What is the Flow Series?',
        answer: 'The Flow Series is our flagship 8-week, cohort-based live program delivered via Zoom. Each cohort is themed around a seasonal focus and weaves together yoga therapy, breathwork, pranayama, reflective inquiry, and group connection. You will move your body, explore your nervous system, and build sustainable practices for personal growth.',
      },
      {
        question: 'What makes the Flow Series different from a typical yoga class?',
        answer: 'The Flow Series is not a drop-in class — it is a living, breathing community experience. You are part of a cohort that moves through the program together over eight weeks. The combination of live sessions, weekly materials, community forum, and a consistent group of people creates a depth of practice and connection that a single class cannot replicate.',
      },
      {
        question: 'Who is it designed for?',
        answer: 'The Flow Series is for anyone seeking meaningful personal growth through an embodied practice. Past participants have included professionals navigating career transitions, people managing stress or burnout, creatives looking to reconnect with intuition, and wellness practitioners deepening their own foundations. No prior experience is required.',
      },
      {
        question: 'What is the Spring 2026 cohort theme?',
        answer: 'The Spring 2026 cohort is themed around Career and Expansion. The modules are designed to help you improve your professional path, deepen creative intuition, and engage your fullest self for future pursuits. Spring practices focus on activation, upregulation, and growth — helping you step into the season ready to begin anew.',
      },
    ],
  },
  {
    heading: 'Schedule & Format',
    faqs: [
      {
        question: 'How often do sessions meet?',
        answer: 'The cohort meets bi-weekly (every two weeks) for four live 2-hour Zoom sessions over the 8 weeks. In addition to live sessions, you receive weekly reflection guides, video practices, and journaling prompts to work with on your own.',
      },
      {
        question: 'When are the live sessions for Spring 2026?',
        answer: 'The Spring 2026 cohort runs March 22 through May 3, 2026. Live sessions are held on Sundays from 4–6pm PST.',
      },
      {
        question: 'What happens during a live session?',
        answer: 'Each 2-hour session combines guided yoga-based movement, pranayama and breathwork, reflective inquiry, and group discussion. Sessions are interactive — you will practice, journal, and connect with cohort members in breakout conversations. It is not a passive watching experience.',
      },
      {
        question: 'What if I miss a live session?',
        answer: 'All live sessions are recorded and made available within 24 hours. You will have lifetime access to the recordings. While attending live is strongly encouraged for the community experience, the recordings ensure you never fall behind on the curriculum.',
      },
      {
        question: 'Can I join from anywhere in the world?',
        answer: 'Yes. The Flow Series is fully virtual and has attracted participants from North America, Europe, Asia, and Australia. Sessions are held on Sundays at 4–6pm PST — please account for your local time zone when enrolling.',
      },
    ],
  },
  {
    heading: 'Enrollment & Pricing',
    faqs: [
      {
        question: 'How much does the Spring 2026 cohort cost?',
        answer: 'The Spring 2026 cohort is $1,200 for the full 8-week program. This covers all four live Zoom sessions, weekly reflection guides and video practices, community forum access, a certificate of completion, lifetime access to session recordings, and discounted pricing on private 1:1 sessions for one full year.',
      },
      {
        question: 'How do I enroll?',
        answer: 'Click "Enroll Now" on the Flow Series page or at the top of this page. You will be prompted to create an account (or sign in) and complete payment through our secure checkout powered by Stripe.',
      },
      {
        question: 'How many spots are available?',
        answer: 'Each cohort is intentionally kept small to preserve the quality of community and instructor attention. There are currently only a few spots remaining for Spring 2026. Enrollment closes once the cohort is full.',
      },
      {
        question: 'What is the refund policy?',
        answer: 'We offer a full refund if you cancel within 7 days of enrollment and before the first live session. After the program has begun, refunds are handled on a case-by-case basis. Please reach out if you have concerns and we will work with you.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards through Stripe, our secure payment processor. Payment is collected in full at the time of enrollment.',
      },
    ],
  },
  {
    heading: 'What\'s Included',
    faqs: [
      {
        question: 'What do I get when I enroll?',
        answer: 'Enrollment includes: 4 bi-weekly live Zoom sessions with your cohort, weekly reflection guides and video practices with journaling prompts, access to the private community forum, a certificate of completion, lifetime access to all session recordings, and discounted pricing on private 1:1 sessions for one year.',
      },
      {
        question: 'What is the community forum?',
        answer: 'The community forum is a private space inside your member dashboard where you and your cohort members can connect, share reflections, ask questions, and support one another between live sessions. Instructors are active in the forum throughout the program.',
      },
      {
        question: 'What is the certificate of completion?',
        answer: 'Upon completing the program, you receive a digital certificate of completion. Completing the Flow Series also grants you automatic priority consideration for future cohorts (subject to space) and activates your alumni discount for private sessions.',
      },
    ],
  },
  {
    heading: 'Experience & Requirements',
    faqs: [
      {
        question: 'Do I need prior yoga or wellness experience?',
        answer: 'No. The Flow Series is designed to be accessible regardless of your fitness level or familiarity with yoga, breathwork, or meditation. We guide everything step by step and offer modifications for every body and ability level.',
      },
      {
        question: 'What technology do I need?',
        answer: 'You need a stable internet connection, a device with a camera and microphone (laptop, tablet, or phone), and enough open floor space to move comfortably. All sessions are on Zoom — a free Zoom account is sufficient.',
      },
      {
        question: 'Do I need any special equipment?',
        answer: 'A yoga mat is helpful but not required. We recommend having comfortable clothing you can move in, a journal or notebook for reflective exercises, and a quiet space where you can participate without interruption.',
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

export default function FlowSeriesFAQPage() {
  return (
    <div className="min-h-screen bg-body">
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 bg-stone-50">
        <div className="container-wide">
          <div className="flex items-center gap-2 mb-3">
            <Waves className="w-4 h-4 text-sage-600" />
            <p className="text-sage-600 font-medium tracking-widest uppercase text-sm">
              Flow Series
            </p>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-bold text-primary mb-4">
            Flow Series FAQ
          </h1>
          <p className="text-secondary text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            Everything you need to know about the Flow Series — format, curriculum, enrollment, pricing, and what to expect.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/offerings/flow-series"
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-sage-700 transition-colors"
            >
              View Spring 2026 Cohort
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/checkout/spring-cohort"
              className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-lg font-medium text-sm border border-stone-300 hover:border-sage-300 hover:shadow-sm transition-all"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-wide max-w-3xl">
          <div className="space-y-12 sm:space-y-16">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-primary mb-5 sm:mb-6">
                  {section.heading}
                </h2>
                <div className="space-y-3">
                  {section.faqs.map((faq) => (
                    <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-stone-50">
        <div className="container-wide text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-4">
            Ready to join the Spring cohort?
          </h2>
          <p className="text-secondary mb-8 max-w-lg mx-auto">
            Only a few spots remain. Enroll now or reach out if you have more questions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/checkout/spring-cohort"
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors w-full sm:w-auto justify-center"
            >
              Enroll Now — $1,200
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-medium border border-stone-300 hover:border-sage-300 hover:shadow-sm transition-all w-full sm:w-auto justify-center"
            >
              Contact Us
            </Link>
          </div>
          <p className="text-secondary text-sm mt-6">
            Looking for all site FAQs?{' '}
            <Link to="/faq" className="text-sage-600 font-semibold hover:text-sage-700">
              Visit the Help Center
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
