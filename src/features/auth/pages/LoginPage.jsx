import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import authApi from "../api/authApi";
// Import authApi từ đường dẫn thực tế trong dự án của bạn

const SocialButton = ({ icon, text }) => (
  <button
    type="button"
    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-400 dark:hover:border-slate-600 transition-all bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-semibold text-sm"
  >
    <span className="text-lg">{icon}</span>
    <span>{text}</span>
  </button>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // 1. Gọi API Login
      const res = await authApi.login({
        identifier: email,
        password: password,
      });

      const backendResponse = res.data;

      // 2. Kiểm tra login thành công
      if (backendResponse.code === 200 && backendResponse.body) {
        const { accessToken, refreshToken } = backendResponse.body;

        // 3a. Lưu token vào localStorage
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        // 3b. Gọi API lấy thông tin User ngay lập tức
        // Lúc này axiosClient đã có token trong localStorage nên sẽ tự gắn vào header
        let userInfo = null;
        try {
          const userRes = await authApi.getInformation();
          if (userRes.data && userRes.data.code === 200) {
            userInfo = userRes.data.body;
            // Lưu thông tin user vào localStorage để các trang khác dùng ngay
            localStorage.setItem("user_info", JSON.stringify(userInfo));
            console.log("User info saved:", userInfo);
          }
        } catch (infoError) {
          console.error("Failed to fetch user info:", infoError);
          // Không block login nếu lỗi lấy info, có thể lấy lại ở DashboardLayout sau
        }

        // Lưu auth state vào Redux
        dispatch(setAuth(userInfo));

        console.log("Login success:", backendResponse.message);

        // 4. Chuyển hướng
        navigate("/projects");
      } else {
        setErrorMsg(backendResponse.message || "Đăng nhập thất bại.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.data) {
        setErrorMsg(
          error.response.data.message || "Sai tên đăng nhập hoặc mật khẩu."
        );
      } else {
        setErrorMsg("Không thể kết nối đến server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 pt-12 pb-12 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 dark:bg-cyan-500/10 blur-3xl rounded-full opacity-40 dark:opacity-30 animate-softGlow"></div>

      {/* Login Card */}
      <div className="w-full max-w-[420px] px-6 py-10 rounded-2xl border border-slate-200 dark:border-slate-700/50 relative z-10 animate-slideUp bg-white/90 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl dark:shadow-[0_20px_50px_rgba(6,182,212,0.1)]">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-bold text-2xl mb-4">
            <span className="text-3xl">⚡</span> TaskMgmt
          </div>
          <h2 className="text-base font-semibold text-slate-600 dark:text-slate-300">
            Sign in to continue
          </h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-all"
              required
              autoFocus
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-all"
              required
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/30">
              {errorMsg}
            </div>
          )}

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-500 focus:ring-blue-500 dark:focus:ring-cyan-500/50 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
            >
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-semibold py-2.5 rounded-lg transition-all mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50 ${
              isLoading
                ? "bg-blue-400/70 dark:bg-cyan-600/50 cursor-not-allowed opacity-70"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 shadow-md dark:shadow-cyan-500/25"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700/40"></div>
          </div>
          <span className="relative bg-white dark:bg-slate-900 px-2 text-xs text-slate-500 dark:text-slate-500">
            Or continue with
          </span>
        </div>

        {/* Social Buttons */}
        <div className="space-y-2">
          <SocialButton
            icon={<span className="text-lg">G</span>}
            text="Google"
          />
          <SocialButton
            icon={<span className="text-lg">⊞</span>}
            text="Microsoft"
          />
        </div>

        {/* Footer Links */}
        <div className="border-t border-slate-200 dark:border-slate-700/40 mt-6 pt-4 text-center text-sm text-slate-600 dark:text-slate-400 space-x-1">
          <Link
            to="#"
            className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors"
          >
            Forgot password?
          </Link>
          <span>•</span>
          <Link
            to="/"
            className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center relative z-10">
        <div className="text-slate-500 dark:text-slate-600 font-semibold text-sm">
          <span className="tracking-tighter">TaskMgmt © 2026</span>
        </div>
      </footer>
    </div>
  );
}
