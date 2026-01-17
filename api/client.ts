import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'x-language': 'eng', // Default language header aligned to API expectations
  },
});

axiosInstance.interceptors.request.use(config => {
  // Respect any header provided by callers (e.g., per-user language); otherwise default to 'eng'
  if (!config.headers['X-Language'] && !config.headers['x-language']) {
    config.headers['X-Language'] = 'eng';
  }
  return config;
});

export default axiosInstance;
