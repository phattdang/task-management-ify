import axiosClient from "../../../utils/axiosClient";

const URL = "/api/v1/projects";

const projectApi = {
  getAll: () => axiosClient.get(URL),
  createProject: (request) => axiosClient.post(URL, request),
  getMembers: (projectId) => axiosClient.get(`${URL}/${projectId}`),
  deleteProject: (projectId, request) =>
    axiosClient.delete(`${URL}/${projectId}`, { data: request }),
  isProjectManager: (projectId) =>
    axiosClient.get(`${URL}/${projectId}/is-manager`),
  updateProject: (projectId, request) =>
    axiosClient.put(`${URL}/${projectId}`, request),
  getProjectSummary: (projectId) =>
    axiosClient.get(`${URL}/${projectId}/summary`),
};

export default projectApi;
