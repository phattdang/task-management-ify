import axiosClient from "../../../utils/axiosClient";

const taskApi = {
  findAllTask: () => axiosClient.get("/task-management/api/v2/tasks"),
  addTask: (data) => axiosClient.post("/task-management/api/v2/tasks", data),
};

export default taskApi;
