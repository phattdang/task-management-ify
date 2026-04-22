import React from "react";

const settingsSections = [
  { id: "details", icon: "ℹ️", label: "Details" },
  { id: "access", icon: "👥", label: "Access" },
  { id: "notifications", icon: "🔔", label: "Notifications" },
  { id: "settings", icon: "⚙️", label: "Settings" },
  { id: "email-audit", icon: "📧", label: "Space email audit" },
  { id: "automation", icon: "🤖", label: "Automation" },
  { id: "fields", icon: "📋", label: "Fields" },
  { id: "work-types", icon: "📌", label: "Work types" },
  { id: "features", icon: "✨", label: "Features" },
  { id: "board", icon: "📊", label: "Board" },
  { id: "timeline", icon: "📅", label: "Timeline" },
  { id: "toolchain", icon: "🔧", label: "Toolchain" },
  { id: "apps", icon: "📱", label: "Apps" },
];

export default function SettingsSidebar({ activeSection, onSelectSection, onBack }) {
  return (
    <aside className="w-64 border-r border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 overflow-y-auto transition-colors duration-200">
      {/* Header with back button */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 font-semibold transition-colors"
        >
          <span className="text-lg">←</span>
          Space settings
        </button>
      </div>

      {/* Navigation sections */}
      <nav className="p-4 space-y-6">
        {/* First group: Main settings */}
        <div>
          {settingsSections.slice(0, 2).map((section) => (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors mb-1 flex items-center gap-3 ${
                activeSection === section.id
                  ? "bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-400"
                  : "text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800/40"
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-sm">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Second group: Notifications, Settings, etc. */}
        <div>
          <div className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-500 px-3 py-2 mb-2">
            Configuration
          </div>
          {settingsSections.slice(2, 5).map((section) => (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors mb-1 flex items-center gap-3 ${
                activeSection === section.id
                  ? "bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-400"
                  : "text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800/40"
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-sm">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Third group: Fields, Work types */}
        <div>
          <div className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-500 px-3 py-2 mb-2">
            Customization
          </div>
          {settingsSections.slice(5, 8).map((section) => (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors mb-1 flex items-center gap-3 ${
                activeSection === section.id
                  ? "bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-400"
                  : "text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800/40"
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-sm">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Fourth group: Features, Board, Timeline, Toolchain */}
        <div>
          <div className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-500 px-3 py-2 mb-2">
            Features
          </div>
          {settingsSections.slice(8, 12).map((section) => (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors mb-1 flex items-center gap-3 ${
                activeSection === section.id
                  ? "bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-400"
                  : "text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800/40"
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-sm">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Fifth group: Apps */}
        <div>
          <div className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-500 px-3 py-2 mb-2">
            Integrations
          </div>
          {settingsSections.slice(12).map((section) => (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors mb-1 flex items-center gap-3 ${
                activeSection === section.id
                  ? "bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-400"
                  : "text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800/40"
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-sm">{section.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
