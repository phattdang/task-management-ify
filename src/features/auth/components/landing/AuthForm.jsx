import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

export default function AuthForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignUpClick = async () => {
    if (!email) {
      setErrorMsg("Vui lòng nhập email");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // CHỈ GỌI 1 API ĐẾN MODULE AUTH
      // API này sẽ tự check trùng, tự lưu Redis và tự ném lệnh cho Kafka
      const res = await authApi.requestRegisterOtp({ email: email });

      if (res.data && res.data.code === 200) {
        // Auth trả về OK, tức là mail hợp lệ và đã ra lệnh gửi OTP
        navigate("/verify-email", {
          state: {
            email: email,
            generatedAt: Date.now(),
          },
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      // Bắt lỗi HTTP 400 từ Backend nếu email đã tồn tại
      if (error.response?.data?.code === 1010) {
        // Giả sử 1010 là mã EMAIL_EXISTED
        setErrorMsg("Email này đã được đăng ký. Vui lòng đăng nhập.");
      } else {
        setErrorMsg("Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleGoogleLogin = () => {
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${REDIRECT_URL}&` +
      `response_type=code&` +
      `scope=openid profile email&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = url;
  };

  return (
    <div className="max-w-lg w-full">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
        Kết nối, chia sẻ công việc, quản lý mọi thứ với Unemployed Team!
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">
            Email
          </label>
          <input
            type="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // Nếu đang loading thì disable input
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm ${
              errorMsg ? "border-red-500" : "border-gray-300"
            }`}
          />
          {/* Hiển thị lỗi nếu có */}
          {errorMsg && (
            <p className="text-red-500 text-sm mt-1 ml-1">{errorMsg}</p>
          )}
        </div>

        <button
          onClick={handleSignUpClick}
          disabled={isLoading}
          className={`w-full text-white font-bold py-3 rounded transition-colors shadow-md ${
            isLoading
              ? "bg-blue-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Đang xác thực tài khoản..." : "Đăng ký"}
        </button>
      </div>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <span className="relative bg-transparent px-2 text-sm text-gray-500 bg-gradient-to-br from-[#DEEBFF] to-[#E6FCFF]">
          Hoặc tiếp tục với
        </span>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleGoogleLogin}
          className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded font-bold text-gray-600 shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 text-sm transition-colors"
        >
          <span className="text-lg">G</span> Google
        </button>
        <button className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded font-bold text-gray-600 shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 text-sm transition-colors">
          <span className="text-lg">⊞</span> Microsoft
        </button>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <p>Nếu bạn đã có tài khoản Unemployed Team? </p>
        <p
          className="text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={handleLoginClick}
        >
          Đăng nhập ngay!
        </p>
      </div>
    </div>
  );
}
