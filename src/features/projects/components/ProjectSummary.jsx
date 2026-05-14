import React, { useMemo } from "react";

export default function ProjectSummary({ tasks = [] }) {
  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    let completed = 0;
    let updated = 0;
    let created = 0;
    let dueSoon = 0;

    const statusCounts = {
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      TO_DO: 0,
      DONE: 0,
    };

    const priorityCounts = {
      HIGHEST: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      LOWEST: 0,
      NONE: 0,
    };

    const typeCounts = {
      Task: 0,
      Epic: 0,
      Story: 0,
      Subtask: 0,
    };

    tasks.forEach((task) => {
      // General stats
      if (task.status === "DONE") completed++;
      if (task.updatedAt && new Date(task.updatedAt) >= sevenDaysAgo) updated++;
      if (task.createdAt && new Date(task.createdAt) >= sevenDaysAgo) created++;
      if (
        task.dueDate &&
        new Date(task.dueDate) >= now &&
        new Date(task.dueDate) <= sevenDaysFromNow
      ) {
        dueSoon++;
      }

      // Status overview
      if (statusCounts[task.status] !== undefined) {
        statusCounts[task.status]++;
      } else {
        statusCounts.TO_DO++;
      }

      // Priority breakdown
      const prio = task.priority || "NONE";
      if (priorityCounts[prio] !== undefined) {
        priorityCounts[prio]++;
      } else {
        priorityCounts.NONE++;
      }

      // Types of work (mocking since type might not exist)
      const type = task.type || "Task";
      if (typeCounts[type] !== undefined) {
        typeCounts[type]++;
      } else {
        typeCounts.Task++;
      }
    });

    return {
      completed,
      updated,
      created,
      dueSoon,
      statusCounts,
      priorityCounts,
      typeCounts,
      total: tasks.length,
    };
  }, [tasks]);

  const MetricCard = ({ icon, value, label, subtext }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {value} {label}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {subtext}
        </div>
      </div>
    </div>
  );

  // Status Overview Donut Chart Logic
  const statusTotal = stats.total || 1; // prevent div by zero
  const getStrokeDashArray = (value) => {
    const circumference = 2 * Math.PI * 40; // r=40
    return `${(value / statusTotal) * circumference} ${circumference}`;
  };

  const statusColors = {
    IN_PROGRESS: "#3b82f6", // blue-500
    IN_REVIEW: "#a855f7", // purple-500
    TO_DO: "#94a3b8", // slate-400
    DONE: "#10b981", // emerald-500
  };

  let currentOffset = 0;
  const donutSegments = Object.entries(stats.statusCounts).map(
    ([key, value]) => {
      const circumference = 2 * Math.PI * 40;
      const strokeDashoffset = currentOffset;
      currentOffset -= (value / statusTotal) * circumference;
      return { key, value, strokeDashoffset };
    }
  );

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
          value={stats.completed}
          label="completed"
          subtext="in the last 7 days"
        />
        <MetricCard
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          }
          value={stats.updated}
          label="updated"
          subtext="in the last 7 days"
        />
        <MetricCard
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          value={stats.created}
          label="created"
          subtext="in the last 7 days"
        />
        <MetricCard
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          value={stats.dueSoon}
          label="due soon"
          subtext="in the next 7 days"
        />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Overview Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Status overview</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Get a snapshot of the status of your work items.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {donutSegments.map((segment) => (
                  <circle
                    key={segment.key}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={statusColors[segment.key]}
                    strokeWidth="15"
                    strokeDasharray={getStrokeDashArray(segment.value)}
                    strokeDashoffset={segment.strokeDashoffset}
                    className="transition-all duration-500"
                  />
                ))}
                {stats.total === 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e2e8f0" // slate-200
                    strokeWidth="15"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {stats.total}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Total work items
                </span>
              </div>
            </div>
            <div className="space-y-3 flex-1 w-full">
              {Object.entries(stats.statusCounts).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: statusColors[key] }}
                    ></div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {key.replace("_", " ")}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="mb-4">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="80" height="40" rx="4" fill="#E2E8F0" className="dark:fill-slate-800" />
              <rect x="40" y="30" width="40" height="20" fill="#3B82F6" className="dark:fill-blue-600" />
              <circle cx="80" cy="50" r="10" fill="#10B981" className="dark:fill-emerald-500" />
              <path d="M76 50L79 53L84 47" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">No activity yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Create a few work items and invite some teammates to your space to see your space activity.
          </p>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Breakdown Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Priority breakdown</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Get a holistic view of how work is being prioritized.
          </p>
          <div className="h-48 flex items-end justify-around gap-2 mt-4 relative border-b border-l border-slate-200 dark:border-slate-700 pb-2 pl-2">
            {/* Y-axis labels */}
            <div className="absolute left-[-20px] bottom-2 top-0 flex flex-col justify-between text-xs text-slate-400">
              <span>{Math.max(...Object.values(stats.priorityCounts), 10)}</span>
              <span>{Math.floor(Math.max(...Object.values(stats.priorityCounts), 10) / 2)}</span>
              <span>0</span>
            </div>

            {Object.entries(stats.priorityCounts).map(([key, value]) => {
              const maxVal = Math.max(...Object.values(stats.priorityCounts), 10);
              const heightPct = (value / maxVal) * 100;
              return (
                <div key={key} className="flex flex-col items-center flex-1 group">
                  <div
                    className="w-full max-w-[40px] bg-slate-400 dark:bg-slate-600 rounded-t-sm transition-all duration-300 group-hover:bg-blue-500 dark:group-hover:bg-cyan-500"
                    style={{ height: `${heightPct}%`, minHeight: value > 0 ? "4px" : "0px" }}
                    title={`${key}: ${value}`}
                  ></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                    {key === "NONE" ? "None" : key.charAt(0) + key.slice(1).toLowerCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Types of Work Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Types of work</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Get a breakdown of work items by their types.
          </p>
          <div className="space-y-4">
            <div className="flex text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <div className="w-24">Type</div>
              <div>Distribution</div>
            </div>
            {Object.entries(stats.typeCounts).map(([key, value]) => {
              const total = stats.total || 1;
              const pct = Math.round((value / total) * 100);
              return (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-24 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="text-blue-500">
                      {key === "Task" && "✓"}
                      {key === "Epic" && "⚡"}
                      {key === "Story" && "🔖"}
                      {key === "Subtask" && "↳"}
                    </span>
                    {key}
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-800 rounded-sm overflow-hidden flex">
                      <div
                        className="h-full bg-slate-400 dark:bg-slate-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
