import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import projectInvitationsApi from "../apis/projectInvitationApi";

export default function InvitationConfirmPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // State lưu dữ liệu lời mời từ API
  const [invitationData, setInvitationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 1. FETCH DATA KHI MOUNT ---
  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ hoặc bị thiếu.");
      setIsLoading(false);
      return;
    }

    const fetchInvitationDetails = async () => {
      try {
        const res = await projectInvitationsApi.getInvitationByInvitedCode(
          token
        );
        // Response format: { code: 200, body: { ... } }
        if (res.data && res.data.code === 200) {
          setInvitationData(res.data.body);
        } else {
          setError(res.data?.message || "Không tìm thấy lời mời.");
        }
      } catch (err) {
        console.error("Fetch invitation error:", err);
        setError("Lời mời không tồn tại hoặc đã hết hạn.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitationDetails();
  }, [token]);

  // --- 2. XỬ LÝ ACCEPT / DECLINE ---
  const handleAnswer = async (answer) => {
    try {
      setIsProcessing(true);

      const requestBody = {
        invitationCode: token,
        answer: answer, // true = accept, false = decline
      };

      const res = await projectInvitationsApi.answerInvitation(requestBody);

      if (res.data && res.data.code === 200) {
        if (answer) {
          alert("Đã tham gia dự án thành công!");
          // Lấy ID dự án từ data đã fetch từ trước (hoặc từ response accept nếu có)
          const projectId = invitationData?.project?.id;
          navigate(`/projects/${projectId}`);
        } else {
          alert("Đã từ chối lời mời.");
          navigate("/projects");
        }
      } else {
        alert("Thao tác thất bại: " + (res.data?.message || "Lỗi server"));
      }
    } catch (err) {
      console.error("Answer error:", err);
      if (err.response && err.response.data) {
        alert(err.response.data.message || "Có lỗi xảy ra.");
      } else {
        alert("Lỗi kết nối.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper: Lấy chữ cái đầu
  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  // --- RENDER ---

  // 1. Màn hình Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-slate-500 dark:text-slate-400 font-medium">
          Checking invitation...
        </div>
      </div>
    );
  }

  // 2. Màn hình Lỗi
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center px-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-200 dark:border-red-500/30">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Không thể tải lời mời
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="text-blue-600 dark:text-cyan-400 hover:underline font-medium"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  // 3. Màn hình chính (Có dữ liệu)
  const { inviter, project } = invitationData;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center pt-16 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* --- AVATAR GROUP --- */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {/* Project Avatar */}
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-md flex items-center justify-center border border-slate-200 dark:border-slate-800/50 shadow-sm">
          <span className="text-xl font-bold text-emerald-800 dark:text-emerald-400">
            {getInitials(project?.name)}
          </span>
        </div>

        <span className="text-slate-400 dark:text-slate-500 text-xl font-light">
          +
        </span>

        {/* Inviter Avatar */}
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800/50 shadow-sm overflow-hidden">
          <span className="text-xl font-bold text-blue-700 dark:text-cyan-400">
            {getInitials(inviter?.fullName)}
          </span>
        </div>
      </div>

      {/* --- TITLE --- */}
      <div className="text-center mb-6 px-4">
        <h1 className="text-xl sm:text-2xl font-light mb-1 text-slate-800 dark:text-slate-200">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {inviter?.fullName}
          </span>{" "}
          invited you to collaborate on
        </h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 dark:text-cyan-400">
          {project?.name}
        </h2>
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => handleAnswer(true)} // Accept
          disabled={isProcessing}
          className="bg-emerald-600 hover:bg-emerald-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white px-5 py-2 rounded-md font-semibold text-sm shadow-sm border border-emerald-700/20 dark:border-cyan-400/20 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-cyan-500/50"
        >
          {isProcessing ? "Processing..." : "Accept invitation"}
        </button>
        <button
          type="button"
          onClick={() => handleAnswer(false)} // Decline
          disabled={isProcessing}
          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 px-5 py-2 rounded-md font-semibold text-sm shadow-sm border border-slate-300 dark:border-slate-700 transition-colors disabled:opacity-50"
        >
          Decline invitation
        </button>
      </div>

      {/* --- INFO BOX --- */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/50 rounded-md p-4 max-w-lg w-full mx-4 mb-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <span className="text-slate-500 dark:text-slate-400 mt-1">ℹ️</span>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="text-blue-600 dark:text-cyan-400 cursor-pointer hover:underline">
              Owners
            </span>{" "}
            of <strong className="text-slate-900 dark:text-slate-200">{project?.name}</strong> will be able to see:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your public profile information</li>
              <li>Certain activity within this repository</li>
              <li>Country of request origin</li>
              <li>Your IP address</li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-auto py-6 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
        <span>© 2026 Taskify, Inc.</span>
      </div>
    </div>
  );
}
