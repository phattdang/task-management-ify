// features/projects/components/project_setting/add_people/AddPeopleModal.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ManageAccessView from "./ManageAccessView";
import AddPeopleView from "./AddPeopleView";
import projectInvitationsApi from "../../../../project_invitations/apis/projectInvitationApi";

export default function AddPeopleModal({ onClose, projectInfo }) {
  const [currentView, setCurrentView] = useState("list");
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const projectId = projectInfo?.id;
  const projectName = projectInfo?.name || "Project";

  // Tách hàm fetch ra để có thể gọi lại (refresh)
  const fetchInvitations = async () => {
    if (!projectId) return;
    try {
      setIsLoading(true);
      const res = await projectInvitationsApi.getAllInvitations(projectId);
      if (res.data && res.data.code === 200) {
        setInvitations(res.data.body);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi lần đầu khi mount
  useEffect(() => {
    fetchInvitations();
  }, [projectId]);

  // Hàm xử lý khi từ trang Add quay về trang List
  const handleBackToList = () => {
    setCurrentView("list");
    fetchInvitations(); // Reload lại danh sách để thấy thành viên mới mời
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 z-[1000] flex items-center justify-center font-sans backdrop-blur-sm">
      <div className="w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 relative animate-slideUp border border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/60 dark:backdrop-blur-xl dark:shadow-[0_25px_50px_rgba(6,182,212,0.15)]">
        {currentView === "list" ? (
          <ManageAccessView
            invitations={invitations}
            isLoading={isLoading}
            onSwitchToAddView={() => setCurrentView("add")}
          />
        ) : (
          <AddPeopleView
            projectName={projectName}
            projectId={projectId}
            onBackToList={handleBackToList}
          />
        )}

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 text-xl font-bold transition-colors"
        >
          &times;
        </button>
      </div>
    </div>,
    document.body
  );
}
