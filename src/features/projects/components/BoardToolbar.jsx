// components/BoardToolbar.jsx
import React from "react";

export default function BoardToolbar({ members = [] }) {
  return (
    <div className="px-8 py-4 flex items-center justify-between bg-white">
      {/* --- Cụm bên trái: Search, Avatars, Filter --- */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search board"
            className="pl-8 pr-4 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm w-40 hover:bg-gray-50 focus:bg-white transition-colors"
          />
          <span className="absolute left-2.5 top-1.5 text-gray-400 text-xs">
            🔍
          </span>
        </div>

        <div className="flex -space-x-1 cursor-pointer hover:space-x-0 transition-all">
          {members.slice(0, 5).map((m, idx) => (
            <div
              key={idx}
              className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm"
              title={m.fullName}
            >
              {m.fullName?.charAt(0) || "U"}
            </div>
          ))}
          {members.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600">
              +{members.length - 5}
            </div>
          )}
        </div>

        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          📂 Filter
        </button>
      </div>

      {/* --- Cụm bên phải: Group, View Mode, Extra (Khúc bạn đang tìm đây) --- */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 rounded text-sm font-medium text-gray-700 transition-colors">
          Group ⌄
        </button>

        <div className="bg-gray-100 rounded p-0.5 flex">
          <button className="p-1.5 bg-white rounded shadow-sm text-gray-600">
            📈
          </button>
          <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
            📋
          </button>
        </div>

        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors">
          •••
        </button>
      </div>
    </div>
  );
}
