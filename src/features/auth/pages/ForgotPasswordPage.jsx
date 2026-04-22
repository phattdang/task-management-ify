import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await authApi.forgotPassword({ email: email.trim() });
      if (res.data?.code === 200) {
        navigate("/verify-forgot-password-otp", {
          state: { email: email.trim() },
        });
      } else {
        setErrorMsg("Không thể gửi mã OTP. Vui lòng thử lại.");
      }
    } catch (error) {
      const backendCode = error.response?.data?.code;
      if (backendCode === 1003) {
        setErrorMsg("Email không tồn tại trong hệ thống.");
      } else if (backendCode === 1015) {
        setErrorMsg("Bạn đã gửi OTP quá nhiều lần. Vui lòng đợi 1 phút.");
      } else {
        setErrorMsg(
          error.response?.data?.message || "Không thể kết nối đến server."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 pt-12 pb-12 font-sans relative overflow-hidden transition-colors duration-200">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 dark:bg-cyan-500/10 blur-3xl rounded-full opacity-40 dark:opacity-30 animate-softGlow"></div>

      <div className="w-full max-w-[420px] px-6 py-10 rounded-2xl border border-slate-200 dark:border-slate-700/50 relative z-10 bg-white/90 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl dark:shadow-[0_20px_50px_rgba(6,182,212,0.1)]">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-bold text-2xl mb-4">
            <img
              src="https://res.cloudinary.com/dkrrib3mb/image/upload/v1775490962/logo_remove_background_fl6k7i.png"
              alt="Unemployed Team Logo"
              className="w-10 h-10 object-contain"
            />
            Unemployed Team
          </div>
          <h2 className="text-base font-semibold text-slate-600 dark:text-slate-300">
            Quen mat khau
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
            Nhap email de nhan ma OTP dat lai mat khau.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {errorMsg && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/30">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-semibold py-2.5 rounded-lg transition-all mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50 ${
              isLoading
                ? "bg-blue-400/70 dark:bg-cyan-600/50 cursor-not-allowed opacity-70"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 shadow-md dark:shadow-cyan-500/25"
            }`}
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <div className="border-t border-slate-200 dark:border-slate-700/40 mt-6 pt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <Link
            to="/login"
            className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
