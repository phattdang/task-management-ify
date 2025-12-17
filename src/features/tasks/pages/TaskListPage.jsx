import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import KanbanBoard from "../components/KanbanBoard";
import taskApi from "../api/taskApi";
import projectApi from "../../projects/apis/projectApi";

export default function TaskListPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [projectInfo, setProjectInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Chuyển logic fetch thành hàm riêng để tái sử dụng
  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      const taskRes = await taskApi.getAllTaskByProjectId(projectId);
      setTasks(taskRes.data.body || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    const initData = async () => {
      setLoading(true);
      try {
        await fetchTasks(); // Lấy tasks
        const projRes = await projectApi.getAll(); // Lấy info project
        const currentProj = projRes.data.body.find((p) => p.id === projectId);
        setProjectInfo(currentProj);
      } catch (error) {
        console.error("Error init data:", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [projectId, fetchTasks]);

  if (!projectId) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center text-gray-500">
          Loading Workspace...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* === PROJECT HEADER SECTION === */}
        <div className="px-8 pt-6 pb-0 border-b border-gray-200 bg-white">
          {/* Breadcrumbs */}
          <div className="text-xs text-gray-500 mb-3 font-medium">
            Projects /{" "}
            <span className="text-gray-700">
              {projectInfo ? projectInfo.name : "Loading..."}
            </span>
          </div>

          {/* Project Title & Actions */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-lg shadow-sm text-black">
              📦
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {projectInfo ? projectInfo.name : "..."}
            </h1>
            <button className="p-1 hover:bg-gray-100 rounded ml-2 transition-colors">
              👤+
            </button>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              •••
            </button>
          </div>

          {/* Tab Navigation (Full options) */}
          <div className="flex items-center gap-6 text-sm font-medium text-gray-500 overflow-x-auto">
            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1 whitespace-nowrap transition-colors">
              🌐 Summary
            </div>
            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1 whitespace-nowrap transition-colors">
              📝 List
            </div>

            {/* Active Tab */}
            <div className="pb-3 text-blue-600 border-b-2 border-blue-600 cursor-pointer flex items-center gap-1 whitespace-nowrap font-bold">
              📊 Board
            </div>

            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1 whitespace-nowrap transition-colors">
              💻 Code
            </div>
            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1 whitespace-nowrap transition-colors">
              📋 Forms
            </div>
            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1 whitespace-nowrap transition-colors">
              ⏳ Timeline
            </div>
            <div className="pb-3 cursor-pointer hover:text-blue-600 flex items-center gap-1 whitespace-nowrap transition-colors">
              📄 Pages
            </div>
            <div className="pb-3 cursor-pointer hover:bg-gray-100 px-2 rounded transition-colors">
              +
            </div>
          </div>
        </div>

        {/* === BOARD CONTROLS === */}
        <div className="px-8 py-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search board"
                className="pl-8 pr-4 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm w-40 hover:bg-gray-50 focus:bg-white transition-colors"
              />
              <span className="absolute left-2.5 top-1.5 text-gray-400 text-xs">
                🔍
              </span>
            </div>

            {/* Users Avatars */}
            <div className="flex -space-x-1 cursor-pointer hover:space-x-0 transition-all">
              {/* Giả lập avatar member, sau này map projectInfo.members vào đây */}
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs font-bold text-gray-500">
                👤
              </div>
              <div className="w-8 h-8 rounded-full bg-red-500 border border-white flex items-center justify-center text-xs font-bold text-white">
                AD
              </div>
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              📂 Filter
            </button>
          </div>

          {/* Right Group Buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-100 rounded text-sm font-medium text-gray-700 transition-colors">
              Group ⌄
            </button>
            <div className="bg-gray-100 rounded p-0.5 flex">
              <button className="p-1.5 bg-white rounded shadow-sm text-gray-600">
                📈
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors">
                📋
              </button>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors">
              •••
            </button>
          </div>
        </div>

        {/* === KANBAN BOARD CONTENT === */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden bg-white px-8 pb-4">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-gray-500 animate-pulse">
                Loading tasks...
              </div>
            </div>
          ) : (
            <KanbanBoard
              tasks={tasks}
              projectId={projectId}
              onTaskCreated={fetchTasks} // Truyền callback refresh
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
