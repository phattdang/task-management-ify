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
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="text-gray-500 font-medium">Checking invitation...</div>
      </div>
    );
  }

  // 2. Màn hình Lỗi
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9] text-center px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Không thể tải lời mời
        </h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => navigate("/projects")}
          className="text-blue-600 hover:underline font-medium"
        >
          Quay về trang chủ
        </button>
      </div>
    );
  }

  // 3. Màn hình chính (Có dữ liệu)
  const { inviter, project } = invitationData;

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center pt-16 font-sans text-[#24292f]">
      {/* --- AVATAR GROUP --- */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {/* Project Avatar */}
        <div className="w-12 h-12 bg-green-200 rounded-md flex items-center justify-center border border-gray-200 shadow-sm">
          <span className="text-xl font-bold text-green-700">
            {getInitials(project?.name)}
          </span>
        </div>

        <span className="text-gray-400 text-xl font-light">+</span>

        {/* Inviter Avatar */}
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden">
          <span className="text-xl font-bold text-blue-600">
            {getInitials(inviter?.fullName)}
          </span>
        </div>
      </div>

      {/* --- TITLE --- */}
      <div className="text-center mb-6 px-4">
        <h1 className="text-xl sm:text-2xl font-light mb-1">
          <span className="font-semibold">{inviter?.fullName}</span> invited you
          to collaborate on
        </h1>
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-600">
          {project?.name}
        </h2>
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => handleAnswer(true)} // Accept
          disabled={isProcessing}
          className="bg-[#2da44e] hover:bg-[#2c974b] text-white px-5 py-2 rounded-md font-semibold text-sm shadow-sm border border-[rgba(27,31,36,0.15)] transition-colors disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Accept invitation"}
        </button>
        <button
          onClick={() => handleAnswer(false)} // Decline
          disabled={isProcessing}
          className="bg-[#f6f8fa] hover:bg-[#f3f4f6] text-[#24292f] px-5 py-2 rounded-md font-semibold text-sm shadow-sm border border-[rgba(27,31,36,0.15)] transition-colors disabled:opacity-50"
        >
          Decline invitation
        </button>
      </div>

      {/* --- INFO BOX --- */}
      <div className="bg-white border border-[#d0d7de] rounded-md p-4 max-w-lg w-full mx-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-gray-500 mt-1">ℹ️</span>
          <div className="text-sm text-[#57606a]">
            <span className="text-[#0969da] cursor-pointer hover:underline">
              Owners
            </span>{" "}
            of <strong>{project?.name}</strong> will be able to see:
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
      <div className="mt-auto py-6 flex items-center gap-4 text-xs text-[#57606a]">
        <span>© 2025 Taskify, Inc.</span>
      </div>
    </div>
  );
}
