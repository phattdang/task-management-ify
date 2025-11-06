import axiosClient from "../../../utils/axiosClient";

const authApi = {
  login: (data) =>
    axiosClient.post("/authentication-management/api/v2/auth/log-in", data),
  register: (data) => axiosClient.post("/user-management/api/v1/users", data),
  refresh: (token) =>
    axiosClient.post("/authentication-management/api/v2/auth/refresh", {
      refreshToken: token,
    }),
};

export default authApi;
