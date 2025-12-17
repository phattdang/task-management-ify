import React, { useState } from "react";
import taskApi from "../api/taskApi"; // Import API

// Helper format date
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

// Cấu hình hiển thị cho từng status (Màu sắc & Label)
const STATUS_CONFIG = {
  TO_DO: { label: "To Do", className: "bg-gray-100 text-gray-700" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
  IN_REVIEW: { label: "In Review", className: "bg-purple-100 text-purple-700" },
  DONE: { label: "Done", className: "bg-green-100 text-green-700" },
};

// Thêm prop onTaskUpdated để gọi refresh
export default function TaskCard({ task, onTaskUpdated }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    // Nếu chọn lại status cũ thì không làm gì
    if (newStatus === task.status) return;

    setIsUpdating(true);
    try {
      // Gọi API update
      // Request body: { "status": "IN_PROGRESS" }
      const res = await taskApi.updateTask(task.id, { status: newStatus });

      if (res.data && res.data.code === 200) {
        // Update thành công -> Gọi callback để cha load lại list
        if (onTaskUpdated) onTaskUpdated();
      }
    } catch (error) {
      console.error("Update status failed:", error);
      alert("Không thể cập nhật trạng thái.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Ngăn click vào card khi đang chọn dropdown
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md cursor-pointer group mb-2 transition-all relative">
      {/* Loading Overlay khi đang update */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-gray-800 font-medium line-clamp-2">
          {task.taskName}
        </p>
        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:bg-gray-100 p-1 rounded">
          •••
        </button>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {/* Date Badge */}
        {task.dueDate && (
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-100 text-xs text-gray-600 font-semibold">
            <span>📅</span> {formatDate(task.dueDate)}
          </div>
        )}

        {/* --- STATUS COMBOBOX (NEW) --- */}
        <div
          className="relative"
          onClick={stopPropagation} // Chặn click xuyên qua card
        >
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className={`
                    appearance-none cursor-pointer text-[10px] font-bold px-2 py-0.5 rounded border border-transparent 
                    hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all
                    ${STATUS_CONFIG[task.status]?.className || "bg-gray-100"}
                `}
          >
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
            onClick={stopPropagation}
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
