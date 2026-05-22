import { getToken } from "../utils/authToken";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://over-drive-backend.onrender.com";

/**
 * Generic API client for all requests
 */
export async function apiClient(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;

  const token = getToken();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const headers = {
      ...(options.headers || {}),
    };

    // Attach JWT token if available
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Only set JSON header if NOT FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type");

    let data;

    // Parse JSON safely
    if (contentType?.includes("application/json")) {
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => null);
    }

    // Handle API errors
    if (!response.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`;

      throw new Error(message);
    }

    return data;
  } catch (error) {
    // Handle abort separately
    if (error.name === "AbortError") {
      throw new Error("Request timeout. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}