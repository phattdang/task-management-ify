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
    <div className="flex items-center gap-6 text-sm font-medium text-gray-500 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <div
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`pb-3 cursor-pointer flex items-center gap-1 whitespace-nowrap transition-colors border-b-2 ${
              isActive
                ? "text-blue-600 border-blue-600 font-bold"
                : "border-transparent hover:text-blue-600"
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </div>
        );
      })}
      <div className="pb-3 cursor-pointer hover:bg-gray-100 px-2 rounded transition-colors">
        +
      </div>
    </div>
  );
}
