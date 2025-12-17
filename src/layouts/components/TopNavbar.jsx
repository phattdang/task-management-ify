import React, { useState, useRef, useEffect } from "react";
import UserDropdown from "./UserDropdown"; // Import component con

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

        {/* Icons */}
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
          🔔
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
          ❓
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
          ⚙️
        </button>

        {/* --- USER AVATAR & DROPDOWN --- */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs border-2 border-white cursor-pointer shadow-sm hover:opacity-90 select-none"
          >
            {/* Hiển thị Initials từ userInfo hoặc fallback là "DP" */}
            {userInfo ? getInitials(userInfo.fullName) : "..."}
          </div>

          {/* Truyền userInfo xuống Dropdown để hiển thị chi tiết */}
          <UserDropdown isOpen={isMenuOpen} userInfo={userInfo} />
        </div>
      </div>
    </header>
  );
}
