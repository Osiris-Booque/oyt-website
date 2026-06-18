import { Route } from "react-router-dom";
import { lazy } from "react";
import LandingLayout from "../layouts/LandingLayout";
import MarketingLayout from "../layouts/MarketingLayout";
import AboutLayout from "../layouts/AboutLayout";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const BlogPage = lazy(() => import("../pages/BlogPage"));
const FAQPage = lazy(() => import("../pages/FAQPage"));
const SiteMapPage = lazy(() => import("../pages/SiteMapPage"));

export const marketingRoutes = (
  <>
    <Route path="/" element={<LandingLayout />}>
      <Route index element={<LandingPage />} />
    </Route>
    <Route path="/" element={<MarketingLayout />}>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="blog" element={<BlogPage />} />
      <Route path="faq" element={<FAQPage />} />
    </Route>
    <Route path="sitemap" element={<SiteMapPage />} />
    <Route path="/about" element={<AboutLayout />}>
      <Route index element={<AboutPage />} />
    </Route>
  </>
);
