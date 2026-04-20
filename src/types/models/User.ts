export default interface User {
  id: string; // Chuẩn hóa userId thành id để đồng nhất với database/các class khác
  username: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt?: string | Date;
  status?: "ACTIVE" | "INACTIVE" | "BANNED";
}
