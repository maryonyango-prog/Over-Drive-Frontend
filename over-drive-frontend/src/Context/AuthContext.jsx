import { createContext, useReducer, useContext, useCallback } from "react";
import AuthReducer from "./AuthReducer";
import {
  loginStart, loginSuccess, loginFailure,
  registerStart, registerSuccess, registerFailure,
  logout as logoutAction,
  clearError,
  updateUser,
} from "./AuthActions";
import { authService } from "../api/authService";

// ─── Storage helpers ──────────────────────────────────────────────────────────

const TOKEN_KEY = "overdrive_token";
const USER_KEY  = "overdrive_user";

const getStoredToken = () => localStorage.getItem(TOKEN_KEY) || null;
const getStoredUser  = () => {
  try {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

// ─── Initial state (rehydrated from localStorage) ────────────────────────────

const storedToken = getStoredToken();
const storedUser  = getStoredUser();

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!(storedUser && storedToken),
  loading: false,
  error: null,
};

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext(initialState);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const login = useCallback(async (email, password) => {
  dispatch(loginStart());

  try {
    const data = await authService.login(email, password);

    const token = data?.data?.access_token;
    const user = data?.data?.user;

    if (!token) {
      throw new Error("Login failed: token missing from server response");
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    dispatch(loginSuccess(user));
    return { success: true };
  } catch (err) {
    dispatch(loginFailure(err.message));
    return { success: false, error: err.message };
  }
}, []);

  const register = useCallback(async (name, email, password) => {
  dispatch(registerStart());

  try {
    const data = await authService.register(name, email, password);

    const token = data?.data?.access_token;
    const user = data?.data?.user;

    if (!token) {
      throw new Error("Register failed: token missing from server response");
    }

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    dispatch(registerSuccess(user));
    return { success: true };
  } catch (err) {
    dispatch(registerFailure(err.message));
    return { success: false, error: err.message };
  }
}, []);

  // Used by OAuthCallback — stores token + user coming back from Google/Facebook
  const loginWithToken = useCallback((token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    dispatch(loginSuccess(user));
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    dispatch(logoutAction());
  }, []);

  const clearAuthError = useCallback(() => dispatch(clearError()), []);

  const updateUserProfile = useCallback(
    (fields) => {
      const updated = { ...state.user, ...fields };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      dispatch(updateUser(fields));
    },
    [state.user]
  );

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
        loginWithToken,
        logout: logoutUser,
        clearAuthError,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Custom hook ──────────────────────────────────────────────────────────────

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
