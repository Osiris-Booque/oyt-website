// src/config/personalization.ts

import { CTA_CONFIG, CTAConfig } from "./cta";

type PersonalizationContext = {
  userRole?: string;
  referralSource?: string;
  pageType?: string;
};

/*
Resolves dynamic CTA based on context
*/
export function resolveDynamicCTA(
  context: PersonalizationContext
): CTAConfig {

  if (context.userRole === "member") {
    return CTA_CONFIG.enrollToday;
  }

  if (context.referralSource === "corporate") {
    return CTA_CONFIG.teamConsult;
  }

  if (context.pageType === "landing") {
    return CTA_CONFIG.takeTest;
  }

  return CTA_CONFIG.default;
}