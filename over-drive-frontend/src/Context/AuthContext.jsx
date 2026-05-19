import { createContext, useReducer, useContext, useCallback } from "react";
import AuthReducer from "./AuthReducer";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout as logoutAction,
  clearError,
  updateUser,
} from "./AuthActions";

// ─── Helpers ────────────────────────────────────────────────────────────────

const TOKEN_KEY = "overdrive_token";
const USER_KEY = "overdrive_user";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || null;

// ─── Initial State ───────────────────────────────────────────────────────────

const storedUser = getStoredUser();
const storedToken = getStoredToken();

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!(storedUser && storedToken),
  loading: false,
  error: null,
};

// ─── Context ─────────────────────────────────────────────────────────────────

export const AuthContext = createContext(initialState);

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Login — calls your backend API
  const login = useCallback(async (email, password) => {
    dispatch(loginStart());
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      // Persist to localStorage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      dispatch(loginSuccess(data.user));
      return { success: true };
    } catch (err) {
      dispatch(loginFailure(err.message));
      return { success: false, error: err.message };
    }
  }, []);

  // Register — calls your backend API
  const register = useCallback(async (name, email, password) => {
    dispatch(registerStart());
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      // Persist to localStorage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      dispatch(registerSuccess(data.user));
      return { success: true };
    } catch (err) {
      dispatch(registerFailure(err.message));
      return { success: false, error: err.message };
    }
  }, []);

  // Logout
  const logoutUser = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    dispatch(logoutAction());
  }, []);

  // Clear any auth error (e.g. when user starts typing again)
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, []);

  // Update user profile data in state + storage
  const updateUserProfile = useCallback((updatedFields) => {
    const updated = { ...state.user, ...updatedFields };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    dispatch(updateUser(updatedFields));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        register,
        logout: logoutUser,
        clearAuthError,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Custom Hook ─────────────────────────────────────────────────────────────

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
