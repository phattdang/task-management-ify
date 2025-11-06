import axiosClient from "../../../utils/axiosClient";

const taskApi = {
  findAllTask: axiosClient.post(
    "/authentication-management/api/v2/auth/log-in"
  ),
  register: (data) => axiosClient.post("/user-management/api/v1/users", data),
  refresh: (token) =>
    axiosClient.post("/authentication-management/api/v2/auth/refresh", {
      refreshToken: token,
    }),
};

export default taskApi;
