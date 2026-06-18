import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    heading: 'About Osiris Yoga Therapy',
    faqs: [
      {
        question: 'What is Osiris Yoga Therapy?',
        answer: 'Osiris Yoga Therapy is a multi-modal health and wellness practice specializing in yoga therapy, breathwork, meditation, and conditioning. We offer programs for individuals and organizations, delivered both online and in person.',
      },
      {
        question: 'Who are your programs designed for?',
        answer: 'Our programs serve two audiences: individuals looking for personal growth and wellness, and organizations (government agencies, corporations, nonprofits, schools) seeking team-based wellness solutions. No prior experience is required for any of our offerings.',
      },
      {
        question: 'Where are you located?',
        answer: 'Our team is based in the United States, but nearly all of our programs are available virtually via Zoom. We also offer in-person and hybrid delivery for team engagements. Our personal cohort programs regularly include participants from around the world.',
      },
    ],
  },
  {
    heading: 'Programs & Offerings',
    faqs: [
      {
        question: 'What is the Flow Series?',
        answer: 'The Flow Series is our flagship 8-week cohort-based program that combines yoga therapy, breathwork, meditation, and group inquiry. Each cohort is themed around a seasonal focus and delivered live via Zoom. It includes weekly materials, community access, and lifetime recordings.',
      },
      {
        question: 'Do you offer private 1:1 sessions?',
        answer: 'Yes. We offer private sessions in yoga therapy, breathwork, and meditation coaching. Flow Series alumni receive discounted rates. You can book a free consultation to discuss what format is the best fit for your goals.',
      },
      {
        question: 'What team programs do you offer?',
        answer: 'We design custom wellness programs for government agencies, corporate teams, nonprofits, and community organizations. Programs can include live workshops, ongoing group sessions, leadership coaching, and asynchronous resources. Delivery is available virtually, in person, or in a hybrid format.',
      },
      {
        question: 'How do I know which program is right for me?',
        answer: 'Start by exploring our offerings page, which breaks down personal and team programs. If you are still unsure, reach out through our contact form or book a free consultation. We are happy to help you find the right fit.',
      },
    ],
  },
  {
    heading: 'Enrollment & Pricing',
    faqs: [
      {
        question: 'How much does the Flow Series cost?',
        answer: 'The Spring 2026 Flow Series cohort is $1,200 for the full 8-week program. This includes all live sessions, weekly materials, community forum access, lifetime access to session recordings, and discounted rates on private sessions for one year.',
      },
      {
        question: 'How does team program pricing work?',
        answer: 'Team program pricing depends on scope, duration, group size, and delivery format. We provide a detailed proposal after an initial consultation. Contact us for a custom quote.',
      },
      {
        question: 'What is the refund policy?',
        answer: 'For the Flow Series, we offer a full refund if you cancel within 7 days of enrollment and before the first live session. After the program begins, refunds are handled on a case-by-case basis. For team programs, terms are outlined in the engagement proposal.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards through our secure payment processor, Stripe. Payment is collected at the time of enrollment or booking.',
      },
    ],
  },
  {
    heading: 'Sessions & Experience',
    faqs: [
      {
        question: 'Do I need prior yoga or wellness experience?',
        answer: 'No. All of our programs are designed to be accessible regardless of your fitness level or familiarity with yoga and breathwork. We meet you where you are and adapt every session accordingly.',
      },
      {
        question: 'What if I miss a live session?',
        answer: 'All Flow Series sessions are recorded and made available within 24 hours. You will have lifetime access to the recordings. We encourage attending live for the community interaction, but recordings ensure you never fall behind.',
      },
      {
        question: 'What technology do I need for virtual sessions?',
        answer: 'You need a stable internet connection, a device with a camera and microphone (laptop, tablet, or phone), and enough space to move comfortably. Sessions are held on Zoom.',
      },
    ],
  },
  {
    heading: 'Your Account & the App',
    faqs: [
      {
        question: 'Do I need an account to access programs?',
        answer: 'Yes. You need a free account to enroll in any program and access your member dashboard. Creating an account takes less than a minute from our signup page.',
      },
      {
        question: 'What can I do inside the member dashboard?',
        answer: 'Your dashboard gives you access to your enrolled programs and weekly materials, the community forum, direct messages with instructors and cohort members, a personal calendar, and private session booking.',
      },
      {
        question: 'How do I update my profile or account settings?',
        answer: 'Navigate to the Profile section inside your dashboard to update your name, bio, profile photo, and contact details.',
      },
      {
        question: 'What is the difference between a Member, Instructor, and Admin account?',
        answer: 'Members are enrolled participants who access programs and community features. Instructors have access to program management tools, student progress, and enhanced messaging. Admins manage the platform, users, and all program content.',
      },
    ],
  },
  {
    heading: 'Getting Started',
    faqs: [
      {
        question: 'How do I sign up for the Flow Series?',
        answer: 'Visit the Flow Series page from our personal offerings section and click "Enroll Now." You will create an account and complete payment through our secure checkout.',
      },
      {
        question: 'How do I get started with a team program?',
        answer: 'The first step is a 30-minute consultation where we learn about your organization\'s goals. Request a consultation from the team offerings page or use our contact form.',
      },
      {
        question: 'How can I contact you?',
        answer: 'You can reach us at info@osiris.yoga or through the contact form on our website. We typically respond within one business day.',
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

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-body">
      <section className="pt-12 sm:pt-20 pb-8 sm:pb-12 bg-stone-50">
        <div className="container-wide">
          <p className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-3">
            Help Center
          </p>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl font-bold text-primary mb-4">
            Help Center
          </h1>
          <p className="text-secondary text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
            A complete list of frequently asked questions about Osiris Yoga Therapy — our programs, pricing, enrollment, and more.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-20">
        <div className="container-wide max-w-3xl">
          <div className="space-y-10 sm:space-y-14">
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
            Did not find what you were looking for?
          </h2>
          <p className="text-secondary mb-8 max-w-lg mx-auto">
            We are here to help. Reach out and we will get back to you within one business day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors w-full sm:w-auto justify-center"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/offerings"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-medium border border-stone-300 hover:border-sage-300 hover:shadow-sm transition-all w-full sm:w-auto justify-center"
            >
              Explore Offerings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
