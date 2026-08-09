import axios from "axios";

function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    const url = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
    return url.endsWith("/api") ? url : `${url}/api`;
  }
  return "/api";
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000,
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
      const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/register");
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
