import axiosClient from "../../../utils/axiosClient";

const taskApi = {
  getAllTaskByProjectId: (projectId) =>
    axiosClient.get(`/task-management/api/v1/tasks/${projectId}`),
};

export default taskApi;
