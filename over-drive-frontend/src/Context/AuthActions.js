export const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  LOGOUT: "LOGOUT",
  CLEAR_ERROR: "CLEAR_ERROR",
  UPDATE_USER: "UPDATE_USER",
};

export const loginStart = () => ({
  type: AUTH_ACTIONS.LOGIN_START,
});

export const loginSuccess = (data) => ({
  type: AUTH_ACTIONS.LOGIN_SUCCESS,
  payload: data, 
});

export const loginFailure = (error) => ({
  type: AUTH_ACTIONS.LOGIN_FAILURE,
  payload: error,
});

export const registerStart = () => ({
  type: AUTH_ACTIONS.REGISTER_START,
});

export const registerSuccess = (data) => ({
  type: AUTH_ACTIONS.REGISTER_SUCCESS,
  payload: data, 
});

export const registerFailure = (error) => ({
  type: AUTH_ACTIONS.REGISTER_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: AUTH_ACTIONS.LOGOUT,
});

export const clearError = () => ({
  type: AUTH_ACTIONS.CLEAR_ERROR,
});

export const updateUser = (user) => ({
  type: AUTH_ACTIONS.UPDATE_USER,
  payload: user,
});