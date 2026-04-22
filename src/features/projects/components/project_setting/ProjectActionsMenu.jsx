// components/ProjectActionsMenu.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProjectActionsMenu({
  onClose,
  onDeleteClick,
  onAddPeopleClick,
}) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  // Cấu hình Menu: Tách riêng để dễ quản lý và đọc
  const menuGroups = [
    [
      {
        icon: "⭐",
        label: "Add to starred",
        onClick: () => console.log("Starred"),
      },
      {
        icon: "👤",
        label: "Add people",
        onClick: onAddPeopleClick,
      },
      { icon: "📋", label: "Save as template", badge: "ENTERPRISE" },
      { icon: "🖼️", label: "Set space background", hasSubmenu: true },
      {
        icon: "⚙️",
        label: "Space settings",
        onClick: () => navigate(`/projects/${projectId}/settings`),
      },
    ],
    [
      { icon: "📥", label: "Archive space", badge: "PREMIUM" },
      {
        icon: "🗑️",
        label: "Delete space",
        color: "text-red-600 dark:text-red-400",
        onClick: onDeleteClick, // Gán trực tiếp callback từ props
      },
    ],
    [{ icon: "🚀", label: "Software space", description: "Team-managed" }],
  ];

  return (
    <div className="absolute top-10 left-0 w-64 bg-white dark:bg-slate-900/95 backdrop-blur-md shadow-xl border border-gray-200 dark:border-slate-700 rounded-md z-[100] py-2 transition-colors duration-200">
      {menuGroups.map((group, gIndex) => (
        <React.Fragment key={gIndex}>
          {gIndex > 0 && <div className="h-[1px] bg-gray-100 dark:bg-slate-800 my-1" />}
          {group.map((item, iIndex) => (
            <div
              key={iIndex}
              className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between group transition-colors"
              onClick={() => {
                if (item.onClick) item.onClick(); // Chạy hàm nếu có định nghĩa
                onClose(); // Luôn đóng menu sau khi click
              }}
            >
              <div className="flex items-center gap-3">
                <span className={`text-sm ${item.color || "text-gray-600 dark:text-slate-400"}`}>
                  {item.icon}
                </span>
                <div className="flex flex-col text-left">
                  <span
                    className={`text-sm font-medium ${
                      item.color || "text-gray-700 dark:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 leading-none">
                      {item.description}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-[9px] font-bold bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1 py-0.5 rounded border border-purple-100 dark:border-purple-500/30 uppercase">
                    {item.badge}
                  </span>
                )}
                {item.hasSubmenu && (
                  <span className="text-gray-400 dark:text-slate-500 text-xs">›</span>
                )}
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
