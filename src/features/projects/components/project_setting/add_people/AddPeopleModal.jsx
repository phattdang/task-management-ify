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
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center font-sans">
      <div className="bg-white w-[600px] rounded-lg shadow-lg p-6 relative animate-fade-in-down">
        {currentView === "list" ? (
          <ManageAccessView
            invitations={invitations}
            isLoading={isLoading}
            onSwitchToAddView={() => setCurrentView("add")}
          />
        ) : (
          <AddPeopleView
            projectName={projectName}
            projectId={projectId} //
            onBackToList={handleBackToList}
          />
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
