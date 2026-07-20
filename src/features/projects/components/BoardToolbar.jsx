// components/BoardToolbar.jsx
import React, { useState, useEffect, useRef } from "react";

const STATUSES = [
  { value: "TO_DO", label: "TO DO" },
  { value: "IN_PROGRESS", label: "IN PROGRESS" },
  { value: "IN_REVIEW", label: "IN REVIEW" },
  { value: "DONE", label: "DONE" },
];

const PRIORITIES = [
  { value: "HIGHEST", label: "Highest", icon: "🚩", color: "text-red-600" },
  { value: "HIGH", label: "High", icon: "🚩", color: "text-red-500" },
  { value: "MEDIUM", label: "Medium", icon: "🏳️", color: "text-amber-600" },
  { value: "LOW", label: "Low", icon: "✓", color: "text-emerald-600" },
  { value: "LOWEST", label: "Lowest", icon: "✓", color: "text-emerald-400" },
];

export default function BoardToolbar({ members = [], filters = {}, onApplyFilter, onClearFilter }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("Assignee");
  const filterRef = useRef(null);

  const [localFilters, setLocalFilters] = useState({
    assigneeIds: [],
    statuses: [],
    priorities: [],
    unassigned: false,
  });

  const [searchTaskKey, setSearchTaskKey] = useState(filters.searchKey || "");

  // Sync when opened
  useEffect(() => {
    if (isFilterOpen) {
      setLocalFilters({
        assigneeIds: filters.assigneeIds || [],
        statuses: filters.statuses || [],
        priorities: filters.priorities || [],
        unassigned: filters.unassigned || false,
      });
    }
  }, [isFilterOpen, filters]);

  useEffect(() => {
    setSearchTaskKey(filters.searchKey || "");
  }, [filters.searchKey]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setIsFilterOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  const FILTER_TABS = ["Assignee", "Status", "Priority"];

  const handleApply = () => {
    if (onApplyFilter) {
      onApplyFilter({
        ...localFilters,
        searchKey: searchTaskKey,
      });
    }
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    setLocalFilters({
      assigneeIds: [],
      statuses: [],
      priorities: [],
      unassigned: false,
    });
    setSearchTaskKey("");
    if (onClearFilter) {
      onClearFilter();
    }
    setIsFilterOpen(false);
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      if (onApplyFilter) {
        onApplyFilter({ searchKey: searchTaskKey });
      }
    }
  };

  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    }
    return [...array, item];
  };

  return (
    <div className="relative z-10 px-6 py-4 flex items-center justify-between bg-white/90 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700/40 backdrop-blur-md transition-colors duration-200">
      {/* Left: Search, Avatars, Filter */}
      <div className="flex items-center gap-3">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTaskKey}
            onChange={(e) => setSearchTaskKey(e.target.value)}
            onKeyDown={handleSearchEnter}
            className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/50 text-sm w-48 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-cyan-400 transition-colors">
            🔍
          </span>
        </div>

        <div className="flex -space-x-2 cursor-pointer hover:space-x-0 transition-all">
          {members.slice(0, 5).map((m, idx) => (
            <div
              key={idx}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm hover:scale-110 transition-transform"
              title={m.fullName}
            >
              {m.fullName?.charAt(0) || "U"}
            </div>
          ))}
          {members.length > 5 && (
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700/50 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400">
              +{members.length - 5}
            </div>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm font-medium transition-all ${
              isFilterOpen || (filters.assigneeIds?.length > 0 || filters.statuses?.length > 0 || filters.priorities?.length > 0 || filters.unassigned)
                ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400"
                : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/40"
            }`}
          >
            <span className="flex items-center justify-center w-4 h-4">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Filter
            {((filters.assigneeIds?.length || 0) + (filters.statuses?.length || 0) + (filters.priorities?.length || 0) + (filters.unassigned ? 1 : 0)) > 0 && (
              <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200 text-xs font-bold">
                {((filters.assigneeIds?.length || 0) + (filters.statuses?.length || 0) + (filters.priorities?.length || 0) + (filters.unassigned ? 1 : 0))}
              </span>
            )}
          </button>

          {isFilterOpen && (
            <div className="absolute top-full mt-2 left-0 w-[560px] bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/60 z-50 overflow-hidden flex flex-col">
              <div className="flex min-h-[320px]">
                {/* Sidebar */}
                <div className="w-[180px] border-r border-slate-200 dark:border-slate-700/60 py-3 flex flex-col gap-0.5">
                  {FILTER_TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveFilterTab(tab)}
                      className={`text-left px-5 py-2 text-[13px] transition-colors flex justify-between items-center ${
                        activeFilterTab === tab
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20 border-l-[3px] border-blue-600 dark:border-blue-500 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-[3px] border-transparent"
                      }`}
                    >
                      <span>{tab}</span>
                      {tab === "Assignee" && (localFilters.assigneeIds.length > 0 || localFilters.unassigned) && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200 px-1.5 rounded">{localFilters.assigneeIds.length + (localFilters.unassigned ? 1 : 0)}</span>
                      )}
                      {tab === "Status" && localFilters.statuses.length > 0 && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200 px-1.5 rounded">{localFilters.statuses.length}</span>
                      )}
                      {tab === "Priority" && localFilters.priorities.length > 0 && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200 px-1.5 rounded">{localFilters.priorities.length}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 p-5 overflow-y-auto max-h-[320px]">
                  {activeFilterTab === "Assignee" && (
                    <div className="flex flex-col h-full">
                      <div className="flex flex-col gap-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={localFilters.unassigned}
                            onChange={(e) => setLocalFilters(prev => ({...prev, unassigned: e.target.checked}))}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                          />
                          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                          <span className="text-[13px] text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">Unassigned</span>
                        </label>
                        {members.map((m) => (
                          <label key={m.id} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              checked={localFilters.assigneeIds.includes(m.id)}
                              onChange={() => setLocalFilters(prev => ({...prev, assigneeIds: toggleArrayItem(prev.assigneeIds, m.id)}))}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                            />
                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                              {m.fullName?.charAt(0) || "U"}
                            </div>
                            <span className="text-[13px] text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">{m.fullName}</span>
                          </label>
                        ))}
                        {members.length === 0 && (
                          <span className="text-sm text-slate-500">No members found</span>
                        )}
                      </div>
                    </div>
                  )}

                  {activeFilterTab === "Status" && (
                    <div className="flex flex-col gap-4">
                      {STATUSES.map((status) => (
                        <label key={status.value} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={localFilters.statuses.includes(status.value)}
                            onChange={() => setLocalFilters(prev => ({...prev, statuses: toggleArrayItem(prev.statuses, status.value)}))}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                          />
                          <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">{status.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {activeFilterTab === "Priority" && (
                    <div className="flex flex-col gap-4">
                       {PRIORITIES.map((priority) => (
                        <label key={priority.value} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={localFilters.priorities.includes(priority.value)}
                            onChange={() => setLocalFilters(prev => ({...prev, priorities: toggleArrayItem(prev.priorities, priority.value)}))}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                          />
                          <div className={`w-5 flex justify-center ${priority.color}`}>
                            {priority.icon}
                          </div>
                          <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">{priority.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-200 dark:border-slate-700/60 p-3 px-5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <button 
                  onClick={handleClear}
                  className="text-[13px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Clear Filter
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="px-3 py-1.5 text-[13px] text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleApply}
                    className="px-3 py-1.5 text-[13px] bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
