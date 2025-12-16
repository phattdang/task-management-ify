import axiosClient from "../../../utils/axiosClient";

const authApi = {
  login: (data) =>
    axiosClient.post("/authentication-management/api/v1/auth/log-in", data),
  register: (data) => axiosClient.post("/user-management/api/v1/users", data),
  introspect: (token) =>
    axiosClient.post(
      "/authentication-management/api/v1/auth/introspect",
      token
    ),
  refresh: (token) =>
    axiosClient.post("/authentication-management/api/v1/auth/refresh", {
      token,
    }),
};

export default authApi;
