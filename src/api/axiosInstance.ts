import axios, { type AxiosError } from 'axios';
import { getAccessToken } from './authToken';

export interface ApiError {
  message: string;
  status?: number;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10_000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  withCredentials: import.meta.env.VITE_USE_COOKIE_AUTH === 'true',
});

// Attach the short-lived Access Token to authenticated requests.
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize server/network errors centrally for the UI.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message ??
        (error.code === 'ECONNABORTED' ? 'Час очікування відповіді минув.' :
          error.response ? 'Не вдалося виконати запит. Спробуйте ще раз.' :
            'Немає з’єднання із сервером.'),
      status: error.response?.status,
    };
    if (apiError.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(apiError);
  },
);

export default axiosInstance;
