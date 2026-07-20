import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setAuth } from "../../../store/authSlice";
import authApi from "../api/authApi";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

const SocialButton = ({ icon, text, onClick, delay }) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 + delay, duration: 0.5 }}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-400 dark:hover:border-slate-600 transition-all bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-semibold text-sm"
  >
    <span className="text-lg">{icon}</span>
    <span>{text}</span>
  </motion.button>
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 pt-12 pb-12 font-sans relative overflow-hidden transition-colors duration-200">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      ></motion.div>
      <motion.div 
        className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 dark:bg-cyan-500/10 blur-3xl rounded-full opacity-40 dark:opacity-30"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>

      {/* Login Card */}
      <motion.div 
        className="w-full max-w-[420px] px-6 py-10 rounded-2xl border border-slate-200 dark:border-slate-700/50 relative z-10 bg-white/90 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl dark:shadow-[0_20px_50px_rgba(6,182,212,0.1)]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo & Title */}
        <motion.div 
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-bold text-2xl mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <motion.img 
              src="https://res.cloudinary.com/dkrrib3mb/image/upload/v1775490962/logo_remove_background_fl6k7i.png" 
              alt="Unemployed Team Logo" 
              className="w-10 h-10 object-contain" 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            /> 
            Unemployed Team
          </motion.div>
          <motion.h2 
            className="text-base font-semibold text-slate-600 dark:text-slate-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Sign in to continue
          </motion.h2>
        </motion.div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <motion.input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
              className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-all"
              required
              autoFocus
            />
          </motion.div>

          {/* Password Input */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
              className="w-full px-4 py-2 pr-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-all"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              {showPassword ? (
                <EyeOpenIcon className="w-5 h-5" />
              ) : (
                <EyeClosedIcon className="w-5 h-5" />
              )}
            </motion.button>
          </motion.div>

          {/* Error Message */}
          {errorMsg && (
            <motion.div 
              className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {errorMsg}
            </motion.div>
          )}
          {/* Sign In Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className={`w-full text-white font-semibold py-2.5 rounded-lg transition-all mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50 ${
              isLoading
                ? "bg-blue-400/70 dark:bg-cyan-600/50 cursor-not-allowed opacity-70"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 shadow-md dark:shadow-cyan-500/25"
            }`}
          >
            {isLoading ? (
              <motion.span 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                ⟳ Signing in...
              </motion.span>
            ) : (
              "Sign in"
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <motion.div 
          className="relative my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700/40"></div>
          </div>
          <span className="relative bg-white dark:bg-slate-900 px-2 text-xs text-slate-500 dark:text-slate-500">
            Or continue with
          </span>
        </motion.div>

        {/* Social Buttons */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <SocialButton
            icon={<span className="text-lg">G</span>}
            text="Google"
            onClick={handleGoogleLogin}
            delay={0}
          />
          <SocialButton
            icon={<span className="text-lg">⊞</span>}
            text="Microsoft"
            delay={0.05}
          />
        </motion.div>

        {/* Footer Links */}
        <motion.div 
          className="border-t border-slate-200 dark:border-slate-700/40 mt-6 pt-4 text-center text-sm text-slate-600 dark:text-slate-400 space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            to="/forgot-password"
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
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        className="mt-12 text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="text-slate-500 dark:text-slate-600 font-semibold text-sm">
          <span className="tracking-tighter">TaskMgmt © 2026</span>
        </div>
      </motion.footer>
    </div>
  );
}
