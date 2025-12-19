import axiosClient from "../../../utils/axiosClient";

const URL = "/task-management/api/v1/tasks";

const taskApi = {
  getAllTaskByProjectId: (projectId) =>
    axiosClient.get(`${URL}/projects/${projectId}`),
  createTask: (request) => axiosClient.post(URL, request),
  updateTask: (taskId, request) => axiosClient.put(`${URL}/${taskId}`, request),
  deleteTask: (taskId, request) =>
    axiosClient.delete(`${URL}/${taskId}`, request),
  getTaskDetail: (taskId) => axiosClient.get(`${URL}/${taskId}`),
};

export default taskApi;
