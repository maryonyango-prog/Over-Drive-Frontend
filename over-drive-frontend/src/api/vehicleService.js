import { apiClient } from "./client";

export const vehicleService = {
  registerVehicle: (data, token) =>
    apiClient("/api/vehicle/register", {
      method: "POST",
      body: JSON.stringify(data),
    }, token),

  getVehicle: (vehicleId, token) =>
    apiClient(`/api/vehicle/${vehicleId}`, {
      method: "GET",
    }, token),
    
  getValuation: (data, token) =>
  apiClient("/api/vehicle/valuation", {
    method: "POST",
    body: JSON.stringify(data),
  }, token),  
  analyzeVehicle: (vehicleId, token) =>
    apiClient(`/api/vehicle/${vehicleId}/analyze`, {
      method: "POST",
    }, token),

  uploadVehicleImage: (vehicleId, file, token) => {
    const formData = new FormData();
    formData.append("image", file);

    return fetch(
      `${import.meta.env.VITE_API_URL}/api/vehicle/${vehicleId}/upload_image`,
      {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      }
    ).then(res => res.json());
  },
};