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
      const res = await projectApi.createProject({ name: projectName });
      if (res.data && res.data.code === 201) {
        // Tạo xong thì về trang danh sách dự án
        navigate("/projects");
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Lỗi khi tạo dự án.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* === CỘT TRÁI: FORM NHẬP LIỆU === */}
      <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center bg-white dark:bg-slate-900/20">
        <div className="max-w-[500px] mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
            Create project
          </h1>

          <p className="text-xs text-red-600 dark:text-red-400 mb-4 font-semibold">
            Required fields are marked with an asterisk *
          </p>

          <form onSubmit={handleSubmit}>
            {/* Input Name */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                placeholder="Try a team name, project goal, milestone..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border-2 border-blue-600 dark:border-cyan-500/50 rounded-[3px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 transition-all disabled:bg-slate-100 dark:disabled:bg-slate-800"
                autoFocus
              />
            </div>

            {/* Template Selection (Read-only UI) */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Template
              </label>
              <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded flex items-center justify-center shrink-0">
                  <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
                    <div className="bg-blue-600 dark:bg-cyan-500 h-4 w-2 rounded-sm"></div>
                    <div className="bg-blue-300 dark:bg-cyan-700/50 h-2 w-2 rounded-sm"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      Kanban
                    </span>
                    <span className="text-blue-600 dark:text-cyan-400 text-xs font-semibold hover:underline">
                      Change template
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Visualize and advance your project forward using work items
                    on a powerful board.
                  </p>
                </div>
              </div>
            </div>

            {/* Type Selection (UI Only) */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Type
              </label>
              <div className="p-2 border border-slate-300 dark:border-slate-700 rounded bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm cursor-not-allowed flex justify-between items-center">
                <span>Team-managed</span>
                <span className="text-xs">▼</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/projects")}
                disabled={isLoading}
                className="px-4 py-2 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !projectName}
                className={`px-6 py-2 text-white font-bold rounded-[3px] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50 ${
                  isLoading || !projectName
                    ? "bg-blue-300 dark:bg-slate-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400"
                }`}
              >
                {isLoading ? "Creating..." : "Create project"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* === CỘT PHẢI: MINH HỌA (PREVIEW) - Giữ nguyên === */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-100 to-indigo-50 dark:from-slate-900 dark:to-slate-950 items-center justify-center relative overflow-hidden border-l border-slate-200 dark:border-slate-800/50">
        {/* Blob Background */}
        <div className="absolute w-[600px] h-[600px] bg-blue-500 dark:bg-cyan-500 opacity-10 dark:opacity-15 rounded-full blur-3xl -top-20 -right-20"></div>
        <div className="absolute w-[400px] h-[400px] bg-indigo-400 dark:bg-cyan-600 opacity-15 dark:opacity-10 rounded-full blur-2xl bottom-10 left-10"></div>

        {/* Board Mockup Window */}
        <div className="relative bg-white dark:bg-slate-900/60 w-[500px] h-[350px] rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800/50 flex overflow-hidden z-10 backdrop-blur-sm">
          {/* Sidebar */}
          <div className="w-12 bg-slate-50 dark:bg-slate-950/80 border-r border-slate-200 dark:border-slate-800/50 flex flex-col items-center py-4 gap-3">
            <div className="w-6 h-6 bg-blue-600 dark:bg-cyan-500 rounded"></div>
            <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="w-6 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="w-8 h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 bg-white dark:bg-slate-900/40">
            {/* Header */}
            <div className="flex gap-2 items-center mb-6">
              <div className="w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded-sm"></div>
              <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800 rounded ml-auto"></div>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-3 gap-3 h-full">
              {/* Col 1 */}
              <div className="bg-slate-50 dark:bg-slate-950/50 p-2 rounded flex flex-col gap-2 border border-slate-100 dark:border-slate-800/30">
                <div className="h-2 w-10 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                <CardMock keyStr={projectKey} num="1" />
                <CardMock keyStr={projectKey} num="2" />
                <CardMock keyStr={projectKey} num="3" />
              </div>
              {/* Col 2 */}
              <div className="bg-slate-50 dark:bg-slate-950/50 p-2 rounded flex flex-col gap-2 border border-slate-100 dark:border-slate-800/30">
                <div className="h-2 w-16 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                <CardMock keyStr={projectKey} num="4" />
                <CardMock keyStr={projectKey} num="5" />
              </div>
              {/* Col 3 */}
              <div className="bg-slate-50 dark:bg-slate-950/50 p-2 rounded flex flex-col gap-2 border border-slate-100 dark:border-slate-800/30">
                <div className="h-2 w-12 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
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
  <div className="bg-white dark:bg-slate-900/60 p-2 rounded shadow-sm border border-slate-200 dark:border-slate-800/50">
    <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded mb-2"></div>
    <div className="h-1 w-2/3 bg-slate-100 dark:bg-slate-800 rounded mb-2"></div>
    <div className="flex justify-between items-center mt-2">
      <div className="h-3 w-3 rounded-full bg-red-100 dark:bg-red-500/20"></div>
      <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500">
        {keyStr}-{num}
      </span>
    </div>
  </div>
);
