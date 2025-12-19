import React from "react";

export default function TaskActionsMenu({ onClose, onDeleteClick, onCopyId }) {
  const menuGroups = [
    [
      { icon: "🔄", label: "Change status", hasSubmenu: true },
      { icon: "🔗", label: "Copy link" },
      { icon: "🔑", label: "Copy key", onClick: onCopyId },
    ],
    [
      { icon: "🚩", label: "Add flag" },
      { icon: "🏷️", label: "Add label" },
      { icon: "🔗", label: "Link work item" },
      { icon: "📁", label: "Change parent" },
    ],
    [
      { icon: "📦", label: "Archive" },
      {
        icon: "🗑️",
        label: "Delete",
        color: "text-red-600",
        onClick: onDeleteClick,
      },
    ],
  ];

  return (
    <div className="absolute top-8 right-0 w-52 bg-white shadow-xl border border-gray-200 rounded-md z-[100] py-1 overflow-hidden">
      {menuGroups.map((group, gIndex) => (
        <React.Fragment key={gIndex}>
          {gIndex > 0 && <div className="h-[1px] bg-gray-100 my-1" />}
          {group.map((item, iIndex) => (
            <div
              key={iIndex}
              className={`px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between group transition-colors ${
                item.color || "text-gray-700"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (item.onClick) item.onClick();
                onClose();
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm w-4 text-center">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.hasSubmenu && (
                <span className="text-gray-400 text-xs">›</span>
              )}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
