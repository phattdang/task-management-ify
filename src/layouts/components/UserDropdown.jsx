import React from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../features/auth/api/authApi";
// Đảm bảo đường dẫn import đúng tới file api của bạn

export default function UserDropdown({ isOpen, userInfo }) {
  const navigate = useNavigate();

  // Fallback nếu chưa load xong userInfo
  const displayUser = userInfo || {
    fullName: "Đang tải...",
    email: "...",
    avatarColor: "bg-gray-400",
  };

  const handleLogout = async () => {
    try {
      // 1. Lấy token hiện tại
      const accessToken = localStorage.getItem("access_token");

      // 2. Gọi API Logout (nếu có token)
      // Backend yêu cầu body: { "accessToken": "..." }
      if (accessToken) {
        await authApi.logout({ accessToken: accessToken });
      }
    } catch (error) {
      // Nếu API lỗi (ví dụ token hết hạn), ta vẫn tiếp tục logout ở client
      console.error("Logout API failed:", error);
    } finally {
      // 3. Dọn dẹp Local Storage (QUAN TRỌNG: Xóa cả user_info)
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_info"); // Xóa cache thông tin user để tránh hiện sai cho lần đăng nhập sau

      // 4. Chuyển về trang Login
      navigate("/login");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 w-[340px] rounded-xl z-[100] animate-in fade-in zoom-in-95 duration-100 origin-top-right border border-slate-200 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl dark:shadow-[0_20px_50px_rgba(6,182,212,0.12)]">
      {/* Header Info */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 flex items-center justify-center text-white">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {displayUser.fullName}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {displayUser.email}
            </p>
          </div>
        </div>
      </div>

      {/* Menu List 1 */}
      <div className="py-1 border-b border-slate-200 dark:border-slate-700/40">
        <div className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-pointer flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          <span className="text-lg">👤</span> Profile
        </div>
        <div className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-pointer flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
          <span className="text-lg">⚙️</span> Account Settings
        </div>
      </div>

      {/* Menu List 2 */}
      <div className="py-1">
        <div
          onClick={handleLogout}
          className="px-4 py-2 hover:bg-red-500/10 cursor-pointer flex items-center gap-3 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
        >
          <span className="text-lg">🚪</span> Sign out
        </div>
      </div>
    </div>
  );
}
