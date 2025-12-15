import React from "react";

// Mock Data giống ảnh image_b356f4.png
const data = {
  todo: [{ id: "KAN-1", title: "Task 1", date: "Dec 19, 2025" }],
  progress: [
    { id: "KAN-2", title: "Task 2", date: "Dec 24, 2025", flag: true }, // Có cờ xanh lá
  ],
  review: [],
  done: [],
};

const TaskCard = ({ task }) => (
  <div className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md cursor-pointer group mb-2 transition-all">
    <div className="flex justify-between items-start mb-3">
      <p className="text-sm text-gray-800 font-medium">{task.title}</p>
      <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:bg-gray-100 p-1 rounded">
        •••
      </button>
    </div>

    {/* Date Badge */}
    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-100 text-xs text-gray-600 font-semibold mb-3">
      <span>📅</span> {task.date}
    </div>

    <div className="flex justify-between items-center mt-1">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
          defaultChecked={task.id === "KAN-1"}
        />
        <span className="text-xs text-gray-500 font-bold">{task.id}</span>
      </div>

      <div className="flex items-center gap-2">
        {task.flag && <span className="text-green-600">🏳️</span>}
        {/* Avatar placeholder */}
        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
          👤
        </div>
      </div>
    </div>
  </div>
);

export default function KanbanBoard() {
  return (
    <div className="flex h-full gap-6 items-start min-w-[1000px]">
      {/* Col: TO DO */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full border border-transparent">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <span>To Do</span>
          <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-700">
            1
          </span>
        </div>
        <div className="px-2 flex-1">
          {data.todo.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-200 w-full p-2 rounded text-sm mt-1">
            <span>+</span> Create
          </button>
        </div>
      </div>

      {/* Col: IN PROGRESS */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <span>In Progress</span>
          <span className="bg-gray-200 px-1.5 py-0.5 rounded text-[10px] text-gray-700">
            1
          </span>
        </div>
        <div className="px-2 flex-1">
          {data.progress.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      </div>

      {/* Col: IN REVIEW */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full min-h-[200px]">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase">
          In Review
        </div>
        <div className="px-2 flex-1">{/* Empty state */}</div>
      </div>

      {/* Col: DONE */}
      <div className="w-[280px] shrink-0 bg-gray-50/50 rounded-lg flex flex-col h-full min-h-[200px]">
        <div className="px-3 py-3 text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
          <span>Done</span>
          <span className="text-green-600">✓</span>
        </div>
        <div className="px-2 flex-1">{/* Empty state */}</div>
      </div>

      {/* Create Column Button */}
      <div className="shrink-0 pt-2">
        <button className="w-10 h-10 bg-white border border-gray-300 rounded hover:bg-gray-50 text-xl font-light shadow-sm">
          +
        </button>
      </div>
    </div>
  );
}
