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
        className="absolute inset-0 bg-[#091E42]/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-[1200px] h-full max-h-[95vh] rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#172B4D] animate-fade-in-up">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <TaskDetailHeader task={task} onClose={onClose} />

            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row px-6">
              {/* Content nhận props onUpdate */}
              <TaskDetailContent task={task} onUpdate={handleTaskUpdate} />

              {/* Sidebar nhận props onUpdate */}
              <TaskDetailSidebar task={task} onUpdate={handleTaskUpdate} />
            </div>
          </>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}
