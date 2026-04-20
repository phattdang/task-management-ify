import User from "../../../types/models/User";

// =======================
// REQUEST DTOs
// =======================

export interface LoginRequest {
  identifier?: string; 
  password?: string;
  username?: string; // Tùy thuộc vào backend nếu cho phép đa dạng field
}

export interface RegisterRequest {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface IntrospectRequest {
  token: string;
}

// =======================
// RESPONSE DTOs
// =======================

/**
 * Cấu trúc Response chuẩn bọc ngoài (thường gọi là ApiResponse Wrapper của BE)
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  body: T;
}

/**
 * Result trả về từ Login
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  isExisted?: boolean;
}

/**
 * Payload chứa thông tin User Response
 */
export type UserInfoResponse = User;
