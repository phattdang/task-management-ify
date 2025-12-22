import { Routes, Route } from "react-router-dom";
import LandingPage from "../features/auth/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import SetupAccountPage from "../features/auth/pages/SetupAccountPage";
import CreateSitePage from "../features/auth/pages/CreateSitePage";
import CreateProjectPage from "../features/projects/pages/CreateProjectPage";
import TaskListPage from "../features/tasks/pages/TaskListPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import InvitationConfirmPage from "./../features/project_invitations/pages/InvitationConfirmPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ... Public Routes cũ ... */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/setup-account" element={<SetupAccountPage />} />

      {/* Protected Routes */}
      <Route path="/create-site" element={<CreateSitePage />} />
      <Route path="/create-project" element={<CreateProjectPage />} />

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

      {/* --- ROUTE MỚI CHO INVITATION --- */}
      {/* Route này không cần bọc ProtectedRoute nếu bạn muốn user chưa login cũng xem được (tùy logic), 
          nhưng thường user phải login rồi mới accept được. 
          Tạm thời mình để ngoài để bạn test giao diện cho dễ. */}
      <Route
        path="/projects/:projectId/invitations/confirm"
        element={<InvitationConfirmPage />}
      />
    </Routes>
  );
}
