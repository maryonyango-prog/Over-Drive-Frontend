import { vehicleService } from "../api/vehicleService";

export const useVehicles = () => {
  const analyzeVehicle = (vehicleId, token) =>
    vehicleService.analyzeVehicle(vehicleId, token);

  return { analyzeVehicle };
};