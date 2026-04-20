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
          className="rounded text-blue-600 w-4 h-4 cursor-pointer"
          onClick={stopPropagation}
        />
        <span className="text-xs text-gray-500 font-bold">
          #{taskId.split("-")[0]}...
        </span>
      </div>
      <div className="flex items-center gap-2">
        {priority === "HIGH" && <span className="text-red-500">🚩</span>}
        {priority === "MEDIUM" && <span className="text-yellow-500">🏳️</span>}
        <div
          className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-white shadow-sm"
          title={assignee?.fullName}
        >
          {getInitials(assignee?.fullName)}
        </div>
      </div>
    </div>
  );
}
