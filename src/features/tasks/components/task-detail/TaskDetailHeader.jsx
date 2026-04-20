import React from "react";

export default function TaskDetailHeader({ task, onClose }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/30 bg-gradient-to-r from-slate-900/50 to-transparent">
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="text-cyan-400 font-bold flex items-center gap-1">
          📦 {task?.project?.name || "Project"}
        </span>
        <span className="text-slate-600">/</span>
        <span className="flex items-center gap-1.5">
          <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-sm text-[10px] font-bold">
            ✓ DONE
          </span>
          #{task?.id?.substring(0, 8)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-slate-500">
        <button className="hover:bg-slate-800/40 p-1.5 rounded-lg hover:text-slate-300 transition-all" title="Lock">
          🔒
        </button>
        <button className="hover:bg-slate-800/40 p-1.5 rounded-lg hover:text-slate-300 flex items-center gap-1 text-sm transition-all">
          👁️ 1
        </button>
        <button className="hover:bg-slate-800/40 p-1.5 rounded-lg hover:text-slate-300 transition-all" title="Copy link">
          🔗
        </button>
        <button className="hover:bg-slate-800/40 p-1.5 rounded-lg hover:text-slate-300 transition-all" title="More options">
          •••
        </button>
        <button
          onClick={onClose}
          className="hover:bg-slate-800/40 p-1 text-2xl leading-none rounded-lg hover:text-slate-300 transition-all ml-2"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
