import axiosClient from "../../../utils/axiosClient";

// Import types dùng làm JSDoc
/**
 * @typedef {import("../types").LoginRequest} LoginRequest
 * @typedef {import("../types").LoginResponse} LoginResponse
 * @typedef {import("../types").RegisterRequest} RegisterRequest
 * @typedef {import("../types").IntrospectRequest} IntrospectRequest
 * @typedef {import("../types").UserInfoResponse} UserInfoResponse
 * @template T
 * @typedef {import("../types").ApiResponse<T>} ApiResponse
 */

const authApi = {
  /**
   * Đăng nhập
   * @param {LoginRequest} data 
   * @returns {Promise<import("axios").AxiosResponse<ApiResponse<LoginResponse>>>}
   */
  login: (data) => axiosClient.post("/api/v1/auth/log-in", data),

  /**
   * Đăng xuất
   * @param {IntrospectRequest} token 
   */
  logout: (token) => axiosClient.post("/api/v1/auth/log-out", token),

  /**
   * Đăng ký User
   * @param {RegisterRequest} data 
   */
  register: (data) => axiosClient.post("/api/v1/users", data),

  /**
   * Kiểm tra Token
   * @param {IntrospectRequest} token 
   */
  introspect: (token) => axiosClient.post("/api/v1/auth/introspect", token),

  /**
   * Làm mới Token (Do axiosClient gọi /api/v1/auth/refresh)
   * @param {string} token 
   * @returns {Promise<import("axios").AxiosResponse<ApiResponse<LoginResponse>>>}
   */
  refresh: (token) =>
    axiosClient.post("/api/v1/auth/refresh", {
      token,
    }),

  checkEmailExisted: (email) =>
    axiosClient.post("/api/v1/accounts/existence", email),
    
  requestRegisterOtp: (request) =>
    axiosClient.post("/api/v1/auth/request-register-otp", request),
    
  verifyRegisterOtp: (request) =>
    axiosClient.post("/api/v1/auth/verify-register-otp", request),
    
  createUser: (request) => axiosClient.post("/api/v1/users", request),

  /**
   * Lấy thông tin User Model
   * @returns {Promise<import("axios").AxiosResponse<ApiResponse<UserInfoResponse>>>}
   */
  getInformation: () => axiosClient.get("/api/v1/users/information"),

  /**
   * Đăng nhập thông qua Google SSO Callback
   * @param {string} code Auth Code từ Google
   * @returns {Promise<import("axios").AxiosResponse<ApiResponse<LoginResponse>>>}
   */
  loginGoogle: (code) => 
    axiosClient.post(`/api/v1/auth/google?code=${encodeURIComponent(code)}`),
};

export default authApi;
