import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";

export default function AuthForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignUpClick = async () => {
    // Validate cơ bản
    if (!email) {
      setErrorMsg("Vui lòng nhập email");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      // BƯỚC 1: Kiểm tra email đã tồn tại chưa
      // Request: { "credential": "..." }
      const checkRes = await authApi.checkEmailExisted({ credential: email });

      // Backend trả về: body.isExisted
      if (checkRes.data && checkRes.data.body && checkRes.data.body.isExisted) {
        setErrorMsg("Email này đã được đăng ký. Vui lòng đăng nhập.");
        setIsLoading(false);
        return;
      }

      // BƯỚC 2: Nếu chưa tồn tại -> Gửi OTP
      // Request: { "email": "..." }
      const otpRes = await authApi.getRegisterOtp({ email: email });

      if (otpRes.data && otpRes.data.code === 200) {
        // Lấy OTP từ response: { "otp": " 15252", ... }
        const rawOtp = otpRes.data.body.otp;
        // Trim() vì ví dụ bạn đưa otp có khoảng trắng ở đầu " 15252"
        const cleanOtp = rawOtp.trim();

        // BƯỚC 3: Chuyển trang và mang theo OTP + Thời gian tạo để kiểm tra
        navigate("/verify-email", {
          state: {
            email: email,
            serverOtp: cleanOtp,
            generatedAt: Date.now(), // Lưu thời gian hiện tại
          },
        });
      } else {
        setErrorMsg("Không thể gửi mã OTP. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setErrorMsg("Đã có lỗi xảy ra. Vui lòng kiểm tra kết nối.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="max-w-md w-full">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
        Connect every team, task, and project together with Jira
      </h1>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 uppercase">
            Work email
          </label>
          <input
            type="email"
            placeholder="you@company.com"
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

        <p className="text-xs text-gray-500">
          Using a work email helps find teammates and boost collaboration.
        </p>

        <button
          onClick={handleSignUpClick}
          disabled={isLoading}
          className={`w-full text-white font-bold py-3 rounded transition-colors shadow-md ${
            isLoading
              ? "bg-blue-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Checking..." : "Sign up"}
        </button>
      </div>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <span className="relative bg-transparent px-2 text-sm text-gray-500 bg-gradient-to-br from-[#DEEBFF] to-[#E6FCFF]">
          Or continue with
        </span>
      </div>

      <div className="flex gap-4 mb-8">
        <button className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded font-bold text-gray-600 shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 text-sm transition-colors">
          <span className="text-lg">G</span> Google
        </button>
        <button className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded font-bold text-gray-600 shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2 text-sm transition-colors">
          <span className="text-lg">⊞</span> Microsoft
        </button>
      </div>

      <div className="flex items-center justify-between opacity-60 grayscale mt-8">
        <span className="font-bold text-lg italic font-serif">Ford</span>
        <span className="font-bold text-lg">PayPal</span>
        <span className="font-bold text-lg tracking-widest">NASA</span>
        <span className="font-bold text-xl">🎲</span>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <p
          className="text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={handleLoginClick}
        >
          Trying to access Jira? Log in
        </p>
      </div>
    </div>
  );
}
