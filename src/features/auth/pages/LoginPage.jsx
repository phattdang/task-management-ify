import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import authApi from "../api/authApi";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import introVideo from "../../../assets/background-intro.webm";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

const SocialButton = ({ icon, text, onClick, disabled, title, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-white/40 dark:border-slate-700 rounded-full transition-all text-sm font-semibold shadow-sm hover:shadow-md ${
      disabled
        ? "opacity-50 cursor-not-allowed bg-white/30 dark:bg-slate-800/40 text-slate-500"
        : "bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
    } ${className}`}
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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Video Background */}
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
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/25 dark:bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950"></div>
        {/* Decorative glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-cyan-500/10 blur-[100px] rounded-full mix-blend-screen opacity-60"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[420px] px-8 py-10 rounded-[2rem] border border-white/50 dark:border-slate-700/50 relative z-10 animate-slideUp bg-white/30 dark:bg-slate-900/40 backdrop-blur-md shadow-2xl">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-slate-900 dark:text-cyan-400 font-bold text-2xl mb-4 drop-shadow-md">
            <img 
              src="https://res.cloudinary.com/dkrrib3mb/image/upload/v1775490962/logo_remove_background_fl6k7i.png" 
              alt="Unemployed Team Logo" 
              className="w-10 h-10 object-contain drop-shadow-md" 
            /> Unemployed Team
          </div>
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300 drop-shadow-sm">
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
              className="w-full px-5 py-3.5 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 text-sm transition-all shadow-sm"
              required
              autoFocus
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 pr-12 bg-white/60 dark:bg-slate-900/50 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 text-sm transition-all shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              {showPassword ? (
                <EyeOpenIcon className="w-5 h-5" />
              ) : (
                <EyeClosedIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/30">
              {errorMsg}
            </div>
          )}
          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-semibold py-3.5 rounded-full transition-all mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg ${
              isLoading
                ? "bg-blue-400/70 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-slate-300 dark:border-slate-700/60"></div>
          <span className="px-3 text-xs text-slate-500 dark:text-slate-400 font-medium">Or continue with</span>
          <div className="flex-grow border-t border-slate-300 dark:border-slate-700/60"></div>
        </div>

        {/* Social Buttons */}
        <div className="space-y-2">
          <SocialButton
            icon={<span className="text-lg">G</span>}
            text="Continue with Google"
            onClick={handleGoogleLogin}
          />
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20 text-sm">
          <Link
            to="/forgot-password"
            className="text-white/80 hover:text-white font-medium transition-all hover:underline underline-offset-4"
          >
            Forgot password?
          </Link>
          <div className="text-white/70">
            New here?{" "}
            <Link
              to="/"
              className="text-white hover:text-cyan-400 font-bold transition-all underline decoration-white/30 hover:decoration-cyan-400 underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center relative z-10">
        <div className="text-white/50 font-semibold text-sm">
          <span className="tracking-tighter">PirA © 2026</span>
        </div>
      </footer>
    </div>
  );
}
