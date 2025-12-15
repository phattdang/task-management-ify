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
    <div className="min-h-screen flex items-center justify-center bg-white font-sans text-[#172B4D]">
      <div className="w-full max-w-[400px] px-4">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 text-blue-600 font-bold text-3xl">
            <span className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xl">
              J
            </span>
            <span className="text-[#172B4D]">Jira</span>
          </div>
          <h1 className="text-3xl font-bold">Tạo tài khoản</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-md p-8 border border-gray-100"
        >
          {/* Email Section (Read only) */}
          <div className="mb-6">
            <label className="block text-sm text-gray-500 mb-1">
              Địa chỉ email
            </label>
            <div className="font-bold text-base text-[#172B4D]">
              {initialEmail}
            </div>
          </div>

          {/* Full Name Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-500 mb-1">Họ tên</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ tên đầy đủ"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
              autoFocus
            />
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Bằng việc tạo tài khoản, tôi chấp nhận{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Điều khoản dịch vụ Atlassian Cloud
            </a>{" "}
            và công nhận{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Chính sách quyền riêng tư
            </a>
            .
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#0052CC] hover:bg-blue-700 text-white font-bold py-2.5 rounded-[3px] transition-colors mb-6"
          >
            Tiếp tục
          </button>

          {/* Footer Link */}
          <div className="text-center text-sm">
            <span className="text-gray-600">
              Bạn đã có tài khoản Atlassian?{" "}
            </span>
            <Link to="/login" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
