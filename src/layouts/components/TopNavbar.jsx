import React, { useState, useRef, useEffect } from "react";
import UserDropdown from "./UserDropdown";
import ThemeToggle from "../../components/ThemeToggle";

export default function TopNavbar({ userInfo }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Click outside logic
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Lấy 2 chữ cái đầu của tên để làm avatar (VD: "Admin User" -> "AU")
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .match(/(\b\S)?/g)
      .join("")
      .match(/(^\S|\S$)?/g)
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-14 sticky top-0 z-50 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800/50 bg-white dark:bg-slate-900/40 dark:backdrop-blur-md shadow-sm transition-colors duration-200">
      {/* Left: App Switcher & Logo */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group"
        >
          <span className="grid grid-cols-3 gap-1 w-5 h-5">
            {[...Array(9)].map((_, i) => (
              <span
                key={i}
                className="bg-slate-400 dark:bg-slate-500 group-hover:bg-blue-600 dark:group-hover:bg-cyan-400 w-1.5 h-1.5 rounded-full transition-colors"
              ></span>
            ))}
          </span>
        </button>
        <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-bold text-lg tracking-tight cursor-pointer hover:text-blue-700 dark:hover:text-cyan-300 transition-colors">
          <span className="text-2xl">⚡</span> TaskMgmt
        </div>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 max-w-lg mx-6 hidden md:block">
        <div className="relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-cyan-400 transition-colors">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-all duration-200 shadow-md dark:shadow-[0_0_12px_rgba(6,182,212,0.25)] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50"
        >
          + Create
        </button>
        <button
          type="button"
          className="hidden lg:flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 transition-all"
        >
          ✨ Premium
        </button>
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        {/* Icons */}
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
        >
          🔔
        </button>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
        >
          ❓
        </button>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
        >
          ⚙️
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* USER AVATAR & DROPDOWN */}
        <div className="relative ml-2" ref={menuRef}>
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsMenuOpen(!isMenuOpen);
              }
            }}
            className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 text-white flex items-center justify-center font-bold text-xs border-2 border-slate-200 dark:border-slate-700/50 cursor-pointer hover:border-blue-500 dark:hover:border-cyan-500/50 hover:shadow-md dark:hover:shadow-[0_0_12px_rgba(6,182,212,0.2)] select-none transition-all"
          >
            {userInfo ? getInitials(userInfo.fullName) : "U"}
          </div>

          <UserDropdown isOpen={isMenuOpen} userInfo={userInfo} />
        </div>
      </div>
    </header>
  );
}
