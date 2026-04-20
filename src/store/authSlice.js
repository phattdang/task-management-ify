import { createSlice } from '@reduxjs/toolkit';

// Khởi tạo state từ localStorage nếu có
const initialToken = localStorage.getItem('access_token');
const initialUserStr = localStorage.getItem('user_info');
let initialUser = null;
try {
  if (initialUserStr) {
    initialUser = JSON.parse(initialUserStr);
  }
} catch (e) {
  console.error("Lỗi khi parse user info từ localeStorage", e);
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!initialToken,
    user: initialUser,
  },
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      if (action.payload) {
        state.user = action.payload;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_info");
    },
  },
});

export const { setAuth, logout } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
