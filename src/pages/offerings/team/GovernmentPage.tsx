import TeamProgramLayout from '../../../components/offerings/TeamProgramLayout';
import type { TeamProgram } from '../../../components/offerings/TeamProgramLayout';

const PROGRAM: TeamProgram = {
  engagementLabel: 'Government Engagement',
  title: 'Government Agency Programs',
  intro:
    "Resilience and performance programs built for public servants managing institutional pressure that doesn't ease with the news cycle.",
  heroImage:
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
  heroMeta: [
    { text: '60 min, half day, or full day' },
    { text: 'Team & 1:1 formats' },
    { text: 'Virtual or on-site' },
  ],
  consultPoints: [
    'Custom-scoped to your agency',
    'Delivered by a C-IAYT credentialed therapist',
    'Workshop, retainer, or keynote format',
  ],
  ctaLabel: 'Request a Consultation',
  ctaHref: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1HZ43X9NOvJz834TvyIRoJS6rrPvTHxRDCiOwqWtngAL-YC3ZkXiU716kFjkglgZmCtYJ1PKF_',
  pricingNote:
    'Pricing is scoped after your complimentary consult, based on team size and engagement format.',
  whyHeading: 'Why resilience training, not another wellness day',
  whyBody:
    "Public service asks people to hold other people's crises as a matter of course. That's not a morale issue, it's a sustained nervous system load, and it accumulates whether or not anyone names it. Trauma-informed resilience work exists because generic stress management wasn't built for people whose job is absorbing other people's worst days.",
  included: [
    'Trauma-informed resilience training',
    'Burnout prevention and recovery',
    'Mindfulness for high-stakes decision-making',
    'Leadership development programs',
  ],
  howBody:
    "Every engagement starts with an assessment of what your teams are actually carrying, not a standard curriculum. Osiris works with agency leadership to build the right format, whether that's ongoing coaching for high-exposure roles, a structured workshop series, or leadership-focused sessions on high-stakes decision-making. The methodology is the same clinical yoga therapy framework used in 1:1 practice, adapted for institutional teams.",
  practiceBody:
    '[Needs real numbers] Sessions run [length], delivered as [workshop / retainer cadence / keynote], on-site or virtual.',
  closingBody: 'Request a consultation. Scoping happens after your complimentary consult.',
};

export default function GovernmentPage() {
  return <TeamProgramLayout program={PROGRAM} />;
}
