import React, { useState } from "react";

export default function AddPeopleModal({
  onClose,
  projectName = "My Project",
}) {
  const [currentView, setCurrentView] = useState("list");
  const ManageAccessView = () => (
    <>
      {/* Header: Title & Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Manage access</h2>
        <button
          onClick={() => setCurrentView("add")} // Chuyển sang màn hình Add
          className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-700"
        >
          Add people
        </button>
      </div>

      {/* Main Content Box */}
      <div className="border border-gray-200 rounded-md p-4 min-h-[300px]">
        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Select all</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer">
            <span>Type</span> <span className="text-xs">▼</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-2.5 text-gray-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            placeholder="Find a collaborator..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* User List Item */}
        <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded group border border-transparent hover:border-gray-100">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">PH</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                pHsvDIU
              </span>
              <span className="text-xs text-gray-500">Awaiting response</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">Pending Invite</span>
            <button className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50">
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Footer: Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6 text-sm text-gray-600 font-medium select-none">
        <span className="cursor-pointer hover:text-gray-900 text-gray-400">
          ‹ Previous
        </span>
        <span className="cursor-pointer hover:text-gray-900">Next ›</span>
      </div>
    </>
  );

  // --- SUB-COMPONENT: MÀN HÌNH THÊM MỚI (ADD PEOPLE TO...) ---
  const AddPeopleView = () => (
    <>
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        Add people to {projectName}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search by username, full name, or email
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            placeholder="Find people"
            className="w-full pl-10 pr-4 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm shadow-sm"
            autoFocus
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={() => setCurrentView("list")} // Quay lại màn hình danh sách
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-700"
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium shadow-sm"
          onClick={() => {
            alert("Đã gửi lời mời! (Giả lập)");
            setCurrentView("list");
          }}
        >
          Add to repository
        </button>
      </div>
    </>
  );
  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center font-sans">
      <div className="bg-white w-[600px] rounded-lg shadow-lg p-6 relative animate-fade-in-down">
        {/* Render View dựa trên state */}
        {currentView === "list" ? <ManageAccessView /> : <AddPeopleView />}

        {/* Nút đóng chung (chỉ hiện ở view list hoặc cả 2 tùy bạn, ở đây mình để cả 2) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
