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

  const getStatusConfig = (status) => {
    switch (status) {
      case "ACCEPTED":
        return {
          label: "Member",
          style:
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30",
        };
      case "PENDING":
        return {
          label: "Pending",
          style:
            "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30",
        };
      case "REJECTED":
        return {
          label: "Rejected",
          style:
            "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30",
        };
      case "EXPIRED":
        return {
          label: "Expired",
          style:
            "bg-slate-200 text-slate-700 dark:bg-slate-600/20 dark:text-slate-400 border border-slate-300 dark:border-slate-600/30",
        };
      default:
        return {
          label: "Unknown",
          style:
            "bg-slate-100 text-slate-600 dark:bg-slate-700/20 dark:text-slate-400",
        };
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Members & Access
        </h2>
        <button
          type="button"
          onClick={onSwitchToAddView}
          className="px-4 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
        >
          + Add people
        </button>
      </div>

      <div className="border border-slate-200 dark:border-slate-700/40 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto bg-slate-50 dark:bg-slate-800/30">
        {/* Controls */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-100/95 dark:bg-slate-800/50 z-10 pb-2 border-b border-slate-200 dark:border-slate-700/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 dark:text-cyan-500 focus:ring-blue-500 dark:focus:ring-cyan-500 cursor-pointer"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Select all
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300 transition-colors">
            <span>Filter</span> <span className="text-xs">▼</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 group">
          <span className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-cyan-400 transition-colors text-lg">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 transition-all"
          />
        </div>

        {/* LIST */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400">
            <div className="animate-spin rounded-full h-6 w-6 border-4 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-cyan-500 mb-2"></div>
            <span className="text-sm font-medium animate-pulse">
              Loading members...
            </span>
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-500 py-10 bg-white dark:bg-slate-700/20 rounded-lg border border-dashed border-slate-300 dark:border-slate-700/50">
            <p className="text-sm font-medium">No members yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-600 mt-1">
              Add people to start collaborating
            </p>
          </div>
        ) : (
          invitations.map((item) => {
            const statusConfig = getStatusConfig(item.status);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 hover:bg-white dark:hover:bg-slate-700/30 rounded-lg group border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50 transition-all mb-1"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 dark:text-cyan-500 focus:ring-blue-500 dark:focus:ring-cyan-500 cursor-pointer"
                  />

                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/80 to-blue-700/80 dark:from-cyan-500/50 dark:to-blue-600/50 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-600/50">
                    <span className="text-xs font-bold text-white dark:text-slate-100">
                      {getInitials(item.invitedMember?.fullName)}
                    </span>
                  </div>

                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-200 cursor-pointer hover:text-blue-600 dark:hover:text-cyan-400 hover:underline truncate transition-colors">
                      {item.invitedMember?.fullName || "Unknown User"}
                    </span>
                    <span
                      className="text-xs text-slate-500 dark:text-slate-600 truncate"
                      title={item.invitedMember?.email}
                    >
                      {item.invitedMember?.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide ${statusConfig.style}`}
                  >
                    {statusConfig.label}
                  </span>

                  <button
                    type="button"
                    className="text-slate-500 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove member"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Remove this member from the project?"
                        )
                      ) {
                        console.log("Remove invitation ID:", item.id);
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

      <div className="flex justify-center items-center gap-4 mt-6 text-sm text-slate-500 dark:text-slate-500 font-medium select-none">
        <button
          type="button"
          className="hover:text-slate-800 dark:hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ‹ Previous
        </button>
        <button
          type="button"
          className="hover:text-slate-800 dark:hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next ›
        </button>
      </div>
    </>
  );
}
