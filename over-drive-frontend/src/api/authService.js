import { apiClient } from "./client";

export const authService = {
  login: async (email, password) => {
    const res = await apiClient("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    return {
      user: res.user,
      token: res.access_token,
    };
  },

  register: async (name, email, password) => {
    const res = await apiClient("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    return {
      user: res.user,
      token: res.access_token,
    };
  },

  getMe: async (token) => {
    const res = await apiClient("/api/auth/me", {
      method: "GET",
    }, token);

    return res.user;
  },
};