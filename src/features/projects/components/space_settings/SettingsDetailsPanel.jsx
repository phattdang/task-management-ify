import React, { useState, useEffect } from "react";
import projectApi from "../../apis/projectApi";

export default function SettingsDetailsPanel({ projectId }) {
  const [projectData, setProjectData] = useState({
    name: "",
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
      const response = await projectApi.getAll();
      const projects = response.data.body || [];
      const currentProject = projects.find((p) => p.id === projectId);
      
      if (currentProject) {
        setProjectData({ name: currentProject.name });
      }
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
      await projectApi.updateProject(projectId, {
        projectName: projectData.name,
      });
      setMessage("Changes saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving project details:", error);
      setMessage("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
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
        <span>{projectData.name || "Space"}</span>
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
