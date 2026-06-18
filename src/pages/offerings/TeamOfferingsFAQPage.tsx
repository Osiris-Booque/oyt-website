import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'What types of organizations do you work with?',
    answer: 'We partner with government agencies, corporate teams, nonprofits, schools, and community organizations of all sizes. Our programs are tailored to the unique culture and goals of each group, whether that is a 10-person leadership team or a 500-person agency.',
  },
  {
    question: 'How are team programs structured?',
    answer: 'Each engagement begins with a discovery conversation to understand your organization\'s needs. From there we design a custom program that may include live workshops, ongoing group sessions, leadership coaching, and asynchronous resources. Programs typically run between 4 and 12 weeks, though we also offer single-day immersions.',
  },
  {
    question: 'Can sessions be delivered virtually?',
    answer: 'Absolutely. We offer virtual, in-person, and hybrid delivery options. Our virtual programs are conducted live via Zoom and are designed to be just as interactive and engaging as in-person sessions. Many of our clients have distributed teams across multiple locations and time zones.',
  },
  {
    question: 'What does a typical session look like?',
    answer: 'Sessions blend guided movement, breathwork, and facilitated discussion. A 60-minute workshop might include 15 minutes of grounding breathwork, 20 minutes of accessible yoga-based movement, and 25 minutes of reflective inquiry and group dialogue. Every session is adapted to the physical abilities and comfort levels of participants.',
  },
  {
    question: 'Do participants need prior yoga or wellness experience?',
    answer: 'No prior experience is needed. Our programs are designed to be accessible to everyone regardless of fitness level or familiarity with yoga and breathwork. We meet each group where they are and build from there.',
  },
  {
    question: 'How do you measure outcomes?',
    answer: 'We use pre- and post-program assessments that measure self-reported stress levels, team cohesion, engagement, and overall wellbeing. For longer engagements we provide quarterly progress reports with anonymized data and actionable recommendations.',
  },
  {
    question: 'What is the pricing model for team programs?',
    answer: 'Pricing depends on the scope, duration, group size, and delivery format. We provide a detailed proposal after the initial consultation. Most engagements range from a single workshop to a multi-month series. Contact us for a custom quote.',
  },
  {
    question: 'How do we get started?',
    answer: 'The first step is a free 30-minute consultation where we learn about your team\'s goals and challenges. From there we\'ll put together a tailored proposal. You can request a consultation directly from our team offerings page or reach out via our contact form.',
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

export default function TeamOfferingsFAQPage() {
  return (
    <div className="min-h-screen bg-body">
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16 bg-stone-50">
        <div className="container-wide">
          <p className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-3">
            Team Programs
          </p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-secondary text-sm sm:text-base leading-relaxed max-w-2xl">
            Everything you need to know about our group and organizational wellness programs.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-wide max-w-3xl">
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-stone-50">
        <div className="container-wide text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary mb-4">
            Still have questions?
          </h2>
          <p className="text-secondary mb-8 max-w-lg mx-auto">
            Visit our help center for a list of all our FAQs or send us a message.
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
