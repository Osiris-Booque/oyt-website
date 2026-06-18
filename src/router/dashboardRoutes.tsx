import { Route } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoute from "../components/ui/ProtectedRoute";
import DashboardLayout from "../components/dashboard/DashboardLayout";

const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHome"));
const CalendarPage = lazy(() => import("../pages/dashboard/CalendarPage"));
const BookingPage = lazy(() => import("../pages/dashboard/BookingPage"));
const ProfilePage = lazy(() => import("../pages/dashboard/ProfilePage"));
const CourseCatalog = lazy(() => import("../pages/dashboard/CourseCatalog"));
const CourseDetail = lazy(() => import("../pages/dashboard/CourseDetail"));
const CommunityPage = lazy(() => import("../pages/dashboard/CommunityPage"));
const MessagesPage = lazy(() => import("../pages/dashboard/MessagesPage"));
const CompletedPrograms = lazy(() => import("../pages/dashboard/CompletedPrograms"));
const AppFAQPage = lazy(() => import("../pages/dashboard/AppFAQPage"));

export const dashboardRoutes = (
  <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
    <Route path="/dashboard" element={<DashboardHome />} />
    <Route path="/dashboard/calendar" element={<CalendarPage />} />
    <Route path="/dashboard/booking" element={<BookingPage />} />
    <Route path="/dashboard/profile" element={<ProfilePage />} />
    <Route path="/dashboard/programs" element={<CourseCatalog />} />
    <Route path="/dashboard/programs/:slug" element={<CourseDetail />} />
    <Route path="/dashboard/community" element={<CommunityPage />} />
    <Route path="/dashboard/messages" element={<MessagesPage />} />
    <Route path="/dashboard/completed-programs" element={<CompletedPrograms />} />
    <Route path="/dashboard/faq" element={<AppFAQPage />} />
  </Route>
);