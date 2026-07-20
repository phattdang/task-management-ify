import React, { useState } from "react";
import projectInvitationsApi from "../../../../project_invitations/apis/projectInvitationApi";
import { useToast } from "../../../../../contexts/ToastContext";

export default function AddPeopleView({
  projectName,
  projectId,
  onBackToList,
}) {
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const toast = useToast();

  const handleInvite = async () => {
    if (!email.trim()) {
      toast.warning("Vui lòng nhập email!");
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
        toast.success("Gửi lời mời thành công!");
        onBackToList();
      } else {
        // Nếu HTTP 200 mà code != 200 (ví dụ code 400 nằm trong body success)
        toast.error(res.data?.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      console.error("Invite error:", error);

      // --- PHẦN QUAN TRỌNG: BẮT LỖI TỪ BACKEND TRẢ VỀ ---
      if (error.response && error.response.data) {
        // Lấy message từ response của backend: { code: 400, message: "..." }
        const backendMessage = error.response.data.message;

        if (backendMessage) {
          toast.error(backendMessage); // Hiển thị: "User already in project!"
        } else {
          toast.error("Gửi lời mời thất bại (Lỗi Server).");
        }
      } else {
        // Lỗi mạng hoặc không kết nối được server
        toast.error("Không thể kết nối đến server hoặc lỗi mạng.");
      }
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
        Invite people to {projectName}
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Email address
        </label>
        <div className="relative group">
          <span className="absolute left-3 top-3 text-slate-500 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-cyan-400 transition-colors text-lg">
            🔍
          </span>
          <input
            type="email"
            placeholder="example@domain.com"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 shadow-sm transition-all"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleInvite();
            }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
          Enter the email address of the person to invite
        </p>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={onBackToList}
          disabled={isInviting}
          className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 text-sm font-medium text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg text-white text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50 ${
            isInviting
              ? "bg-blue-400/70 dark:bg-cyan-600/50 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 shadow-md dark:shadow-cyan-500/25"
          }`}
          onClick={handleInvite}
          disabled={isInviting}
        >
          {isInviting ? "Sending..." : "Send Invite"}
        </button>
      </div>
    </>
  );
}
