import axios from "axios";

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL:
    import.meta.env.VITE_APP_API_URL || "https://mpc-bn.onrender.com",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For FormData, remove Content-Type header to let axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
      console.log(
        "FormData detected - removing Content-Type header for auto-detection",
      );
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
