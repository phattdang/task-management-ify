// features/projects/components/project_setting/add_people/ManageAccessView.jsx
import React from "react";

export default function ManageAccessView({
  invitations,
  isLoading,
  onSwitchToAddView,
}) {
  // Helper: Lấy chữ cái đầu làm Avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // --- HELPER: Xử lý màu sắc và text cho từng Status ---
  const getStatusConfig = (status) => {
    switch (status) {
      case "ACCEPTED":
        return {
          label: "Member",
          style: "bg-green-100 text-green-700 border border-green-200",
        };
      case "PENDING":
        return {
          label: "Pending Invite",
          style: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        };
      case "REJECTED":
        return {
          label: "Rejected",
          style: "bg-red-50 text-red-700 border border-red-200",
        };
      case "EXPIRED":
        return {
          label: "Expired",
          style: "bg-gray-100 text-gray-500 border border-gray-200",
        };
      default:
        return {
          label: "Unknown",
          style: "bg-gray-50 text-gray-500",
        };
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-800">Manage access</h2>
        <button
          onClick={onSwitchToAddView}
          className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
        >
          Add people
        </button>
      </div>

      <div className="border border-gray-200 rounded-md p-4 min-h-[300px] max-h-[400px] overflow-y-auto">
        {/* Controls */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-gray-600">Select all</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
            <span>Type</span> <span className="text-xs">▼</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-2.5 text-gray-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            placeholder="Filter by name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 text-sm transition-all"
          />
        </div>

        {/* --- LIST RENDERING --- */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
            <span className="text-sm">Loading members...</span>
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded border border-dashed border-gray-200">
            No members found.
          </div>
        ) : (
          invitations.map((item) => {
            // Lấy config hiển thị dựa trên status
            const statusConfig = getStatusConfig(item.status);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 hover:bg-blue-50/50 rounded group border border-transparent hover:border-blue-100 transition-all mb-1"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0 border border-blue-200">
                    <span className="text-xs font-bold text-blue-700">
                      {getInitials(item.invitedMember?.fullName)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-blue-600 hover:underline truncate">
                      {item.invitedMember?.fullName || "Unknown User"}
                    </span>
                    <span
                      className="text-xs text-gray-500 truncate"
                      title={item.invitedMember?.email}
                    >
                      {item.invitedMember?.email}
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {/* Status Badge */}
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${statusConfig.style}`}
                  >
                    {statusConfig.label}
                  </span>

                  {/* Remove Button */}
                  <button
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove access"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to remove this member?"
                        )
                      ) {
                        console.log("Call API remove invitation ID:", item.id);
                      }
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-6 text-sm text-gray-600 font-medium select-none">
        <button className="hover:text-gray-900 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed">
          ‹ Previous
        </button>
        <button className="hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed">
          Next ›
        </button>
      </div>
    </>
  );
}
