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
    <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp border"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(71, 85, 105, 0.3)',
          boxShadow: '0 25px 50px rgba(6, 182, 212, 0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/30">
          <h3 className="text-sm font-bold text-slate-100">
            Delete {targetName}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-2xl transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 text-slate-400">
            <span className="text-5xl">📦</span>
          </div>

          <h2 className="text-lg font-bold text-slate-100 mb-2">{targetName}</h2>
          <div className="flex gap-4 text-xs text-slate-500 mb-6">
            <span>📊 Tasks: {Math.floor(Math.random() * 100)}</span>
            <span>👥 Members: 0</span>
          </div>

          <div className="w-full text-left">
            <p className="text-sm text-slate-300 mb-3">
              This action cannot be undone. To confirm, type <span className="font-bold text-cyan-400">"{targetName}"</span> in the box below
            </p>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/30 transition-all mb-4"
              placeholder="Type project name to confirm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-700/30 flex flex-col gap-2">
          <button
            disabled={!isMatch}
            onClick={() => onConfirm(confirmName)}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
              isMatch
                ? "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/30"
                : "bg-slate-800/50 text-slate-600 cursor-not-allowed opacity-50"
            }`}
          >
            {isMatch ? "Delete project permanently" : "Enter project name to delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
