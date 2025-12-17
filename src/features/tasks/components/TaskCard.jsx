import React from "react";

// Helper format date (Có thể tách ra utils nếu muốn dùng chung nhiều nơi)
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .match(/(\b\S)?/g)
    .join("")
    .match(/(^\S|\S$)?/g)
    .join("")
    .toUpperCase();
};

export default function TaskCard({ task }) {
  return (
    <div className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md cursor-pointer group mb-2 transition-all">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-gray-800 font-medium line-clamp-2">
          {task.taskName}
        </p>
        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:bg-gray-100 p-1 rounded">
          •••
        </button>
      </div>

      {task.dueDate && (
        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-100 text-xs text-gray-600 font-semibold mb-3">
          <span>📅</span> {formatDate(task.dueDate)}
        </div>
      )}

      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
          />
          <span className="text-xs text-gray-500 font-bold">
            #{task.id.split("-")[0]}...
          </span>
        </div>
        <div className="flex items-center gap-2">
          {task.priority === "HIGH" && <span className="text-red-500">🚩</span>}
          {task.priority === "MEDIUM" && (
            <span className="text-yellow-500">🏳️</span>
          )}

          <div
            className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-white shadow-sm"
            title={task.assignee?.fullName}
          >
            {getInitials(task.assignee?.fullName)}
          </div>
        </div>
      </div>
    </div>
  );
}
