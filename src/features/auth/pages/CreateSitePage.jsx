import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CreateSitePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu từ các bước trước (để sau này gọi API register 1 lần)
  const previousData = location.state || {};

  // Tự động tạo tên site gợi ý dựa trên email hoặc tên (giả lập logic Jira)
  const [siteName, setSiteName] = useState(
    previousData.email
      ? previousData.email.split("@")[0] +
          "-" +
          Math.floor(Math.random() * 1000)
      : "adef17540"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic: Gọi API tạo site hoặc hoàn tất đăng ký
    console.log("Final Registration Data:", {
      ...previousData,
      siteUrl: `${siteName}.atlassian.net`,
    });

    // Thay vì navigate("/tasks"), giờ ta chuyển sang bước tiếp theo
    navigate("/create-project", {
      state: {
        ...previousData,
        siteUrl: `${siteName}.atlassian.net`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="w-full max-w-[480px] px-6 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6 text-blue-600 dark:text-cyan-400 font-bold text-3xl">
          <span className="w-8 h-8 bg-blue-600 dark:bg-cyan-500 rounded flex items-center justify-center text-white text-xl">
            J
          </span>
          <span className="text-slate-900 dark:text-slate-100">Jira</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 flex justify-center items-center gap-2 text-slate-900 dark:text-slate-100">
          Create a site
          <span
            className="text-amber-500 dark:text-amber-400 text-4xl leading-none"
            style={{ marginTop: "-10px" }}
          >
            ˊ
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm">
          Sites are the shared space where people organize teams, work, and
          projects.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="text-left">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Your site
          </label>

          {/* Input Group đặc biệt */}
          <div className="relative flex items-center mb-2">
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full pl-4 pr-32 py-3 border-2 border-emerald-500 dark:border-emerald-500/70 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium"
              autoFocus
            />
            {/* Đuôi cố định .atlassian.net */}
            <span className="absolute right-10 text-slate-500 dark:text-slate-400 pointer-events-none text-sm">
              .atlassian.net
            </span>
            {/* Icon check xanh */}
            <div className="absolute right-3 w-5 h-5 rounded-full border border-emerald-500 dark:border-emerald-400 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-emerald-600 dark:text-emerald-400 font-bold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-500 mb-8">
            This site name is just a suggestion. Feel free to change to
            something your team will recognize.
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white font-bold py-3 rounded-[3px] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
