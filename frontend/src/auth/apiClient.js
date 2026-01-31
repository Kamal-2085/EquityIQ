import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let currentAccessToken = null;
export function setAccessToken(token) {
  currentAccessToken = token;
}
export function clearAccessToken() {
  currentAccessToken = null;
}

// Attach Authorization header if token present
api.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});

export default api;
