// components/DeleteProjectModal.jsx
import React, { useState } from "react";

export default function DeleteProjectModal({
  projectInfo,
  onClose,
  onConfirm,
}) {
  const [confirmName, setConfirmName] = useState("");

  const targetName = projectInfo?.name || "phattdang/task-management-api";
  const isMatch = confirmName === targetName;

  return (
    <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">
            Delete {targetName}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 text-gray-400">
            <span className="text-4xl">📄</span>
            <span className="absolute mt-6 -ml-2 text-xs">🔒</span>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-1">{targetName}</h2>
          <div className="flex gap-4 text-xs text-gray-500 mb-6">
            <span>⭐ 0 stars</span>
            <span>👁️ 0 watchers</span>
          </div>

          <div className="w-full text-left">
            <p className="text-sm text-gray-700 mb-2">
              To confirm, type <span className="font-bold">"{targetName}"</span>{" "}
              in the box below
            </p>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-red-100 outline-none mb-4"
              placeholder="Enter project name"
            />{" "}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex flex-col gap-2">
          <button
            disabled={!isMatch}
            onClick={() => onConfirm(confirmName)}
            className={`w-full py-2 rounded font-medium text-sm transition-colors ${
              isMatch
                ? "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Delete this repository
          </button>
        </div>
      </div>
    </div>
  );
}
