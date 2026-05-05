import React, { useMemo, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "../../tasks/components/task-card/TaskCard";
import CreateTaskForm from "../../tasks/components/CreateTaskForm";
import taskApi from "../../tasks/api/taskApi";
import { useToast } from "../../../contexts/ToastContext";

export default function KanbanBoard({ tasks = [], projectId, onTaskCreated }) {
  const [isCreating, setIsCreating] = useState(false);
  const [localTasks, setLocalTasks] = useState(tasks);
  const toast = useToast();

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const columns = useMemo(() => {
    return {
      todo: localTasks.filter((t) => t.status === "TO_DO"),
      inProgress: localTasks.filter((t) => t.status === "IN_PROGRESS"),
      review: localTasks.filter(
        (t) => t.status === "IN_REVIEW" || t.status === "REVIEW",
      ),
      done: localTasks.filter((t) => t.status === "DONE"),
    };
  }, [localTasks]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const taskToMove = localTasks.find((t) => t.id === draggableId);
    if (!taskToMove) return;

    const STATUS_MAP = {
      todo: "TO_DO",
      inProgress: "IN_PROGRESS",
      review: "IN_REVIEW",
      done: "DONE",
    };

    const newStatus = STATUS_MAP[destination.droppableId];
    if (!newStatus) return;

    // Optimistically update
    const updatedTasks = localTasks.map((t) =>
      t.id === draggableId ? { ...t, status: newStatus } : t
    );
    setLocalTasks(updatedTasks);

    try {
      await taskApi.updateTask(draggableId, { status: newStatus });
      if (onTaskCreated) onTaskCreated();
    } catch (error) {
      setLocalTasks(tasks); // Revert
      const msg = error.response?.data?.message || "Không thể cập nhật trạng thái.";
      toast.error(msg);
    }
  };

  const renderCard = (task, index) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 rounded-lg ${snapshot.isDragging ? "shadow-2xl ring-2 ring-blue-500 z-50 opacity-90" : ""}`}
          style={provided.draggableProps.style}
        >
          <TaskCard task={task} onTaskUpdated={onTaskCreated} />
        </div>
      )}
    </Draggable>
  );

  const renderClone = (provided, snapshot, rubric) => {
    const task = localTasks.find((t) => t.id === rubric.draggableId);
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="rounded-lg shadow-2xl ring-2 ring-blue-500 z-[9999] opacity-90"
        style={provided.draggableProps.style}
      >
        {task && <TaskCard task={task} onTaskUpdated={onTaskCreated} />}
      </div>
    );
  };

  const renderColumn = (columnKey, columnTitle, columnTasks) => {
    const countColor =
      columnKey === "done"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
        : "bg-slate-200 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300";

    return (
      <div
        key={columnKey}
        className="w-[300px] shrink-0 rounded-xl flex flex-col h-full border border-slate-200 dark:border-slate-800/50 bg-slate-100/90 dark:bg-slate-900/40 backdrop-blur-md shadow-sm dark:shadow-none transition-colors duration-200"
      >
        {/* Column Header */}
        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700/40">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {columnTitle}
            </h3>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${countColor}`}
            >
              {columnTasks.length}
            </span>
          </div>
        </div>

        {/* Tasks Container */}
        <Droppable droppableId={columnKey} renderClone={renderClone}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`px-3 py-3 flex-1 overflow-y-auto min-h-[150px] transition-colors rounded-b-xl ${
                snapshot.isDraggingOver
                  ? "bg-slate-200/50 dark:bg-slate-800/50"
                  : ""
              }`}
            >
              {columnTasks.map((task, index) => renderCard(task, index))}
              {provided.placeholder}

              {columnKey === "todo" && isCreating ? (
                <CreateTaskForm
                  projectId={projectId}
                  onCancel={() => setIsCreating(false)}
                  onSuccess={() => {
                    setIsCreating(false);
                    if (onTaskCreated) onTaskCreated();
                  }}
                />
              ) : columnKey === "todo" ? (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-white/80 dark:hover:bg-slate-800/40 transition-all flex items-center gap-2 border border-dashed border-slate-300 dark:border-slate-700/50 font-medium"
                >
                  <span>+</span> Add task
                </button>
              ) : null}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-4 items-start min-w-[1300px] px-6 py-6">
        {renderColumn("todo", "To Do", columns.todo)}
        {renderColumn("inProgress", "In Progress", columns.inProgress)}
        {renderColumn("review", "In Review", columns.review)}
        {renderColumn("done", "Done", columns.done)}

        {/* Add Column Button */}
        <div className="shrink-0 pt-20">
          <button
            type="button"
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 bg-slate-100/90 dark:bg-slate-900/40 backdrop-blur-md border border-dashed border-slate-300 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800/40 transition-all duration-300 hover:dark:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            +
          </button>
        </div>
      </div>
    </DragDropContext>
  );
}
