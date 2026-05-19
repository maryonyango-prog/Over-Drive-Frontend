import { createContext, useReducer, useContext, useCallback } from "react";
import VehicleReducer from "./VehicleReducer";
import {
  valuationStart,
  valuationSuccess,
  valuationFailure,
  fetchHistoryStart,
  fetchHistorySuccess,
  fetchHistoryFailure,
  setSelectedVehicle,
  clearValuation as clearValuationAction,
  clearVehicleError as clearVehicleErrorAction,
} from "./VehicleActions";

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  currentValuation: null,
  valuationHistory: [],
  selectedVehicle: null,
  valuationLoading: false,
  historyLoading: false,
  valuationError: null,
  historyError: null,
};

// ─── Context ──────────────────────────────────────────────────────────────────

export const VehicleContext = createContext(initialState);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const VehicleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(VehicleReducer, initialState);

  // Request an AI valuation for a vehicle
  const getValuation = useCallback(async (vehicleData, token) => {
    dispatch(valuationStart());
    try {
      const res = await fetch("http://localhost:5000/api/vehicles/valuate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Valuation failed. Please try again.");
      }

      dispatch(valuationSuccess(data));
      return { success: true, data };
    } catch (err) {
      dispatch(valuationFailure(err.message));
      return { success: false, error: err.message };
    }
  }, []);

  // Fetch the user's valuation history
  const fetchValuationHistory = useCallback(async (token) => {
    dispatch(fetchHistoryStart());
    try {
      const res = await fetch("http://localhost:5000/api/vehicles/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not load history.");
      }

      dispatch(fetchHistorySuccess(data));
    } catch (err) {
      dispatch(fetchHistoryFailure(err.message));
    }
  }, []);

  // Set the vehicle the user is currently viewing
  const selectVehicle = useCallback((vehicle) => {
    dispatch(setSelectedVehicle(vehicle));
  }, []);

  // Reset the current valuation result
  const clearValuation = useCallback(() => {
    dispatch(clearValuationAction());
  }, []);

  const clearVehicleError = useCallback(() => {
    dispatch(clearVehicleErrorAction());
  }, []);

  return (
    <VehicleContext.Provider
      value={{
        currentValuation: state.currentValuation,
        valuationHistory: state.valuationHistory,
        selectedVehicle: state.selectedVehicle,
        valuationLoading: state.valuationLoading,
        historyLoading: state.historyLoading,
        valuationError: state.valuationError,
        historyError: state.historyError,
        getValuation,
        fetchValuationHistory,
        selectVehicle,
        clearValuation,
        clearVehicleError,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

// ─── Custom Hook ──────────────────────────────────────────────────────────────

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicle must be used within a VehicleProvider");
  }
  return context;
};
