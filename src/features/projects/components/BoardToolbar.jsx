// components/BoardToolbar.jsx
import React from "react";

export default function BoardToolbar({ members = [] }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between bg-slate-900/50 border-b border-slate-700/30">
      {/* Left: Search, Avatars, Filter */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30 text-sm w-48 text-slate-100 placeholder-slate-600 transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors">
            🔍
          </span>
        </div>

        <div className="flex -space-x-2 cursor-pointer hover:space-x-0 transition-all">
          {members.slice(0, 5).map((m, idx) => (
            <div
              key={idx}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm hover:scale-110 transition-transform"
              title={m.fullName}
            >
              {m.fullName?.charAt(0) || "U"}
            </div>
          ))}
          {members.length > 5 && (
            <div className="w-8 h-8 rounded-lg bg-slate-700/50 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-400">
              +{members.length - 5}
            </div>
          )}
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-700/50 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-300 hover:border-slate-600 hover:bg-slate-800/40 transition-all">
          📂 Filter
        </button>
      </div>

      {/* Right: Group, View Mode, Menu */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-300 hover:bg-slate-800/40 transition-all">
          Group ⌄
        </button>

        <div className="bg-slate-800/50 rounded-lg p-0.5 flex border border-slate-700/30">
          <button className="p-1.5 bg-slate-700/60 rounded-md text-cyan-400 shadow-sm">
            📈
          </button>
          <button className="p-1.5 hover:bg-slate-700/60 rounded-md text-slate-500 hover:text-slate-300 transition-colors">
            📋
          </button>
        </div>

        <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-all">
          •••
        </button>
      </div>
    </div>
  );
}
