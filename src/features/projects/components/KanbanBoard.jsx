import React, { useMemo, useState } from "react";
import TaskCard from "../../tasks/components/task-card/TaskCard";
import CreateTaskForm from "../../tasks/components/CreateTaskForm";

export default function KanbanBoard({ tasks = [], projectId, onTaskCreated }) {
  const [isCreating, setIsCreating] = useState(false);

  const columns = useMemo(() => {
    return {
      todo: tasks.filter((t) => t.status === "TO_DO"),
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS"),
      review: tasks.filter(
        (t) => t.status === "IN_REVIEW" || t.status === "REVIEW",
      ),
      done: tasks.filter((t) => t.status === "DONE"),
    };
  }, [tasks]);

  // Hàm render Card để đỡ lặp lại code
  const renderCard = (task) => (
    <TaskCard
      key={task.id}
      task={task}
      // QUAN TRỌNG: Truyền hàm refresh xuống đây
      onTaskUpdated={onTaskCreated}
    />
  );

  return (
    <div className="flex h-full gap-6 items-start min-w-[1000px]">
      {/* === Col: TO DO === */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full border border-transparent">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <span>To Do</span>
          <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-700">
            {columns.todo.length}
          </span>
        </div>

        <div className="px-2 flex-1 overflow-y-auto">
          {/* Render các task trong cột Todo */}
          {columns.todo.map(renderCard)}

          {isCreating ? (
            <CreateTaskForm
              projectId={projectId}
              onCancel={() => setIsCreating(false)}
              onSuccess={() => {
                setIsCreating(false);
                if (onTaskCreated) onTaskCreated();
              }}
            />
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1 text-gray-600 hover:bg-gray-200 w-full p-2 rounded text-sm mt-1 transition-colors text-left pl-2"
            >
              <span>+</span> Create issue
            </button>
          )}
        </div>
      </div>

      {/* === Col: IN PROGRESS === */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <span>In Progress</span>
          <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-700">
            {columns.inProgress.length}
          </span>
        </div>
        <div className="px-2 flex-1 overflow-y-auto">
          {columns.inProgress.map(renderCard)}
        </div>
      </div>

      {/* === Col: IN REVIEW === */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <span>In Review</span>
          <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-700">
            {columns.review.length}
          </span>
        </div>
        <div className="px-2 flex-1 overflow-y-auto">
          {columns.review.map(renderCard)}
        </div>
      </div>

      {/* === Col: DONE === */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <span>Done</span>
          <span className="text-green-600 bg-green-100 px-1.5 py-0.5 rounded text-[10px]">
            {columns.done.length} ✓
          </span>
        </div>
        <div className="px-2 flex-1 overflow-y-auto">
          {columns.done.map(renderCard)}
        </div>
      </div>

      <div className="shrink-0 pt-2">
        <button className="w-10 h-10 bg-white border border-gray-300 rounded hover:bg-gray-50 text-xl font-light shadow-sm transition-colors">
          +
        </button>
      </div>
    </div>
  );
}
