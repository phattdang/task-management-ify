import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate(); // Hook điều hướng
  const location = useLocation();
  const initialEmail = location.state?.email || "adef17540@gmail.com";

  const [fullName, setFullName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Chuyển hướng sang trang Create Site, mang theo dữ liệu cũ
    navigate("/create-site", {
      state: {
        email: initialEmail,
        fullName: fullName,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans relative overflow-hidden transition-colors duration-200">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/10 dark:bg-cyan-500/10 blur-3xl rounded-full opacity-40 dark:opacity-30 animate-softGlow"></div>

      <div className="w-full max-w-[420px] px-6 relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6 text-blue-600 dark:text-cyan-400 font-bold text-3xl">
            <span className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
              T
            </span>
            <span>TaskMgmt</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Create Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Join us and manage tasks better
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl dark:shadow-[0_20px_50px_rgba(6,182,212,0.1)]"
        >
          {/* Email Section (Read only) */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-500 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="font-semibold text-base text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
              {initialEmail}
            </div>
          </div>

          {/* Full Name Input */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-500 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-all"
              autoFocus
            />
          </div>

          {/* Terms */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            By creating an account, you agree to our{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and acknowledge our{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 mb-6 shadow-md dark:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50"
          >
            Continue
          </button>

          {/* Footer Link */}
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
