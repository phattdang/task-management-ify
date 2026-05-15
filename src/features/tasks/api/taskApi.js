import axiosClient from "../../../utils/axiosClient";

const URL = "/api/v1/tasks";

const taskApi = {
  getAllTaskByProjectId: (projectId) =>
    axiosClient.get(`${URL}/projects/${projectId}`),
  
  filterTasksByProjectId: (projectId, params) => {
    const serializedParams = {};
    
    if (params.assigneeIds && params.assigneeIds.length > 0) {
      serializedParams.assigneeIds = params.assigneeIds.join(',');
    }
    if (params.statuses && params.statuses.length > 0) {
      serializedParams.statuses = params.statuses.join(',');
    }
    if (params.priorities && params.priorities.length > 0) {
      serializedParams.priorities = params.priorities.join(',');
    }
    if (params.searchKey) {
      serializedParams.searchKey = params.searchKey;
    }
    if (params.unassigned) {
      serializedParams.unassigned = "true";
    }
    if (params.page !== undefined) {
      serializedParams.page = params.page;
    }
    if (params.size !== undefined) {
      serializedParams.size = params.size;
    }
    if (params.sort) {
      serializedParams.sort = params.sort;
    }

    return axiosClient.get(`${URL}/projects/${projectId}/filter`, { params: serializedParams });
  },

  createTask: (request) => axiosClient.post(URL, request),
  updateTask: (taskId, request) => axiosClient.put(`${URL}/${taskId}`, request),
  deleteTask: (taskId, request) =>
    axiosClient.delete(`${URL}/${taskId}`, request),
  getTaskDetail: (taskId) => axiosClient.get(`${URL}/${taskId}`),
};

export default taskApi;
