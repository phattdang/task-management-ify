import axiosClient from "../../../utils/axiosClient";

const projectApi = {
  getAll: () => axiosClient.get("/project-management/api/v1/projects"),
  createProject: (request) =>
    axiosClient.post("/project-management/api/v1/projects", request),
  getMembers: (projectId) =>
    axiosClient.get(`/project-management/api/v1/projects/${projectId}`),
  deleteProject: (projectId, request) =>
    axiosClient.delete(
      `/project-management/api/v1/projects/${projectId}`,
      request
    ),
};

export default projectApi;
