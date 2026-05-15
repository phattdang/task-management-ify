import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import KanbanBoard from "../../projects/components/KanbanBoard";
import taskApi from "../api/taskApi";
import projectApi from "../../projects/apis/projectApi";
import ProjectHeader from "../../projects/components/ProjectHeader";
import NavigationTabs from "../../projects/components/NavigationTabs";
import LoadingPulse from "../components/LoadingPulse";
import BoardToolbar from "./../../projects/components/BoardToolbar";
import TaskDetailModal from "../components/task-detail/TaskDetailModal";
import ProjectSummary from "../../projects/components/ProjectSummary";
import ProjectListView from "../../projects/components/ProjectListView";

export default function TaskListPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [projectInfo, setProjectInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("BOARD");
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination and Filter state
  const [filters, setFilters] = useState({
    searchKey: "",
    assigneeIds: [],
    statuses: [],
    priorities: [],
    unassigned: false,
    page: 0,
    size: 200, // Initial size based on default BOARD tab
    sort: "createdAt,desc"
  });
  const [pageData, setPageData] = useState({
    totalPages: 0,
    totalElements: 0,
    number: 0,
    size: 10
  });

  // When tab changes, adjust size if needed
  useEffect(() => {
    if (currentTab === "BOARD") {
      setFilters(prev => ({ ...prev, size: 200 }));
    } else if (currentTab === "LIST") {
      setFilters(prev => ({ ...prev, size: 10 }));
    }
  }, [currentTab]);

  // Lấy ID task từ URL
  const selectedTaskId = searchParams.get("selectedIssue");
  const handleCloseModal = () => {
    searchParams.delete("selectedIssue");
    setSearchParams(searchParams);
  };

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      const taskRes = await taskApi.filterTasksByProjectId(projectId, filters);
      const resBody = taskRes.data.body;
      setTasks(resBody.content || []);
      setPageData({
        totalPages: resBody.totalPages || 0,
        totalElements: resBody.totalElements || 0,
        number: resBody.number || 0,
        size: resBody.size || filters.size
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [projectId, filters]);

  // Re-fetch tasks whenever filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Initial Data Load (Project Info)
  useEffect(() => {
    if (!projectId) return;

    const initData = async () => {
      setLoading(true);
      try {
        const projRes = await projectApi.getAll();
        const currentProj = projRes.data.body.find((p) => p.id === projectId);
        setProjectInfo(currentProj);
      } catch (error) {
        console.error("Error init data:", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [projectId]);

  const handleApplyFilter = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0 // Reset to first page on new filter
    }));
  };

  const handleClearFilter = () => {
    setFilters(prev => ({
      ...prev,
      searchKey: "",
      assigneeIds: [],
      statuses: [],
      priorities: [],
      unassigned: false,
      page: 0
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (!projectId) {
    return (
      <DashboardLayout>
        <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
          Loading Workspace...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* HEADER SECTION */}
        <div className="relative z-40 px-8 pt-6 border-b border-slate-200 dark:border-slate-800/50 bg-white dark:bg-slate-900/30 backdrop-blur-sm transition-colors duration-200">
          <ProjectHeader projectInfo={projectInfo} />
          <NavigationTabs activeTab={currentTab} onTabChange={setCurrentTab} />
        </div>

        {/* VIEW CONTENT */}
        {(currentTab === "BOARD" || currentTab === "LIST") && (
          <BoardToolbar 
            members={projectInfo?.members || []} 
            filters={filters}
            onApplyFilter={handleApplyFilter}
            onClearFilter={handleClearFilter}
          />
        )}

        {currentTab === "BOARD" && (
          <div className="relative z-0 flex-1 overflow-x-auto overflow-y-hidden bg-slate-50 dark:bg-slate-950 px-8 pb-4 transition-colors duration-200">
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
        )}

        {currentTab === "LIST" && (
          <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 transition-colors duration-200">
            <ProjectListView 
              tasks={tasks} 
              onTaskUpdated={fetchTasks} 
              pageData={pageData}
              onPageChange={handlePageChange}
            />
          </div>
        )}
        
        {currentTab === "SUMMARY" && (
          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            <ProjectSummary tasks={tasks} projectId={projectId} />
          </div>
        )}
        {currentTab === "TIMELINE" && (
          <div className="p-8 text-slate-600 dark:text-slate-400">
            Chức năng đang phát triển...
          </div>
        )}
        {currentTab === "PAGES" && (
          <div className="p-8 text-slate-600 dark:text-slate-400">
            Chức năng đang phát triển...
          </div>
        )}

        {/* Render Modal nếu có ID trên URL */}
        {selectedTaskId && (
          <TaskDetailModal
            taskId={selectedTaskId}
            onClose={handleCloseModal}
            onUpdated={fetchTasks} // Refresh board khi update trong modal
          />
        )}
      </div>
    </DashboardLayout>
  );
}
