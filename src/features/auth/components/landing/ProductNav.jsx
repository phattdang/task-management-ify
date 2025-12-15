import React from "react";

// Dữ liệu giả cho các icon phía trên
const items = [
  { name: "Software", color: "bg-blue-500", icon: "🖥️" },
  { name: "Operations", color: "bg-pink-500", icon: "⚙️" },
  { name: "HR", color: "bg-yellow-500", icon: "📋" },
  { name: "All Teams", color: "bg-blue-700", icon: "🚀", active: true },
  { name: "Marketing", color: "bg-purple-500", icon: "📢" },
  { name: "Design", color: "bg-orange-500", icon: "🎨" },
  { name: "Sales", color: "bg-green-500", icon: "📈" },
];

export default function ProductNav() {
  return (
    <div className="flex flex-wrap justify-center md:justify-start gap-8 mb-10">
      {items.map((item) => (
        <div
          key={item.name}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:-translate-y-1 ${
              item.active ? "scale-125 shadow-md" : "opacity-80"
            } ${item.color}`}
          >
            <span className="text-sm">{item.icon}</span>
          </div>
          <span
            className={`text-xs font-semibold ${
              item.active ? "text-blue-700" : "text-gray-500"
            }`}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}
