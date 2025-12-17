import React from "react";
import { useNavigate } from "react-router-dom";

export default function LeftSidebar({ projects, currentProjectId }) {
  const navigate = useNavigate();

  return (
    <aside className="w-[260px] bg-white border-r border-gray-200 h-[calc(100vh-56px)] overflow-y-auto flex flex-col py-6 px-4 hidden lg:flex sticky top-14">
      {/* For you */}
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

      {/* Recent Projects */}
      <div className="mb-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase">
            Recent Projects
          </h3>
          {/* Nút Create Project nhỏ gọn */}
          <button
            onClick={() => navigate("/create-project")}
            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors"
            title="Create new project"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="px-2 text-sm text-gray-400 italic mb-2">
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

        {/* Nút Create Project to rõ hơn nếu list trống hoặc user muốn click dễ */}
        <div
          onClick={() => navigate("/create-project")}
          className="flex items-center gap-3 p-2 rounded cursor-pointer mt-1 hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <div className="w-5 h-5 border border-dashed border-gray-400 rounded-sm flex items-center justify-center text-xs">
            +
          </div>
          <span className="text-sm">Create project</span>
        </div>
      </div>

      {/* Footer links */}
      {/* ... Giữ nguyên phần dưới ... */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">
          Recommended
        </h3>
        {/* ... */}
      </div>
    </aside>
  );
}
