import React from "react";

// --- Sub-component: TopNavbar ---
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
      <div className="flex items-center gap-2 text-blue-900 font-bold text-lg tracking-tight">
        <span className="text-2xl">⚡</span> Jira
      </div>
    </div>

    {/* Middle: Search Bar */}
    <div className="flex-1 max-w-2xl mx-4">
      <div className="relative">
        <span className="absolute left-2 top-2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-8 pr-4 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50"
        />
      </div>
    </div>

    {/* Right: Actions */}
    <div className="flex items-center gap-3">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded text-sm transition-colors">
        + Create
      </button>
      {/* Nút Premium Trial giống ảnh */}
      <button className="hidden lg:flex items-center gap-1 border border-purple-300 bg-purple-50 text-purple-700 px-3 py-1.5 rounded text-sm font-semibold hover:bg-purple-100">
        💎 Premium trial
      </button>

      <div className="h-6 w-px bg-gray-300 mx-1"></div>

      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
        🔔
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
        ❓
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
        ⚙️
      </button>
      <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs border-2 border-white cursor-pointer">
        AD
      </div>
    </div>
  </header>
);

// --- Sub-component: Left Sidebar (Global Nav) ---
const LeftSidebar = () => (
  <aside className="w-[260px] bg-white border-r border-gray-200 h-[calc(100vh-56px)] overflow-y-auto flex flex-col py-6 px-4 hidden lg:flex sticky top-14">
    {/* Section: For you */}
    <div className="mb-6">
      <div className="flex items-center gap-2 text-gray-600 font-semibold mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
        <span>🌍</span> For you
      </div>
      <div className="flex items-center gap-2 text-gray-600 font-semibold mb-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
        <span>📂</span> Spaces
        <span className="ml-auto text-xs text-gray-400">+</span>
      </div>
    </div>

    {/* Section: Recent */}
    <div className="mb-2">
      <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">
        Recent
      </h3>

      {/* Active Project Item */}
      <div className="flex items-center gap-3 p-2 bg-blue-50 text-blue-700 rounded cursor-pointer">
        <div className="w-5 h-5 bg-yellow-400 rounded-sm flex items-center justify-center text-[10px] shadow-sm">
          📦
        </div>
        <span className="text-sm font-medium">My Software Team</span>
      </div>

      {/* Other Items */}
      <div className="flex items-center gap-3 p-2 hover:bg-gray-100 text-gray-700 rounded cursor-pointer mt-1">
        <div className="w-5 h-5 bg-red-500 rounded-sm flex items-center justify-center text-[10px] text-white">
          🔥
        </div>
        <span className="text-sm font-medium">Support</span>
      </div>
    </div>

    <div className="mt-2 pl-2 text-sm font-medium text-gray-500 hover:text-blue-600 cursor-pointer flex items-center gap-2">
      <span>Show more spaces</span> ›
    </div>

    <div className="mt-8 border-t border-gray-200 pt-4">
      <h3 className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">
        Recommended
      </h3>
      <div className="flex items-center gap-3 p-2 hover:bg-gray-100 text-gray-700 rounded cursor-pointer">
        <span className="text-lg">💡</span>
        <div className="flex-1">
          <p className="text-sm font-medium">Prioritize ideas</p>
        </div>
        <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-1 rounded">
          TRY
        </span>
      </div>
      <div className="flex items-center gap-3 p-2 hover:bg-gray-100 text-gray-700 rounded cursor-pointer">
        <span>📂</span>{" "}
        <span className="text-sm font-medium">Browse templates</span>
      </div>
    </div>
  </aside>
);

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopNavbar />
      <div className="flex flex-1">
        <LeftSidebar />
        <main className="flex-1 bg-white min-w-0">{children}</main>
      </div>

      {/* Nút Quickstart tím tím ở góc dưới màn hình */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg font-bold flex items-center gap-2">
          💡 Quickstart{" "}
          <span className="bg-purple-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
