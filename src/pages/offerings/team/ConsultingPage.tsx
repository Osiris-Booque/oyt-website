import TeamProgramLayout from '../../../components/offerings/TeamProgramLayout';
import type { TeamProgram } from '../../../components/offerings/TeamProgramLayout';

const PROGRAM: TeamProgram = {
  engagementLabel: 'Consulting Engagement',
  title: 'Wellness Consulting',
  intro:
    'Strategic partnership for organizations that want a wellness framework built around them, not a package pulled off a shelf.',
  heroImage:
    'https://images.pexels.com/photos/15141493/pexels-photo-15141493.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
  heroMeta: [
    { text: '60 min, half day, or full day' },
    { text: 'Leadership-level advisory' },
    { text: 'Virtual or on-site' },
  ],
  consultPoints: [
    'Fully custom scope',
    'Delivered by a C-IAYT credentialed therapist',
    'Advisory, not program delivery',
  ],
  ctaLabel: 'Inquire About Consulting',
  ctaHref: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1HZ43X9NOvJz834TvyIRoJS6rrPvTHxRDCiOwqWtngAL-YC3ZkXiU716kFjkglgZmCtYJ1PKF_',
  pricingNote:
    'Scope and pricing are set after your complimentary consult, based on organizational needs.',
  whyHeading: 'Why consulting, not just a program',
  whyBody:
    "Delivered sessions solve the immediate need. They don't tell you why the need exists, or what it will take to keep it from resurfacing after the contract ends. Consulting exists for organizations that want the structural answer, not just the intervention.",
  included: [
    'Organizational wellness assessment',
    'Custom framework design with leadership',
    'Ongoing strategic advisory',
    'Integration with existing L&D/HR structure',
  ],
  howBody:
    "Osiris works directly with leadership to assess the organization's actual wellness architecture: where stress originates, how it moves through the team, and what existing L&D or HR structures can and can't hold. The output is a framework your organization owns, built to integrate with what you already run, not a bolt-on program.",
  practiceBody:
    '[Needs real numbers] Engagements are scoped individually. Typical structure includes an organizational assessment, a framework design phase with leadership, and an ongoing advisory relationship at whatever cadence fits.',
  closingBody: 'Inquire about consulting. Scoping happens after your complimentary consult.',
};

export default function ConsultingPage() {
  return <TeamProgramLayout program={PROGRAM} />;
}
