import React from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import KanbanBoard from "../components/KanbanBoard";

export default function TaskListPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* === PROJECT HEADER SECTION === */}
        <div className="px-8 pt-6 pb-0 border-b border-gray-200">
          {/* Breadcrumbs */}
          <div className="text-xs text-gray-500 mb-3">
            Spaces / <span className="text-gray-700">My Software Team</span>
          </div>

          {/* Project Title & Actions */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-lg shadow-sm">
              📦
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              My Software Team
            </h1>
            <button className="p-1 hover:bg-gray-100 rounded ml-2">👤+</button>
            <button className="p-1 hover:bg-gray-100 rounded">•••</button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1">
              🌐 Summary
            </div>
            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1">
              📝 List
            </div>

            {/* Active Tab */}
            <div className="pb-3 text-blue-600 border-b-2 border-blue-600 cursor-pointer flex items-center gap-1">
              📊 Board
            </div>

            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1">
              💻 Code
            </div>
            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1">
              📋 Forms
            </div>
            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1">
              ⏳ Timeline
            </div>
            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1">
              📄 Pages
            </div>
            <div className="pb-3 cursor-pointer hover:bg-gray-100 px-2 rounded">
              +
            </div>
          </div>
        </div>

        {/* === BOARD CONTROLS === */}
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search board"
                className="pl-8 pr-4 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm w-40 hover:bg-gray-50"
              />
              <span className="absolute left-2.5 top-1.5 text-gray-400 text-xs">
                🔍
              </span>
            </div>

            {/* Users Avatars */}
            <div className="flex -space-x-1">
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs font-bold text-gray-500">
                👤
              </div>
              <div className="w-8 h-8 rounded-full bg-red-500 border border-white flex items-center justify-center text-xs font-bold text-white">
                AD
              </div>
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
              📂 Filter
            </button>
          </div>

          {/* Right Group Buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 rounded text-sm font-medium text-gray-700">
              Group ⌄
            </button>
            <div className="bg-gray-100 rounded p-0.5 flex">
              <button className="p-1.5 bg-white rounded shadow-sm text-gray-600">
                📈
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600">
                📋
              </button>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
              •••
            </button>
          </div>
        </div>

        {/* === KANBAN BOARD === */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden bg-white px-8 pb-4">
          <KanbanBoard />
        </div>
      </div>
    </DashboardLayout>
  );
}
