import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import authApi from "../api/authApi";

export const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const [isProcessingGoogle, setIsProcessingGoogle] = useState(false);

  const loginWithGoogle = async (code) => {
    setIsProcessingGoogle(true);
    try {
      console.log("Đang xử lý Google Code:", code);
      const res = await authApi.loginGoogle(code);
      const data = res.data || res;

      if (data.code === 200) {
        console.log("Login Google thành công:", data);
        const { accessToken, refreshToken, isExisted } = data.body;

        // Lưu vào Local Storage theo cấu trúc dự án
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        // Fetch User Info
        let userInfo = null;
        try {
          const userRes = await authApi.getInformation();
          if (userRes.data && userRes.data.code === 200) {
            userInfo = userRes.data.body;
            localStorage.setItem("user_info", JSON.stringify(userInfo));
          }
        } catch (infoError) {
          console.error("Failed to fetch user info:", infoError);
        }

        // Lưu vào Redux
        dispatch(setAuth(userInfo));
        window.dispatchEvent(new Event("storage"));
        
        return { success: true, isExisted };
      } else {
        return {
          success: false, 
          message: data.message || "Đăng nhập Google thất bại"
        };
      }
    } catch (err) {
      console.error("Lỗi kết nối Google Login:", err);
      const errorMsg = err.response?.data?.message || "Có lỗi xảy ra khi kết nối tới server.";
      return { success: false, message: errorMsg };
    } finally {
      setIsProcessingGoogle(false);
    }
  };

  return { loginWithGoogle, isProcessingGoogle };
};
