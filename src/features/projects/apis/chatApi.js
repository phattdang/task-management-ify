import axiosClient from "../../../utils/axiosClient";

const chatApi = {
  getHistory: (projectId) =>
    axiosClient.get(`/api/v1/projects/${projectId}/chat/history`),
};

export default chatApi;
