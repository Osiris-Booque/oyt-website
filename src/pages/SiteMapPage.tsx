import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  Users,
  ShoppingCart,
  LayoutDashboard,
  GraduationCap,
  Shield,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Map,
} from "lucide-react";

type FlowArrow = {
  from: string;
  to: string;
  label: string;
  type: "cta" | "nav" | "redirect" | "external";
};

type PageNode = {
  path: string;
  label: string;
  description?: string;
};

type SiteSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  pages: PageNode[];
};

const sections: SiteSection[] = [
  {
    id: "public",
    title: "Public Pages",
    icon: <Globe className="w-4 h-4" />,
    color: "text-teal-700",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    pages: [
      { path: "/", label: "Landing Page", description: "Hero, Offerings preview, About, Contact form" },
      { path: "/about", label: "About", description: "Values, Journey, Testimonials, Who We Serve" },
      { path: "/blog", label: "Blog", description: "Articles, newsletter signup" },
      { path: "/faq", label: "FAQ", description: "Frequently asked questions" },
      { path: "/contact", label: "Contact", description: "Contact form, consultation booking" },
      { path: "/login", label: "Login", description: "Email/password sign in" },
      { path: "/signup", label: "Sign Up", description: "New account registration" },
    ],
  },
  {
    id: "offerings",
    title: "Offerings",
    icon: <Users className="w-4 h-4" />,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    pages: [
      { path: "/offerings", label: "Offerings Hub", description: "Personal vs Team selection" },
      { path: "/offerings/personal", label: "Personal Offerings", description: "Individual programs, Flow Series highlight" },
      { path: "/offerings/team", label: "Team Offerings", description: "Government, Corporate, Community programs" },
      { path: "/offerings/flow-series", label: "Flow Series Detail", description: "Full program details, curriculum, pricing" },
      { path: "/offerings/personal/the-body", label: "The Body", description: "Private session track — somatic awareness, strength, nervous system regulation" },
      { path: "/offerings/personal/the-mind", label: "The Mind", description: "Private session track — somatic-emotional and metacognitive work" },
      { path: "/offerings/personal/the-soul", label: "The Soul", description: "Private session track — energetic identity and inner dualities" },
      { path: "/offerings/personal/faq", label: "Personal FAQ", description: "Program-specific questions" },
      { path: "/offerings/team/consulting", label: "Wellness Consulting", description: "Leadership-level advisory and framework design" },
      { path: "/offerings/team/government", label: "Government Programs", description: "Resilience and performance for public servants" },
      { path: "/offerings/team/corporate", label: "Corporate Wellness", description: "Executive coaching, team mindfulness, immersion days" },
      { path: "/offerings/team/community", label: "Community Wellness", description: "Schools, nonprofits, and community organizations" },
      { path: "/offerings/team/faq", label: "Team FAQ", description: "Team program questions" },
    ],
  },
  {
    id: "checkout",
    title: "Checkout Flow",
    icon: <ShoppingCart className="w-4 h-4" />,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    pages: [
      { path: "/checkout/:programSlug", label: "Generic Checkout", description: "Program purchase page" },
      { path: "/checkout/spring-cohort/register", label: "Spring Cohort Register", description: "Account creation / sign in" },
      { path: "/checkout/spring-cohort/pay", label: "Spring Cohort Payment", description: "Stripe payment processing" },
    ],
  },
  {
    id: "dashboard",
    title: "Student Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    pages: [
      { path: "/dashboard", label: "Dashboard Home", description: "Enrolled programs, upcoming classes, community preview" },
      { path: "/dashboard/programs", label: "Program Catalog", description: "Browse all available programs" },
      { path: "/dashboard/programs/:slug", label: "Program Detail", description: "Modules, assignments, class schedule" },
      { path: "/dashboard/calendar", label: "Calendar", description: "Class schedule view" },
      { path: "/dashboard/booking", label: "Booking", description: "Book sessions with instructors" },
      { path: "/dashboard/community", label: "Community Board", description: "Discussion posts and replies" },
      { path: "/dashboard/messages", label: "Messages", description: "Direct messaging" },
      { path: "/dashboard/profile", label: "Profile", description: "Account settings" },
      { path: "/dashboard/completed-programs", label: "Completed Programs", description: "Past programs and certificates" },
    ],
  },
  {
    id: "instructor",
    title: "Instructor Portal",
    icon: <GraduationCap className="w-4 h-4" />,
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    pages: [
      { path: "/instructor", label: "Instructor Home", description: "Assigned programs, student overview" },
      { path: "/instructor/programs/:id", label: "Program Management", description: "Manage enrollments, milestones" },
      { path: "/instructor/calendar", label: "Calendar", description: "Teaching schedule" },
      { path: "/instructor/availability", label: "Availability", description: "Set available time slots" },
      { path: "/instructor/messages", label: "Messages", description: "Student communication" },
      { path: "/instructor/community", label: "Community", description: "Community board access" },
    ],
  },
  {
    id: "admin",
    title: "Admin Panel",
    icon: <Shield className="w-4 h-4" />,
    color: "text-slate-700",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    pages: [
      { path: "/admin", label: "Admin Overview", description: "Stats, recent activity summary" },
      { path: "/admin/programs", label: "Manage Programs", description: "Create, edit, delete programs" },
      { path: "/admin/programs/:id", label: "Program Editor", description: "Full program editing with CSV import" },
      { path: "/admin/users", label: "User Management", description: "Roles, status, user details" },
      { path: "/admin/activity", label: "Activity Log", description: "System-wide activity feed" },
      { path: "/admin/messages", label: "Messages", description: "Admin messaging" },
      { path: "/admin/community", label: "Community", description: "Community moderation" },
    ],
  },
];

