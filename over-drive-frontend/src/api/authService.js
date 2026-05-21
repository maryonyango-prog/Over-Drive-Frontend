import { apiClient } from "./client";

export const authService = {
  login: async (email, password) => {
    const res = await apiClient("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = res?.data || res; // 🔥 normalize

    return {
      user: data?.user,
      access_token: data?.access_token,
    };
  },

  register: async (name, email, password) => {
    const res = await apiClient("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    const data = res?.data || res; // 🔥 normalize

    return {
      user: data?.user,
      access_token: data?.access_token,
    };
  },

  getMe: async () => {
    const res = await apiClient("/api/auth/me", {
      method: "GET",
    });

    const data = res?.data || res;

    return data?.user;
  },
};