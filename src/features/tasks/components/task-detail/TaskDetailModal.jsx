import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import taskApi from "../../api/taskApi";
import TaskDetailHeader from "./TaskDetailHeader";
import TaskDetailContent from "./TaskDetailContent";
import TaskDetailSidebar from "./TaskDetailSidebar";

export default function TaskDetailModal({ taskId, onClose, onUpdated }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm fetch data được bọc useCallback để truyền xuống con
  const fetchDetail = useCallback(async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const res = await taskApi.getTaskDetail(taskId);
      setTask(res.data.body);
    } catch (err) {
      console.error("Error fetching task detail:", err);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Hàm xử lý khi con update thành công
  const handleTaskUpdate = () => {
    fetchDetail(); // Reload data mới nhất trong Modal
    if (onUpdated) onUpdated(); // Báo cho danh sách bên ngoài reload theo
  };

  if (!taskId) return null;

  const content = (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />

      <div className="relative w-full max-w-[1200px] h-full max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 animate-slideUp border border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/60 dark:backdrop-blur-xl dark:shadow-[0_25px_50px_rgba(6,182,212,0.15)]">
        {loading ? (
          <div className="flex items-center justify-center h-full bg-slate-50/50 dark:bg-transparent">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-cyan-500"></div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">
                Loading task details...
              </p>
            </div>
          </div>
        ) : (
          <>
            <TaskDetailHeader task={task} onClose={onClose} />

            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row px-6 gap-6 bg-slate-50/30 dark:bg-transparent">
              <TaskDetailContent task={task} onUpdate={handleTaskUpdate} />
              <TaskDetailSidebar task={task} onUpdate={handleTaskUpdate} />
            </div>
          </>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}
