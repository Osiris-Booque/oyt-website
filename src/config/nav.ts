export type NavItem = {
  label: string
  to?: string
  href?: string
  isBack?: boolean
}

export const NAV_LANDING: NavItem[] = [
  { label: "Offerings", href: "#offerings" },
  { label: "About", href: "#about" },
  { label: "Blog", to: "/blog" },
  { label: "Send Us A Message", href: "#contact" }
]

export const NAV_MARKETING: NavItem[] = [
  { label: "Offerings", to: "/offerings" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" }
]

export const NAV_OFFERINGS_HUB: NavItem[] = [
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "FAQs", to: "/faq" },
]

export const NAV_PERSONAL_HUB: NavItem[] = [
  { label: "Back to all Offerings", href: "/#offerings", isBack: true },
  { label: "Personal Programs FAQs", to: "/offerings/personal/faq" }
]

export const NAV_PERSONAL_PROGRAM: NavItem[] = [
  { label: "Back to Personal Offerings", to: "/offerings/personal", isBack: true },
  { label: "Overview", href: "#overview" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "Program FAQs", to: "/offerings/personal/faq" }
]

export const NAV_FLOW_SERIES: NavItem[] = [
  { label: "Back to Personal Offerings", to: "/offerings/personal#flow-series", isBack: true },
  { label: "Flow Series FAQ", to: "/offerings/flow-series/faq" }
]

export const NAV_PERSONAL_FAQ: NavItem[] = [
  { label: "Back to Personal Offerings", to: "/offerings/personal", isBack: true }
]

export const NAV_PRIVATE_SESSION: NavItem[] = [
  { label: "Back to Private Session Offerings", to: "/offerings/personal#private-sessions", isBack: true },
  { label: "The Body", to: "/offerings/personal/the-body" },
  { label: "The Mind", to: "/offerings/personal/the-mind" },
  { label: "The Soul", to: "/offerings/personal/the-soul" },
]

export const NAV_TEAM_PROGRAM: NavItem[] = [
  { label: "Back to Team Offerings", to: "/offerings/team", isBack: true },
  { label: "Consulting", to: "/offerings/team/consulting" },
  { label: "Government", to: "/offerings/team/government" },
  { label: "Corporate", to: "/offerings/team/corporate" },
  { label: "Community", to: "/offerings/team/community" },
]

export const NAV_TEAM_HUB: NavItem[] = [
  { label: "Back to all Offerings", href: "/#offerings", isBack: true },
  { label: "Program FAQs", to: "/offerings/team/faq" }
]

export const NAV_ABOUT: NavItem[] = [
  { label: "Offerings", to: "/offerings" },
  { label: "Blog", to: "/blog" },
]

export const NAV_CONTACT: NavItem[] = [
  { label: "Offerings", to: "/offerings" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "FAQ", to: "/faq" }
]
