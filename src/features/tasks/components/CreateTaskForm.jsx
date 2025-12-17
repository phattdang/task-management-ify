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
    <div ref={formRef} className="mb-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-blue-600 rounded p-2 shadow-md"
      >
        <textarea
          placeholder="What needs to be done?"
          className="w-full text-sm resize-none outline-none text-gray-800 placeholder-gray-400 mb-2"
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

        <div className="flex items-center gap-2 relative">
          {/* Date Picker */}
          <div className="relative group">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
            {dueDate ? (
              <div className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-[3px] text-xs font-bold">
                <span>📅 {formatDateDisplay(dueDate)}</span>
              </div>
            ) : (
              <div className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500">
                <span className="text-lg">📅</span>
              </div>
            )}
          </div>

          {/* Assignee Dropdown */}
          <div className="relative" ref={memberDropdownRef}>
            <button
              type="button"
              onClick={() => setIsMemberOpen(!isMemberOpen)}
              className={`flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ${
                assigneeId ? "" : "w-7 h-7"
              }`}
            >
              {assigneeId && selectedMember ? (
                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-[3px] border border-blue-200">
                  <div className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                    {getInitials(selectedMember.fullName)}
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap max-w-[80px] truncate">
                    {selectedMember.fullName}
                  </span>
                </div>
              ) : (
                <span className="text-gray-500 text-lg">👤</span>
              )}
            </button>

            {isMemberOpen && (
              <div className="absolute top-8 left-0 w-60 bg-white shadow-xl border border-gray-200 rounded z-50">
                <div className="p-2 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                  Assignee
                </div>
                <div className="max-h-48 overflow-y-auto py-1">
                  <div
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setAssigneeId(null);
                      setIsMemberOpen(false);
                    }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      ?
                    </div>
                    <span className="text-sm text-gray-700">Unassigned</span>
                  </div>
                  {members.map((mem) => (
                    <div
                      key={mem.id}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        setAssigneeId(mem.id);
                        setIsMemberOpen(false);
                      }}
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {getInitials(mem.fullName)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-700 font-medium">
                          {mem.fullName}
                        </span>
                        <span className="text-[10px] text-gray-400">
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

      <div className="flex items-center gap-2 mt-2 px-1">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
        <button
          onClick={onCancel}
          className="text-gray-600 text-sm font-medium px-3 py-1.5 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
