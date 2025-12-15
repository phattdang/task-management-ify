import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "phatdang19032004@gmail.com";

  // State lưu 6 chữ số
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // Hàm xử lý khi nhập số
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Chỉ cho nhập số

    const newCode = [...code];
    // Lấy ký tự cuối cùng (trường hợp người dùng nhập đè)
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Tự động focus sang ô tiếp theo nếu có giá trị
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Hàm xử lý nút Backspace (xóa lùi)
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 6) {
      console.log("Verify Code:", fullCode);

      navigate("/setup-account", { state: { email } });
    } else {
      alert("Vui lòng nhập đủ 6 số!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#F9FAFB] pt-12 pb-12 font-sans text-[#172B4D]">
      {/* Container */}
      <div className="w-full max-w-[400px] px-8 py-10 bg-white shadow-lg rounded-sm sm:border sm:border-gray-200 text-center">
        {/* Logo */}
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

        {/* OTP Inputs */}
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

          <button
            type="submit"
            className="w-full bg-[#0052CC] hover:bg-blue-700 text-white font-bold py-2 rounded-[3px] transition-colors mb-4"
          >
            Xác minh
          </button>
        </form>

        <div className="text-sm">
          <button className="text-[#0052CC] hover:underline">
            Bạn không nhận được email? Gửi lại email
          </button>
        </div>

        {/* Footer */}
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
