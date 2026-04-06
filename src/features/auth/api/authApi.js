import axiosClient from "../../../utils/axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/api/v1/auth/log-in", data),
  logout: (token) => axiosClient.post("/api/v1/auth/log-out", token),
  register: (data) => axiosClient.post("/api/v1/users", data),
  introspect: (token) => axiosClient.post("/api/v1/auth/introspect", token),
  refresh: (token) =>
    axiosClient.post("/api/v1/auth/refresh", {
      token,
    }),
  checkEmailExisted: (email) =>
    axiosClient.get("/api/v1/accounts/existence", email),
  getRegisterOtp: (request) =>
    axiosClient.post("/api/v1/email/send-register-otp", request),
  verifyRegisterOtp: (request) =>
    axiosClient.post("/api/v1/email/verify-register-otp", request),
  createUser: (request) => axiosClient.post("/api/v1/users", request),
  getInformation: () => axiosClient.get("/api/v1/users/information"),
};

export default authApi;
