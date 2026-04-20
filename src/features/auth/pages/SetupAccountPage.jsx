import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../api/authApi"; // Import api

export default function SetupAccountPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Lấy email từ trang trước, nếu mất state thì fallback (hoặc redirect về login)
  const email = location.state?.email;

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State quản lý lỗi từ backend trả về
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const payload = {
      fullName: fullName,
      email: email,
      password: password,
    };

    try {
      // 1. Gọi API tạo user
      const res = await authApi.createUser(payload);

      if (res.data && res.data.code === 201) {
        console.log("User created successfully");

        // 2. Tự động Login ngay lập tức
        try {
          const loginRes = await authApi.login({
            identifier: email,
            password: password,
          });

          const loginData = loginRes.data;

          if (loginData.code === 200 && loginData.body) {
            const { accessToken, refreshToken } = loginData.body;

            // 3. Lưu Token vào localStorage
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);

            // 4. Lấy thông tin User để đồng bộ hóa ứng dụng
            try {
              const userRes = await authApi.getInformation();
              if (userRes.data && userRes.data.code === 200) {
                localStorage.setItem(
                  "user_info",
                  JSON.stringify(userRes.data.body)
                );
              }
            } catch (infoError) {
              console.error("Failed to fetch info after signup:", infoError);
            }

            // 5. Chuyển hướng đến trang Tạo Project thay vì /projects
            navigate("/create-project");
          }
        } catch (loginError) {
          console.error("Silent login failed:", loginError);
          // Nếu login tự động lỗi, đưa về login chính thức
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Setup Error:", error);

      // Xử lý lỗi từ Backend (400 Bad Request)
      if (error.response && error.response.data) {
        const data = error.response.data;

        // Nếu code là 400 và có body chứa danh sách lỗi
        if (data.code === 400 && Array.isArray(data.body)) {
          const newErrors = {};
          // Duyệt qua mảng lỗi để map vào object errors
          // Ví dụ: [{field: "password", message: "..."}] -> { password: "..." }
          data.body.forEach((err) => {
            newErrors[err.field] = err.message;
          });
          setErrors(newErrors);
        } else {
          // Lỗi chung chung khác
          alert(data.message || "Có lỗi xảy ra, vui lòng thử lại.");
        }
      } else {
        alert("Lỗi kết nối đến server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 pt-12 pb-12 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full opacity-30 animate-softGlow"></div>

      <div className="w-full max-w-[420px] px-6 py-10 rounded-2xl border relative z-10" style={{
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(71, 85, 105, 0.3)',
        boxShadow: '0 20px 50px rgba(6, 182, 212, 0.1)',
      }}>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <span className="flex items-center gap-2 text-2xl font-bold text-cyan-400">
            <span className="text-3xl">⚡</span>
            TaskMgmt
          </span>
        </div>

        {/* Header Success */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-slate-100 flex items-center justify-center gap-2">
            Email verified
            <span className="text-emerald-400 text-xl">✓</span>
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Complete your account setup
          </p>
        </div>

        {/* Email Read-only */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
            Email Address
          </label>
          <div className="text-sm font-semibold text-slate-100 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            {email}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg focus:outline-none transition-all text-sm text-slate-100 placeholder-slate-600 ${
                errors.fullName
                  ? "border-red-500/50 focus:border-red-500/70"
                  : "border-slate-700/50 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30"
              }`}
              required
            />
            {errors.fullName && (
              <p className="text-red-400 text-xs mt-2">{errors.fullName}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2.5 bg-slate-800/50 border rounded-lg focus:outline-none transition-all text-sm text-slate-100 placeholder-slate-600 pr-10 ${
                  errors.password
                    ? "border-red-500/50 focus:border-red-500/70"
                    : "border-slate-700/50 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 text-lg transition-colors"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-2">{errors.password}</p>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Password must be at least 8 characters long
          </p>

          <p className="text-xs text-slate-400 leading-relaxed">
            By signing up, you agree to our{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Terms of Service
            </a>{" "}
            and acknowledge our{" "}
            <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Privacy Policy
            </a>
            .
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-semibold py-2.5 rounded-lg transition-all mt-6 ${
              isLoading
                ? "bg-cyan-600/50 cursor-not-allowed opacity-70"
                : "bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-500/30"
            }`}
          >
            {isLoading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700/30 text-center">
          <p className="text-xs text-slate-600">
            TaskMgmt © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
