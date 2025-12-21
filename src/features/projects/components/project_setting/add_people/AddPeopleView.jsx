import React, { useState } from "react";
import projectInvitationsApi from "../../../apis/projectInvitationApi";

export default function AddPeopleView({
  projectName,
  projectId,
  onBackToList,
}) {
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) {
      alert("Vui lòng nhập email!");
      return;
    }

    try {
      setIsInviting(true);

      const requestBody = { memberEmail: email };
      const res = await projectInvitationsApi.inviteMember(
        projectId,
        requestBody
      );

      // Trường hợp 1: Backend trả về HTTP 200 OK nhưng logic nghiệp vụ có thể lỗi
      // (Tùy cách bạn cấu hình backend, đôi khi lỗi vẫn trả về 200 kèm code lỗi trong body)
      if (res.data && res.data.code === 200) {
        alert("Gửi lời mời thành công!");
        onBackToList();
      } else {
        // Nếu HTTP 200 mà code != 200 (ví dụ code 400 nằm trong body success)
        alert(res.data?.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      console.error("Invite error:", error);

      // --- PHẦN QUAN TRỌNG: BẮT LỖI TỪ BACKEND TRẢ VỀ ---
      if (error.response && error.response.data) {
        // Lấy message từ response của backend: { code: 400, message: "..." }
        const backendMessage = error.response.data.message;

        if (backendMessage) {
          alert(backendMessage); // Hiển thị: "User already in project!"
        } else {
          alert("Gửi lời mời thất bại (Lỗi Server).");
        }
      } else {
        // Lỗi mạng hoặc không kết nối được server
        alert("Không thể kết nối đến server hoặc lỗi mạng.");
      }
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <>
      <h2 className="text-lg font-medium text-gray-800 mb-4">
        Add people to {projectName}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search by username, full name, or email
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            placeholder="Enter email to invite..."
            className="w-full pl-10 pr-4 py-2 border border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm shadow-sm"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleInvite();
            }}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={onBackToList}
          disabled={isInviting}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-700 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium shadow-sm flex items-center gap-2 disabled:opacity-50"
          onClick={handleInvite}
          disabled={isInviting}
        >
          {isInviting ? "Sending..." : "Add to repository"}
        </button>
      </div>
    </>
  );
}
