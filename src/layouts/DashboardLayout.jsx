import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import projectApi from "../features/projects/apis/projectApi";

// Import các components con
import TopNavbar from "./components/TopNavbar";
import LeftSidebar from "./components/LeftSidebar";
import authApi from "../features/auth/api/authApi";

export default function DashboardLayout({ children }) {
  const [projects, setProjects] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();
  const hasFetched = useRef(false);
  const initialPathRef = useRef(location.pathname);

  // Fetch data once on mount, not on every pathname change
  const fetchData = useCallback(async () => {
    try {
      const [projectRes, userRes] = await Promise.all([
        projectApi.getAll(),
        authApi.getInformation(),
      ]);

      const projectList = projectRes.data.body || [];
      setProjects(projectList);

      if (userRes.data && userRes.data.body) {
        setUserInfo(userRes.data.body);
      }

      // Auto-redirect only on initial load when at bare /projects
      if (initialPathRef.current === "/projects" && projectList.length > 0) {
        const firstProjectId = projectList[0].id;
        navigate(`/projects/${firstProjectId}`, { replace: true });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }, [navigate]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      {/* 1. Navbar */}
      <TopNavbar
        userInfo={userInfo}
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-200">
        {/* 2. Sidebar */}
        <LeftSidebar
          projects={projects}
          currentProjectId={projectId}
          isMobileOpen={isSidebarOpen}
          onMobileClose={() => setIsSidebarOpen(false)}
        />

        {/* 3. Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-56px)] bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          {children}
        </main>
      </div>

      {/* 4. Quickstart Button - Glassmorphic */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          className="rounded-full px-4 py-2 font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg text-slate-900 dark:text-slate-100 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-800/50 hover:dark:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        >
          <span>✨</span> Quickstart
          <span className="bg-slate-200/80 dark:bg-slate-800/80 rounded-full w-5 h-5 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-300/90 dark:hover:bg-slate-700 transition-all">
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
