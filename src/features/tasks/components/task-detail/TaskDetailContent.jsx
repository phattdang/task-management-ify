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
      <div className="mb-6">
        {isEditingTitle ? (
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleUpdateTitle();
              }
            }}
            className="w-full text-2xl font-semibold p-3 bg-slate-800/50 border-2 border-cyan-500/50 rounded-lg outline-none resize-none text-slate-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
            rows={1}
            autoFocus
          />
        ) : (
          <h1
            onClick={() => setIsEditingTitle(true)}
            className="text-3xl font-bold p-2 -ml-2 rounded-lg hover:bg-slate-800/40 cursor-pointer text-slate-100 transition-colors"
          >
            {task?.taskName}
          </h1>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-8">
        <button className="bg-slate-800/50 hover:bg-slate-700/50 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-slate-100 border border-slate-700/30 transition-all">
          ➕ Attach
        </button>
        <button className="bg-slate-800/50 hover:bg-slate-700/50 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-slate-100 border border-slate-700/30 transition-all">
          ⚙️ Subtask
        </button>
      </div>

      {/* --- DESCRIPTION (EDITABLE) --- */}
      <div className="mb-8">
        <h3 className="text-sm font-bold mb-3 text-slate-400 uppercase tracking-wider">Description</h3>

        {isEditingDesc ? (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 min-h-[120px] text-sm outline-none resize-y bg-slate-800/50 text-slate-100 placeholder-slate-600 border-none rounded-t-lg"
              placeholder="Add task description..."
              autoFocus
            />
            <div className="flex items-center gap-2 p-3 bg-slate-700/20 border-t border-slate-700/30 rounded-b-lg justify-end">
              <button
                onClick={() => {
                  setDescription(task?.description || "");
                  setIsEditingDesc(false);
                }}
                className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-slate-300 hover:bg-slate-800/40 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDesc}
                className="px-3 py-1.5 text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/30 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingDesc(true)}
            className="text-sm text-slate-300 hover:bg-slate-800/40 p-3 -ml-2 rounded-lg cursor-pointer min-h-[80px] whitespace-pre-wrap transition-colors border border-transparent hover:border-slate-700/50"
          >
            {task?.description || (
              <span className="text-slate-500 italic">Click to add description...</span>
            )}
          </div>
        )}
      </div>

      {/* Activity Section (Giữ nguyên) */}
      <div className="mb-8">{/* ... (Code Activity cũ giữ nguyên) */}</div>
    </div>
  );
}
