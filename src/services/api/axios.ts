import axios, { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_PLANTALUDUM_API_URL,
});

export const apiRequest = {
  get: <T>(url: string) => api.get<T>(url),
  post: <T>(url: string, data?: {}, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config),
};

export const apiPrivate = axios.create({
  baseURL: import.meta.env.VITE_PLANTALUDUM_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json; utf-8" },
});

export const apiPrivateRequest = {
  get: <T>(url: string) => apiPrivate.get<T>(url),
  post: <T>(url: string, data?: {}, config?: AxiosRequestConfig) =>
    apiPrivate.post<T>(url, data, config),
  put: <T>(url: string, data?: {}, config?: AxiosRequestConfig) =>
    apiPrivate.put<T>(url, data, config),
  patch: <T>(url: string, data?: {}, config?: AxiosRequestConfig) =>
    apiPrivate.patch<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiPrivate.delete<T>(url, config),
};

export const apiFlore = axios.create({
  baseURL: import.meta.env.VITE_FLORE_API_URL,
});

export const apiFloreRequest = {
  get: <T>(url: string) => apiFlore.get<T>(url),
  post: <T>(url: string, data: {}) => apiFlore.post<T>(url, data),
};

export default api;
