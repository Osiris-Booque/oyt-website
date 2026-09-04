import {
  NAV_LANDING,
  NAV_MARKETING,
  NAV_OFFERINGS_HUB,
  NAV_PERSONAL_HUB,
  NAV_PERSONAL_PROGRAM,
  NAV_PERSONAL_FAQ,
  NAV_PRIVATE_SESSION,
  NAV_TEAM_HUB,
  NAV_TEAM_PROGRAM,
  NAV_ABOUT,
  NAV_CONTACT,
  NAV_FLOW_SERIES
} from "./nav"

export const HEADER_CONFIG = {

  landing: {
    style: "frosted",
    navItems: NAV_LANDING,
    cta: "default",
    hideCurrentPage: false
  },

  marketing: {
    style: "frosted",
    navItems: NAV_MARKETING,
    cta: "dynamic",
    hideCurrentPage: true
  },

  offeringsHub: {
    style: "frosted",
    navItems: NAV_OFFERINGS_HUB,
    cta: "contactUs",
    hideCurrentPage: true
  },

  personalHub: {
    style: "frosted",
    navItems: NAV_PERSONAL_HUB,
    cta: "contactUs",
    hideCurrentPage: true
  },

  personalFAQ: {
    style: "frosted",
    navItems: NAV_PERSONAL_FAQ,
    cta: "contactUs",
    hideCurrentPage: true
  },

  privateSession: {
    style: "frosted",
    navItems: NAV_PRIVATE_SESSION,
    cta: "none",
    hideCurrentPage: false
  },

  personalProgram: {
    style: "frosted",
    navItems: NAV_PERSONAL_PROGRAM,
    cta: "enrollToday",
    hideCurrentPage: true
  },

  teamProgram: {
    style: "frosted",
    navItems: NAV_TEAM_PROGRAM,
    cta: "none",
    hideCurrentPage: false
  },

  teamHub: {
    style: "frosted",
    navItems: NAV_TEAM_HUB,
    cta: "bookConsultation",
    hideCurrentPage: true
  },

  about: {
    style: "frosted",
    navItems: NAV_ABOUT,
    cta: "default",
    hideCurrentPage: false
  },

  contact: {
    style: "frosted",
    navItems: NAV_CONTACT,
    cta: "none",
    hideCurrentPage: true
  },

  flowSeries: {
    style: "frosted",
    navItems: NAV_FLOW_SERIES,
    cta: "enrollToday",
    hideCurrentPage: false
  }

}
