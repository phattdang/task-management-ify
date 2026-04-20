import React, { useState, useEffect } from "react";
import { getInitials } from "../../../../utils/formatters";
import taskApi from "../../api/taskApi";

export default function TaskDetailContent({ task, onUpdate }) {
  const [activeTab, setActiveTab] = useState("Comments");

  // State cho Edit Title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(task?.taskName || "");

  // State cho Edit Description
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(task?.description || "");

  // Sync state khi task thay đổi (từ cha truyền xuống)
  useEffect(() => {
    setTitle(task?.taskName || "");
    setDescription(task?.description || "");
  }, [task]);

  // --- HANDLERS ---
  const handleUpdateTitle = async () => {
    if (title === task?.taskName) return setIsEditingTitle(false); // Không đổi thì thôi
    if (!title.trim()) return alert("Task name cannot be empty");

    try {
      await taskApi.updateTask(task.id, { taskName: title });
      onUpdate(); // Gọi callback để refresh data ở cha
      setIsEditingTitle(false);
    } catch (error) {
      console.error("Update title failed:", error);
    }
  };

  const handleUpdateDesc = async () => {
    try {
      await taskApi.updateTask(task.id, { description: description });
      onUpdate();
      setIsEditingDesc(false);
    } catch (error) {
      console.error("Update description failed:", error);
    }
  };

  return (
    <div className="flex-1 lg:pr-10 py-2">
      {/* --- TASK NAME (EDITABLE) --- */}
      <div className="mb-4">
        {isEditingTitle ? (
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle} // Click ra ngoài tự save
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleUpdateTitle();
              }
            }}
            className="w-full text-2xl font-semibold p-2 border-2 border-blue-600 rounded-md outline-none resize-none bg-white"
            rows={1}
            autoFocus
          />
        ) : (
          <h1
            onClick={() => setIsEditingTitle(true)}
            className="text-2xl font-semibold p-2 -ml-2 rounded-md hover:bg-gray-100 cursor-pointer text-[#172B4D] transition-colors"
          >
            {task?.taskName}
          </h1>
        )}
      </div>

      {/* Quick Actions (Giữ nguyên) */}
      <div className="flex gap-2 mb-8">
        <button className="bg-[#EBECF0] hover:bg-gray-200 px-3 py-1.5 rounded-md text-sm font-medium text-[#42526E]">
          ➕ Attach
        </button>
        <button className="bg-[#EBECF0] hover:bg-gray-200 px-3 py-1.5 rounded-md text-sm font-medium text-[#42526E]">
          ⚙️ Add child
        </button>
      </div>

      {/* --- DESCRIPTION (EDITABLE) --- */}
      <div className="mb-8">
        <h3 className="text-sm font-bold mb-2 text-[#5E6C84]">Description</h3>

        {isEditingDesc ? (
          <div className="bg-white border border-gray-300 rounded-md">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 min-h-[120px] text-sm outline-none resize-y rounded-t-md"
              placeholder="Add a description..."
              autoFocus
            />
            <div className="flex items-center gap-2 p-2 bg-gray-50 border-t border-gray-200 rounded-b-md justify-end">
              <button
                onClick={() => {
                  setDescription(task?.description || "");
                  setIsEditingDesc(false);
                }}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDesc}
                className="px-3 py-1.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingDesc(true)}
            className="text-sm text-gray-800 hover:bg-gray-100 p-3 -ml-2 rounded-md cursor-pointer min-h-[60px] whitespace-pre-wrap transition-colors"
          >
            {task?.description || (
              <span className="text-gray-400 italic">Add a description...</span>
            )}
          </div>
        )}
      </div>

      {/* Activity Section (Giữ nguyên) */}
      <div className="mb-8">{/* ... (Code Activity cũ giữ nguyên) */}</div>
    </div>
  );
}
