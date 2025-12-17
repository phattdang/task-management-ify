import axiosClient from "../../../utils/axiosClient";

const projectApi = {
  getAll: () => axiosClient.get("/project-management/api/v1/projects"),
  createProject: (request) =>
    axiosClient.post("/project-management/api/v1/projects", request),
};

export default projectApi;
