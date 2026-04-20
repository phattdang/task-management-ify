import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import authApi from "../api/authApi";
// Import authApi từ đường dẫn thực tế trong dự án của bạn

const SocialButton = ({ icon, text }) => (
  <button
    type="button"
    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-700/50 rounded-lg hover:bg-slate-800/60 hover:border-slate-600 transition-all bg-slate-800/40 text-slate-300 hover:text-slate-100 font-semibold text-sm"
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 pt-12 pb-12 font-sans relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full opacity-30 animate-softGlow"></div>

      {/* Login Card */}
      <div 
        className="w-full max-w-[420px] px-6 py-10 rounded-2xl border relative z-10 animate-slideUp"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(71, 85, 105, 0.3)',
          boxShadow: '0 20px 50px rgba(6, 182, 212, 0.1)',
        }}
      >
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-2xl mb-4">
            <span className="text-3xl">⚡</span> TaskMgmt
          </div>
          <h2 className="text-base font-semibold text-slate-300">Sign in to continue</h2>
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
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800/80 text-slate-100 placeholder-slate-600 text-sm transition-all"
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
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800/80 text-slate-100 placeholder-slate-600 text-sm transition-all"
              required
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/30">
              {errorMsg}
            </div>
          )}

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-slate-600/50 bg-slate-800/50 checked:bg-cyan-500 checked:border-cyan-500 focus:ring-cyan-500/50 cursor-pointer"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-slate-400 cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-semibold py-2.5 rounded-lg transition-all mt-6 ${
              isLoading
                ? "bg-cyan-600/50 cursor-not-allowed opacity-70"
                : "bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/30"></div>
          </div>
          <span className="relative bg-slate-950 px-2 text-xs text-slate-500">Or continue with</span>
        </div>

        {/* Social Buttons */}
        <div className="space-y-2">
          <SocialButton icon={<span className="text-lg">G</span>} text="Google" />
          <SocialButton icon={<span className="text-lg">⊞</span>} text="Microsoft" />
        </div>

        {/* Footer Links */}
        <div className="border-t border-slate-700/30 mt-6 pt-4 text-center text-sm text-slate-400 space-x-1">
          <Link to="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Forgot password?
          </Link>
          <span>•</span>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Sign up
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center relative z-10">
        <div className="text-slate-600 font-semibold text-sm">
          <span className="tracking-tighter">TaskMgmt © 2025</span>
        </div>
      </footer>
    </div>
  );
}
