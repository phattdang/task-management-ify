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
  checkEmailExisted: (email) =>
    axiosClient.post("/account-management/api/v1/accounts/is-existed", email),
  getRegisterOtp: (request) =>
    axiosClient.post("/email-sending/api/v1/send-register-otp", request),
  verifyRegisterOtp: (request) =>
    axiosClient.post("/email-sending/api/v1/verify-register-otp", request),
  createUser: (request) =>
    axiosClient.post("/user-management/api/v1/users", request),
};

export default authApi;
