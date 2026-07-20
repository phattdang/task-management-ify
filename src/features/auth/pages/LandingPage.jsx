import React, { useEffect, useRef } from "react";
import AuthForm from "../components/landing/AuthForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { useToast } from "../../../contexts/ToastContext";
import introVideo from "../../../assets/background-intro.webm";

export default function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithGoogle, isProcessingGoogle } = useGoogleAuth();
  const toast = useToast();

  const hasFetched = useRef(false);

  // Check session khi vào root (http://localhost:5173/)
  useEffect(() => {
    // Nếu đang xử lý callback từ Google Auth thì bỏ qua logic check session
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("code")) return;

    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const userInfo = localStorage.getItem("user_info");

    let isValid = false;
    if (accessToken && refreshToken && userInfo) {
      try {
        JSON.parse(userInfo);
        isValid = true;
      } catch (e) {
        isValid = false;
      }
    }

    if (isValid) {
      navigate("/projects", { replace: true });
    } else {
      // Chỉ dọn rác, KHÔNG redirect — để user tự do dùng Landing/Register
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_info");
    }
  }, [navigate, location.search]);

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
        navigate("/create-project", { replace: true });
      }
    } else {
      toast.error(result.message);
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-x-hidden relative transition-colors duration-200">
      {/* Premium Video Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={introVideo} type="video/webm" />
        </video>

        {/* Subtle Dark Overlay (25-35% opacity) to improve readability */}
        <div className="absolute inset-0 bg-black/25 dark:bg-black/40"></div>
        
        {/* Smooth Gradient to blend bottom edge if needed */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50 dark:to-slate-950"></div>
        
        {/* Decorative subtle glows (Linear/Raycast style) */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-cyan-500/10 blur-[100px] rounded-full mix-blend-screen opacity-60"></div>
      </div>

      {/* Loading Overlay */}
      {isProcessingGoogle && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent dark:border-cyan-500 dark:border-t-transparent"></div>
          <p className="mt-4 font-semibold text-blue-600 dark:text-cyan-400">
            Signing in with Google...
          </p>
        </div>
      )}

      {/* Top Navigation - Glassmorphic Pill */}
      <div className="pt-6 px-6 w-full max-w-7xl mx-auto">
        <nav className="relative z-10 px-8 py-4 flex items-center justify-between bg-black/20 dark:bg-black/40 backdrop-blur-lg border border-white/10 rounded-full shadow-lg">
          {/* Logo */}
          <div className="flex items-center gap-3 text-white font-extrabold text-xl hover:text-slate-200 transition-colors cursor-pointer drop-shadow-md">
            <img 
              src="https://res.cloudinary.com/dkrrib3mb/image/upload/v1775490962/logo_remove_background_fl6k7i.png" 
              alt="Unemployed Team Logo" 
              className="w-9 h-9 object-contain drop-shadow-md" 
            />
            Unemployed Team
          </div>
          
          {/* Center Links (Sleek Pill Hover) */}
          <div className="hidden md:flex items-center gap-2 text-white/70 font-medium text-sm drop-shadow-md">
            <a href="#features" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all duration-200">
              Features
            </a>
            <a href="#solutions" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all duration-200">
              Solutions
            </a>
            <a href="#pricing" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all duration-200">
              Pricing
            </a>
            <a href="#resources" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all duration-200">
              Resources
            </a>
            <a href="#contact" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all duration-200">
              Contact
            </a>
          </div>

          {/* Right Button */}
          <div>
            <button onClick={() => navigate("/login")} className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full transition-all border border-white/20 shadow-lg flex items-center gap-2 hover:scale-105">
              Sign In <span className="text-lg leading-none">&rarr;</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 min-h-[calc(100vh-100px)] flex items-center pb-20">
        <div className="w-full max-w-xl">
          <div className="w-full backdrop-blur-md bg-white/30 dark:bg-slate-900/40 p-8 sm:p-10 rounded-[2rem] shadow-2xl border border-white/50 dark:border-slate-700/50">
            <AuthForm />
          </div>
        </div>
      </main>
    </div>
  );
}
