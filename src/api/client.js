import axios from "axios";

const BASE_URL = "https://dev.wenivops.co.kr/services/fastapi-crud";

export const authClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
});

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 요청 에러:", error.response || error.message);
    return Promise.reject(error);
  }
);