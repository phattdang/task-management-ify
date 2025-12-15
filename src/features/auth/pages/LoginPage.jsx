import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Component nút Social (đỡ phải viết lại nhiều lần)
const SocialButton = ({ icon, text }) => (
  <button className="w-full mb-3 flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors shadow-sm bg-white">
    <span className="font-bold text-lg">{icon}</span>
    <span className="text-sm font-bold text-[#42526E]">{text}</span>
  </button>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic: Gọi API login, nếu thành công thì vào trang Tasks
    console.log("Login with:", email);
    // Giả lập login thành công
    navigate("/tasks");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F9FAFB] pt-12 pb-12 font-sans text-[#172B4D]">
      {/* Container chính */}
      <div className="w-full max-w-[400px] px-4 bg-white shadow-lg rounded-sm sm:border sm:border-gray-200 py-10 px-8">
        {/* Logo Atlassian */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 text-[#0052CC] mb-4">
            {/* Logo SVG giả lập */}
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
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border-2 border-blue-500 rounded-[3px] focus:outline-none focus:ring-0 placeholder-gray-500 text-sm"
              autoFocus
            />
            {/* Nếu input rỗng thì có thể hiện validation message ở đây */}
          </div>

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
              <span
                className="text-gray-400 text-xs cursor-help"
                title="Thông tin thêm"
              >
                ⓘ
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0052CC] hover:bg-blue-700 text-white font-bold py-2 rounded-[3px] transition-colors mb-6"
          >
            Tiếp tục
          </button>
        </form>

        <div className="text-center text-xs text-[#5E6C84] mb-4">
          Hoặc đăng nhập bằng:
        </div>

        {/* Social Buttons Stack */}
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

      {/* Footer Bottom */}
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
          <br />
          <a href="#" className="text-blue-600 hover:underline">
            Chính sách quyền riêng tư
          </a>{" "}
          •{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Lưu ý dành cho người dùng
          </a>
          <br />
          Trang này được bảo vệ bởi reCAPTCHA và tuân theo{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Chính sách quyền riêng tư
          </a>{" "}
          và{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Điều khoản dịch vụ
          </a>{" "}
          của Google.
        </p>
      </footer>
    </div>
  );
}
