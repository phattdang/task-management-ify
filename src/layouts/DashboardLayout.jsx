import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import projectApi from "../features/projects/apis/projectApi";

// --- Sub-component: TopNavbar (Giao diện chuẩn chỉ) ---
const TopNavbar = () => (
  <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
    {/* Left: App Switcher & Logo */}
    <div className="flex items-center gap-3">
      <button className="p-2 hover:bg-gray-100 rounded">
        <span className="grid grid-cols-3 gap-0.5 w-4 h-4">
          {[...Array(9)].map((_, i) => (
            <span key={i} className="bg-gray-600 w-1 h-1 rounded-full"></span>
          ))}
        </span>
      </button>
      <div className="flex items-center gap-2 text-blue-900 font-bold text-lg tracking-tight cursor-pointer">
        <span className="text-2xl">⚡</span> Jira Clone
      </div>
    </div>

    {/* Middle: Search Bar */}
    <div className="flex-1 max-w-2xl mx-4 hidden md:block">
      <div className="relative">
        <span className="absolute left-2 top-2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-8 pr-4 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 transition-colors focus:bg-white"
        />
      </div>
    </div>

    {/* Right: Actions */}
    <div className="flex items-center gap-3">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded text-sm transition-colors shadow-sm">
        + Create
      </button>

      <button className="hidden lg:flex items-center gap-1 border border-purple-300 bg-purple-50 text-purple-700 px-3 py-1.5 rounded text-sm font-semibold hover:bg-purple-100 transition-colors">
        💎 Premium trial
      </button>

      <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>

      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
        🔔
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
        ❓
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
        ⚙️
      </button>
      <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs border-2 border-white cursor-pointer shadow-sm hover:opacity-90">
        AD
      </div>
    </div>
  </header>
);

// --- Sub-component: Left Sidebar (Giao diện chuẩn chỉ + Logic Project) ---
const LeftSidebar = ({ projects, currentProjectId }) => {
  const navigate = useNavigate();

  return (
    <aside className="w-[260px] bg-white border-r border-gray-200 h-[calc(100vh-56px)] overflow-y-auto flex flex-col py-6 px-4 hidden lg:flex sticky top-14">
      {/* Section: For you */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-gray-600 font-semibold mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
          <span>🌍</span> For you
        </div>
        <div className="flex items-center gap-2 text-gray-600 font-semibold mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
          <span>📂</span> Spaces
          <span className="ml-auto text-xs text-gray-400 hover:text-gray-600">
            +
          </span>
        </div>
      </div>

      {/* Section: Recent Projects (LOGIC Ở ĐÂY) */}
      <div className="mb-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">
          Recent Projects
        </h3>

        {projects.length === 0 ? (
          <div className="px-2 text-sm text-gray-400 italic">
            No projects found.
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => navigate(`/projects/${proj.id}`)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer mt-1 transition-colors group ${
                currentProjectId === proj.id
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="w-5 h-5 bg-yellow-400 rounded-sm flex items-center justify-center text-[10px] shadow-sm text-black group-hover:scale-105 transition-transform">
                📦
              </div>
              <span className="text-sm font-medium truncate">{proj.name}</span>
            </div>
          ))
        )}
      </div>

      <div className="mt-2 pl-2 text-sm font-medium text-gray-500 hover:text-blue-600 cursor-pointer flex items-center gap-2 transition-colors">
        <span>Show more projects</span> ›
      </div>

      <div className="mt-8 border-t border-gray-200 pt-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">
          Recommended
        </h3>
        <div className="flex items-center gap-3 p-2 hover:bg-gray-100 text-gray-700 rounded cursor-pointer transition-colors">
          <span className="text-lg">💡</span>
          <div className="flex-1">
            <p className="text-sm font-medium">Prioritize ideas</p>
          </div>
          <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-1 rounded">
            TRY
          </span>
        </div>
        <div className="flex items-center gap-3 p-2 hover:bg-gray-100 text-gray-700 rounded cursor-pointer transition-colors">
          <span>📂</span>{" "}
          <span className="text-sm font-medium">Browse templates</span>
        </div>
      </div>
    </aside>
  );
};

// === MAIN LAYOUT COMPONENT ===
export default function DashboardLayout({ children }) {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectApi.getAll();
        const projectList = res.data.body || [];
        setProjects(projectList);

        // Logic Auto Redirect
        if (location.pathname === "/projects" && projectList.length > 0) {
          const firstProjectId = projectList[0].id;
          navigate(`/projects/${firstProjectId}`, { replace: true });
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <TopNavbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar projects={projects} currentProjectId={projectId} />
        <main className="flex-1 bg-white min-w-0 overflow-y-auto h-[calc(100vh-56px)]">
          {children}
        </main>
      </div>

      {/* Nút Quickstart tím tím ở góc dưới màn hình */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg font-bold flex items-center gap-2 transition-transform hover:scale-105">
          💡 Quickstart{" "}
          <span className="bg-purple-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
