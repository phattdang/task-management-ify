import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import authApi from "../../features/auth/api/authApi";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: đang check, true: ok, false: chặn

  useEffect(() => {
    const verifyToken = async () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      // 1. Nếu không có access token thì cho về login luôn
      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // 2. Gọi Introspect để kiểm tra token hiện tại
        // Payload introspect thường là { token: "..." }
        await authApi.introspect({ token: accessToken });

        // Nếu API trả về 200 OK -> Token còn sống
        setIsAuthenticated(true);
      } catch (error) {
        // 3. Nếu Introspect lỗi (thường là 401 do hết hạn) -> Thử Refresh
        console.log("Error: ", error);
        console.log("Token expired or invalid, trying to refresh...");

        if (!refreshToken) {
          handleLogout();
          return;
        }

        try {
          // Gọi API refresh
          // Lưu ý: authApi.refresh của bạn đã tự wrap { token } rồi, nên chỉ truyền string
          const res = await authApi.refresh(refreshToken);
          const data = res.data; // Axios response wrapper

          // Kiểm tra response chuẩn từ backend
          if (data.code === 200 && data.body) {
            // 4. Refresh thành công -> Lưu token mới
            localStorage.setItem("access_token", data.body.accessToken);
            localStorage.setItem("refresh_token", data.body.refreshToken);

            // Cho phép vào trang
            setIsAuthenticated(true);
          } else {
            // Backend trả về 200 nhưng code logic lỗi
            throw new Error("Refresh failed");
          }
        } catch (refreshError) {
          // 5. Refresh cũng thất bại (token hết hạn hẳn hoặc bị thu hồi)
          console.error("Refresh failed:", refreshError);
          handleLogout();
        }
      }
    };

    verifyToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  };

  // UI RENDERING

  // 1. Trạng thái đang kiểm tra (Loading)
  // Bạn có thể thay bằng một Loading Spinner đẹp hơn
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-gray-500 font-medium">Đang xác thực...</div>
      </div>
    );
  }

  // 2. Nếu thất bại -> Chuyển về Login
  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  // 3. Nếu thành công -> Render nội dung trang (Children)
  return children;
}
