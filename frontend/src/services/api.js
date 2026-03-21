import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend URL
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to standardize error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If server responds with a message, use it; otherwise fallback
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "An unexpected error occurred";
    return Promise.reject({ ...error, message: msg });
  }
);

export default api;