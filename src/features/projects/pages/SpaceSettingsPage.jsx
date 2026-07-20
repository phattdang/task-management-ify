import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SettingsSidebar from "../components/space_settings/SettingsSidebar";
import SettingsDetailsPanel from "../components/space_settings/SettingsDetailsPanel";
import SettingsAccessPanel from "../components/space_settings/SettingsAccessPanel";

export default function SpaceSettingsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("details");

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Left Sidebar */}
      <SettingsSidebar 
        activeSection={activeSection} 
        onSelectSection={setActiveSection}
        onBack={() => navigate(`/projects/${projectId}`)}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          {activeSection === "details" && <SettingsDetailsPanel projectId={projectId} />}
          {activeSection === "access" && (
            <SettingsAccessPanel projectId={projectId} />
          )}
          {activeSection === "notifications" && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Notifications</h2>
              <p className="text-gray-600 dark:text-slate-400">Coming soon...</p>
            </div>
          )}
          {/* Add more sections as needed */}
        </div>
      </div>
    </div>
  );
}
