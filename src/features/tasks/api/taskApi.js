import axiosClient from "../../../utils/axiosClient";

const taskApi = {
  getAllTaskByProjectId: (projectId) =>
    axiosClient.get(`/task-management/api/v1/tasks/projects/${projectId}`),
  createTask: (request) =>
    axiosClient.post("/task-management/api/v1/tasks", request),
  updateTask: (taskId, request) =>
    axiosClient.put(`/task-management/api/v1/tasks/${taskId}`, request),
};

export default taskApi;
