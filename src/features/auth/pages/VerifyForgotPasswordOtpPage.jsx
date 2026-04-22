import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

export default function VerifyForgotPasswordOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (Number.isNaN(Number(value))) return;

    const nextCode = [...code];
    nextCode[index] = value.substring(value.length - 1);
    setCode(nextCode);
    setErrorMsg("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otp = code.join("");

    if (otp.length < 6) {
      setErrorMsg("Vui long nhap du 6 so.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");

    try {
      const res = await authApi.verifyForgotPasswordOtp({ otp, email });
      if (res.data?.code === 200 && res.data?.body?.valid) {
        navigate("/reset-password", {
          state: {
            email,
            resetToken: res.data.body.validToken,
          },
        });
      } else {
        setErrorMsg("Ma OTP khong chinh xac.");
      }
    } catch (error) {
      const backendCode = error.response?.data?.code;
      if (backendCode === 1014) {
        setErrorMsg("Ma OTP da het han. Vui long gui lai ma moi.");
      } else if (backendCode === 1013) {
        setErrorMsg("Ma OTP khong chinh xac.");
      } else {
        setErrorMsg("Xac thuc that bai. Vui long thu lai.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setErrorMsg("");
    setCode(["", "", "", "", "", ""]);

    try {
      const res = await authApi.forgotPassword({ email });
      if (res.data?.code === 200) {
        inputRefs.current[0]?.focus();
      } else {
        setErrorMsg("Khong the gui lai ma. Vui long thu lai sau.");
      }
    } catch (error) {
      const backendCode = error.response?.data?.code;
      if (backendCode === 1015) {
        setErrorMsg("Ban da gui OTP qua nhieu lan. Vui long doi 1 phut.");
      } else {
        setErrorMsg("Loi ket noi khi gui lai ma.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 pt-12 pb-12 font-sans relative overflow-hidden transition-colors duration-200">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 dark:bg-cyan-500/10 blur-3xl rounded-full opacity-50 dark:opacity-40 animate-softGlow"></div>

      <div className="w-full max-w-[420px] px-6 py-10 rounded-2xl border border-slate-200 dark:border-slate-700/50 relative z-10 text-center bg-white/90 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl dark:shadow-[0_20px_50px_rgba(6,182,212,0.1)]">
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
          Verify reset OTP
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          We sent a verification code to:
          <br />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {email}
          </span>
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
                className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-center text-xl font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 transition-all"
              />
            ))}
          </div>

          {errorMsg && (
            <div className="text-red-600 dark:text-red-400 text-sm mb-4 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/30">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className={`w-full text-white font-semibold py-2.5 rounded-lg transition-all duration-200 mb-4 shadow-md dark:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50 ${
              isVerifying
                ? "bg-blue-400/70 dark:bg-cyan-600/50 cursor-not-allowed opacity-70"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400"
            }`}
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isResending ? "Sending..." : "Didn't receive code? Resend"}
        </button>
      </div>
    </div>
  );
}
