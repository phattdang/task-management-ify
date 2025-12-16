import { Routes, Route } from "react-router-dom";
import LandingPage from "../features/auth/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import CreateSitePage from "../features/auth/pages/CreateSitePage";
import CreateProjectPage from "../features/projects/pages/CreateProjectPage"; // Import mới
import TaskListPage from "../features/tasks/pages/TaskListPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import SetupAccountPage from "../features/auth/pages/SetupAccountPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/setup-account" element={<SetupAccountPage />} />
      <Route path="/create-site" element={<CreateSitePage />} />
      <Route path="/create-project" element={<CreateProjectPage />} />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TaskListPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