const flows: FlowArrow[] = [
  { from: "/", to: "/offerings", label: "Explore Offerings (Hero CTA)", type: "cta" },
  { from: "/", to: "/offerings/team", label: "Team Growth section", type: "nav" },
  { from: "/", to: "/offerings/personal", label: "Personal Growth section", type: "nav" },
  { from: "/", to: "/about", label: "Learn more about us", type: "nav" },

  { from: "/about", to: "/offerings/personal", label: "Explore personal programs", type: "nav" },
  { from: "/about", to: "/offerings/team", label: "Explore team programs", type: "nav" },
  { from: "/about", to: "/offerings", label: "View Offerings", type: "cta" },


  { from: "/faq", to: "/contact", label: "Contact Us", type: "cta" },
  { from: "/faq", to: "/offerings", label: "Explore Offerings", type: "cta" },

  { from: "/offerings", to: "/offerings/personal", label: "Personal Growth card", type: "nav" },
  { from: "/offerings", to: "/offerings/team", label: "Team Growth card", type: "nav" },

  { from: "/offerings/personal", to: "/checkout/spring-cohort/register", label: "Enroll Now", type: "cta" },
  { from: "/offerings/personal", to: "/offerings/flow-series", label: "Learn More", type: "nav" },

  { from: "/offerings/personal", to: "/offerings/personal/the-body", label: "The Body card", type: "nav" },
  { from: "/offerings/personal", to: "/offerings/personal/the-mind", label: "The Mind card", type: "nav" },
  { from: "/offerings/personal", to: "/offerings/personal/the-soul", label: "The Soul card", type: "nav" },
  { from: "/offerings/personal", to: "external:flowthroughsummer.com", label: "Summer season site", type: "external" },
  { from: "/offerings/personal", to: "external:flowthroughfall.com", label: "Fall season site", type: "external" },
  { from: "/offerings/personal", to: "external:flowintospring.com", label: "Spring season site", type: "external" },
  { from: "/offerings/personal", to: "external:flowthroughwinter.com", label: "Winter season site", type: "external" },

  { from: "/offerings/team", to: "/offerings/team/consulting", label: "Consulting card", type: "nav" },
  { from: "/offerings/team", to: "/offerings/team/government", label: "Government card", type: "nav" },
  { from: "/offerings/team", to: "/offerings/team/corporate", label: "Corporate card", type: "nav" },
  { from: "/offerings/team", to: "/offerings/team/community", label: "Community card", type: "nav" },
  { from: "/offerings/team", to: "external:calendar", label: "Book a Consultation", type: "external" },
  { from: "/offerings/team/consulting", to: "external:calendar", label: "Inquire About Consulting", type: "external" },
  { from: "/offerings/team/government", to: "external:calendar", label: "Request a Consultation", type: "external" },
  { from: "/offerings/team/corporate", to: "external:calendar", label: "Request a Consultation", type: "external" },
  { from: "/offerings/team/community", to: "external:calendar", label: "Request a Consultation", type: "external" },

  { from: "/offerings/flow-series", to: "/checkout/spring-cohort/pay", label: "Enroll Now -- $1200", type: "cta" },
  { from: "/offerings/flow-series", to: "/login", label: "Already have an account?", type: "nav" },

  { from: "/offerings/personal/faq", to: "/faq", label: "Visit Help Center", type: "nav" },
  { from: "/offerings/personal/faq", to: "/contact", label: "Contact Us", type: "cta" },
  { from: "/offerings/team/faq", to: "/faq", label: "Visit Help Center", type: "nav" },
  { from: "/offerings/team/faq", to: "/contact", label: "Contact Us", type: "cta" },

  { from: "/checkout/spring-cohort/register", to: "/checkout/spring-cohort/pay", label: "Continue to Payment", type: "cta" },
  { from: "/checkout/spring-cohort/register", to: "/login", label: "Sign in here", type: "nav" },
  { from: "/checkout/spring-cohort/pay", to: "/dashboard", label: "Payment success", type: "redirect" },

  { from: "/login", to: "/signup", label: "Sign up", type: "nav" },
  { from: "/login", to: "/dashboard", label: "Login success", type: "redirect" },
  { from: "/signup", to: "/login", label: "Sign in", type: "nav" },
  { from: "/signup", to: "/dashboard", label: "Signup success", type: "redirect" },

  { from: "/dashboard", to: "/dashboard/programs/:slug", label: "Program cards", type: "nav" },
  { from: "/dashboard", to: "/dashboard/community", label: "Join the Conversation", type: "cta" },
  { from: "/dashboard/programs", to: "/dashboard/programs/:slug", label: "Course card", type: "nav" },
  { from: "/dashboard/programs/:slug", to: "/dashboard/community", label: "Go to Community Board", type: "nav" },
];

