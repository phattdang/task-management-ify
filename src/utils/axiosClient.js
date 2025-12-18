import axios from "axios";

const baseURL = "http://localhost:8080";

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
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu không có response (lỗi mạng) hoặc không phải 401 thì reject luôn
    if (!error.response || error.response.status !== 401) {
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
        console.log(refreshToken);

        // Gọi refreshClient (KHÔNG dùng axiosClient ở đây)
        const rs = await refreshClient.post(
          "/authentication-management/api/v1/auth/refresh",
          { refreshToken: refreshToken } // Đảm bảo key này khớp với @RequestBody của Java
        );

        console.log(rs);

        // Kiểm tra cấu trúc data backend: rs.data.body hay rs.data.result?
        const data = rs.data.body || rs.data.data || rs.data;
        const { accessToken, refreshToken: newRefreshToken } = data;

        localStorage.setItem("access_token", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        // Cập nhật token cho các request tiếp theo
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Chỉ logout nếu thật sự refresh thất bại (400, 403, 500)
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
