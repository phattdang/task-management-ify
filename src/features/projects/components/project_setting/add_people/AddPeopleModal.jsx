// features/projects/components/project_setting/add_people/AddPeopleModal.jsx
import React, { useState, useEffect } from "react";
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

  return (
    <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center font-sans backdrop-blur-sm">
      <div 
        className="w-[600px] rounded-2xl shadow-2xl p-8 relative animate-slideUp border"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(71, 85, 105, 0.3)',
          boxShadow: '0 25px 50px rgba(6, 182, 212, 0.15)',
        }}
      >
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
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-xl font-bold transition-colors"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
