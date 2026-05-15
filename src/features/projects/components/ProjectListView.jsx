import React, { useState } from "react";
import taskApi from "../../tasks/api/taskApi";
import { useToast } from "../../../contexts/ToastContext";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
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

export default function ProjectListView({ tasks = [], onTaskUpdated, pageData, onPageChange }) {
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const toast = useToast();

  const handleStatusChange = async (taskId, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return;

    setUpdatingTaskId(taskId);
    try {
      const res = await taskApi.updateTask(taskId, { status: newStatus });
      if (res.data && res.data.code === 200) {
        if (onTaskUpdated) onTaskUpdated();
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Không thể cập nhật trạng thái.";
      toast.error(msg);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const STATUS_COLORS = {
    TO_DO: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700/30 dark:text-slate-300 dark:border-slate-600/50",
    IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-700/30 dark:text-blue-300 dark:border-blue-600/50",
    IN_REVIEW: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-700/30 dark:text-purple-300 dark:border-purple-600/50",
    DONE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-700/30 dark:text-emerald-300 dark:border-emerald-600/50",
  };

  const PRIORITY_ICONS = {
    HIGHEST: <span className="text-red-600 dark:text-red-400">🚩 Highest</span>,
    HIGH: <span className="text-red-500 dark:text-red-400">🚩 High</span>,
    MEDIUM: <span className="text-amber-600 dark:text-amber-400">🏳️ Medium</span>,
    LOW: <span className="text-emerald-600 dark:text-emerald-400">✓ Low</span>,
    LOWEST: <span className="text-emerald-400 dark:text-emerald-300">✓ Lowest</span>,
    NONE: <span className="text-slate-400">None</span>,
  };

  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      {/* Table Toolbar / Header Actions */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
            <span>✨</span> Ask AI
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search work"
              className="pl-8 pr-3 py-1.5 text-sm w-64 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs">U</div>
            <div className="w-7 h-7 rounded-full bg-emerald-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs">Đ</div>
          </div>
          <button className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filter
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            Group
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Saved filters ⌄</span>
          <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded">
            <button className="p-1.5 bg-blue-50 text-blue-600 border-r border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            </button>
            <button className="p-1.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
            </button>
          </div>
          <button className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
            •••
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
              <th className="py-3 px-4 w-10 text-center font-normal">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="py-3 px-4 min-w-[300px]">Work</th>
              <th className="py-3 px-4 w-40">Assignee</th>
              <th className="py-3 px-4 w-40">Reporter</th>
              <th className="py-3 px-4 w-32">Priority</th>
              <th className="py-3 px-4 w-40">Status</th>
              <th className="py-3 px-4 w-32">Resolution</th>
              <th className="py-3 px-4 w-40">Created</th>
              <th className="py-3 px-4 w-40">Updated</th>
              <th className="py-3 px-4 w-40">Due date</th>
              <th className="py-3 px-4 w-10 text-center">
                <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {tasks.map((task) => (
              <tr 
                key={task.id} 
                className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 group transition-colors"
              >
                <td className="py-2.5 px-4 text-center">
                  <input type="checkbox" className="rounded border-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <button className="text-slate-400 hover:text-slate-600">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <span className="text-purple-500">❖</span>
                    <a href="#" className="text-slate-500 hover:underline">{task.id?.split("-")[0] || "TASK-1"}</a>
                    <span className="text-slate-900 dark:text-slate-100 font-medium truncate max-w-[400px]">
                      {task.taskName}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    {task.assignee ? (
                      <>
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                          {getInitials(task.assignee.fullName)}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 truncate w-24">
                          {task.assignee.fullName}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <span className="text-slate-500">Unassigned</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                      {getInitials(task.reporter?.fullName || "Admin")}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 truncate w-24">
                      {task.reporter?.fullName || "Admin"}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-4 text-xs font-medium">
                  {PRIORITY_ICONS[task.priority] || PRIORITY_ICONS.NONE}
                </td>
                <td className="py-2.5 px-4">
                  <div className="relative inline-block w-full max-w-[130px]">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value, task.status)}
                      disabled={updatingTaskId === task.id}
                      className={`appearance-none w-full cursor-pointer text-[11px] font-bold px-2 py-1 rounded-md border transition-all focus:outline-none focus:ring-1 focus:ring-blue-500
                        ${STATUS_COLORS[task.status] || STATUS_COLORS.TO_DO} 
                        ${updatingTaskId === task.id ? 'opacity-50' : ''}`}
                    >
                      <option value="TO_DO">TO DO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="IN_REVIEW">IN REVIEW</option>
                      <option value="DONE">DONE</option>
                    </select>
                    {updatingTaskId === task.id && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-4 text-slate-500 text-xs">
                  {task.status === "DONE" ? "Done" : "Unresolved"}
                </td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                  {formatDate(task.createdAt)}
                </td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                  {formatDate(task.updatedAt)}
                </td>
                <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                  {formatDate(task.dueDate)}
                </td>
                <td className="py-2.5 px-4 text-center">
                  <button className="text-slate-400 hover:text-slate-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    •••
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan="11" className="py-8 text-center text-slate-500">
                  No tasks found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 bg-white dark:bg-slate-900">
        <button className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <span className="text-lg leading-none">+</span> Create
        </button>
        <div className="flex items-center gap-4">
          <span>{tasks.length} of {pageData?.totalElements || tasks.length}</span>
          
          <div className="flex items-center gap-1 border border-slate-300 dark:border-slate-700 rounded overflow-hidden">
            <button 
              onClick={() => onPageChange && onPageChange(pageData.number - 1)}
              disabled={!pageData || pageData.number === 0}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="px-2 text-xs font-medium border-x border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              Page {(pageData?.number || 0) + 1} of {pageData?.totalPages || 1}
            </span>
            <button 
              onClick={() => onPageChange && onPageChange(pageData.number + 1)}
              disabled={!pageData || pageData.number >= (pageData.totalPages - 1)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
