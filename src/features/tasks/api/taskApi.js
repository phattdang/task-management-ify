import axiosClient from "../../../utils/axiosClient";

const taskApi = {
  getAllTaskByProjectId: (projectId) =>
    axiosClient.get(`/task-management/api/v1/tasks/${projectId}`),
  createTask: (request) =>
    axiosClient.post("/task-management/api/v1/tasks", request),
};

export default taskApi;
