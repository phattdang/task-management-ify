import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import projectApi from "../features/projects/apis/projectApi"; // Sửa lại path nếu cần

// Import các components con
import TopNavbar from "./components/TopNavbar";
import LeftSidebar from "./components/LeftSidebar";
import authApi from "../features/auth/api/authApi";

export default function DashboardLayout({ children }) {
  const [projects, setProjects] = useState([]);
  const [userInfo, setUserInfo] = useState(null); // State lưu thông tin user
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();

  // 1. Fetch thông tin User & Projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi song song 2 API để tiết kiệm thời gian
        const [projectRes, userRes] = await Promise.all([
          projectApi.getAll(),
          authApi.getInformation(), // API lấy info user
        ]);

        // Xử lý Projects
        const projectList = projectRes.data.body || [];
        setProjects(projectList);

        // Xử lý User Info
        if (userRes.data && userRes.data.body) {
          setUserInfo(userRes.data.body); // Lưu { id, fullName, email } vào state
        }

        // Logic Auto Redirect
        if (location.pathname === "/projects" && projectList.length > 0) {
          const firstProjectId = projectList[0].id;
          navigate(`/projects/${firstProjectId}`, { replace: true });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Nếu lỗi 401 (hết hạn token), có thể đá về login ở đây
      }
    };
    fetchData();
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* 1. Navbar */}
      <TopNavbar userInfo={userInfo} />

      <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* 2. Sidebar */}
        <LeftSidebar projects={projects} currentProjectId={projectId} />

        {/* 3. Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-56px)] bg-slate-950">
          {children}
        </main>
      </div>

      {/* 4. Quickstart Button - Glassmorphic */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
          }}
          className="rounded-full px-4 py-2 font-bold flex items-center gap-2 transition-all duration-200 hover:bg-slate-800/50 hover:border-cyan-500/50 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
        >
          <span>✨</span> Quickstart
          <span className="bg-slate-700/60 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-slate-600/80 transition-all">
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
