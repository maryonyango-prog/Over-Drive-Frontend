// Action type constants
export const VEHICLE_ACTIONS = {
  VALUATION_START: "VALUATION_START",
  VALUATION_SUCCESS: "VALUATION_SUCCESS",
  VALUATION_FAILURE: "VALUATION_FAILURE",
  FETCH_HISTORY_START: "FETCH_HISTORY_START",
  FETCH_HISTORY_SUCCESS: "FETCH_HISTORY_SUCCESS",
  FETCH_HISTORY_FAILURE: "FETCH_HISTORY_FAILURE",
  SET_SELECTED_VEHICLE: "SET_SELECTED_VEHICLE",
  CLEAR_VALUATION: "CLEAR_VALUATION",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Action creators
export const valuationStart = () => ({ type: VEHICLE_ACTIONS.VALUATION_START });

export const valuationSuccess = (data) => ({
  type: VEHICLE_ACTIONS.VALUATION_SUCCESS,
  payload: data,
});

export const valuationFailure = (error) => ({
  type: VEHICLE_ACTIONS.VALUATION_FAILURE,
  payload: error,
});

export const fetchHistoryStart = () => ({ type: VEHICLE_ACTIONS.FETCH_HISTORY_START });

export const fetchHistorySuccess = (history) => ({
  type: VEHICLE_ACTIONS.FETCH_HISTORY_SUCCESS,
  payload: history,
});

export const fetchHistoryFailure = (error) => ({
  type: VEHICLE_ACTIONS.FETCH_HISTORY_FAILURE,
  payload: error,
});

export const setSelectedVehicle = (vehicle) => ({
  type: VEHICLE_ACTIONS.SET_SELECTED_VEHICLE,
  payload: vehicle,
});

export const clearValuation = () => ({ type: VEHICLE_ACTIONS.CLEAR_VALUATION });

export const clearVehicleError = () => ({ type: VEHICLE_ACTIONS.CLEAR_ERROR });
