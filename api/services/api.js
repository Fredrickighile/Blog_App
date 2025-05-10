// services/api.js
import axios from "axios";

const API_URL = "https://blog-app-sable-three.vercel.app/api";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies/auth
});

// Request wrapper with error handling
export const apiRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: endpoint,
    };

    if (data) {
      if (method.toLowerCase() === "get") {
        config.params = data;
      } else {
        config.data = data;
      }
    }

    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error("API Request Error:", error.response?.data || error.message);
    throw error;
  }
};

// Convenience methods
export const get = (endpoint, params) => apiRequest("get", endpoint, params);
export const post = (endpoint, data) => apiRequest("post", endpoint, data);
export const put = (endpoint, data) => apiRequest("put", endpoint, data);
export const del = (endpoint) => apiRequest("delete", endpoint);

export default api;
