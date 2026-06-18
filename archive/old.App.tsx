import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import ScrollManager from './components/ScrollManager';
import ProtectedRoute from './components/ui/ProtectedRoute';
import AdminRoute from './components/admin/AdminRoute';
import InstructorRoute from './components/instructor/InstructorRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminLayout from './components/admin/AdminLayout';
import InstructorLayout from './components/instructor/InstructorLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import MarketingLayout from "./layouts/MarketingLayout";
import OfferingsLayout from "./layouts/OfferingsLayout";

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const OfferingsPage = lazy(() => import('./pages/offerings/OfferingsPage'));
const PersonalOfferingsPage = lazy(() => import('./pages/offerings/PersonalOfferingsPage'));
const TeamOfferingsPage = lazy(() => import('./pages/offerings/TeamOfferingsPage'));
const FlowSeriesPage = lazy(() => import('./pages/offerings/FlowSeriesPage'));
const CheckoutPage = lazy(() => import('./pages/checkout/CheckoutPage'));
const SpringCohortCheckout = lazy(() => import('./pages/checkout/SpringCohortCheckout'));
const SpringCohortRegister = lazy(() => import('./pages/checkout/SpringCohortRegister'));
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'));
const CalendarPage = lazy(() => import('./pages/dashboard/CalendarPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));
const CourseCatalog = lazy(() => import('./pages/dashboard/CourseCatalog'));
const CourseDetail = lazy(() => import('./pages/dashboard/CourseDetail'));
const CommunityPage = lazy(() => import('./pages/dashboard/CommunityPage'));
const MessagesPage = lazy(() => import('./pages/dashboard/MessagesPage'));
const CompletedPrograms = lazy(() => import('./pages/dashboard/CompletedPrograms'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminPrograms = lazy(() => import('./pages/admin/AdminPrograms'));
const AdminProgramEditor = lazy(() => import('./pages/admin/AdminProgramEditor'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminActivity = lazy(() => import('./pages/admin/AdminActivity'));
const InstructorHome = lazy(() => import('./pages/instructor/InstructorHome'));
const InstructorProgram = lazy(() => import('./pages/instructor/InstructorProgram'));
const InstructorAvailability = lazy(() => import('./pages/instructor/InstructorAvailability'));
const InstructorCalendar = lazy(() => import('./pages/instructor/InstructorCalendar'));
const BookingPage = lazy(() => import('./pages/dashboard/BookingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
          <ScrollManager />
          <Routes>
            <Route element={<MarketingLayout />}>
            <Route path="/" element={<LandingPage />} />
            </Route>
            <Route element={<OfferingsLayout />}>
            <Route path="/offerings" element={<OfferingsPage />} />
            <Route path="/offerings/personal" element={<PersonalOfferingsPage />} />
            <Route path="/offerings/team" element={<TeamOfferingsPage />} />
            <Route path="/offerings/flow-series" element={<FlowSeriesPage />} />
            <Route path="/checkout/:programSlug" element={<CheckoutPage />} />
            <Route path="/checkout/spring-cohort" element={<SpringCohortRegister />} />
            <Route path="/checkout/spring-cohort/register" element={<SpringCohortRegister />} />
            <Route path="/checkout/spring-cohort/pay" element={<SpringCohortCheckout />} />
            </Route>
            <Route path="/checkout/spring-cohort" element={<SpringCohortRegister />} />
            <Route path="/checkout/spring-cohort/register" element={<SpringCohortRegister />} />
            <Route path="/checkout/spring-cohort/pay" element={<SpringCohortCheckout />} />

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
            </Route>

            <Route element={<InstructorRoute><InstructorLayout /></InstructorRoute>}>
              <Route path="/instructor" element={<InstructorHome />} />
              <Route path="/instructor/availability" element={<InstructorAvailability />} />
              <Route path="/instructor/calendar" element={<InstructorCalendar />} />
              <Route path="/instructor/programs/:id" element={<InstructorProgram />} />
              <Route path="/instructor/messages" element={<MessagesPage />} />
              <Route path="/instructor/community" element={<CommunityPage />} />
            </Route>

            <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/programs" element={<AdminPrograms />} />
              <Route path="/admin/programs/:id" element={<AdminProgramEditor />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/activity" element={<AdminActivity />} />
              <Route path="/admin/messages" element={<MessagesPage />} />
              <Route path="/admin/community" element={<CommunityPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;