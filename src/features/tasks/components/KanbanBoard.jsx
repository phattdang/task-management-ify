import React, { useMemo } from "react";

// Hàm helper để format ngày tháng (VD: 2025-12-16 -> Dec 16)
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Hàm lấy chữ cái đầu của tên (VD: "Admin User" -> "AU")
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .match(/(\b\S)?/g)
    .join("")
    .match(/(^\S|\S$)?/g)
    .join("")
    .toUpperCase();
};

const TaskCard = ({ task }) => (
  <div className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md cursor-pointer group mb-2 transition-all">
    <div className="flex justify-between items-start mb-2">
      {/* Sửa task.title thành task.taskName */}
      <p className="text-sm text-gray-800 font-medium line-clamp-2">
        {task.taskName}
      </p>
      <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:bg-gray-100 p-1 rounded">
        •••
      </button>
    </div>

    {/* Date Badge: Sửa task.date thành task.dueDate */}
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
        {/* Cắt ngắn ID cho gọn nếu cần */}
        <span className="text-xs text-gray-500 font-bold">
          #{task.id.split("-")[0]}...
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Check Priority để hiện cờ (Logic ví dụ) */}
        {task.priority === "HIGH" && <span className="text-red-500">🚩</span>}
        {task.priority === "MEDIUM" && (
          <span className="text-yellow-500">🏳️</span>
        )}

        {/* Avatar Assignee */}
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

// Nhận props { tasks } từ TaskListPage
export default function KanbanBoard({ tasks = [] }) {
  // Phân loại task vào các cột dựa trên status
  // Dùng useMemo để không phải filter lại mỗi khi render nếu tasks không đổi
  const columns = useMemo(() => {
    return {
      todo: tasks.filter((t) => t.status === "TO_DO"),
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS"),
      review: tasks.filter(
        (t) => t.status === "IN_REVIEW" || t.status === "REVIEW"
      ), // Dự phòng tên status
      done: tasks.filter((t) => t.status === "DONE"),
    };
  }, [tasks]);

  return (
    <div className="flex h-full gap-6 items-start min-w-[1000px]">
      {/* Col: TO DO */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full border border-transparent">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <span>To Do</span>
          <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-700">
            {columns.todo.length}
          </span>
        </div>
        <div className="px-2 flex-1 overflow-y-auto">
          {columns.todo.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-200 w-full p-2 rounded text-sm mt-1 transition-colors">
            <span>+</span> Create
          </button>
        </div>
      </div>

      {/* Col: IN PROGRESS */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <span>In Progress</span>
          <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-700">
            {columns.inProgress.length}
          </span>
        </div>
        <div className="px-2 flex-1 overflow-y-auto">
          {columns.inProgress.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </div>

      {/* Col: IN REVIEW */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <span>In Review</span>
          <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-700">
            {columns.review.length}
          </span>
        </div>
        <div className="px-2 flex-1 overflow-y-auto">
          {columns.review.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </div>

      {/* Col: DONE */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <span>Done</span>
          <span className="text-green-600 bg-green-100 px-1.5 py-0.5 rounded text-[10px]">
            {columns.done.length} ✓
          </span>
        </div>
        <div className="px-2 flex-1 overflow-y-auto">
          {columns.done.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </div>

      {/* Create Column Button */}
      <div className="shrink-0 pt-2">
        <button className="w-10 h-10 bg-white border border-gray-300 rounded hover:bg-gray-50 text-xl font-light shadow-sm transition-colors">
          +
        </button>
      </div>
    </div>
  );
}
