import axios from "axios";
import localStorageService from "./LocalStorage.service";
import type { AuthState } from "../Models/Auth.model";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

apiClient.interceptors.request.use((config) => {
  const auth = localStorageService.getItem<AuthState>("auth");
  const token = auth?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.error ?? error.response?.data?.message;
      const requestUrl = error.config?.url ?? "";
      const isAuthRequest =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register");

      if (error.response?.status === 401) {
        if (isAuthRequest) {
          return Promise.reject(
            new Error(serverMessage ?? "Invalid email or password"),
          );
        }

        localStorageService.removeItem("auth");
        if (window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
        return Promise.reject(new Error("Unauthorized"));
      }

      if (serverMessage) {
        return Promise.reject(new Error(serverMessage));
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
