import axiosClient from "../../../utils/axiosClient";

const BASE = (taskId) => `/api/v1/tasks/${taskId}/attachments`;

const attachmentApi = {
  // 1. Init upload - get pre-signed URL from backend
  initUpload: (taskId, { fileName, fileType, fileSize }) =>
    axiosClient.post(`${BASE(taskId)}/init-upload`, {
      fileName,
      fileType,
      fileSize,
    }),

  // 2. Upload binary to MinIO (NO auth - plain fetch, not axiosClient)
  uploadToMinIO: async (uploadUrl, file) => {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });
    if (!res.ok) throw new Error(`MinIO upload failed: ${res.status}`);
    return res;
  },

  // 3. Confirm upload to save metadata in backend
  confirmUpload: (taskId, objectKey) =>
    axiosClient.post(`${BASE(taskId)}/confirm-upload`, { objectKey }),

  // 4. List all attachments
  listAttachments: (taskId) => axiosClient.get(BASE(taskId)),

  // 5. Get download URL
  getDownloadUrl: (taskId, attachmentId) =>
    axiosClient.get(`${BASE(taskId)}/${attachmentId}/download-url`),

  // 6. Delete attachment
  deleteAttachment: (taskId, attachmentId) =>
    axiosClient.delete(`${BASE(taskId)}/${attachmentId}`),
};

export default attachmentApi;
