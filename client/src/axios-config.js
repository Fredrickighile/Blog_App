// src/axios-config.js
import axios from "axios";

// Create an instance of axios with default configuration
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // This is important for sending cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
