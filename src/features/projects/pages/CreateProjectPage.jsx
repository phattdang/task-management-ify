import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import projectApi from "../apis/projectApi";

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("KEY");
  const [isLoading, setIsLoading] = useState(false); // Thêm loading state

  // Logic tự động sinh Key
  useEffect(() => {
    if (!projectName) {
      setProjectKey("KEY");
      return;
    }
    const words = projectName.trim().split(/\s+/);
    let generatedKey = "";
    if (words.length === 1) {
      generatedKey = words[0].substring(0, 3).toUpperCase();
    } else {
      generatedKey = words
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .substring(0, 4);
    }
    setProjectKey(generatedKey || "KEY");
  }, [projectName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setIsLoading(true);
    try {
      // Gọi API tạo project
      const res = await projectApi.createProject({ name: projectName });

      // Kiểm tra response
      if (res.data && res.data.code === 201) {
        console.log("Project created:", res.data.body);

        // Chuyển hướng về trang danh sách dự án
        // Layout sẽ tự động fetch lại danh sách và redirect vào project mới nhất hoặc đầu tiên
        navigate("/projects");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Lỗi khi tạo dự án. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-[#172B4D]">
      {/* === CỘT TRÁI: FORM NHẬP LIỆU === */}
      <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
        <div className="max-w-[500px] mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6 text-slate-800">
            Create project
          </h1>

          <p className="text-xs text-red-500 mb-4 font-semibold">
            Required fields are marked with an asterisk *
          </p>

          <form onSubmit={handleSubmit}>
            {/* Input Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                placeholder="Try a team name, project goal, milestone..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border-2 border-blue-500 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-gray-100"
                autoFocus
              />
            </div>

            {/* Template Selection (Read-only UI) */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Template
              </label>
              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center shrink-0">
                  <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
                    <div className="bg-blue-500 h-4 w-2 rounded-sm"></div>
                    <div className="bg-blue-300 h-2 w-2 rounded-sm"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">Kanban</span>
                    <span className="text-blue-600 text-xs font-semibold hover:underline">
                      Change template
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Visualize and advance your project forward using work items
                    on a powerful board.
                  </p>
                </div>
              </div>
            </div>

            {/* Type Selection (UI Only) */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Type
              </label>
              <div className="p-2 border border-gray-300 rounded bg-gray-100 text-gray-500 text-sm cursor-not-allowed flex justify-between items-center">
                <span>Team-managed</span>
                <span className="text-xs">▼</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isLoading}
                className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !projectName}
                className={`px-6 py-2 text-white font-bold rounded-[3px] transition-colors shadow-sm ${
                  isLoading || !projectName
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
              >
                {isLoading ? "Creating..." : "Create project"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* === CỘT PHẢI: MINH HỌA (PREVIEW) - Giữ nguyên === */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 items-center justify-center relative overflow-hidden">
        {/* Blob Background */}
        <div className="absolute w-[600px] h-[600px] bg-blue-500 opacity-10 rounded-full blur-3xl -top-20 -right-20"></div>
        <div className="absolute w-[400px] h-[400px] bg-indigo-400 opacity-20 rounded-full blur-2xl bottom-10 left-10"></div>

        {/* Board Mockup Window */}
        <div className="relative bg-white w-[500px] h-[350px] rounded-lg shadow-2xl border border-gray-100 flex overflow-hidden z-10">
          {/* Sidebar */}
          <div className="w-12 bg-gray-50 border-r border-gray-100 flex flex-col items-center py-4 gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded"></div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
            <div className="w-6 h-1 bg-gray-200 rounded"></div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 bg-white">
            {/* Header */}
            <div className="flex gap-2 items-center mb-6">
              <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
              <div className="h-2 w-24 bg-gray-200 rounded"></div>
              <div className="h-2 w-16 bg-gray-100 rounded ml-auto"></div>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-3 gap-3 h-full">
              {/* Col 1 */}
              <div className="bg-gray-50 p-2 rounded flex flex-col gap-2">
                <div className="h-2 w-10 bg-gray-300 rounded mb-1"></div>
                <CardMock keyStr={projectKey} num="1" />
                <CardMock keyStr={projectKey} num="2" />
                <CardMock keyStr={projectKey} num="3" />
              </div>
              {/* Col 2 */}
              <div className="bg-gray-50 p-2 rounded flex flex-col gap-2">
                <div className="h-2 w-16 bg-gray-300 rounded mb-1"></div>
                <CardMock keyStr={projectKey} num="4" />
                <CardMock keyStr={projectKey} num="5" />
              </div>
              {/* Col 3 */}
              <div className="bg-gray-50 p-2 rounded flex flex-col gap-2">
                <div className="h-2 w-12 bg-gray-300 rounded mb-1"></div>
                <CardMock keyStr={projectKey} num="6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component con giữ nguyên
const CardMock = ({ keyStr, num }) => (
  <div className="bg-white p-2 rounded shadow-sm border border-gray-100">
    <div className="h-1 w-full bg-gray-100 rounded mb-2"></div>
    <div className="h-1 w-2/3 bg-gray-100 rounded mb-2"></div>
    <div className="flex justify-between items-center mt-2">
      <div className="h-3 w-3 rounded-full bg-red-100"></div>
      <span className="text-[8px] font-bold text-gray-400">
        {keyStr}-{num}
      </span>
    </div>
  </div>
);
