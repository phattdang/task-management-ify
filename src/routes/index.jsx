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

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/setup-account" element={<SetupAccountPage />} />

      {/* Protected Routes */}
      <Route path="/create-site" element={<CreateSitePage />} />
      <Route path="/create-project" element={<CreateProjectPage />} />

      {/* CORE ROUTES: Logic mới */}
      {/* 1. Vào /projects -> Layout tự chuyển hướng vào project đầu tiên */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <TaskListPage />
          </ProtectedRoute>
        }
      />
      {/* 2. Vào /projects/:id -> Load tasks của project đó */}
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <TaskListPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
