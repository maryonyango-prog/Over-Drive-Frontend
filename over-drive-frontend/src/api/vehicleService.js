import { apiClient } from "./client";

// ─────────────────────────────────────────────
// Mapper: frontend → backend (IMPORTANT)
// ─────────────────────────────────────────────
function toBackendVehicle(data) {
  return {
    make: data.make,
    model: data.model,
    year: data.year,
    mileage: data.mileage,

    asking_price: data.estimatedValue,

    fuel_type: data.fuelType,
    transmission: data.transmission,
    condition: data.condition,
    body_type: data.bodyType,
    engine_size: data.engineSize,
    color: data.color,
  };
}

// ─────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────
export const vehicleService = {
  registerVehicle: (data, token) =>
    apiClient(
      "/api/vehicle/register",
      {
        method: "POST",
        body: JSON.stringify(toBackendVehicle(data)),
      },
      token
    ),

  getVehicle: (vehicleId, token) =>
    apiClient(`/api/vehicle/${vehicleId}`, { method: "GET" }, token),

  analyzeVehicle: (vehicleId, token) =>
    apiClient(
      `/api/vehicle/${vehicleId}/analyze`,
      { method: "POST" },
      token
    ),

  getValuationById: (vehicleId, token) =>
    apiClient(
      `/api/vehicle/${vehicleId}/valuation`,
      { method: "GET" },
      token
    ),

  uploadVehicleImage: async (vehicleId, file, token) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/vehicle/${vehicleId}/upload_image`,
      {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }

    return data;
  },

  uploadVehicleImages: async (vehicleId, images, token) => {
    return Promise.all(
      images.map(({ file }) =>
        vehicleService.uploadVehicleImage(vehicleId, file, token)
      )
    );
  },
};