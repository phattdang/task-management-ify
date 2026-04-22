import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken;
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!resetToken) {
      navigate("/forgot-password");
    }
  }, [resetToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("Mat khau xac nhan khong khop.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({
        resetToken,
        newPassword,
        confirmPassword,
      });

      if (res.data?.code === 200) {
        setSuccessMsg("Doi mat khau thanh cong. Dang chuyen ve trang dang nhap...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setErrorMsg("Khong the doi mat khau. Vui long thu lai.");
      }
    } catch (error) {
      const backendCode = error.response?.data?.code;
      if (backendCode === 1023) {
        setErrorMsg("Mat khau moi va xac nhan mat khau khong khop.");
      } else if (backendCode === 1007) {
        setErrorMsg("Token dat lai mat khau khong hop le hoac da het han.");
      } else if (backendCode === 1003) {
        setErrorMsg("Email khong ton tai.");
      } else {
        setErrorMsg(error.response?.data?.message || "Co loi xay ra.");
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
        <div className="text-center mb-8">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Reset password
          </h2>
          {email && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {email}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              {showNewPassword ? (
                <EyeOpenIcon className="w-5 h-5" />
              ) : (
                <EyeClosedIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 pr-10 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              {showConfirmPassword ? (
                <EyeOpenIcon className="w-5 h-5" />
              ) : (
                <EyeClosedIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-500">
            Password must be at least 8 characters long.
          </p>

          {errorMsg && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/30">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
              {successMsg}
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
            {isLoading ? "Updating..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}
