import { Route, Navigate } from "react-router-dom";
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

    {/* Legacy /offerings/private-sessions/* URLs → canonical /offerings/personal/* */}
    <Route path="/offerings/private-sessions/the-body" element={<Navigate to="/offerings/personal/the-body" replace />} />
    <Route path="/offerings/private-sessions/the-mind" element={<Navigate to="/offerings/personal/the-mind" replace />} />
    <Route path="/offerings/private-sessions/the-soul" element={<Navigate to="/offerings/personal/the-soul" replace />} />
    <Route path="/offerings/private-sessions/*" element={<Navigate to="/offerings/personal#private-sessions" replace />} />
    <Route path="/offerings/personal/faq" element={<PersonalOfferingsFAQPage />} />
    <Route path="/offerings/team/faq" element={<TeamOfferingsFAQPage />} />
    <Route path="/offerings/flow-series/faq" element={<FlowSeriesFAQPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/checkout/:programSlug" element={<CheckoutPage />} />
    <Route path="/checkout/spring-cohort/register" element={<SpringCohortRegister />} />
    <Route path="/checkout/spring-cohort/pay" element={<SpringCohortCheckout />} />
  </Route>
);
