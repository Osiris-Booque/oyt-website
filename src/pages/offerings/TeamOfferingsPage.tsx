import { Building2, Handshake, Landmark, Monitor, MapPin, ArrowRight, CheckCircle2, Users } from "lucide-react";

const WELLNESS = {
  title: "Consulting",
  subtitle: "Strategic partnership for organizational wellness",
  description:
    "For organizations that want more than delivered sessions. Osiris works directly with your leadership to design a wellness framework built around your team's actual patterns, not a package pulled off a shelf.",
  image:
    "https://images.pexels.com/photos/15141493/pexels-photo-15141493.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
  features: [
    "Organizational wellness assessment",
    "Custom framework design with leadership",
    "Ongoing strategic advisory",
    "Integration with existing L&D/HR structure",
  ],
};

const GOVERNMENT = {
  title: "Government",
  subtitle: "Resilience & performance for public servants",
  description:
    "Purpose-built wellness and performance programs for government teams managing high-stress environments.",
  image:
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
  features: [
    "Trauma-informed resilience training",
    "Burnout prevention and recovery",
    "Mindfulness for high-stakes decision making",
    "Leadership development programs",
  ],
};

const CORPORATE = {
  title: "Corporate",
  subtitle: "Culture, performance, and retention",
  description:
    "Scalable wellness frameworks designed to integrate with L&D and HR strategies.",
  image:
    "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
  features: [
    "Executive wellness coaching",
    "Team mindfulness sessions",
    "Quarterly wellness immersion days",
    "Performance & resilience training",
  ],
};

const COMMUNITY = {
  title: "Community",
  subtitle: "Wellness for schools & nonprofits",
  description:
    "Specialized wellness programs designed for schools, nonprofits, and community organizations.",
  image:
    "https://images.pexels.com/photos/4386366/pexels-photo-4386366.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
  features: [
    "Age-adapted programming",
    "Trauma-informed wellness",
    "Student & staff wellness programs",
    "Senior wellbeing initiatives",
  ],
};

const DELIVERY = [
  {
    icon: Monitor,
    label: "Virtual",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
    desc: "Live Zoom sessions, async materials, and virtual cohorts that work across any timezone.",
  },
  {
    icon: MapPin,
    label: "In-Person",
    color: "text-sage-600",
    bg: "bg-sage-50",
    border: "border-sage-200",
    desc: "On-site programs delivered at your workplace or retreat location.",
  },
  {
    icon: Building2,
    label: "Hybrid",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    desc: "Blended programs designed for teams that include both remote and in-office staff.",
  },
];
const CALENDAR_URL = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1HZ43X9NOvJz834TvyIRoJS6rrPvTHxRDCiOwqWtngAL-YC3ZkXiU716kFjkglgZmCtYJ1PKF_";

function ProgramCard({ program, Icon }: { program: typeof GOVERNMENT; Icon: typeof Building2 }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-4 left-4 w-10 h-10 rounded-lg bg-white flex items-center justify-center">
          <Icon className="w-5 h-5 text-sage-600" />
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {program.title}
        </h3>
        <p className="text-sage-700 text-xs font-medium mb-3">
          {program.subtitle}
        </p>

        <p className="text-slate-500 text-sm mb-4">{program.description}</p>

        <ul className="space-y-2 mb-6">
          {program.features.map((f: string) => (
            <li key={f} className="flex gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-sage-600 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        <a
          href={CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-sage-600 text-white rounded-lg text-sm font-semibold hover:bg-sage-500 transition"
        >
          Request Consultation
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default function TeamOfferingsPage() {
  return (
    <div className="min-h-screen bg-stone-50">

      {/* PAGE CONTENT */}
      <div className="pt-12">

        <section
          id="about"
          className="max-w-7xl mx-auto px-6 pb-20"
        >
          <p className="text-sage-700 uppercase tracking-widest text-lg mb-2">
            Group Programs
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            Wellness Programs for Teams & Communities
          </h1>

          <p className="text-slate-500 max-w-2xl mb-10">
            Carefully crafted programs for organizations, communities, and
            institutions designed to improve resilience, wellbeing, and
            communication.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <ProgramCard program={WELLNESS} Icon={Handshake} />
            <ProgramCard program={GOVERNMENT} Icon={Landmark} />
            <ProgramCard program={CORPORATE} Icon={Building2} />
            <ProgramCard program={COMMUNITY} Icon={Users} />
          </div>
        </section>
      </div>
<section id="approach" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-stone-200">
  <div className="text-center max-w-xl mx-auto mb-12">
    <h2 className="text-2xl font-bold text-slate-900 mb-3">
      Flexible Delivery Options
    </h2>

    <p className="text-slate-500 text-sm leading-relaxed">
      We're here to meet you where you are and help you grow into your goals.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
    {DELIVERY.map((d) => (
      <div
        key={d.label}
        className={`rounded-2xl border ${d.border} ${d.bg} p-6`}
      >
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
          <d.icon className={`w-5 h-5 ${d.color}`} />
        </div>

        <h3 className={`text-lg font-bold mb-2 ${d.color}`}>
          {d.label}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed">
          {d.desc}
        </p>
      </div>
    ))}
  </div>
</section>

<section id="faq" className="bg-white py-20 mb-0 border-t border-stone-200">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 className="text-3xl font-bold text-slate-900 mb-4">
      Ready to bring wellness to your group?
    </h2>

    {/* <p className="text-slate-600 text-lg leading-relaxed mb-8">
      Tell us which programs interest you, and we'll connect you with our team to discuss your organization's goals.
    </p> */}

    <a
      href={CALENDAR_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-sage-600 text-white font-bold text-lg hover:bg-sage-500 transition-colors"
    >
      Book a Consultation
      <ArrowRight className="w-5 h-5" />
    </a>
  </div>
</section>
    </div>
  )
}
