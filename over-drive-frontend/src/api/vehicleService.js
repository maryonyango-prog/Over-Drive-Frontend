import { apiClient } from "./client";

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

export const vehicleService = {
  // -------------------------
  // REGISTER VEHICLE
  // -------------------------
  registerVehicle: (data) =>
    apiClient("/api/vehicle/register", {
      method: "POST",
      body: JSON.stringify(toBackendVehicle(data)),
    }),

  // -------------------------
  // GET VEHICLE
  // -------------------------
  getVehicle: (vehicleId) =>
    apiClient(`/api/vehicle/${vehicleId}`, {
      method: "GET",
    }),

  // -------------------------
  // ANALYZE VEHICLE
  // -------------------------
  analyzeVehicle: (vehicleId) =>
    apiClient(`/api/vehicle/${vehicleId}/analyze`, {
      method: "POST",
    }),

  // -------------------------
  // GET VALUATION
  // -------------------------
  getValuationById: (vehicleId) =>
    apiClient(`/api/vehicle/${vehicleId}/valuation`, {
      method: "GET",
    }),

  // -------------------------
  // UPLOAD SINGLE IMAGE (FIXED)
  // -------------------------
  uploadVehicleImage: async (vehicleId, file) => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", file);

    const headers = {};

    // only attach if token exists
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/vehicle/${vehicleId}/upload_image`,
      {
        method: "POST",
        headers,
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }

    return data;
  },

  // -------------------------
  // UPLOAD MULTIPLE IMAGES
  // -------------------------
  uploadVehicleImages: async (vehicleId, images) =>
    Promise.all(
      images.map(({ file }) =>
        vehicleService.uploadVehicleImage(vehicleId, file)
      )
    ),
};