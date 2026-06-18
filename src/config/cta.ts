export type CTAConfig = {
  label: string;
  to?: string;
  href?: string;
};

export const CTA_CONFIG: Record<string, CTAConfig> = {
  default: {
    label: "Get Started",
    to: "/offerings",
  },

  enrollToday: {
    label: "Enroll Today",
    to: "/checkout/spring-cohort/register",
  },

  takeTest: {
    label: "Take the Test",
    to: "/quiz",
  },

  contactUs: {
  label: "Contact Us",
  to: "/contact",
  },
  
  teamConsult: {
    label: "Book Team Consultation",
    to: "/contact",
  },

  bookConsultation: {
    label: "Book a Consultation",
    href: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1HZ43X9NOvJz834TvyIRoJS6rrPvTHxRDCiOwqWtngAL-YC3ZkXiU716kFjkglgZmCtYJ1PKF_",
  },

  requestConsultation: {
    label: "Request a Consultation",
    href: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1HZ43X9NOvJz834TvyIRoJS6rrPvTHxRDCiOwqWtngAL-YC3ZkXiU716kFjkglgZmCtYJ1PKF_",
  },

  enrollmentOpen: {
    label: "Enrollment Open",
    to: "/offerings/flow-series",
  },

  flowIntoSpring: {
    label: "Flow Into Spring — Registration Now Open",
    to: "/offerings/flow-series",
  },
};
