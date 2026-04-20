// components/DeleteProjectModal.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

export default function DeleteProjectModal({
  projectInfo,
  onClose,
  onConfirm,
}) {
  const [confirmName, setConfirmName] = useState("");

  const targetName = projectInfo?.name || "phattdang/task-management-api";
  const isMatch = confirmName === targetName;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slideUp border border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/60 dark:backdrop-blur-xl dark:shadow-[0_25px_50px_rgba(6,182,212,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Delete {targetName}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-2xl transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 text-slate-500 dark:text-slate-400">
            <span className="text-5xl">📦</span>
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            {targetName}
          </h2>
          <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-500 mb-6">
            <span>📊 Tasks: {Math.floor(Math.random() * 100)}</span>
            <span>👥 Members: 0</span>
          </div>

          <div className="w-full text-left">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
              This action cannot be undone. To confirm, type{" "}
              <span className="font-bold text-blue-600 dark:text-cyan-400">
                "{targetName}"
              </span>{" "}
              in the box below
            </p>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:border-red-500 dark:focus:border-red-500/50 focus:ring-2 focus:ring-red-500/30 transition-all mb-4"
              placeholder="Type project name to confirm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700/40 flex flex-col gap-2">
          <button
            type="button"
            disabled={!isMatch}
            onClick={() => onConfirm(confirmName)}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
              isMatch
                ? "bg-red-600 text-white hover:bg-red-500 shadow-md dark:shadow-red-500/20"
                : "bg-slate-200 dark:bg-slate-800/50 text-slate-500 dark:text-slate-600 cursor-not-allowed opacity-70"
            }`}
          >
            {isMatch
              ? "Delete project permanently"
              : "Enter project name to delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
