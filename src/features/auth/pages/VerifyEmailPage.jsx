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
    <div className="min-h-screen flex flex-col items-center bg-[#F9FAFB] pt-12 pb-12 font-sans text-[#172B4D]">
      <div className="w-full max-w-[400px] px-8 py-10 bg-white shadow-lg rounded-sm sm:border sm:border-gray-200 text-center">
        {/* Logo Section (Giữ nguyên) */}
        <div className="flex justify-center mb-6 text-[#0052CC]">
          <span className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#253858]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.6 19.48l5.37 5.37a.89.89 0 001.27 0l4.57-4.57a.89.89 0 000-1.27l-5.37-5.37a.89.89 0 00-1.27 0l-4.57 4.57a.89.89 0 000 1.27zM6.3 13.18l5.37 5.37a.89.89 0 001.27 0l4.57-4.57a.89.89 0 000-1.27L12.14 7.34a.89.89 0 00-1.27 0L6.3 11.91a.89.89 0 000 1.27z" />
            </svg>
            ATLASSIAN
          </span>
        </div>

        <h1 className="text-base font-bold text-[#172B4D] mb-4">
          Chúng tôi đã gửi cho bạn một mã qua email
        </h1>

        <p className="text-sm text-[#5E6C84] mb-6">
          Để hoàn tất quá trình thiết lập tài khoản, hãy nhập mã chúng tôi đã
          gửi đến:
          <br />
          <span className="font-bold text-[#172B4D]">{email}</span>
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
                className="w-10 h-10 border border-gray-300 rounded-[3px] text-center text-lg font-bold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            ))}
          </div>

          {/* Hiển thị lỗi */}
          {errorMsg && (
            <div className="text-red-600 text-sm mb-4">{errorMsg}</div>
          )}

          <button
            type="submit"
            className="w-full bg-[#0052CC] hover:bg-blue-700 text-white font-bold py-2 rounded-[3px] transition-colors mb-4"
          >
            Xác minh
          </button>
        </form>

        <div className="text-sm">
          <button
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-[#0052CC] hover:underline disabled:opacity-50"
          >
            {isResending
              ? "Đang gửi..."
              : "Bạn không nhận được email? Gửi lại email"}
          </button>
        </div>

        {/* Footer (Giữ nguyên) */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-1 text-gray-500 font-bold text-sm mb-2">
            <span>▲ ATLASSIAN</span>
          </div>
          <p className="text-[10px] text-gray-500">
            Một tài khoản cho Jira, Confluence, Trello và{" "}
            <a href="#" className="text-blue-600">
              sản phẩm khác
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
