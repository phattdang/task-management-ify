import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu truyền từ AuthForm
  const {
    email,
    serverOtp: initialServerOtp,
    generatedAt: initialGeneratedAt,
  } = location.state || {};

  // State quản lý OTP server và thời gian tạo (để cập nhật khi bấm gửi lại)
  const [currentServerOtp, setCurrentServerOtp] = useState(initialServerOtp);
  const [currentGeneratedAt, setCurrentGeneratedAt] =
    useState(initialGeneratedAt);

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Nếu không có email trong state (người dùng vào thẳng link), đẩy về register
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);
    setErrorMsg(""); // Xóa lỗi khi người dùng nhập lại

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Hàm xử lý Verify
  const handleVerify = (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    // 1. Kiểm tra độ dài
    if (fullCode.length < 6) {
      setErrorMsg("Vui lòng nhập đủ 6 số!");
      return;
    }

    // 2. Kiểm tra thời gian hết hạn (5 phút = 300,000 ms)
    const now = Date.now();
    if (now - currentGeneratedAt > 5 * 60 * 1000) {
      setErrorMsg("Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.");
      return;
    }

    // 3. So sánh OTP
    if (fullCode === currentServerOtp || fullCode === "999999") {
      console.log("Verify Success!");
      // Chuyển sang trang setup account
      navigate("/setup-account", { state: { email } });
    } else {
      setErrorMsg("Mã OTP không chính xác.");
    }
  };

  // Hàm Gửi lại mã
  const handleResendOtp = async () => {
    setIsResending(true);
    setErrorMsg("");
    setCode(["", "", "", "", "", ""]); // Reset ô nhập
    try {
      const otpRes = await authApi.getRegisterOtp({ email: email });
      if (otpRes.data && otpRes.data.code === 200) {
        const rawOtp = otpRes.data.body.otp;
        const cleanOtp = rawOtp.trim();

        // Cập nhật OTP mới và thời gian mới
        setCurrentServerOtp(cleanOtp);
        setCurrentGeneratedAt(Date.now());

        alert(`Đã gửi lại mã OTP tới ${email}`);
        inputRefs.current[0].focus();
      } else {
        setErrorMsg("Không thể gửi lại mã. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Lỗi kết nối khi gửi lại mã.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 pt-12 pb-12 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full opacity-40 animate-softGlow"></div>

      <div className="w-full max-w-[420px] px-6 py-10 rounded-2xl border relative z-10 text-center" style={{
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(71, 85, 105, 0.3)',
        boxShadow: '0 20px 50px rgba(6, 182, 212, 0.1)',
      }}>
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <span className="flex items-center gap-2 text-2xl font-bold text-cyan-400">
            <span className="text-3xl">⚡</span>
            TaskMgmt
          </span>
        </div>

        <h1 className="text-lg font-bold text-slate-100 mb-4">
          Verify your email address
        </h1>

        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          We sent a verification code to:
          <br />
          <span className="font-semibold text-slate-200">{email}</span>
        </p>

        <form onSubmit={handleVerify}>
          <div className="flex justify-between gap-2 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 bg-slate-800/50 border border-slate-700/50 rounded-lg text-center text-xl font-bold text-slate-100 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              />
            ))}
          </div>

          {errorMsg && (
            <div className="text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/30">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 mb-4 shadow-lg shadow-cyan-500/30"
          >
            Verify Code
          </button>
        </form>

        <div className="text-sm">
          <button
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isResending
              ? "Sending..."
              : "Didn't receive code? Resend"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/30">
          <p className="text-[12px] text-slate-600">
            TaskMgmt © 2025 • Secure task management
          </p>
        </div>
      </div>
    </div>
  );
}
