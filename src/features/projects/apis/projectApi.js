import axiosClient from "../../../utils/axiosClient";

const projectApi = {
  getAll: () => axiosClient.get("/project-management/api/v1/projects"),
};

export default projectApi;
