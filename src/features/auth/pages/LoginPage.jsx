import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setAuth } from "../../../store/authSlice";
import authApi from "../api/authApi";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import AuthLayout from "../components/AuthLayout";
import AuthFormCard from "../components/AuthFormCard";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

const FormInput = ({ label, type = "text", placeholder, value, onChange, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 + delay, duration: 0.5 }}
    className="relative"
  >
    {label && (
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          <Icon size={18} />
        </div>
      )}
      <motion.input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        whileFocus={{
          scale: 1.01,
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
        }}
        className={`w-full px-4 py-2.5 ${Icon ? "pl-10" : ""} bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600/50 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-all`}
        required
      />
    </div>
  </motion.div>
);

const SocialButton = ({ icon, text, onClick, delay }) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.55 + delay, duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-slate-300 dark:border-slate-600/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-slate-400 dark:hover:border-slate-500 transition-all bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium text-sm"
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
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email,
        password,
      });

      if (response.data?.data?.token) {
        localStorage.setItem("access_token", response.data.data.token);
        dispatch(
          setAuth({
            user: response.data.data.user || {},
            isAuthenticated: true,
          })
        );
        navigate("/projects");
      } else {
        setErrorMsg("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg("Email hoặc mật khẩu không chính xác");
      } else if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Lỗi đăng nhập. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to access your tasks">
      <AuthFormCard onSubmit={handleLogin} submitText={isLoading ? "Signing in..." : "Sign in"}>
        {/* Email Input */}
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          delay={0}
        />

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <motion.input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              whileFocus={{
                scale: 1.01,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
              }}
              className="w-full px-4 py-2.5 pr-10 bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600/50 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-all"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <EyeOpenIcon className="w-5 h-5" />
              ) : (
                <EyeClosedIcon className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Error Message */}
        {errorMsg && (
          <motion.div
            className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {errorMsg}
          </motion.div>
        )}

        {/* Forgot Password Link */}
        <motion.div
          className="text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="relative my-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700/30"></div>
          </div>
          <span className="relative bg-white dark:bg-slate-900/70 px-2 text-xs text-slate-500 dark:text-slate-500">
            Or continue with
          </span>
        </motion.div>

        {/* Social Buttons */}
        <div className="space-y-2">
          <SocialButton icon="G" text="Google" onClick={handleGoogleLogin} delay={0} />
          <SocialButton icon="⊞" text="Microsoft" delay={0.05} />
        </div>

        {/* Sign up link */}
        <motion.p
          className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-semibold transition-colors"
          >
            Sign up
          </Link>
        </motion.p>
      </AuthFormCard>
    </AuthLayout>
  );
}
