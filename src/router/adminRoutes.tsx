import { Route } from "react-router-dom";
import { lazy } from "react";
import AdminRoute from "../components/admin/AdminRoute";
import AdminLayout from "../components/admin/AdminLayout";

const AdminOverview = lazy(() => import("../pages/admin/AdminOverview"));
const AdminPrograms = lazy(() => import("../pages/admin/AdminPrograms"));
const AdminProgramEditor = lazy(() => import("../pages/admin/AdminProgramEditor"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminActivity = lazy(() => import("../pages/admin/AdminActivity"));
const MessagesPage = lazy(() => import("../pages/dashboard/MessagesPage"));
const CommunityPage = lazy(() => import("../pages/dashboard/CommunityPage"));

export const adminRoutes = (
  <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
    <Route path="/admin" element={<AdminOverview />} />
    <Route path="/admin/programs" element={<AdminPrograms />} />
    <Route path="/admin/programs/:id" element={<AdminProgramEditor />} />
    <Route path="/admin/users" element={<AdminUsers />} />
    <Route path="/admin/activity" element={<AdminActivity />} />
    <Route path="/admin/messages" element={<MessagesPage />} />
    <Route path="/admin/community" element={<CommunityPage />} />
  </Route>
);