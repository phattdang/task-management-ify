import axios from "axios";

// 1. Cấu hình base URL (Đảm bảo backend chạy đúng port này)
const baseURL = "http://localhost:8080/";

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Instance riêng để gọi refresh token ---
const refreshClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu request refresh token mà bị lỗi thì thôi, không cứu nữa
    if (
      originalRequest?.url?.includes(
        "/authentication-management/api/v1/auth/refresh"
      )
    ) {
      return Promise.reject(error);
    }

    // Xử lý 401
    if (error.response?.status === 401 && !originalRequest._retry) {
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
        if (!refreshToken) throw new Error("No refresh token available");

        // Gọi API Refresh
        // Gửi { refreshToken: "..." } để khớp với DTO RefreshTokenRequest bên Java
        const rs = await refreshClient.post(
          "/authentication-management/api/v1/auth/refresh",
          { refreshToken: refreshToken }
        );

        // --- SỬA LỖI QUAN TRỌNG TẠI ĐÂY ---
        // Backend trả về: { code: 200, body: { ... } }
        // axios bọc trong .data => rs.data.body
        const data = rs.data.body || rs.data.data;

        const { accessToken, refreshToken: newRefreshToken } = data;

        // Lưu token mới
        localStorage.setItem("access_token", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        // Cập nhật header cho axiosClient
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        // Cập nhật header cho request đang bị lỗi
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Xử lý hàng đợi
        processQueue(null, accessToken);

        // Gọi lại request ban đầu
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại => Logout
        processQueue(refreshError, null);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_info");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
