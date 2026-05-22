import { apiClient } from "./client";

const normalize = (res) => {
  const data = res?.data ?? res;

  return {
    user: data?.user ?? null,
    access_token: data?.access_token ?? null,
  };
};

export const authService = {
  login: async (email, password) => {
    const res = await apiClient("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    return normalize(res);
  },

  register: async (name, email, password) => {
    const res = await apiClient("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    return normalize(res);
  },

  getMe: async () => {
    const res = await apiClient("/api/auth/me", {
      method: "GET",
    });

    const data = res?.data ?? res;

    return data?.user ?? null;
  },
};