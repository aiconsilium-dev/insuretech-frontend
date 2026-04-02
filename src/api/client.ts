import axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import { ENV } from '@/config/env';
import { useAuthStore } from '@/stores/authStore';

const client = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach access token
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors + extract data
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      // No refresh token endpoint in this project; just logout
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

/**
 * Helper: extract `.data` from the standard API envelope `{ success, message, data }`.
 * Falls back to returning the full response data if the envelope is not present.
 */
export function extractData<T>(responseData: unknown): T {
  if (
    responseData !== null &&
    typeof responseData === 'object' &&
    'data' in (responseData as object)
  ) {
    return (responseData as { data: T }).data;
  }
  return responseData as T;
}

export { client };
