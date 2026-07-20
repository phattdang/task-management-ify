import React, { useMemo } from "react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ProjectTimelineView({ tasks = [] }) {
  const { scheduled, unscheduled } = useMemo(() => {
    const scheduled = [];
    const unscheduled = [];

    tasks.forEach((task) => {
      if (task.dueDate) {
        scheduled.push(task);
      } else {
        unscheduled.push(task);
      }
    });

    // Sort scheduled by due date ascending
    scheduled.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    return { scheduled, unscheduled };
  }, [tasks]);

  return (
    <div className="p-8 w-full h-full max-w-7xl mx-auto space-y-8 overflow-y-auto">
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg border border-blue-200 dark:border-blue-800 flex flex-col gap-1">
        <h3 className="font-semibold flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Basic timeline from task due dates
        </h3>
        <p className="text-sm opacity-90 ml-7">
          Gantt chart editing will be available once the backend supports task start dates.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            Scheduled Work ({scheduled.length})
          </h2>
          {scheduled.length === 0 ? (
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 italic">
              No scheduled tasks.
            </div>
          ) : (
            <div className="space-y-3">
              {scheduled.map((task) => (
                <div key={task.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {task.id.split("-")[0] || "TASK"}
                      </span>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {task.taskName}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                        Status: {task.status?.replace("_", " ")}
                      </span>
                      {task.assignee && (
                        <span className="flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {task.assignee.fullName.charAt(0).toUpperCase()}
                          </span>
                          {task.assignee.fullName}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg sm:w-1/3">
                    <div className="flex-1 text-right">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Created</div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(task.createdAt)}</div>
                    </div>
                    <div className="w-full max-w-[40px] h-1 bg-slate-200 dark:bg-slate-700 rounded-full relative">
                      <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-slate-300 to-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-blue-500 uppercase tracking-wider font-semibold">Due</div>
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatDate(task.dueDate)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 mt-8">
            <span className="w-3 h-3 rounded-full bg-slate-400"></span>
            Unscheduled Work ({unscheduled.length})
          </h2>
          {unscheduled.length === 0 ? (
            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 italic">
              All tasks are scheduled.
            </div>
          ) : (
            <div className="space-y-3">
              {unscheduled.map((task) => (
                <div key={task.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {task.id.split("-")[0] || "TASK"}
                      </span>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {task.taskName}
                      </h4>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Created: {formatDate(task.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
