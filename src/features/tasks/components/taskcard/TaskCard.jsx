import React, { useEffect, useRef, useState } from "react";
import taskApi from "../../api/taskApi";
import TaskActionsMenu from "../task_setting/TaskActionsMenu";
import ConfirmDialog from "../../../projects/components/project_setting/delete_project/ConfirmDialog";
import { useSearchParams } from "react-router-dom";

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

const STATUS_CONFIG = {
  TO_DO: { label: "To Do", className: "bg-gray-100 text-gray-700" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
  IN_REVIEW: { label: "In Review", className: "bg-purple-100 text-purple-700" },
  DONE: { label: "Done", className: "bg-green-100 text-green-700" },
};

export default function TaskCard({ task, onTaskUpdated }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleOpenModal = () => {
    // Thêm taskId vào URL mà không làm mất các params khác (nếu có)
    searchParams.set("selectedIssue", task.id);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === task.status) return;

    setIsUpdating(true);
    try {
      const res = await taskApi.updateTask(task.id, { status: newStatus });
      if (res.data && res.data.code === 200) {
        if (onTaskUpdated) onTaskUpdated();
      }
    } catch (error) {
      console.error("Update status failed:", error);
      alert("Không thể cập nhật trạng thái.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      setIsUpdating(true);

      // Cấu hình request body cho method DELETE trong Axios
      const config = {
        data: { projectId: task.project?.id },
      };

      const res = await taskApi.deleteTask(task.id, config);

      if (res.data?.code === 200 && res.data?.body?.isDeleted) {
        if (onTaskUpdated) onTaskUpdated();
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Không thể xóa task.");
    } finally {
      setShowDeleteConfirm(false);
      setIsUpdating(false);
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      onClick={handleOpenModal}
      className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md cursor-pointer mb-2 transition-all relative"
    >
      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 z-[110] flex items-center justify-center rounded">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <p className="text-sm text-gray-800 font-medium line-clamp-2">
          {task.taskName}
        </p>

        {/* Nút Menu ••• - Đã chỉnh sửa luôn hiện và đổi màu khi active */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`p-1 rounded transition-colors ${
              isMenuOpen
                ? "bg-blue-100 text-blue-600"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            •••
          </button>

          {isMenuOpen && (
            <TaskActionsMenu
              onClose={() => setIsMenuOpen(false)}
              onDeleteClick={() => setShowDeleteConfirm(true)}
              onCopyId={() => navigator.clipboard.writeText(task.id)}
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {task.dueDate && (
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-100 text-xs text-gray-600 font-semibold">
            <span>📅</span> {formatDate(task.dueDate)}
          </div>
        )}

        <div className="relative" onClick={stopPropagation}>
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className={`appearance-none cursor-pointer text-[10px] font-bold px-2 py-0.5 rounded border border-transparent 
                    hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all
                    ${STATUS_CONFIG[task.status]?.className || "bg-gray-100"}`}
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
            #{task.id?.split("-")[0]}...
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

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete task?"
        message={`Are you sure you want to delete task "${task.taskName}"? This action cannot be undone.`}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
}
