import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LeftSidebar({
  projects,
  currentProjectId,
  isMobileOpen = false,
  onMobileClose,
}) {
  const navigate = useNavigate();

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onMobileClose?.();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isMobileOpen, onMobileClose]);

  const handleNavigate = (path) => {
    navigate(path);
    onMobileClose?.();
  };

  const sidebarContent = (
    <>


      {/* Recent Projects */}
      <div className="flex-1">
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recent Projects
          </h3>
          <button
            type="button"
            onClick={() => handleNavigate("/create-project")}
            className="text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 p-1.5 rounded-lg transition-all"
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
          <div className="px-2 text-sm text-slate-500 dark:text-slate-500 italic mb-4">
            No projects yet
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => handleNavigate(`/projects/${proj.id}`)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer mb-2 transition-all group ${
                currentProjectId === proj.id
                  ? "bg-blue-50 dark:bg-slate-800/60 border border-blue-200 dark:border-cyan-500/40 text-blue-700 dark:text-cyan-400 shadow-sm"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent"
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
          onClick={() => handleNavigate("/create-project")}
          className="flex items-center gap-3 p-2 rounded-lg cursor-pointer mt-4 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-all group"
        >
          <div className="w-5 h-5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md flex items-center justify-center text-xs group-hover:border-blue-600 dark:group-hover:border-cyan-500/50 transition-colors">
            +
          </div>
          <span className="text-sm font-medium">New project</span>
        </div>
      </div>


    </>
  );

  return (
    <>
      {/* Desktop sidebar – always visible on lg+ */}
      <aside className="w-[260px] m-4 rounded-xl h-[calc(100vh-88px)] overflow-y-auto flex-col py-6 px-4 hidden lg:flex sticky top-20 bg-white border border-slate-200 shadow-sm dark:bg-slate-900/40 dark:border-slate-800/50 dark:backdrop-blur-md dark:shadow-none transition-colors duration-200">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay – visible only when isMobileOpen on <lg */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <aside
            className="absolute left-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col py-6 px-4 overflow-y-auto animate-slideInLeft"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Close button */}
            <div className="flex items-center justify-end mb-4">
              <button
                type="button"
                onClick={onMobileClose}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 transition-colors"
                aria-label="Close navigation menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
