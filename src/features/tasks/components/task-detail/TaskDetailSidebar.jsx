import React, { useState, useEffect, useRef } from "react";
import { getInitials, formatFullDateTime } from "../../../../utils/formatters";
import taskApi from "../../api/taskApi";
import projectApi from "../../../projects/apis/projectApi"; // Import API lấy member
import { useToast } from "../../../../contexts/ToastContext";

export default function TaskDetailSidebar({ task, onUpdate }) {
  const [members, setMembers] = useState([]);
  const toast = useToast();

  // Load Members để dùng cho Assignee Dropdown
  useEffect(() => {
    if (task?.project?.id) {
      projectApi.getMembers(task.project.id).then((res) => {
        if (res.data?.body) setMembers(res.data.body);
      });
    }
  }, [task?.project?.id]);

  // --- GENERIC UPDATE HANDLER ---
  // Contract BE:
  //   - Giữ nguyên assignee: KHÔNG gửi assigneeId hoặc gửi null
  //   - Xóa assignee (Unassign): gửi assigneeId: "" (chuỗi rỗng)
  //   - Gán assignee mới: gửi assigneeId: "<userId>"
  const handleUpdate = async (field, value) => {
    try {
      // Chỉ gửi field cần update, KHÔNG gửi lại toàn bộ payload cũ
      // để tránh ghi đè dữ liệu (đặc biệt assigneeId)
      const payload = {};

      if (field === "assigneeId") {
        // Nếu value là null → user muốn Unassign → gửi chuỗi rỗng ""
        // Nếu value là userId → gán người mới
        payload.assigneeId = value === null ? "" : value;
      } else {
        // Update field khác (status, priority, dueDate, ...)
        // KHÔNG gửi assigneeId → BE giữ nguyên assignee hiện tại
        payload[field] = value;
      }

      // Gọi API
      await taskApi.updateTask(task.id, payload);
      onUpdate();
    } catch (error) {
      const msg = error.response?.data?.message || `Không thể cập nhật ${field}.`;
      toast.error(msg);
    }
  };

  // --- SUB-COMPONENTS CHO DROPDOWN ---

  const StatusSelector = () => (
    <select
      value={task?.status}
      onChange={(e) => handleUpdate("status", e.target.value)}
      className="bg-blue-50 text-blue-700 dark:bg-cyan-500/20 dark:text-cyan-400 font-bold px-3 py-1.5 rounded-lg text-xs uppercase cursor-pointer border border-blue-200 dark:border-cyan-500/30 outline-none hover:bg-blue-100 dark:hover:bg-cyan-500/30 transition-all focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50"
    >
      <option value="TO_DO">TO DO</option>
      <option value="IN_PROGRESS">IN PROGRESS</option>
      <option value="IN_REVIEW">IN REVIEW</option>
      <option value="DONE">DONE</option>
    </select>
  );

  const PrioritySelector = () => (
    <select
      value={task?.priority}
      onChange={(e) => handleUpdate("priority", e.target.value)}
      className="bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-300 cursor-pointer outline-none hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700/40 transition-all focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50"
    >
      <option value="HIGHEST">Highest</option>
      <option value="HIGH">High</option>
      <option value="MEDIUM">Medium</option>
      <option value="LOW">Low</option>
      <option value="LOWEST">Lowest</option>
    </select>
  );

  // 3. Assignee Dropdown (Custom UI giống ảnh)
  const AssigneeSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Click outside to close
    useEffect(() => {
      function handleClickOutside(event) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/40 p-1.5 rounded-lg -ml-1.5 transition-colors"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
            {getInitials(task?.assignee?.fullName)}
          </div>
          <span className="text-slate-800 dark:text-slate-300 text-sm">
            {task?.assignee?.fullName || "Unassigned"}
          </span>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 rounded-lg z-50 py-2 border border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <div
              className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-pointer flex items-center gap-2 transition-colors"
              onClick={() => {
                handleUpdate("assigneeId", null);
                setIsOpen(false);
              }}
            >
              <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/50 flex items-center justify-center text-slate-500 dark:text-slate-500">
                ?
              </div>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Unassigned
              </span>
            </div>
            {members.map((mem) => (
              <div
                key={mem.id}
                className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-pointer flex items-center gap-2 transition-colors"
                onClick={() => {
                  handleUpdate("assigneeId", mem.id);
                  setIsOpen(false);
                }}
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/80 to-blue-700/80 dark:from-cyan-500/50 dark:to-blue-600/50 text-white dark:text-slate-100 flex items-center justify-center text-xs font-bold">
                  {getInitials(mem.fullName)}
                </div>
                <span className="text-sm text-slate-800 dark:text-slate-300">
                  {mem.fullName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- RENDER ---
  return (
    <div className="w-full lg:w-[360px] py-2 lg:pl-2">
      {/* Status */}
      <div className="mb-6">
        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
          Status
        </label>
        <StatusSelector />
      </div>

      {/* Details Box */}
      <div className="border border-slate-200 dark:border-slate-700/40 rounded-lg overflow-hidden mb-6 bg-white dark:bg-slate-800/30 shadow-sm dark:shadow-none">
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/40 flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Details
          </span>
          <button
            type="button"
            className="text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-lg transition-colors"
          >
            ›
          </button>
        </div>

        <div className="p-4 space-y-4 text-sm">
          {/* Assignee */}
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Assignee
            </span>
            <AssigneeSelector />
          </div>

          {/* Priority */}
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Priority
            </span>
            <div className="flex items-center gap-2 -ml-2">
              <span
                className={`ml-2 font-bold ${
                  task?.priority === "HIGHEST"
                    ? "text-red-600 dark:text-red-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {task?.priority === "HIGHEST" ? "↑" : "●"}
              </span>
              <PrioritySelector />
            </div>
          </div>

          {/* Reporter */}
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Reporter
            </span>
            <div className="flex items-center gap-2 p-1.5 -ml-1.5">
              <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                {getInitials(task?.assignor?.fullName)}
              </div>
              <span className="text-slate-800 dark:text-slate-300">
                {task?.assignor?.fullName}
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Due date
            </span>
            <input
              type="date"
              value={task?.dueDate ? task.dueDate.split("T")[0] : ""}
              onChange={(e) =>
                handleUpdate(
                  "dueDate",
                  e.target.value ? `${e.target.value}T00:00:00` : null
                )
              }
              className="text-sm text-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900 p-1.5 -ml-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700/40 outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="text-[11px] text-slate-500 dark:text-slate-600 space-y-1 ml-1 border-t border-slate-200 dark:border-slate-700/40 pt-4">
        <p>Created {formatFullDateTime(task?.createdAt)}</p>
        <p>Updated {formatFullDateTime(task?.updatedAt)}</p>
      </div>
    </div>
  );
}
