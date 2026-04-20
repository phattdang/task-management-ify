// components/BoardToolbar.jsx
import React from "react";

export default function BoardToolbar({ members = [] }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between bg-white/90 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700/40 backdrop-blur-md transition-colors duration-200">
      {/* Left: Search, Avatars, Filter */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/50 text-sm w-48 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-cyan-400 transition-colors">
            🔍
          </span>
        </div>

        <div className="flex -space-x-2 cursor-pointer hover:space-x-0 transition-all">
          {members.slice(0, 5).map((m, idx) => (
            <div
              key={idx}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm hover:scale-110 transition-transform"
              title={m.fullName}
            >
              {m.fullName?.charAt(0) || "U"}
            </div>
          ))}
          {members.length > 5 && (
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700/50 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
              +{members.length - 5}
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all"
        >
          📂 Filter
        </button>
      </div>

      {/* Right: Group, View Mode, Menu */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all"
        >
          Group ⌄
        </button>

        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-0.5 flex border border-slate-200 dark:border-slate-700/40">
          <button
            type="button"
            className="p-1.5 bg-white dark:bg-slate-700/60 rounded-md text-blue-600 dark:text-cyan-400 shadow-sm border border-slate-200/80 dark:border-transparent"
          >
            📈
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-white/80 dark:hover:bg-slate-700/60 rounded-md text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            📋
          </button>
        </div>

        <button
          type="button"
          className="p-1.5 rounded-lg text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all"
        >
          •••
        </button>
      </div>
    </div>
  );
}
