import axiosClient from "../../../utils/axiosClient";

const URL = "/api/v1/activity-logs";

const activityLogApi = {
  getActivityLogs: (projectId, page = 0, size = 20) =>
    axiosClient.get(URL, {
      params: {
        projectId,
        page,
        size,
      },
    }),
};

export default activityLogApi;
