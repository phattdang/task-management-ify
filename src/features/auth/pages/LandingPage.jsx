import React, { useEffect, useState, useRef } from "react"; // 1. NHỚ IMPORT THÊM useRef
import ProductNav from "../components/landing/ProductNav";
import AuthForm from "../components/landing/AuthForm";
import MockBoard from "../components/landing/MockBoard";
import logoImg from "../../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../hooks/useGoogleAuth";

export default function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithGoogle, isProcessingGoogle } = useGoogleAuth();
  
  const hasFetched = useRef(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const authCode = queryParams.get("code");

    if (authCode && !hasFetched.current) {
      hasFetched.current = true;
      handleGoogleCallback(authCode);
    }
  }, [location]);

  const handleGoogleCallback = async (code) => {
    const result = await loginWithGoogle(code);
    
    if (result.success) {
      // Phân luồng User ở đây
      if (result.isExisted) {
        navigate("/projects", { replace: true });
      } else {
        navigate("/create-site", { replace: true });
      }
    } else {
      alert(result.message);
      navigate("/", { replace: true });
    }
  };

  return (
    // Background gradient toàn màn hình
    <div className="min-h-screen bg-gradient-to-br from-[#DEEBFF] via-[#E6FCFF] to-[#DEEBFF] font-sans overflow-x-hidden">
      {/* Loading Overlay khi đang xử lý Google Login */}
      {isProcessingGoogle && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600"></div>
          <p className="mt-4 font-semibold text-amber-800">
            Đang đăng nhập với Google...
          </p>
        </div>
      )}

      {/* Top Navigation Bar (Logo) */}
      <nav className="p-6">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-2xl">
          <img
            src={logoImg}
            alt="Logo"
            className="h-15 w-auto object-contain"
          />
          <span className="text-3xl"></span> Unemployed Team
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pt-4 pb-20">
        {/* Layout 2 cột */}
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
          {/* Cột trái: Nội dung & Form */}
          <div className="flex-1 w-full lg:pt-10">
            <AuthForm />
          </div>

          {/* Cột phải: Hình ảnh minh họa (Ẩn trên mobile nhỏ nếu muốn, hoặc để nguyên) */}
          <div className="flex-1 w-full relative hidden lg:block">
            {/* Hiệu ứng nền mờ phía sau Board */}
            <div className="absolute top-10 left-10 w-full h-full bg-blue-400 opacity-10 blur-3xl rounded-full pointer-events-none"></div>

            {/* Mockup Board */}
            <div className="relative mt-10">
              <MockBoard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}