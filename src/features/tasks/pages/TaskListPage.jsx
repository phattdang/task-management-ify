import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import KanbanBoard from "../../projects/components/KanbanBoard";
import taskApi from "../api/taskApi";
import projectApi from "../../projects/apis/projectApi";
import ProjectHeader from "../../projects/components/ProjectHeader";
import NavigationTabs from "../../projects/components/NavigationTabs";
import LoadingPulse from "../components/LoadingPulse";
import BoardToolbar from "./../../projects/components/BoardToolbar";

export default function TaskListPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [projectInfo, setProjectInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("BOARD");

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
        {/* HEADER SECTION - Tách thành khối riêng để scannable */}
        <div className="px-8 pt-6 border-b border-gray-200 bg-white">
          <ProjectHeader projectInfo={projectInfo} />
          <NavigationTabs activeTab={currentTab} onTabChange={setCurrentTab} />
        </div>

        {/* VIEW CONTENT - Dựa vào tab để render component tương ứng */}
        {currentTab === "BOARD" && (
          <>
            <BoardToolbar members={projectInfo?.members || []} />
            <div className="flex-1 overflow-x-auto overflow-y-hidden bg-white px-8 pb-4">
              {loading ? (
                <LoadingPulse />
              ) : (
                <KanbanBoard
                  tasks={tasks}
                  projectId={projectId}
                  onTaskCreated={fetchTasks}
                />
              )}
            </div>
          </>
        )}

        {currentTab === "LIST" && (
          <div className="p-8">Chức năng đang phát triển...</div>
        )}
        {currentTab === "SUMMARY" && (
          <div className="p-8">Chức năng đang phát triển...</div>
        )}
        {currentTab === "TIMELINE" && (
          <div className="p-8">Chức năng đang phát triển...</div>
        )}
        {currentTab === "PAGES" && (
          <div className="p-8">Chức năng đang phát triển...</div>
        )}
      </div>
    </DashboardLayout>
  );
}
