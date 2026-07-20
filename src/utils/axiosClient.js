import axios from "axios";
import authEvents from "./authEvents";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

const refreshClient = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use(
  (config) => {
    // 1. Khai báo danh sách các API không cần token (để tránh bị backend chặn)
    const publicEndpoints = ["/auth/login", "/auth/register", "/auth/refresh"];

    // 2. Kiểm tra xem URL hiện tại có nằm trong danh sách miễn trừ không
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url.includes(endpoint),
    );

    // 3. Nếu KHÔNG PHẢI api public thì mới nhét token vào
    if (!isPublicEndpoint) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu không có response (lỗi mạng) thì reject luôn
    if (!error.response) {
      return Promise.reject(error);
    }

    // Nếu gặp 403 Forbidden, emit event để hiển thị toast
    if (error.response.status === 403) {
      authEvents.emit("forbidden");
      return Promise.reject(error);
    }

    // Nếu không phải 401 thì reject luôn
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Tránh loop vô tận nếu chính api refresh cũng trả về 401
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (!originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        // Gọi refreshClient (KHÔNG dùng axiosClient ở đây)
        const rs = await refreshClient.post(
          "/api/v1/auth/refresh",
          { refreshToken: refreshToken }, // Đảm bảo key này khớp với @RequestBody của Java
        );


        // Kiểm tra cấu trúc data backend: rs.data.body hay rs.data.result?
        const data = rs.data.body || rs.data.data || rs.data;
        const { accessToken, refreshToken: newRefreshToken } = data;

        localStorage.setItem("access_token", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        // Cập nhật token cho các request tiếp theo
        axiosClient.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Emit event so the React tree can handle this gracefully
        // (toast + soft navigate) instead of a hard page reload
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_info");
        authEvents.emit("session-expired");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
