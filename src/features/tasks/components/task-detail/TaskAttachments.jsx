import React, { useState, useEffect, useRef, useCallback } from "react";
import attachmentApi from "../../api/attachmentApi";
import { useToast } from "../../../../contexts/ToastContext";

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (fileType) => {
  if (!fileType) return "📄";
  if (fileType.startsWith("image/")) return "🖼️";
  if (fileType === "application/pdf") return "📕";
  if (fileType.includes("word") || fileType.includes("document")) return "📝";
  if (fileType.includes("sheet") || fileType.includes("excel")) return "📊";
  if (fileType.includes("zip") || fileType.includes("rar")) return "🗜️";
  if (fileType.startsWith("video/")) return "🎬";
  if (fileType.startsWith("audio/")) return "🎵";
  return "📄";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function TaskAttachments({ taskId, attachRef }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // { fileName, step }
  const [downloadingId, setDownloadingId] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const fetchAttachments = useCallback(async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const res = await attachmentApi.listAttachments(taskId);
      setAttachments(res.data?.body || []);
    } catch (err) {
      console.error("Failed to load attachments", err);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input để user có thể chọn lại cùng file
    e.target.value = "";
    await uploadFile(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const uploadFile = async (file) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File quá lớn! Tối đa 50MB.");
      return;
    }

    setUploading(true);
    setUploadProgress({ fileName: file.name, step: "Initializing..." });

    try {
      // Step 1: Init upload → get pre-signed URL
      setUploadProgress({ fileName: file.name, step: "Getting upload URL..." });
      const initRes = await attachmentApi.initUpload(taskId, {
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
      });
      const { uploadUrl, objectKey } = initRes.data.body;

      // Step 2: PUT file directly to MinIO (no auth)
      setUploadProgress({ fileName: file.name, step: "Uploading to storage..." });
      await attachmentApi.uploadToMinIO(uploadUrl, file);

      // Step 3: Confirm with backend to save metadata
      setUploadProgress({ fileName: file.name, step: "Confirming upload..." });
      await attachmentApi.confirmUpload(taskId, objectKey);

      toast.success(`"${file.name}" uploaded successfully!`);
      await fetchAttachments();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Upload failed.";
      toast.error(msg);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDownload = async (attachment) => {
    setDownloadingId(attachment.id);
    try {
      const res = await attachmentApi.getDownloadUrl(taskId, attachment.id);
      const { downloadUrl } = res.data.body;
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error("Cannot get download link.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Attachments
          {attachments.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
              {attachments.length}
            </span>
          )}
        </h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add file
        </button>
      </div>

      {/* Hidden file input - dual ref for internal & parent "Attach" button */}
      <input
        ref={(el) => {
          fileInputRef.current = el;
          if (attachRef) attachRef.current = el;
        }}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Upload progress */}
      {uploading && uploadProgress && (
        <div className="mb-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent dark:border-cyan-500 dark:border-t-transparent rounded-full animate-spin shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-blue-700 dark:text-cyan-400 truncate">
              {uploadProgress.fileName}
            </p>
            <p className="text-xs text-blue-500 dark:text-cyan-500/70">
              {uploadProgress.step}
            </p>
          </div>
        </div>
      )}

      {/* Drop Zone (shown when no attachments yet and not uploading) */}
      {!loading && attachments.length === 0 && !uploading && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 dark:hover:border-cyan-600 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group"
        >
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📎</div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Drag & drop a file here
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            or click to browse · max 50MB
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-14 rounded-lg bg-slate-100 dark:bg-slate-800/40 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Attachment list */}
      {!loading && attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/40 hover:border-blue-300 dark:hover:border-cyan-600/40 hover:shadow-sm transition-all group"
            >
              {/* File icon / Image preview */}
              <div className="text-2xl shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700/40">
                {att.fileType?.startsWith("image/") ? (
                  <img
                    src={att.fileUrl}
                    alt={att.fileName}
                    className="w-10 h-10 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.textContent = "🖼️";
                    }}
                  />
                ) : (
                  getFileIcon(att.fileType)
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate"
                  title={att.fileName}
                >
                  {att.fileName}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {formatFileSize(att.fileSize)} · {formatDate(att.createdAt)}
                  {att.uploadedBy && (
                    <span className="ml-1">· {att.uploadedBy.split("@")[0]}</span>
                  )}
                </p>
              </div>

              {/* Download button */}
              <button
                type="button"
                onClick={() => handleDownload(att)}
                disabled={downloadingId === att.id}
                className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-700/40 opacity-0 group-hover:opacity-100 transition-all disabled:cursor-wait"
                title="Download"
              >
                {downloadingId === att.id ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </button>
            </div>
          ))}

          {/* Add more (drop zone strip) */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className="border border-dashed border-slate-300 dark:border-slate-700/60 rounded-lg p-2.5 text-center cursor-pointer hover:border-blue-400 dark:hover:border-cyan-600 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all text-xs text-slate-400 dark:text-slate-500"
          >
            + Drop another file or click to add
          </div>
        </div>
      )}
    </div>
  );
}
