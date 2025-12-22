import React from "react";

export default function TaskDetailHeader({ task, onClose }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <div className="flex items-center gap-2 text-xs text-[#5E6C84]">
        <span className="text-[#6554C0] font-bold">
          🚀 {task?.project?.name || "Project"}
        </span>
        <span>/</span>
        <span className="flex items-center gap-1">
          <span className="bg-green-100 text-green-700 p-0.5 rounded-sm text-[10px]">
            ✔
          </span>
          #{task?.id?.substring(0, 8)}
        </span>
      </div>

      <div className="flex items-center gap-3 text-gray-500">
        <button className="hover:bg-gray-100 p-1.5 rounded-md">🔒</button>
        <button className="hover:bg-gray-100 p-1.5 rounded-md flex items-center gap-1 text-sm">
          👁️ 1
        </button>
        <button className="hover:bg-gray-100 p-1.5 rounded-md">🔗</button>
        <button className="hover:bg-gray-100 p-1.5 rounded-md">•••</button>
        <button
          onClick={onClose}
          className="hover:bg-gray-100 p-1 text-2xl leading-none rounded"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
