import React, { useState, useRef, useEffect } from "react";
import UserDropdown from "./UserDropdown";
import ThemeToggle from "../../components/ThemeToggle";

export default function TopNavbar({ userInfo, onToggleSidebar }) {
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
    <header className="h-14 sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800/50 bg-white dark:bg-slate-900/40 dark:backdrop-blur-md shadow-sm transition-colors duration-200">
      {/* Left: Hamburger (mobile) + App Switcher & Logo */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hamburger menu – visible on mobile only */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-slate-600 dark:text-slate-400"
          aria-label="Open navigation menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <button
          type="button"
          className="hidden sm:block p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group"
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
          <span className="text-2xl">⚡</span>
          <span className="hidden sm:inline">TaskMgmt</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* USER AVATAR & DROPDOWN */}
        <div className="relative ml-1 sm:ml-2" ref={menuRef}>
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
