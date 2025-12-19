import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import taskApi from "../../api/taskApi";

// Helper để lấy chữ cái đầu (đã có trong context của bạn)
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Helper format ngày giờ chuẩn Atlassian
const formatFullDateTime = (dateString) => {
  if (!dateString) return "None";
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " at " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

export default function TaskDetailModal({ taskId, onClose, onUpdated }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Comments");

  useEffect(() => {
    if (!taskId) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await taskApi.getTaskDetail(taskId);
        setTask(res.data.body);
      } catch (err) {
        console.error("Error fetching task detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [taskId]);

  if (!taskId) return null;
  if (loading) return null; // Hoặc render một loading spinner

  const content = (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div
        className="absolute inset-0 bg-[#091E42]/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-[1200px] h-full max-h-[95vh] rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#172B4D]">
        {/* 1. TOP BAR */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-[#5E6C84]">
            {/* Map Project Name & Task ID */}
            <span className="text-[#6554C0] font-bold">
              🚀 {task?.project?.name}
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
              className="hover:bg-gray-100 p-1 text-2xl leading-none"
            >
              &times;
            </button>
          </div>
        </div>

        {/* 2. MAIN BODY */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row px-6">
          {/* LEFT: CONTENT */}
          <div className="flex-1 lg:pr-10 py-2">
            {/* Task Name */}
            <h1 className="text-2xl font-semibold mb-4 hover:bg-gray-50 p-2 -ml-2 rounded-md cursor-text transition-colors">
              {task?.taskName}
            </h1>

            {/* Actions */}
            <div className="flex gap-2 mb-8">
              <button className="bg-[#EBECF0] hover:bg-gray-200 px-3 py-1.5 rounded-md text-sm font-medium">
                ➕ Attach
              </button>
              <button className="bg-[#EBECF0] hover:bg-gray-200 px-3 py-1.5 rounded-md text-sm font-medium">
                ⚙️ Add child
              </button>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-bold mb-2 text-[#5E6C84]">
                Description
              </h3>
              <div className="text-sm text-gray-800 hover:bg-gray-50 p-3 -ml-2 rounded-md cursor-pointer border border-transparent hover:border-gray-200">
                {task?.description || "No description provided."}
              </div>
            </div>

            {/* Activity Section */}
            <div className="mb-8">
              <h3 className="text-sm font-bold mb-4">Activity</h3>
              <div className="flex text-xs font-semibold bg-[#F4F5F7] p-1 rounded-md w-fit mb-4">
                {["All", "Comments", "History"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded ${
                      activeTab === tab
                        ? "bg-white shadow-sm text-blue-700"
                        : "text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Comment Input */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {getInitials(task?.assignee?.fullName)}
                </div>
                <div className="flex-1 border border-gray-300 rounded-md overflow-hidden">
                  <textarea
                    className="w-full p-3 text-sm outline-none resize-none"
                    placeholder="Add a comment..."
                    rows="1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <div className="w-full lg:w-[360px] py-2">
            {/* Status Section */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-[#5E6C84] uppercase mb-2">
                Status
              </label>
              <button className="bg-[#DEEBFF] text-[#0747A6] font-bold px-3 py-1.5 rounded-md text-xs flex items-center gap-2 hover:bg-[#B3D4FF] uppercase">
                {task?.status?.replace("_", " ")}{" "}
                <span className="text-[8px]">▼</span>
              </button>
            </div>

            {/* Details Accordion */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase text-gray-500">
                Details
              </div>

              <div className="p-4 space-y-4 text-sm">
                {/* Assignee */}
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="text-[#5E6C84] font-medium">Assignee</span>
                  <div className="flex items-center gap-2 group cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
                      {getInitials(task?.assignee?.fullName)}
                    </div>
                    <span className="text-gray-800">
                      {task?.assignee?.fullName}
                    </span>
                  </div>
                </div>

                {/* Priority */}
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="text-[#5E6C84] font-medium">Priority</span>
                  <div className="flex items-center gap-2">
                    {/* Tự động đổi màu icon theo Priority */}
                    <span
                      className={
                        task?.priority === "HIGH"
                          ? "text-red-500"
                          : "text-orange-500"
                      }
                    >
                      〓
                    </span>
                    <span className="capitalize">
                      {task?.priority?.toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Reporter (Mapped from assignor) */}
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="text-[#5E6C84] font-medium">Reporter</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-[10px] font-bold">
                      {getInitials(task?.assignor?.fullName)}
                    </div>
                    <span>{task?.assignor?.fullName}</span>
                  </div>
                </div>

                {/* Due Date */}
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="text-[#5E6C84] font-medium">Due date</span>
                  <span
                    className={
                      new Date(task?.dueDate) < new Date()
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    {task?.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="mt-6 text-[11px] text-[#5E6C84] space-y-1 ml-1">
              <p>Created {formatFullDateTime(task?.createdAt)}</p>
              <p>Updated {formatFullDateTime(task?.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}
