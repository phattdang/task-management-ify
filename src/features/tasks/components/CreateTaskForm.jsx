import React, { useState, useEffect, useRef } from "react";
import taskApi from "../api/taskApi";
import projectApi from "../../projects/apis/projectApi";

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .match(/(\b\S)?/g)
    .join("")
    .match(/(^\S|\S$)?/g)
    .join("")
    .toUpperCase();
};

const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function CreateTaskForm({ projectId, onCancel, onSuccess }) {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState(null);
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef(null);
  const memberDropdownRef = useRef(null);

  // Click Outside
  useEffect(() => {
    const handleClickOutsideForm = (event) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target) &&
        !isMemberOpen
      ) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutsideForm);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideForm);
  }, [onCancel, isMemberOpen]);

  // Load Members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await projectApi.getMembers(projectId);
        setMembers(res.data.body || []);
      } catch (error) {
        console.error("Load members failed:", error);
      }
    };
    fetchMembers();
  }, [projectId]);

  // --- PHẦN QUAN TRỌNG: SỬA LOGIC SUBMIT ---
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!taskName.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        taskName: taskName,
        projectId: projectId,
        dueDate: dueDate ? `${dueDate}T00:00:00` : null,
        assigneeId: assigneeId,
      };

      console.log("Sending payload:", payload); // Debug 1
      const res = await taskApi.createTask(payload);
      console.log("API Response:", res); // Debug 2: Xem API trả về code bao nhiêu

      // SỬA Ở ĐÂY: Chấp nhận cả code 200 và 201
      if (res.data && (res.data.code === 201 || res.data.code === 200)) {
        console.log("Create Success -> Calling onSuccess");
        onSuccess(); // Gọi hàm này để đóng form và refresh list
      } else {
        console.error("Create failed logic. Code:", res.data?.code);
      }
    } catch (error) {
      console.error("Create task API error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedMember = members.find((m) => m.id === assigneeId);

  return (
    <div ref={formRef} className="mb-3">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg p-3 border border-blue-200/80 dark:border-cyan-500/40 bg-white/90 dark:bg-slate-900/40 backdrop-blur-md shadow-sm transition-colors duration-200"
      >
        <textarea
          placeholder="What needs to be done?"
          className="w-full text-sm resize-none outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 mb-3 p-2 rounded border border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 transition-all"
          rows={3}
          autoFocus
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <div className="flex items-center gap-2 relative flex-wrap">
          {/* Date Picker */}
          <div className="relative group">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
            {dueDate ? (
              <div className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/50 px-2 py-1 rounded-md text-xs font-bold">
                📅 {formatDateDisplay(dueDate)}
              </div>
            ) : (
              <div className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                📅
              </div>
            )}
          </div>

          {/* Assignee Dropdown */}
          <div className="relative" ref={memberDropdownRef}>
            <button
              type="button"
              onClick={() => setIsMemberOpen(!isMemberOpen)}
              className={`flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors ${
                assigneeId ? "" : "w-8 h-8"
              }`}
            >
              {assigneeId && selectedMember ? (
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 text-slate-800 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-600/50">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                    {getInitials(selectedMember.fullName)}
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap max-w-[80px] truncate">
                    {selectedMember.fullName}
                  </span>
                </div>
              ) : (
                <span className="text-slate-500 dark:text-slate-500 text-lg hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                  👤
                </span>
              )}
            </button>

            {isMemberOpen && (
              <div className="absolute top-10 left-0 w-60 rounded-lg z-50 border border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700/40">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase">
                    Assign to
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto py-1">
                  <div
                    className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-pointer flex items-center gap-2 transition-colors"
                    onClick={() => {
                      setAssigneeId(null);
                      setIsMemberOpen(false);
                    }}
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700/50 flex items-center justify-center text-slate-500 dark:text-slate-500 text-xs">
                      ?
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Unassigned
                    </span>
                  </div>
                  {members.map((mem) => (
                    <div
                      key={mem.id}
                      className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-pointer flex items-center gap-2 transition-colors"
                      onClick={() => {
                        setAssigneeId(mem.id);
                        setIsMemberOpen(false);
                      }}
                    >
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/80 to-blue-700/80 dark:from-cyan-500/50 dark:to-blue-600/50 text-white dark:text-slate-100 flex items-center justify-center text-xs font-bold">
                        {getInitials(mem.fullName)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900 dark:text-slate-200 font-medium">
                          {mem.fullName}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-500">
                          {mem.email}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      <div className="flex items-center gap-2 mt-3 px-0">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50 ${
            isSubmitting
              ? "bg-blue-400/70 dark:bg-cyan-600/50 cursor-not-allowed opacity-70"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 shadow-md dark:shadow-[0_0_12px_rgba(6,182,212,0.25)]"
          }`}
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
