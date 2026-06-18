import { Route } from "react-router-dom";
import { lazy } from "react";
import InstructorRoute from "../components/instructor/InstructorRoute";
import InstructorLayout from "../components/instructor/InstructorLayout";

const InstructorHome = lazy(() => import("../pages/instructor/InstructorHome"));
const InstructorAvailability = lazy(() => import("../pages/instructor/InstructorAvailability"));
const InstructorCalendar = lazy(() => import("../pages/instructor/InstructorCalendar"));
const InstructorProgram = lazy(() => import("../pages/instructor/InstructorProgram"));
const MessagesPage = lazy(() => import("../pages/dashboard/MessagesPage"));
const CommunityPage = lazy(() => import("../pages/dashboard/CommunityPage"));

export const instructorRoutes = (
  <Route element={<InstructorRoute><InstructorLayout /></InstructorRoute>}>
    <Route path="/instructor" element={<InstructorHome />} />
    <Route path="/instructor/availability" element={<InstructorAvailability />} />
    <Route path="/instructor/calendar" element={<InstructorCalendar />} />
    <Route path="/instructor/programs/:id" element={<InstructorProgram />} />
    <Route path="/instructor/messages" element={<MessagesPage />} />
    <Route path="/instructor/community" element={<CommunityPage />} />
  </Route>
);