import React, { useEffect, useRef, useState } from "react";
import taskApi from "../../api/taskApi";
import TaskActionsMenu from "../task-setting/TaskActionsMenu";
import ConfirmDialog from "../../../projects/components/project_setting/delete_project/ConfirmDialog";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../../../../contexts/ToastContext";

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

const getHtmlDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function TaskCard({ task, onTaskUpdated }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef(null);
  const dateInputRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

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
      const msg = error.response?.data?.message || "Không thể cập nhật trạng thái.";
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    
    // Nếu newDate có giá trị, định dạng thành ISO string hoặc string tuỳ theo BE yêu cầu
    const datePayload = newDate ? `${newDate}T00:00:00` : null;

    setIsUpdating(true);
    try {
      const res = await taskApi.updateTask(task.id, { dueDate: datePayload });
      if (res.data && res.data.code === 200) {
        if (onTaskUpdated) onTaskUpdated();
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Không thể cập nhật ngày.";
      toast.error(msg);
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
      const msg = error.response?.data?.message || "Không thể xóa task.";
      toast.error(msg);
    } finally {
      setShowDeleteConfirm(false);
      setIsUpdating(false);
    }
  };

  const stopPropagation = (e) => e.stopPropagation();

  const STATUS_COLORS = {
    TO_DO: {
      bg: "bg-slate-100 dark:bg-slate-700/30",
      text: "text-slate-700 dark:text-slate-300",
      border: "border-slate-200 dark:border-slate-600/50",
    },
    IN_PROGRESS: {
      bg: "bg-blue-50 dark:bg-blue-700/30",
      text: "text-blue-700 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-600/50",
    },
    IN_REVIEW: {
      bg: "bg-purple-50 dark:bg-purple-700/30",
      text: "text-purple-700 dark:text-purple-300",
      border: "border-purple-200 dark:border-purple-600/50",
    },
    DONE: {
      bg: "bg-emerald-50 dark:bg-emerald-700/30",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-600/50",
    },
  };

  const statusColor = STATUS_COLORS[task.status] || STATUS_COLORS.TO_DO;

  const handleDateClick = (e) => {
    e.stopPropagation();
    if (dateInputRef.current && dateInputRef.current.showPicker) {
      try {
        dateInputRef.current.showPicker();
      } catch (err) {
        // Fallback for older browsers
      }
    }
  };

  return (
    <div
      onClick={handleOpenModal}
      className={`group relative rounded-lg p-3 cursor-pointer transition-all duration-300 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/50 shadow-sm hover:-translate-y-1 hover:shadow-lg dark:hover:border-cyan-500/30 hover:dark:shadow-[0_0_15px_rgba(6,182,212,0.15)] ${
        isMenuOpen ? "z-50" : ""
      }`}
    >
      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/60 z-[110] flex items-center justify-center rounded-lg backdrop-blur-[2px]">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent dark:border-cyan-500 dark:border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Task Title & Menu */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <p className="text-sm text-slate-900 dark:text-slate-100 font-semibold line-clamp-2 flex-1">
          {task.taskName}
        </p>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`p-1 rounded-lg transition-all text-sm font-bold ${
              isMenuOpen
                ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/30 dark:text-cyan-400"
                : "text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
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
        <div 
          className="relative inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors cursor-pointer overflow-hidden" 
          onClick={handleDateClick}
          title="Change Due Date"
        >
          📅 {task.dueDate ? formatDate(task.dueDate) : "Set date"}
          <input
            ref={dateInputRef}
            type="date"
            value={getHtmlDate(task.dueDate)}
            onChange={handleDateChange}
            disabled={isUpdating}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none"
          />
        </div>

        <div className="relative" onClick={stopPropagation}>
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className={`appearance-none cursor-pointer text-[11px] font-bold px-2 py-0.5 rounded-md border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50
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
            className="rounded text-blue-600 dark:text-cyan-500 focus:ring-blue-500 dark:focus:ring-cyan-500/50 w-4 h-4 cursor-pointer bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
            onClick={stopPropagation}
          />
          <span className="text-xs text-slate-500 dark:text-slate-500 font-semibold">
            #{task.id?.split("-")[0]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {task.priority === "HIGH" && (
            <span className="text-red-600 dark:text-red-400 text-sm">🚩</span>
          )}
          {task.priority === "MEDIUM" && (
            <span className="text-amber-600 dark:text-amber-400 text-sm">🏳️</span>
          )}
          {task.priority === "LOW" && (
            <span className="text-emerald-600 dark:text-emerald-400 text-sm">✓</span>
          )}

          <div
            className="w-6 h-6 rounded-lg text-white flex items-center justify-center text-[10px] font-bold border border-slate-200 dark:border-slate-600/50 shadow-sm bg-gradient-to-br from-blue-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600"
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
