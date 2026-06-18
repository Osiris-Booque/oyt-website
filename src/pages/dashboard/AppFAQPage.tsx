import { useState } from 'react';
import { ChevronDown, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/context/AuthContext';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSection {
  heading: string;
  faqs: FAQ[];
}

const MEMBER_SECTIONS: FAQSection[] = [
  {
    heading: 'Your Dashboard',
    faqs: [
      {
        question: 'What can I do in my dashboard?',
        answer: 'Your dashboard gives you access to your enrolled programs and weekly materials, the community forum, direct messages with instructors and cohort members, a personal calendar, private session booking, and your profile settings.',
      },
      {
        question: 'How do I access my program materials?',
        answer: 'Go to Programs in the sidebar. Select your enrolled program to view weekly reflection guides, video practices, journaling prompts, and session recordings. New materials are released each week of the program.',
      },
      {
        question: 'Where can I find the live session recordings?',
        answer: 'Recordings are available inside your program page within 24 hours of each live session. You have lifetime access to all recordings for any program you have enrolled in.',
      },
      {
        question: 'How do I connect with my cohort?',
        answer: 'The Community section in your dashboard gives you access to the shared forum where you and your cohort members can post, respond, and interact between sessions. You can also send direct messages to cohort members and your instructor from the Messages section.',
      },
    ],
  },
  {
    heading: 'Booking & Calendar',
    faqs: [
      {
        question: 'How do I book a private session?',
        answer: 'Go to the Booking section in your sidebar to view instructor availability and schedule a private yoga therapy, breathwork, or coaching session. Flow Series members receive discounted rates that are applied automatically.',
      },
      {
        question: 'Where do I see my upcoming sessions?',
        answer: 'The Calendar section shows all your upcoming live cohort sessions and booked private appointments. You can also sync it with your personal calendar from the Calendar settings.',
      },
      {
        question: 'How do I cancel or reschedule a private session?',
        answer: 'Reach out to your instructor directly via the Messages section as soon as possible. Cancellations made less than 24 hours before a session may not be eligible for rescheduling.',
      },
    ],
  },
  {
    heading: 'Community & Messaging',
    faqs: [
      {
        question: 'Who can I message?',
        answer: 'As a member, you can message your instructor and other members of your current cohort. Your inbox is in the Messages section of the sidebar.',
      },
      {
        question: 'Can I see posts from past cohorts in the community forum?',
        answer: 'The community forum shows posts from your current active program. Alumni who re-enroll in a new cohort regain access to that cohort\'s forum activity.',
      },
    ],
  },
  {
    heading: 'Account & Profile',
    faqs: [
      {
        question: 'How do I update my name or profile photo?',
        answer: 'Go to Profile in the sidebar to update your display name, bio, profile photo, and contact information.',
      },
      {
        question: 'How do I change my password?',
        answer: 'From your Profile page, select the security settings option to update your password. You can also use the "Forgot password" link on the login page.',
      },
      {
        question: 'Why does it say I do not have access to a program?',
        answer: 'Access to program materials is granted upon enrollment and confirmed payment. If you believe you should have access and do not, contact us through the Help Center or reach out to your instructor.',
      },
    ],
  },
];

const INSTRUCTOR_SECTIONS: FAQSection[] = [
  {
    heading: 'Managing Your Programs',
    faqs: [
      {
        question: 'How do I view and manage my assigned program?',
        answer: 'Go to the Programs section in the instructor sidebar. You can view enrolled students, update program materials, track progress, and manage milestone completions from here.',
      },
      {
        question: 'How do I update program content or weekly materials?',
        answer: 'Inside your program page, use the editor tools to update session descriptions, add resources, or modify weekly reflection guides. Changes are reflected immediately for enrolled students.',
      },
      {
        question: 'How do I manage student enrollment?',
        answer: 'The Enrollments tab inside your program shows all enrolled members. You can view their status, progress, and payment confirmation. Contact admin if you need to adjust enrollment directly.',
      },
    ],
  },
  {
    heading: 'Availability & Booking',
    faqs: [
      {
        question: 'How do I set my availability for private sessions?',
        answer: 'Go to Availability in your instructor sidebar to set the days and times you are available for private bookings. Students can only book during your available windows.',
      },
      {
        question: 'How do I view and manage upcoming bookings?',
        answer: 'Your Calendar shows all upcoming private sessions and cohort events. You can also review new bookings from the Availability section.',
      },
    ],
  },
  {
    heading: 'Messaging & Community',
    faqs: [
      {
        question: 'How do I message students?',
        answer: 'Use the Messages section to send direct messages to any enrolled student. You can also post announcements, reply to posts, and moderate the community forum from the Community section.',
      },
      {
        question: 'Can I message students who are not currently enrolled?',
        answer: 'Direct messaging is available to students enrolled in your active program. For past students or prospective inquiries, use the general messaging tools accessible from your instructor panel.',
      },
    ],
  },
  {
    heading: 'Account & Settings',
    faqs: [
      {
        question: 'How do I update my instructor profile?',
        answer: 'Your instructor profile is managed from the Profile section. Keep your bio, photo, and contact details current — students see this information when viewing program details.',
      },
      {
        question: 'I need admin access to do something. Who do I contact?',
        answer: 'For anything that requires elevated access — such as modifying enrollment records or payment data — contact the site admin directly. Use the Messages section or the Help Center contact form.',
      },
    ],
  },
];

