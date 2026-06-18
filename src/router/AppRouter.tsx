import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import ScrollManager from "../components/ScrollManager";
import LoadingSpinner from "../components/ui/LoadingSpinner";

import { marketingRoutes } from "./marketingRoutes";
import { offeringsRoutes } from "./offeringsRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { instructorRoutes } from "./instructorRoutes";
import { adminRoutes } from "./adminRoutes";

import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
        <ScrollManager />
        
        <Routes>
          {marketingRoutes}
          {offeringsRoutes}
          {dashboardRoutes}
          {instructorRoutes}
          {adminRoutes}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

      </Suspense>
    </BrowserRouter>
  );
}