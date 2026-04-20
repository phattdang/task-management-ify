import React from "react";
import { useNavigate } from "react-router-dom";

export default function LeftSidebar({ projects, currentProjectId }) {
  const navigate = useNavigate();

  return (
    <aside 
      className="w-[260px] m-4 rounded-xl h-[calc(100vh-88px)] overflow-y-auto flex flex-col py-6 px-4 hidden lg:flex sticky top-20"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Navigation Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 text-slate-300 font-semibold mb-3 cursor-pointer hover:text-cyan-400 p-2 rounded-lg hover:bg-slate-800/40 transition-all group">
          <span className="text-lg group-hover:scale-110 transition-transform">🌍</span> For you
        </div>
        <div className="flex items-center gap-3 text-slate-300 font-semibold mb-4 cursor-pointer hover:text-cyan-400 p-2 rounded-lg hover:bg-slate-800/40 transition-all group">
          <span className="text-lg group-hover:scale-110 transition-transform">📂</span> Spaces
          <span className="ml-auto text-xs text-slate-500 hover:text-cyan-400 hover:bg-slate-700/50 p-1 rounded-lg transition-all">
            +
          </span>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="flex-1">
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-label">
            Recent Projects
          </h3>
          <button
            onClick={() => navigate("/create-project")}
            className="text-slate-500 hover:text-cyan-400 hover:bg-slate-700/50 p-1.5 rounded-lg transition-all"
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
          <div className="px-2 text-sm text-slate-500 italic mb-4">
            No projects yet
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => navigate(`/projects/${proj.id}`)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-2 transition-all group ${
                currentProjectId === proj.id
                  ? "bg-slate-800/60 border border-cyan-500/50 text-cyan-400"
                  : "hover:bg-slate-800/40 text-slate-300 hover:text-slate-100"
              }`}
            >
              <div className="w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-md flex items-center justify-center text-[10px] shadow-md text-white group-hover:scale-110 transition-transform">
                📦
              </div>
              <span className="text-sm font-medium truncate">{proj.name}</span>
            </div>
          ))
        )}

        <div
          onClick={() => navigate("/create-project")}
          className="flex items-center gap-3 p-2 rounded-lg cursor-pointer mt-4 hover:bg-slate-800/40 text-slate-500 hover:text-cyan-400 transition-all group"
        >
          <div className="w-5 h-5 border-2 border-dashed border-slate-600 rounded-md flex items-center justify-center text-xs group-hover:border-cyan-500/50 transition-colors">
            +
          </div>
          <span className="text-sm font-medium">New project</span>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-auto pt-6 border-t border-slate-700/30">
        <h3 className="text-label px-2 mb-3">
          Quick Links
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-all text-sm">
            ⭐ Favorites
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-all text-sm">
            📋 Templates
          </div>
        </div>
      </div>
    </aside>
  );
}
