import { authService } from "../api/authService";

export const useAuth = () => {
  const login = (email, password) =>
    authService.login(email, password);

  const register = (name, email, password) =>
    authService.register(name, email, password);

  return { login, register };
};