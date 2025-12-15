import React from "react";
// Import các components con
import ProductNav from "../components/landing/ProductNav";
import AuthForm from "../components/landing/AuthForm";
import MockBoard from "../components/landing/MockBoard";

export default function LandingPage() {
  return (
    // Background gradient toàn màn hình
    <div className="min-h-screen bg-gradient-to-br from-[#DEEBFF] via-[#E6FCFF] to-[#DEEBFF] font-sans overflow-x-hidden">
      {/* Top Navigation Bar (Logo) */}
      <nav className="p-6">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-2xl">
          <span className="text-3xl">✈️</span> Jira
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pt-4 pb-20">
        {/* Layout 2 cột */}
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
          {/* Cột trái: Nội dung & Form */}
          <div className="flex-1 w-full lg:pt-10">
            <ProductNav />
            <AuthForm />
          </div>

          {/* Cột phải: Hình ảnh minh họa (Ẩn trên mobile nhỏ nếu muốn, hoặc để nguyên) */}
          <div className="flex-1 w-full relative hidden lg:block">
            {/* Hiệu ứng nền mờ phía sau Board */}
            <div className="absolute top-10 left-10 w-full h-full bg-blue-400 opacity-10 blur-3xl rounded-full pointer-events-none"></div>

            {/* Mockup Board */}
            <div className="relative mt-10">
              <MockBoard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
