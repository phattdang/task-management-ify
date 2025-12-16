import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Import authApi từ đường dẫn thực tế trong dự án của bạn
import authApi from "../api/authApi";

const SocialButton = ({ icon, text }) => (
  <button
    type="button"
    className="w-full mb-3 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors shadow-sm bg-white"
  >
    <span className="font-bold text-lg">{icon}</span>
    <span className="text-sm font-bold text-[#42526E]">{text}</span>
  </button>
);

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // 1. Gọi API qua authApi
      // Map 'email' state thành 'identifier' theo yêu cầu backend
      const res = await authApi.login({
        identifier: email,
        password: password,
      });

      // Axios trả về object response đầy đủ, data của backend nằm trong res.data
      const backendResponse = res.data;

      // 2. Kiểm tra code business logic (200)
      if (backendResponse.code === 200 && backendResponse.body) {
        const { accessToken, refreshToken } = backendResponse.body;

        // 3. Lưu token vào localStorage
        // LƯU Ý QUAN TRỌNG: axiosClient.js của bạn đang get key là "access_token"
        // nên ở đây phải setItem đúng key đó.
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        console.log("Login success:", backendResponse.message);

        // 4. Chuyển hướng
        navigate("/tasks");
      } else {
        // Trường hợp backend trả về 200 HTTP nhưng code nội bộ báo lỗi (nếu có logic đó)
        setErrorMsg(backendResponse.message || "Đăng nhập thất bại.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      // Xử lý lỗi từ Axios (ví dụ 400, 401, 500)
      if (error.response && error.response.data) {
        // Lấy message lỗi từ backend trả về (nếu có)
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
    <div className="min-h-screen flex flex-col items-center bg-[#F9FAFB] pt-12 pb-12 font-sans text-[#172B4D]">
      <div className="w-full max-w-[400px] px-4 bg-white shadow-lg rounded-sm sm:border sm:border-gray-200 py-10 px-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 text-[#0052CC] mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.6 19.48l5.37 5.37a.89.89 0 001.27 0l4.57-4.57a.89.89 0 000-1.27l-5.37-5.37a.89.89 0 00-1.27 0l-4.57 4.57a.89.89 0 000 1.27zM6.3 13.18l5.37 5.37a.89.89 0 001.27 0l4.57-4.57a.89.89 0 000-1.27L12.14 7.34a.89.89 0 00-1.27 0L6.3 11.91a.89.89 0 000 1.27z" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-[#253858]">
              ATLASSIAN
            </span>
          </div>
          <h2 className="text-base font-bold text-[#5E6C84]">
            Đăng nhập để tiếp tục
          </h2>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email" // Để type email để browser hỗ trợ validate cơ bản
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 focus:border-blue-500 rounded-[3px] focus:outline-none transition-colors placeholder-gray-500 text-sm"
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 focus:border-blue-500 rounded-[3px] focus:outline-none transition-colors placeholder-gray-500 text-sm"
              required
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm text-[#5E6C84] flex items-center gap-1"
            >
              Nhớ thông tin đăng nhập của tôi
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-2 rounded-[3px] transition-colors mb-6 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-[#0052CC] hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div className="text-center text-xs text-[#5E6C84] mb-4">
          Hoặc đăng nhập bằng:
        </div>

        <div>
          <SocialButton icon="🔑" text="Passkey" />
        </div>

        <div className="text-center text-xs text-[#5E6C84] mb-3 mt-4">
          Hoặc tiếp tục với:
        </div>

        <div>
          <SocialButton
            icon={<span className="text-red-500">G</span>}
            text="Google"
          />
          <SocialButton
            icon={<span className="text-blue-500">⊞</span>}
            text="Microsoft"
          />
          <SocialButton icon="🍎" text="Apple" />
          <SocialButton
            icon={<span className="text-purple-600">#</span>}
            text="Slack"
          />
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4 text-center space-x-1">
          <Link to="#" className="text-[#0052CC] text-sm hover:underline">
            Bạn không đăng nhập được?
          </Link>
          <span className="text-gray-400">•</span>
          <Link
            to="/register"
            className="text-[#0052CC] text-sm hover:underline"
          >
            Tạo tài khoản
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2 text-gray-400 font-bold text-lg">
          <span className="tracking-tighter">▲ ATLASSIAN</span>
        </div>
        <p className="text-[10px] text-gray-500 max-w-lg mx-auto leading-normal px-4">
          Một tài khoản cho Jira, Confluence, Trello và{" "}
          <a href="#" className="text-blue-600 hover:underline">
            sản phẩm khác
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
