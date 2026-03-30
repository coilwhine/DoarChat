import axios from "axios";
import localStorageService from "./LocalStorage.Service";
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
      if (serverMessage) {
        return Promise.reject(new Error(serverMessage));
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
