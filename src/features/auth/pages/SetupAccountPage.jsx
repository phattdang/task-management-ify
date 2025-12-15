import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SetupAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "phatdang19032004@gmail.com";

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      alert("Mật khẩu phải dài ít nhất 8 ký tự!");
      return;
    }
    // Logic: Gọi API tạo tài khoản hoàn tất
    console.log("Setup Account:", { email, fullName, password });

    // Sau khi tạo tài khoản xong -> Chuyển sang bước Tạo Site
    navigate("/create-site", { state: { email, fullName } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F9FAFB] pt-12 pb-12 font-sans text-[#172B4D]">
      {/* Container */}
      <div className="w-full max-w-[400px] px-8 py-10 bg-white shadow-lg rounded-sm sm:border sm:border-gray-200">
        {/* Logo */}
        <div className="flex justify-center mb-6 text-[#0052CC]">
          <span className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#253858]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.6 19.48l5.37 5.37a.89.89 0 001.27 0l4.57-4.57a.89.89 0 000-1.27l-5.37-5.37a.89.89 0 00-1.27 0l-4.57 4.57a.89.89 0 000 1.27zM6.3 13.18l5.37 5.37a.89.89 0 001.27 0l4.57-4.57a.89.89 0 000-1.27L12.14 7.34a.89.89 0 00-1.27 0L6.3 11.91a.89.89 0 000 1.27z" />
            </svg>
            ATLASSIAN
          </span>
        </div>

        {/* Header Success */}
        <div className="text-center mb-6">
          <h2 className="text-base font-bold text-[#172B4D] flex items-center justify-center gap-2">
            Đã xác minh địa chỉ email
            <span className="text-green-600">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </span>
          </h2>
          <p className="text-xs text-[#5E6C84] mt-1 font-semibold">
            Finish setting up your account
          </p>
        </div>

        {/* Email Read-only */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-[#5E6C84] mb-1">
            Địa chỉ email
          </label>
          <div className="text-sm font-bold text-[#172B4D]">{email}</div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-[#5E6C84] mb-1">
              Họ tên
            </label>
            <input
              type="text"
              placeholder="Nhập họ tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-[3px] focus:border-blue-500 focus:outline-none transition-colors text-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="block text-xs font-bold text-[#5E6C84] mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Tạo mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-[3px] focus:border-blue-500 focus:outline-none transition-colors text-sm pr-10"
                required
              />
              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-[#5E6C84] mb-6">
            Mật khẩu phải dài ít nhất 8 ký tự
          </p>

          {/* Terms */}
          <p className="text-xs text-[#5E6C84] mb-6 leading-relaxed">
            Bằng việc đăng ký, tôi chấp nhận{" "}
            <a href="#" className="text-[#0052CC] hover:underline">
              Điều khoản dịch vụ của Atlassian Cloud
            </a>{" "}
            và công nhận{" "}
            <a href="#" className="text-[#0052CC] hover:underline">
              Chính sách quyền riêng tư
            </a>
            .
          </p>

          <button
            type="submit"
            className="w-full bg-[#0052CC] hover:bg-blue-700 text-white font-bold py-2 rounded-[3px] transition-colors mb-4"
          >
            Tiếp tục
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 font-bold text-sm mb-2">
            <span>▲ ATLASSIAN</span>
          </div>
          <p className="text-[10px] text-gray-500 px-4">
            Một tài khoản cho Jira, Confluence, Trello và{" "}
            <a href="#" className="text-blue-600">
              sản phẩm khác
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
