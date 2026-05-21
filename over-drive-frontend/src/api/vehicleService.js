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
  registerVehicle: (data) =>
    apiClient("/api/vehicle/register", {
      method: "POST",
      body: JSON.stringify(toBackendVehicle(data)),
    }),

  getVehicle: (vehicleId) =>
    apiClient(`/api/vehicle/${vehicleId}`, { method: "GET" }),

  analyzeVehicle: (vehicleId) =>
    apiClient(`/api/vehicle/${vehicleId}/analyze`, {
      method: "POST",
    }),

  getValuationById: (vehicleId) =>
    apiClient(`/api/vehicle/${vehicleId}/valuation`, {
      method: "GET",
    }),

  uploadVehicleImage: async (vehicleId, file) => {
    const token = localStorage.getItem("token");

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

    if (!res.ok) throw new Error(data.error || "Upload failed");

    return data;
  },

  uploadVehicleImages: async (vehicleId, images) =>
    Promise.all(
      images.map(({ file }) =>
        vehicleService.uploadVehicleImage(vehicleId, file)
      )
    ),
};