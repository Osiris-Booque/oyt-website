import { Route } from "react-router-dom";
import { lazy } from "react";
import OfferingsLayout from "../layouts/OfferingsLayout";

const OfferingsPage = lazy(() => import("../pages/offerings/OfferingsPage"));
const PersonalOfferingsPage = lazy(() => import("../pages/offerings/PersonalOfferingsPage"));
const TeamOfferingsPage = lazy(() => import("../pages/offerings/TeamOfferingsPage"));
const FlowSeriesPage = lazy(() => import("../pages/offerings/FlowSeriesPage"));
const TheBodyPage = lazy(() => import("../pages/offerings/TheBodyPage"));
const TheMindPage = lazy(() => import("../pages/offerings/TheMindPage"));
const TheSoulPage = lazy(() => import("../pages/offerings/TheSoulPage"));
const PersonalOfferingsFAQPage = lazy(() => import("../pages/offerings/PersonalOfferingsFAQPage"));
const ConsultingPage = lazy(() => import("../pages/offerings/team/ConsultingPage"));
const GovernmentPage = lazy(() => import("../pages/offerings/team/GovernmentPage"));
const CorporatePage = lazy(() => import("../pages/offerings/team/CorporatePage"));
const CommunityPage = lazy(() => import("../pages/offerings/team/CommunityPage"));
const TeamOfferingsFAQPage = lazy(() => import("../pages/offerings/TeamOfferingsFAQPage"));
const FlowSeriesFAQPage = lazy(() => import("../pages/offerings/FlowSeriesFAQPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const CheckoutPage = lazy(() => import("../pages/checkout/CheckoutPage"));
const SpringCohortCheckout = lazy(() => import("../pages/checkout/SpringCohortCheckout"));
const SpringCohortRegister = lazy(() => import("../pages/checkout/SpringCohortRegister"));

export const offeringsRoutes = (
  <Route element={<OfferingsLayout />}>
    <Route path="/offerings" element={<OfferingsPage />} />
    <Route path="/offerings/personal" element={<PersonalOfferingsPage />} />
    <Route path="/offerings/team" element={<TeamOfferingsPage />} />
    <Route path="/offerings/flow-series" element={<FlowSeriesPage />} />
    {/* Private-session detail pages — src/pages/offerings/The*Page.tsx */}
    <Route path="/offerings/personal/the-body" element={<TheBodyPage />} />
    <Route path="/offerings/personal/the-mind" element={<TheMindPage />} />
    <Route path="/offerings/personal/the-soul" element={<TheSoulPage />} />
    <Route path="/offerings/personal/faq" element={<PersonalOfferingsFAQPage />} />
    <Route path="/offerings/team/faq" element={<TeamOfferingsFAQPage />} />

    {/* Team program detail pages — src/pages/offerings/team/*.tsx */}
    <Route path="/offerings/team/consulting" element={<ConsultingPage />} />
    <Route path="/offerings/team/government" element={<GovernmentPage />} />
    <Route path="/offerings/team/corporate" element={<CorporatePage />} />
    <Route path="/offerings/team/community" element={<CommunityPage />} />
    <Route path="/offerings/flow-series/faq" element={<FlowSeriesFAQPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/checkout/:programSlug" element={<CheckoutPage />} />
    <Route path="/checkout/spring-cohort/register" element={<SpringCohortRegister />} />
    <Route path="/checkout/spring-cohort/pay" element={<SpringCohortCheckout />} />
  </Route>
);