const typeStyles: Record<string, { bg: string; text: string; label: string }> = {
  cta: { bg: "bg-emerald-100", text: "text-emerald-800", label: "CTA" },
  nav: { bg: "bg-sky-100", text: "text-sky-800", label: "Nav Link" },
  redirect: { bg: "bg-amber-100", text: "text-amber-800", label: "Redirect" },
  external: { bg: "bg-rose-100", text: "text-rose-800", label: "External" },
};

function FlowCard({ flow }: { flow: FlowArrow }) {
  const style = typeStyles[flow.type];
  return (
    <div className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
      <span className={`shrink-0 mt-0.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
        {style.label}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 font-medium leading-tight">{flow.label}</p>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px] font-mono">{flow.from}</code>
          <ArrowRight className="w-3 h-3 shrink-0 text-gray-400" />
          {flow.type === "external" ? (
            <span className="flex items-center gap-1 text-rose-600">
              External <ExternalLink className="w-3 h-3" />
            </span>
          ) : (
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px] font-mono">{flow.to}</code>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SiteMapPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.id))
  );
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filteredFlows = flows.filter((f) => {
    if (activeFilter && f.type !== activeFilter) return false;
    if (selectedPage && f.from !== selectedPage && f.to !== selectedPage) return false;
    return true;
  });

  const outgoing = selectedPage ? flows.filter((f) => f.from === selectedPage) : [];
  const incoming = selectedPage ? flows.filter((f) => f.to === selectedPage) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Admin Dashboard
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-600 text-white">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Site Map</h1>
              <p className="text-sm text-gray-500">Pages, navigation, CTAs, and user flows</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">All Pages</h2>
              {selectedPage && (
                <button
                  onClick={() => setSelectedPage(null)}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Clear selection
                </button>
              )}
            </div>

            {sections.map((section) => {
              const isExpanded = expandedSections.has(section.id);
              return (
                <div
                  key={section.id}
                  className={`rounded-xl border bg-white overflow-hidden transition-shadow ${
                    selectedPage &&
                    section.pages.some((p) => p.path === selectedPage)
                      ? "ring-2 ring-teal-300 shadow-md"
                      : "shadow-sm"
                  }`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors ${section.borderColor}`}
                  >
                    <div className={`p-1.5 rounded-md ${section.bgColor} ${section.color}`}>
                      {section.icon}
                    </div>
                    <span className="font-semibold text-gray-900 flex-1">{section.title}</span>
                    <span className="text-xs text-gray-400 mr-2">{section.pages.length} pages</span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {section.pages.map((page) => {
                        const isSelected = selectedPage === page.path;
                        const pageOutgoing = flows.filter((f) => f.from === page.path);
                        const pageIncoming = flows.filter((f) => f.to === page.path);
                        const hasFlows = pageOutgoing.length > 0 || pageIncoming.length > 0;

                        return (
                          <button
                            key={page.path}
                            onClick={() =>
                              setSelectedPage(isSelected ? null : page.path)
                            }
                            className={`w-full text-left px-5 py-3 flex items-start gap-3 transition-all border-l-[3px] ${
                              isSelected
                                ? `${section.borderColor} ${section.bgColor}`
                                : "border-transparent hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">{page.label}</span>
                                {hasFlows && (
                                  <span className="text-[10px] text-gray-400">
                                    {pageOutgoing.length > 0 && `${pageOutgoing.length} out`}
                                    {pageOutgoing.length > 0 && pageIncoming.length > 0 && " / "}
                                    {pageIncoming.length > 0 && `${pageIncoming.length} in`}
                                  </span>
                                )}
                              </div>
                              <code className="text-[11px] font-mono text-gray-400 block mt-0.5">
                                {page.path}
                              </code>
                              {page.description && (
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                  {page.description}
                                </p>
                              )}
                            </div>
                            <ArrowRight
                              className={`w-4 h-4 mt-1 shrink-0 transition-colors ${
                                isSelected ? "text-teal-500" : "text-gray-300"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="sticky top-20">
              {selectedPage ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-teal-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 bg-teal-50 border-b border-teal-100">
                      <h3 className="font-semibold text-teal-900">
                        {sections
                          .flatMap((s) => s.pages)
                          .find((p) => p.path === selectedPage)?.label}
                      </h3>
                      <code className="text-xs font-mono text-teal-600 mt-0.5 block">
                        {selectedPage}
                      </code>
                    </div>

                    {outgoing.length > 0 && (
                      <div className="px-5 py-3 border-b border-gray-100">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Links from this page ({outgoing.length})
                        </h4>
                        <div className="space-y-1">
                          {outgoing.map((f, i) => (
                            <FlowCard key={i} flow={f} />
                          ))}
                        </div>
                      </div>
                    )}

                    {incoming.length > 0 && (
                      <div className="px-5 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Links to this page ({incoming.length})
                        </h4>
                        <div className="space-y-1">
                          {incoming.map((f, i) => (
                            <FlowCard key={i} flow={f} />
                          ))}
                        </div>
                      </div>
                    )}

                    {outgoing.length === 0 && incoming.length === 0 && (
                      <div className="px-5 py-6 text-center text-sm text-gray-400">
                        No tracked flows for this page
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">All Flows</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Click a page to see its connections
                      </p>
                    </div>

                    <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap gap-2">
                      {Object.entries(typeStyles).map(([key, style]) => (
                        <button
                          key={key}
                          onClick={() =>
                            setActiveFilter(activeFilter === key ? null : key)
                          }
                          className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md transition-all ${
                            activeFilter === key
                              ? `${style.bg} ${style.text} ring-2 ring-offset-1 ring-current`
                              : activeFilter === null
                              ? `${style.bg} ${style.text}`
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {style.label} ({flows.filter((f) => f.type === key).length})
                        </button>
                      ))}
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-50 px-2 py-1">
                      {filteredFlows.map((flow, i) => (
                        <FlowCard key={i} flow={flow} />
                      ))}
                      {filteredFlows.length === 0 && (
                        <div className="px-4 py-6 text-center text-sm text-gray-400">
                          No flows match the current filter
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border bg-white shadow-sm p-5">
                    <h3 className="font-semibold text-gray-900 mb-3">Key User Journeys</h3>
                    <div className="space-y-4">
                      <Journey
                        title="New Student Enrollment"
                        steps={[
                          "Landing Page",
                          "Offerings Hub",
                          "Personal Offerings",
                          "Flow Series Detail",
                          "Register",
                          "Payment",
                          "Dashboard",
                        ]}
                        color="emerald"
                      />
                      <Journey
                        title="Team Consultation"
                        steps={[
                          "Landing Page",
                          "Offerings Hub",
                          "Team Offerings",
                          "Book Consultation (External)",
                        ]}
                        color="amber"
                      />
                      <Journey
                        title="Returning Student"
                        steps={[
                          "Login",
                          "Dashboard",
                          "Program Detail",
                          "Community Board",
                        ]}
                        color="sky"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Journey({
  title,
  steps,
  color,
}: {
  title: string;
  steps: string[];
  color: string;
}) {
  const dotColor: Record<string, string> = {
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    sky: "bg-sky-500",
  };
  const lineColor: Record<string, string> = {
    emerald: "bg-emerald-200",
    amber: "bg-amber-200",
    sky: "bg-sky-200",
  };

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      <div className="relative pl-4">
        <div className={`absolute left-[7px] top-2 bottom-2 w-0.5 ${lineColor[color]}`} />
        {steps.map((step, i) => (
          <div key={i} className="relative flex items-center gap-2.5 py-1">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor[color]} ${i === steps.length - 1 ? "ring-2 ring-offset-2 ring-current" : ""}`} />
            <span className="text-xs text-gray-600">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
