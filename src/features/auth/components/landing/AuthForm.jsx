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
    <div className="max-w-lg w-full">
      {/* Hero Headline */}
      <h1 className="text-5xl md:text-6xl font-bold text-slate-100 leading-tight mb-4">
        Connect, collaborate, and manage{' '}
        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          everything
        </span>
      </h1>
      <p className="text-lg text-slate-400 mb-8 leading-relaxed">
        Bring your team together with TaskMgmt. Organize tasks, boost productivity, and ship better work.
      </p>

      {/* Email Signup Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg outline-none transition-all text-slate-100 placeholder-slate-600 text-sm ${
              errorMsg
                ? "border-red-500/50 focus:border-red-500/70"
                : "border-slate-700/50 focus:border-cyan-500/50 focus:bg-slate-800/80"
            }`}
          />
          {errorMsg && (
            <p className="text-red-400 text-sm mt-2">{errorMsg}</p>
          )}
        </div>

        <button
          onClick={handleSignUpClick}
          disabled={isLoading}
          className={`w-full text-white font-semibold py-3 rounded-lg transition-all ${
            isLoading
              ? "bg-cyan-600/50 cursor-not-allowed opacity-70"
              : "bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
          }`}
        >
          {isLoading ? "Creating account..." : "Get Started"}
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700/30"></div>
        </div>
        <span className="relative bg-slate-950 px-2 text-xs text-slate-500">Or continue with</span>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={handleGoogleLogin}
          className="py-2.5 px-4 bg-slate-800/40 border border-slate-700/50 rounded-lg font-semibold text-slate-300 hover:text-cyan-400 hover:border-slate-700/80 hover:bg-slate-800/60 flex items-center justify-center gap-2 text-sm transition-all"
        >
          <span className="text-lg">G</span> Google
        </button>
        <button className="py-2.5 px-4 bg-slate-800/40 border border-slate-700/50 rounded-lg font-semibold text-slate-300 hover:text-cyan-400 hover:border-slate-700/80 hover:bg-slate-800/60 flex items-center justify-center gap-2 text-sm transition-all">
          <span className="text-lg">⊞</span> Microsoft
        </button>
      </div>

      {/* Sign In Link */}
      <div className="pt-4 border-t border-slate-700/30 text-center text-sm text-slate-400">
        <span>Already have an account? </span>
        <button
          onClick={handleLoginClick}
          className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
