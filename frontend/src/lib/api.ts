import axios from "axios";

function getApiBaseUrl(): string {
  // If running in browser and NOT on localhost (e.g. deployed on Vercel/Netlify),
  // NEVER use localhost - always use the live production backend!
  if (
    typeof window !== "undefined" &&
    !window.location.hostname.includes("localhost") &&
    window.location.hostname !== "127.0.0.1"
  ) {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      const url = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
      return url.endsWith("/api") ? url : `${url}/api`;
    }
    return "https://fixitnow-9f1w.onrender.com/api";
  }

  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    const url = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
    return url.endsWith("/api") ? url : `${url}/api`;
  }
  return "/api";
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 45000, // 45 seconds to accommodate potential cloud container cold starts
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fixitnow_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === "object" && "data" in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthRoute =
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/send-otp") ||
        url.includes("/auth/verify-otp") ||
        url.includes("/auth/reset-password");
      if (!isAuthRoute) {
        localStorage.removeItem("fixitnow_token");
        localStorage.removeItem("fixitnow_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
