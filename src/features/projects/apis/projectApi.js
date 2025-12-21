import axiosClient from "../../../utils/axiosClient";

const URL = "/project-management/api/v1/projects";

const projectApi = {
  getAll: () => axiosClient.get(URL),
  createProject: (request) => axiosClient.post(URL, request),
  getMembers: (projectId) => axiosClient.get(`${URL}/${projectId}`),
  deleteProject: (projectId, request) =>
    axiosClient.delete(`${URL}/${projectId}`, request),
  isProjectManager: (projectId) =>
    axiosClient.get(`${URL}/${projectId}/is-manager`),
};

export default projectApi;
