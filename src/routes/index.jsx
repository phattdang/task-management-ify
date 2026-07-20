import { Routes, Route } from "react-router-dom";
import {
  LandingPage,
  LoginPage,
  VerifyEmailPage,
  SetupAccountPage,
  ForgotPasswordPage,
  VerifyForgotPasswordOtpPage,
  ResetPasswordPage,
} from "../features/auth";
import CreateProjectPage from "../features/projects/pages/CreateProjectPage";
import SpaceSettingsPage from "../features/projects/pages/SpaceSettingsPage";
import TaskListPage from "../features/tasks/pages/TaskListPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import InvitationConfirmPage from "./../features/project_invitations/pages/InvitationConfirmPage";
import { Navigate } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ... Public Routes cũ ... */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/setup-account" element={<SetupAccountPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/verify-forgot-password-otp"
        element={<VerifyForgotPasswordOtpPage />}
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/create-project"
        element={
          <ProtectedRoute>
            <CreateProjectPage />
          </ProtectedRoute>
        }
      />

      {/* CORE ROUTES */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <TaskListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <TaskListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/settings"
        element={
          <ProtectedRoute>
            <SpaceSettingsPage />
          </ProtectedRoute>
        }
      />

      {/* --- ROUTE MỚI CHO INVITATION --- */}
      {/* Route này không cần bọc ProtectedRoute nếu bạn muốn user chưa login cũng xem được (tùy logic), 
          nhưng thường user phải login rồi mới accept được. 
          Tạm thời mình để ngoài để bạn test giao diện cho dễ. */}
      <Route
        path="/projects/:projectId/invitations/confirm"
        element={<InvitationConfirmPage />}
      />

      {/* Catch-all 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
