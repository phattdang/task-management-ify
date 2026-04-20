import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/authSlice";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Nếu chưa đăng nhập (không có token trong store Redux) -> Chuyển về Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu token hết hạn, middleware Axios (axiosClient) sẽ tự động handle refresh token, 
  // và đẩy về /login nếu refresh thất bại. Nên ta không cần introspect thủ công nữa.

  return children;
}
