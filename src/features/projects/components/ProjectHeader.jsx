import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectActionsMenu from "./project_setting/ProjectActionsMenu";
import DeleteProjectModal from "./project_setting/delete_project/DeleteProjectModal";
import ConfirmDialog from "./project_setting/delete_project/ConfirmDialog";
import projectApi from "../apis/projectApi";
import AddPeopleModal from "./project_setting/add_people/AddPeopleModal";

export default function ProjectHeader({ projectInfo }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [confirmProjectName, setConfirmProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddPeopleModal, setShowAddPeopleModal] = useState(false);

  // State mới: Lưu quyền quản lý
  const [isManager, setIsManager] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Effect 1: Gọi API kiểm tra quyền Manager
  useEffect(() => {
    const checkManagerPermission = async () => {
      if (!projectInfo?.id) return;

      try {
        const res = await projectApi.isProjectManager(projectInfo.id);
        // Response format: { code: 200, body: true/false }
        if (res.data?.code === 200) {
          setIsManager(res.data.body);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra quyền manager:", error);
        setIsManager(false); // Mặc định không cho phép nếu lỗi
      }
    };

    checkManagerPermission();
  }, [projectInfo?.id]);

  // Effect 2: Xử lý click outside menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProceedToDelete = (projectName) => {
    setConfirmProjectName(projectName);
    setShowDeleteModal(false);
    setShowFinalConfirm(true);
  };

  const handleActualDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const requestBody = {
        data: { projectName: confirmProjectName },
      };

      const res = await projectApi.deleteProject(projectInfo.id, requestBody);

      if (res.data?.code === 200 && res.data?.body?.isDeleted) {
        setShowFinalConfirm(false);
        alert("Dự án đã được xóa thành công!");
        navigate("/projects");
      } else {
        alert(
          "Xóa dự án thất bại: " + (res.data?.message || "Lỗi không xác định")
        );
      }
    } catch (error) {
      console.error("Lỗi khi xóa dự án:", error);
      alert("Đã có lỗi xảy ra khi gọi API xóa.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6 relative z-50">
      <div className="flex items-center gap-4 relative" ref={menuRef}>
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-xl shadow-lg">
          📦
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 transition-colors duration-200">
          {projectInfo?.name || "Loading..."}
        </h1>

        {isManager && (
          <div className="relative z-50">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-all text-sm font-bold ${
                isMenuOpen
                  ? "bg-blue-100 text-blue-700 dark:bg-cyan-500/30 dark:text-cyan-400"
                  : "hover:bg-gray-200 dark:hover:bg-slate-800/40 text-gray-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400"
              }`}
            >
              •••
            </button>

            {isMenuOpen && (
              <ProjectActionsMenu
                onClose={() => setIsMenuOpen(false)}
                onDeleteClick={() => setShowDeleteModal(true)}
                onAddPeopleClick={() => setShowAddPeopleModal(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Các Modal vẫn giữ nguyên logic hiển thị dựa trên state local */}
      {showAddPeopleModal && (
        <AddPeopleModal
          onClose={() => setShowAddPeopleModal(false)}
          projectInfo={projectInfo}
        />
      )}

      {showDeleteModal && (
        <DeleteProjectModal
          projectInfo={projectInfo}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleProceedToDelete}
        />
      )}

      <ConfirmDialog
        isOpen={showFinalConfirm}
        title="Are you absolutely sure?"
        message={`This action is irreversible. The project "${projectInfo?.name}" and all its tasks will be permanently removed.`}
        onCancel={() => setShowFinalConfirm(false)}
        onConfirm={handleActualDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
