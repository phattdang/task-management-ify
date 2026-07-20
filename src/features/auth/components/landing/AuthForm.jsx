import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

export default function AuthForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignUpClick = async () => {
    if (!email) {
      setErrorMsg("Vui lòng nhập email");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // CHỈ GỌI 1 API ĐẾN MODULE AUTH
      // API này sẽ tự check trùng, tự lưu Redis và tự ném lệnh cho Kafka
      const res = await authApi.requestRegisterOtp({ email: email });

      if (res.data && res.data.code === 200) {
        // Auth trả về OK, tức là mail hợp lệ và đã ra lệnh gửi OTP
        navigate("/verify-email", {
          state: {
            email: email,
            generatedAt: Date.now(),
          },
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      // Bắt lỗi HTTP 400 từ Backend nếu email đã tồn tại
      if (error.response?.data?.code === 1010) {
        // Giả sử 1010 là mã EMAIL_EXISTED
        setErrorMsg("Email này đã được đăng ký. Vui lòng đăng nhập.");
      } else {
        setErrorMsg("Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleGoogleLogin = () => {
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${REDIRECT_URL}&` +
      `response_type=code&` +
      `scope=openid profile email&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = url;
  };

  return (
    <div className="w-full">
      {/* Hero Headline */}
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-4">
        Connect, collaborate, and manage{" "}
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
          everything
        </span>
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
        Bring your team together with PirA. Organize tasks, boost
        productivity, and ship better work.
      </p>

      {/* Email Signup Form */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={`flex-1 px-6 py-3.5 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm border rounded-full outline-none transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500 text-sm focus:ring-2 shadow-sm ${
              errorMsg
                ? "border-red-400 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                : "border-white/50 dark:border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/30"
            }`}
          />
          <button
            type="button"
            onClick={handleSignUpClick}
            disabled={isLoading}
            className={`px-8 py-3.5 font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg whitespace-nowrap flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-blue-400/70 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02]"
            }`}
          >
            {isLoading ? "Wait..." : "Get Started"}
          </button>
        </div>
        {errorMsg && (
          <p className="text-red-500 dark:text-red-400 text-sm pl-4">{errorMsg}</p>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-grow border-t border-slate-300 dark:border-slate-700/60"></div>
        <span className="px-3 text-xs text-slate-500 dark:text-slate-400 font-medium">Or continue with</span>
        <div className="flex-grow border-t border-slate-300 dark:border-slate-700/60"></div>
      </div>

      {/* Social Login */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex-1 py-3 px-6 bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm border border-white/40 dark:border-slate-700 rounded-full font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center gap-3 text-sm transition-all shadow-sm hover:shadow-md"
        >
          <span className="text-lg">G</span> Continue with Google
        </button>
      </div>

      {/* Sign In Link */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700/40 text-center text-sm text-slate-600 dark:text-slate-400">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={handleLoginClick}
          className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
