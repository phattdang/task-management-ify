// components/NavigationTabs.jsx
const TABS = [
  { id: "SUMMARY", label: "Summary", icon: "🌐" },
  { id: "LIST", label: "List", icon: "📝" },
  { id: "BOARD", label: "Board", icon: "📊" },
  { id: "TIMELINE", label: "Timeline", icon: "⏳" },
  { id: "PAGES", label: "Pages", icon: "📄" },
];

export default function NavigationTabs({ activeTab = "BOARD", onTabChange }) {
  return (
    <div className="flex items-center gap-4 text-sm font-medium text-slate-400 overflow-x-auto px-6 py-3 border-b border-slate-700/30">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <div
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`pb-3 cursor-pointer flex items-center gap-2 whitespace-nowrap transition-all border-b-2 hover:text-cyan-400 ${
              isActive
                ? "text-cyan-400 border-cyan-500 font-bold"
                : "border-transparent"
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </div>
        );
      })}
      <div className="pb-3 cursor-pointer hover:text-cyan-400 px-2 rounded-lg hover:bg-slate-800/40 transition-all text-lg">
        +
      </div>
    </div>
  );
}
