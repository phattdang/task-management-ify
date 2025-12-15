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
    <div className="min-h-screen flex items-center justify-center bg-white font-sans text-[#172B4D]">
      <div className="w-full max-w-[480px] px-6 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6 text-blue-600 font-bold text-3xl">
          <span className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xl">
            J
          </span>
          <span className="text-[#172B4D]">Jira</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 flex justify-center items-center gap-2">
          Create a site
          <span
            className="text-yellow-500 text-4xl leading-none"
            style={{ marginTop: "-10px" }}
          >
            ˊ
          </span>
        </h1>

        <p className="text-gray-600 mb-8 text-sm">
          Sites are the shared space where people organize teams, work, and
          projects.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="text-left">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Your site
          </label>

          {/* Input Group đặc biệt */}
          <div className="relative flex items-center mb-2">
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full pl-4 pr-32 py-3 border-2 border-green-500 rounded-[3px] focus:outline-none text-[#172B4D] font-medium"
              autoFocus
            />
            {/* Đuôi cố định .atlassian.net */}
            <span className="absolute right-10 text-gray-500 pointer-events-none">
              .atlassian.net
            </span>
            {/* Icon check xanh */}
            <div className="absolute right-3 w-5 h-5 rounded-full border border-green-500 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-green-500 font-bold"
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

          <p className="text-xs text-gray-500 mb-8">
            This site name is just a suggestion. Feel free to change to
            something your team will recognize.
          </p>

          <button
            type="submit"
            className="w-full bg-[#0052CC] hover:bg-blue-800 text-white font-bold py-3 rounded-[3px] transition-colors shadow-sm"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
