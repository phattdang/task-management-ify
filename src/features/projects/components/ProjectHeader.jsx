import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm để điều hướng sau khi xóa
import ProjectActionsMenu from "./project_setting/ProjectActionsMenu";
import DeleteProjectModal from "./project_setting/delete_project/DeleteProjectModal";
import ConfirmDialog from "./project_setting/delete_project/ConfirmDialog";
import projectApi from "../apis/projectApi";

export default function ProjectHeader({ projectInfo }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [confirmProjectName, setConfirmProjectName] = useState(""); // Lưu tên để gọi API
  const [isDeleting, setIsDeleting] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Bước 1: Nhận tên dự án từ Modal và mở Dialog xác nhận cuối cùng
  const handleProceedToDelete = (projectName) => {
    setConfirmProjectName(projectName); // Lưu lại tên để dùng cho API ở bước sau
    setShowDeleteModal(false);
    setShowFinalConfirm(true);
  };

  // Bước 2: Gọi API thực tế
  const handleActualDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);

      // Request body theo yêu cầu: { "projectName": "..." }
      const requestBody = {
        data: { projectName: confirmProjectName }, // Axios delete thường yêu cầu body nằm trong key 'data'
      };

      // Gọi API: deleteProject(projectId, config)
      const res = await projectApi.deleteProject(projectInfo.id, requestBody);

      if (res.data?.code === 200 && res.data?.body?.isDeleted) {
        setShowFinalConfirm(false);
        alert("Dự án đã được xóa thành công!");
        navigate("/projects"); // Điều hướng về trang danh sách dự án
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
    <div className="flex flex-col gap-3 mb-6 relative">
      <div className="flex items-center gap-3 relative" ref={menuRef}>
        <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center text-lg shadow-sm text-black">
          📦
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          {projectInfo?.name || "..."}
        </h1>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1 rounded ${
              isMenuOpen
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            •••
          </button>

          {isMenuOpen && (
            <ProjectActionsMenu
              onClose={() => setIsMenuOpen(false)}
              onDeleteClick={() => setShowDeleteModal(true)}
            />
          )}
        </div>
      </div>

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
        isLoading={isDeleting} // Bạn có thể thêm prop này vào ConfirmDialog để hiện loading
      />
    </div>
  );
}