const ADMIN_SECTIONS: FAQSection[] = [
  {
    heading: 'User Management',
    faqs: [
      {
        question: 'How do I view and manage all users?',
        answer: 'The Admin Users section gives you a complete list of all registered accounts. You can search by name or email, view role assignments, and update user roles directly from this page.',
      },
      {
        question: 'How do I change a user\'s role?',
        answer: 'From the Users page, select a user and use the role assignment controls to promote them to Instructor or Admin, or revert them to Member. Role changes take effect immediately.',
      },
      {
        question: 'How do I review user activity?',
        answer: 'The Activity section in the admin panel shows a log of recent platform activity across users, programs, and enrollments.',
      },
    ],
  },
  {
    heading: 'Program Management',
    faqs: [
      {
        question: 'How do I create or edit a program?',
        answer: 'Go to the Programs section in the admin panel. Use the Program Editor to create new programs, assign instructors, add or edit modules, set pricing, and configure enrollment status.',
      },
      {
        question: 'How do I assign an instructor to a program?',
        answer: 'Open the Program Editor for the program you want to manage. The Instructor field lets you assign any user with an instructor role. Only one instructor can be assigned as the primary instructor per program.',
      },
    ],
  },
  {
    heading: 'Payments & Enrollments',
    faqs: [
      {
        question: 'Where do I view payment records?',
        answer: 'Payment data is managed through the database and Stripe dashboard. The Admin Overview page surfaces summary enrollment and payment metrics. For detailed transaction records, access your Stripe dashboard directly.',
      },
      {
        question: 'How do I manually enroll a user in a program?',
        answer: 'Manual enrollment can be done by creating a payment record with a confirmed status for the user and program combination. Contact the development team if you need a UI-based manual enrollment tool added.',
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

function FAQSections({ sections }: { sections: FAQSection[] }) {
  return (
    <div className="space-y-10 sm:space-y-14">
      {sections.map((section) => (
        <div key={section.heading}>
          <h2 className="text-lg sm:text-xl font-bold text-primary mb-4 sm:mb-5">
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
  );
}

export default function AppFAQPage() {
  const { profile, hasRole } = useAuth();

  const isAdmin = hasRole('admin');
  const isInstructor = hasRole('instructor');

  const sections = isAdmin ? ADMIN_SECTIONS : isInstructor ? INSTRUCTOR_SECTIONS : MEMBER_SECTIONS;

  const roleLabel = isAdmin ? 'Admin' : isInstructor ? 'Instructor' : 'Member';
  const roleSubheading = isAdmin
    ? 'Answers specific to managing users, programs, and platform settings.'
    : isInstructor
    ? 'Answers specific to managing your programs, availability, and student interactions.'
    : 'Answers to help you get the most out of your membership and enrolled programs.';

  return (
    <div className="min-h-screen bg-body">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex items-start gap-3 mb-8 sm:mb-10">
          <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center shrink-0 mt-0.5">
            <HelpCircle className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-sage-600 uppercase tracking-widest mb-1">
              App FAQs · {roleLabel}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
              {profile?.full_name ? `Hi ${profile.full_name.split(' ')[0]}, how can we help?` : 'How can we help?'}
            </h1>
            <p className="text-secondary text-sm mt-1 max-w-xl">{roleSubheading}</p>
          </div>
        </div>

        <FAQSections sections={sections} />

        <div className="mt-12 sm:mt-16 p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center">
          <h2 className="font-semibold text-primary mb-2">Didn't find what you were looking for?</h2>
          <p className="text-secondary text-sm mb-5">
            Visit the public Help Center for a complete list of FAQs, or send us a message.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-sage-700 transition-colors w-full sm:w-auto justify-center"
            >
              Visit Help Center
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard/messages"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-2.5 rounded-lg font-medium text-sm border border-stone-300 hover:border-sage-300 hover:shadow-sm transition-all w-full sm:w-auto justify-center"
            >
              Message Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
