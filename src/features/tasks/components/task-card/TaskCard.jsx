import React, { useEffect, useRef, useState } from "react";
import taskApi from "../../api/taskApi";
import TaskActionsMenu from "../task-setting/TaskActionsMenu";
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

  const STATUS_COLORS = {
    TO_DO: { bg: 'bg-slate-700/30', text: 'text-slate-300', border: 'border-slate-600/50' },
    IN_PROGRESS: { bg: 'bg-blue-700/30', text: 'text-blue-300', border: 'border-blue-600/50' },
    IN_REVIEW: { bg: 'bg-purple-700/30', text: 'text-purple-300', border: 'border-purple-600/50' },
    DONE: { bg: 'bg-emerald-700/30', text: 'text-emerald-300', border: 'border-emerald-600/50' },
  };

  const statusColor = STATUS_COLORS[task.status] || STATUS_COLORS.TO_DO;

  return (
    <div
      onClick={handleOpenModal}
      className="group relative rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-105"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        boxShadow: 'group-hover:0 0 12px rgba(6, 182, 212, 0.2)',
      }}
    >
      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-slate-900/50 z-[110] flex items-center justify-center rounded-lg">
          <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Task Title & Menu */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <p className="text-sm text-slate-100 font-semibold line-clamp-2 flex-1">
          {task.taskName}
        </p>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`p-1 rounded-lg transition-all text-sm font-bold ${
              isMenuOpen
                ? "bg-cyan-500/30 text-cyan-400"
                : "text-slate-500 hover:text-cyan-400 hover:bg-slate-700/40"
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

      {/* Due Date & Status */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {task.dueDate && (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-slate-400 bg-slate-800/50 border border-slate-700/50">
            📅 {formatDate(task.dueDate)}
          </div>
        )}

        <div className="relative" onClick={stopPropagation}>
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className={`appearance-none cursor-pointer text-[11px] font-bold px-2 py-0.5 rounded-md border transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50
                    ${statusColor.bg} ${statusColor.text} ${statusColor.border} border`}
          >
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>

      {/* Footer: Checkbox, ID, Priority, Assignee */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded text-cyan-500 focus:ring-cyan-400 w-4 h-4 cursor-pointer bg-slate-800/50 border-slate-600/50"
            onClick={stopPropagation}
          />
          <span className="text-xs text-slate-500 font-semibold">
            #{task.id?.split("-")[0]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {task.priority === "HIGH" && <span className="text-red-500 text-sm">🚩</span>}
          {task.priority === "MEDIUM" && <span className="text-amber-500 text-sm">🏳️</span>}
          {task.priority === "LOW" && <span className="text-green-500 text-sm">✓</span>}

          <div
            className="w-6 h-6 rounded-lg text-white flex items-center justify-center text-[10px] font-bold border border-slate-600/50 shadow-sm bg-gradient-to-br from-cyan-500 to-blue-600"
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
