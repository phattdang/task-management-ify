import React, { useState, useEffect } from "react";
import projectApi from "../../apis/projectApi";

export default function SettingsDetailsPanel({ projectId }) {
  const [projectData, setProjectData] = useState({
    name: "",
    spaceKey: "",
    category: "Software",
    owner: "",
    defaultAssignee: "Unassigned",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      // Mock data for now - replace with actual API call
      const mockData = {
        name: "Billing System Dev",
        spaceKey: "SAM1",
        category: "Software",
        owner: "Đặng Nguyễn Tiến Phát",
        defaultAssignee: "Unassigned",
      };
      setProjectData(mockData);
    } catch (error) {
      console.error("Error fetching project details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Replace with actual API call
      console.log("Saving project data:", projectData);
      setMessage("Changes saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving project details:", error);
      setMessage("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleIconChange = () => {
    // Handle icon change - show file picker or icon selector
    console.log("Change icon clicked");
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
        <span>Spaces</span>
        <span>/</span>
        <span>(Example) Billing System Dev</span>
        <span>/</span>
        <span className="font-semibold text-gray-900 dark:text-slate-200">Space settings</span>
      </div>

      {/* Details Header */}
      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold">Details</h1>
        {message && (
          <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-2 rounded-lg">
            {message}
          </div>
        )}
      </div>

      {/* Space Icon Section */}
      <div className="space-y-4">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-purple-600 to-cyan-500 rounded-lg flex items-center justify-center text-6xl shadow-lg">
          📦
        </div>
        <button
          onClick={handleIconChange}
          className="px-4 py-2 bg-blue-600 dark:bg-cyan-600 hover:bg-blue-700 dark:hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
        >
          Change icon
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="text-sm text-gray-600 dark:text-slate-400">
          Required fields are marked with an asterisk <span className="text-red-600">*</span>
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-slate-200 mb-2">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={projectData.name}
            onChange={handleChange}
            className="w-full max-w-2xl px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 rounded-lg text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Space Key Field */}
        <div>
          <label htmlFor="spaceKey" className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-slate-200 mb-2">
            Space key <span className="text-red-600">*</span>
            <span className="text-gray-400 dark:text-slate-500 text-xs">ⓘ</span>
          </label>
          <input
            type="text"
            id="spaceKey"
            name="spaceKey"
            value={projectData.spaceKey}
            onChange={handleChange}
            className="w-full max-w-2xl px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 rounded-lg text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-900 dark:text-slate-200 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={projectData.category}
            onChange={handleChange}
            className="w-full max-w-2xl px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 rounded-lg text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option>Choose a category</option>
            <option>Software</option>
            <option>Business</option>
            <option>Design</option>
            <option>Marketing</option>
            <option>Operations</option>
          </select>
        </div>

        {/* Space Owner Field */}
        <div>
          <label htmlFor="owner" className="block text-sm font-semibold text-gray-900 dark:text-slate-200 mb-2">
            Space owner
          </label>
          <div className="w-full max-w-2xl px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 rounded-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
              ĐN
            </span>
            <span className="text-gray-900 dark:text-slate-100 font-medium">{projectData.owner}</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-2">
            Make sure your space lead has access to work items in the space.
          </p>
        </div>

        {/* Default Assignee Field */}
        <div>
          <label htmlFor="defaultAssignee" className="block text-sm font-semibold text-gray-900 dark:text-slate-200 mb-2">
            Default assignee
          </label>
          <select
            id="defaultAssignee"
            name="defaultAssignee"
            value={projectData.defaultAssignee}
            onChange={handleChange}
            className="w-full max-w-2xl px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900/50 rounded-lg text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option>Unassigned</option>
            <option>Current User</option>
            <option>Project Lead</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 dark:bg-cyan-600 hover:bg-blue-700 dark:hover:bg-cyan-500 disabled:bg-gray-400 dark:disabled:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
