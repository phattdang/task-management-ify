import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSignUpClick = () => {
    navigate("/verify-email", { state: { email: email } });
  };

  // Hàm xử lý khi bấm nút Log in
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
            className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>

        <p className="text-xs text-gray-500">
          Using a work email helps find teammates and boost collaboration.
        </p>

        <button
          onClick={handleSignUpClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors shadow-md"
        >
          Sign up
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
        {/* Cập nhật sự kiện click ở đây */}
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
