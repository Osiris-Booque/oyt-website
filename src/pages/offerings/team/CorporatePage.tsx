import TeamProgramLayout from '../../../components/offerings/TeamProgramLayout';
import type { TeamProgram } from '../../../components/offerings/TeamProgramLayout';

const PROGRAM: TeamProgram = {
  engagementLabel: 'Corporate Engagement',
  title: 'Corporate Wellness Programs',
  intro:
    'A wellness framework for organizations whose people are performing under sustained pressure, built by a certified yoga therapist, not templated from a vendor catalog.',
  heroImage:
    'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
  heroMeta: [
    { text: '60 min, half day, or full day' },
    { text: 'Team & 1:1 formats' },
    { text: 'Virtual or on-site' },
  ],
  consultPoints: [
    'Custom-scoped to your team',
    'Delivered by a C-IAYT credentialed therapist',
    'Workshop, retainer, or keynote format',
  ],
  ctaLabel: 'Request a Consultation',
  ctaHref: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1HZ43X9NOvJz834TvyIRoJS6rrPvTHxRDCiOwqWtngAL-YC3ZkXiU716kFjkglgZmCtYJ1PKF_',
  pricingNote:
    'Pricing is scoped after your complimentary consult, based on team size and engagement format.',
  whyHeading: 'Why yoga therapy, not wellness programming',
  whyBody:
    "Most corporate wellness treats stress as a morale problem. It isn't. It's a nervous system problem, and nervous systems don't reset because someone brought in a masseuse for the afternoon. Yoga therapy is a distinct clinical discipline, and the difference matters most in high-stakes environments, where the cost of unregulated teams shows up in retention, decision quality, and burnout.",
  included: [
    'Executive wellness coaching',
    'Team mindfulness sessions',
    'Quarterly wellness immersion days',
    'Performance & resilience training',
  ],
  howBody:
    "Every engagement starts with an assessment, not a package. Osiris works directly with leadership to understand your team's actual stress patterns, then builds a program specific to that: ongoing coaching, a scheduled workshop series, or a single high-impact session. This is the same therapeutic methodology used in clinical 1:1 work, adapted for the room.",
  practiceBody:
    '[Needs real numbers] Sessions run [length], delivered as [workshop / retainer cadence / keynote], on-site or virtual. Engagements range from a single immersion day to an ongoing quarterly retainer.',
  closingBody: 'Request a consultation. Scoping happens after your complimentary consult.',
};

export default function CorporatePage() {
  return <TeamProgramLayout program={PROGRAM} />;
}
