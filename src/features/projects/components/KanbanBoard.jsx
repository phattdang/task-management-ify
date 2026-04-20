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

  const renderColumn = (columnKey, columnTitle, tasks, isLastColumn = false) => {
    const countColor = columnKey === 'done' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/40 text-slate-300';
    
    return (
      <div 
        key={columnKey}
        className="w-[300px] shrink-0 rounded-xl flex flex-col h-full border"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.3)',
          backdropFilter: 'blur(8px)',
          borderColor: 'rgba(71, 85, 105, 0.2)',
        }}
      >
        {/* Column Header */}
        <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(71, 85, 105, 0.2)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              {columnTitle}
            </h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${countColor}`}>
              {tasks.length}
            </span>
          </div>
        </div>

        {/* Tasks Container */}
        <div className="px-3 py-3 flex-1 overflow-y-auto space-y-2">
          {tasks.map(renderCard)}

          {columnKey === 'todo' && isCreating ? (
            <CreateTaskForm
              projectId={projectId}
              onCancel={() => setIsCreating(false)}
              onSuccess={() => {
                setIsCreating(false);
                if (onTaskCreated) onTaskCreated();
              }}
            />
          ) : columnKey === 'todo' ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-all flex items-center gap-2 border border-dashed border-slate-700/50 font-medium"
            >
              <span>+</span> Add task
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full gap-4 items-start min-w-[1300px] px-6 py-6">
      {renderColumn('todo', 'To Do', columns.todo)}
      {renderColumn('inProgress', 'In Progress', columns.inProgress)}
      {renderColumn('review', 'In Review', columns.review)}
      {renderColumn('done', 'Done', columns.done, true)}

      {/* Add Column Button */}
      <div className="shrink-0 pt-20">
        <button 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-semibold text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-all"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(8px)',
            border: '1px dashed rgba(71, 85, 105, 0.3)',
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
