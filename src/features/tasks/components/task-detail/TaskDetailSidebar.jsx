import React, { useState, useEffect, useRef } from "react";
import { getInitials, formatFullDateTime } from "../../../../utils/formatters";
import taskApi from "../../api/taskApi";
import projectApi from "../../../projects/apis/projectApi"; // Import API lấy member

export default function TaskDetailSidebar({ task, onUpdate }) {
  const [members, setMembers] = useState([]);

  // Load Members để dùng cho Assignee Dropdown
  useEffect(() => {
    if (task?.project?.id) {
      projectApi.getMembers(task.project.id).then((res) => {
        if (res.data?.body) setMembers(res.data.body);
      });
    }
  }, [task?.project?.id]);

  // --- GENERIC UPDATE HANDLER ---
  const handleUpdate = async (field, value) => {
    try {
      // Tạo payload cơ bản
      const payload = {
        taskName: task.taskName, // Gửi lại tên cũ
        description: task.description, // Gửi lại mô tả cũ
        priority: task.priority, // Gửi lại priority cũ
        status: task.status, // Gửi lại status cũ
        assigneeId: task.assignee?.id || null, // Gửi lại ID cũ (hoặc null)
        dueDate: task.dueDate,
      };

      // Ghi đè giá trị mới vào
      payload[field] = value;

      // Gọi API
      await taskApi.updateTask(task.id, payload);
      onUpdate();
    } catch (error) {
      console.error(`Update ${field} failed:`, error);
    }
  };

  // --- SUB-COMPONENTS CHO DROPDOWN ---

  // 1. Status Dropdown
  const StatusSelector = () => (
    <select
      value={task?.status}
      onChange={(e) => handleUpdate("status", e.target.value)}
      className="bg-[#DEEBFF] text-[#0747A6] font-bold px-3 py-1.5 rounded-md text-xs uppercase cursor-pointer border-none outline-none hover:bg-[#B3D4FF]"
    >
      <option value="TO_DO">TO DO</option>
      <option value="IN_PROGRESS">IN PROGRESS</option>
      <option value="IN_REVIEW">IN REVIEW</option>
      <option value="DONE">DONE</option>
    </select>
  );

  // 2. Priority Dropdown
  const PrioritySelector = () => (
    <select
      value={task?.priority}
      onChange={(e) => handleUpdate("priority", e.target.value)}
      className="bg-transparent text-sm text-[#172B4D] cursor-pointer outline-none hover:bg-gray-100 px-2 py-1 rounded"
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
          className="flex items-center gap-2 group cursor-pointer hover:bg-gray-100 p-1.5 rounded -ml-1.5 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
            {getInitials(task?.assignee?.fullName)}
          </div>
          <span className="text-[#172B4D] text-sm">
            {task?.assignee?.fullName || "Unassigned"}
          </span>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-60 bg-white shadow-xl border border-gray-200 rounded-md z-50 py-1">
            <div
              className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
              onClick={() => {
                handleUpdate("assigneeId", null);
                setIsOpen(false);
              }}
            >
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                ?
              </div>
              <span className="text-sm">Unassigned</span>
            </div>
            {members.map((mem) => (
              <div
                key={mem.id}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  handleUpdate("assigneeId", mem.id);
                  setIsOpen(false);
                }}
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {getInitials(mem.fullName)}
                </div>
                <span className="text-sm">{mem.fullName}</span>
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
        <label className="block text-[11px] font-bold text-[#5E6C84] uppercase mb-2">
          Status
        </label>
        <StatusSelector />
      </div>

      {/* Details Box */}
      <div className="border border-gray-200 rounded-md overflow-hidden mb-6">
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-[#172B4D]">Details</span>
          <button className="text-gray-400 hover:text-gray-600 text-lg">
            ›
          </button>
        </div>

        <div className="p-4 space-y-4 text-sm bg-white">
          {/* Assignee */}
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="text-[#5E6C84] font-medium">Assignee</span>
            <AssigneeSelector />
          </div>

          {/* Priority */}
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="text-[#5E6C84] font-medium">Priority</span>
            <div className="flex items-center gap-2 -ml-2">
              {/* Icon Priority màu mè */}
              <span
                className={`ml-2 font-bold ${
                  task?.priority === "HIGHEST"
                    ? "text-red-600"
                    : "text-orange-500"
                }`}
              >
                {task?.priority === "HIGHEST" ? "↑" : "〓"}
              </span>
              <PrioritySelector />
            </div>
          </div>

          {/* Reporter (Read-only) */}
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="text-[#5E6C84] font-medium">Reporter</span>
            <div className="flex items-center gap-2 p-1.5 -ml-1.5">
              <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-[10px] font-bold">
                {getInitials(task?.assignor?.fullName)}
              </div>
              <span className="text-[#172B4D]">{task?.assignor?.fullName}</span>
            </div>
          </div>

          {/* Due Date */}
          <div className="grid grid-cols-[100px_1fr] items-center">
            <span className="text-[#5E6C84] font-medium">Due date</span>
            <input
              type="date"
              value={task?.dueDate ? task.dueDate.split("T")[0] : ""}
              onChange={(e) =>
                handleUpdate(
                  "dueDate",
                  e.target.value ? `${e.target.value}T00:00:00` : null
                )
              }
              className="text-sm text-[#172B4D] p-1 -ml-1 hover:bg-gray-100 rounded cursor-pointer border-none outline-none"
            />
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="text-[11px] text-[#5E6C84] space-y-1 ml-1 border-t pt-4 border-gray-100">
        <p>Created {formatFullDateTime(task?.createdAt)}</p>
        <p>Updated {formatFullDateTime(task?.updatedAt)}</p>
      </div>
    </div>
  );
}
