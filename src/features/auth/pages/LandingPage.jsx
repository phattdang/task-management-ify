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
    <div className="min-h-screen bg-slate-950 font-sans overflow-x-hidden relative">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-60"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full opacity-40 animate-softGlow"></div>

      {/* Loading Overlay */}
      {isProcessingGoogle && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="mt-4 font-semibold text-cyan-400">Signing in with Google...</p>
        </div>
      )}

      {/* Top Navigation */}
      <nav className="relative z-10 p-6">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-2xl hover:text-cyan-300 transition-colors cursor-pointer">
          <span className="text-3xl">⚡</span> TaskMgmt
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left Column - Hero Text & Form */}
          <div className="flex-1 w-full lg:pt-12">
            <AuthForm />
          </div>

          {/* Right Column - Illustration */}
          <div className="flex-1 w-full relative hidden lg:block">
            <div className="absolute -top-10 -right-10 w-80 h-80 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none"></div>
            <div className="relative">
              <MockBoard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
