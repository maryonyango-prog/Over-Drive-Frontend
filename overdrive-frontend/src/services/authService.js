import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  logout: () => localStorage.removeItem('token'),
};