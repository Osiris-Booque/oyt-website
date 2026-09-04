import TeamProgramLayout from '../../../components/offerings/TeamProgramLayout';
import type { TeamProgram } from '../../../components/offerings/TeamProgramLayout';

const PROGRAM: TeamProgram = {
  engagementLabel: 'Community Engagement',
  title: 'Community Wellness Programs',
  intro:
    'Wellness for schools, nonprofits, and community organizations built for the people holding the community together, not just the people they serve.',
  heroImage:
    'https://images.pexels.com/photos/4386366/pexels-photo-4386366.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
  heroMeta: [
    { text: '60 min, half day, or full day' },
    { text: 'Team & 1:1 formats' },
    { text: 'Virtual or on-site' },
  ],
  consultPoints: [
    'Custom-scoped to your organization',
    'Delivered by a C-IAYT credentialed therapist',
    'Workshop, retainer, or keynote format',
  ],
  ctaLabel: 'Request a Consultation',
  ctaHref: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1HZ43X9NOvJz834TvyIRoJS6rrPvTHxRDCiOwqWtngAL-YC3ZkXiU716kFjkglgZmCtYJ1PKF_',
  pricingNote:
    'Pricing is scoped after your complimentary consult, based on group size and engagement format.',
  whyHeading: 'Why age-adapted, trauma-informed practice',
  whyBody:
    "Schools, nonprofits, and community organizations run on people who give past capacity because the mission demands it. Staff burnout in these settings isn't a scheduling problem, it's an under-resourced nervous system holding a caseload it was never built to carry alone. Generic wellness content doesn't reach that. Trauma-informed, age-adapted practice does.",
  included: [
    'Age-adapted programming',
    'Trauma-informed wellness',
    'Student & staff wellness programs',
    'Senior wellbeing initiatives',
  ],
  howBody:
    "Every engagement starts with understanding who's actually in the room, students, staff, elders, and building toward that. Osiris works with your leadership to design programming specific to your population, whether that's ongoing staff support, a workshop series for students, or a single wellbeing initiative. Same clinical methodology, adapted to the setting.",
  practiceBody:
    '[Needs real numbers] Sessions run [length], delivered as [workshop / retainer cadence / keynote], on-site or virtual. Engagements range from a single wellbeing day to an ongoing program.',
  closingBody: 'Request a consultation. Scoping happens after your complimentary consult.',
};

export default function CommunityPage() {
  return <TeamProgramLayout program={PROGRAM} />;
}
