// components/NavigationTabs.jsx
const TABS = [
  { id: "SUMMARY", label: "Summary", icon: "🌐" },
  { id: "LIST", label: "List", icon: "📝" },
  { id: "BOARD", label: "Board", icon: "📊" },
  { id: "TIMELINE", label: "Timeline", icon: "⏳" },
  { id: "CHAT", label: "Chat", icon: "💬" },
];

export default function NavigationTabs({ activeTab = "BOARD", onTabChange }) {
  return (
    <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 overflow-x-auto px-6 py-3 border-b border-slate-200 dark:border-slate-700/40 bg-slate-50/80 dark:bg-transparent">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <div
            key={tab.id}
            role="button"
            tabIndex={0}
            onClick={() => onTabChange?.(tab.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTabChange?.(tab.id);
              }
            }}
            className={`pb-3 cursor-pointer flex items-center gap-2 whitespace-nowrap transition-all border-b-2 hover:text-blue-600 dark:hover:text-cyan-400 ${
              isActive
                ? "text-blue-600 dark:text-cyan-400 border-blue-600 dark:border-cyan-500 font-bold"
                : "border-transparent"
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </div>
        );
      })}
      <div className="pb-3 cursor-pointer hover:text-blue-600 dark:hover:text-cyan-400 px-2 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-800/40 transition-all text-lg">
        +
      </div>
    </div>
  );
}
