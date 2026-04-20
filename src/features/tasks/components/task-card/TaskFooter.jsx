export default function TaskFooter({
  taskId,
  priority,
  assignee,
  getInitials,
  stopPropagation,
}) {
  return (
    <div className="flex justify-between items-center mt-1">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded text-blue-600 dark:text-cyan-500 focus:ring-blue-500 dark:focus:ring-cyan-500/50 w-4 h-4 cursor-pointer bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
          onClick={stopPropagation}
        />
        <span className="text-xs text-slate-500 dark:text-slate-500 font-bold">
          #{taskId.split("-")[0]}...
        </span>
      </div>
      <div className="flex items-center gap-2">
        {priority === "HIGH" && (
          <span className="text-red-600 dark:text-red-400">🚩</span>
        )}
        {priority === "MEDIUM" && (
          <span className="text-amber-600 dark:text-amber-400">🏳️</span>
        )}
        <div
          className="w-6 h-6 rounded-full bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-400 flex items-center justify-center text-[10px] font-bold border border-white dark:border-slate-700 shadow-sm"
          title={assignee?.fullName}
        >
          {getInitials(assignee?.fullName)}
        </div>
      </div>
    </div>
  );
}
