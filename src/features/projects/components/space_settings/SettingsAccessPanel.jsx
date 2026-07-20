import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import projectApi from "../../apis/projectApi";
import { useToast } from "../../../../contexts/ToastContext";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";

export default function SettingsAccessPanel({ projectId }) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isManager, setIsManager] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const currentUser = useSelector((state) => state.auth.user);
  const toast = useToast();

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const res = await projectApi.getProjectMembers(projectId);
      if (res.data?.code === 200) {
        const data = res.data.body || [];
        setMembers(data);
        
        // Determine if current user is manager from the returned members list
        const me = data.find((m) => m.email === currentUser?.email);
        if (me && me.roleInProject === "MANAGER") {
          setIsManager(true);
        } else {
          setIsManager(false);
        }
      }
    } catch (error) {
      console.error("Error fetching project members:", error);
      toast.error("Failed to load project members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;
    try {
      setIsRemoving(true);
      const res = await projectApi.removeProjectMember(projectId, memberToRemove.id);
      if (res.data?.code === 200) {
        toast.success(`Removed ${memberToRemove.fullName} from project.`);
        // Remove locally or refetch
        setMembers((prev) => prev.filter((m) => m.id !== memberToRemove.id));
      }
    } catch (error) {
      console.error("Failed to remove member:", error);
      const msg = error.response?.data?.message || "Failed to remove member.";
      toast.error(msg);
    } finally {
      setIsRemoving(false);
      setMemberToRemove(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 py-8 max-w-4xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800/40 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
        <span>Spaces</span>
        <span>/</span>
        <span>Settings</span>
        <span>/</span>
        <span className="font-semibold text-gray-900 dark:text-slate-200">Access</span>
      </div>

      <div className="flex items-start justify-between">
        <h1 className="text-3xl font-bold">Access Settings</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
        {members.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No members found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6 w-24 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {members.map((member) => {
                const isMe = member.email === currentUser?.email;
                const canRemove = isManager && !isMe;
                
                return (
                  <tr
                    key={member.id}
                    className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100">
                      {member.fullName} {isMe && <span className="text-xs text-blue-500 font-normal ml-2">(You)</span>}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{member.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        member.roleInProject === "MANAGER"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        {member.roleInProject === "MANAGER" ? "Manager" : "Member"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {canRemove && (
                        <button
                          onClick={() => setMemberToRemove(member)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors font-medium text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!memberToRemove}
        title="Remove Member"
        message={`Are you sure you want to remove ${memberToRemove?.fullName} from this project? They will lose access immediately.`}
        confirmText="Remove"
        onConfirm={handleConfirmRemove}
        onCancel={() => setMemberToRemove(null)}
        isLoading={isRemoving}
      />
    </div>
  );
}
