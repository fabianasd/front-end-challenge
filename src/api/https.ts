import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === 'true',
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const auth = useAuthStore();
  const token = auth.accessToken;
  if (token) {
    const headers = config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers as any);
    if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }

  const m = (config.method || '').toLowerCase();
  if ((m === 'post' || m === 'put' || m === 'patch') && config.data && !(config.data instanceof FormData)) {
    const headers = config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers as any);
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    config.headers = headers;
  }
  return config;
});

let isRefreshing = false;
let queue: Array<[(v?: unknown)=>void, (e?: unknown)=>void]> = [];

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const auth = useAuthStore();
    const original = error?.config;

    if (error?.response?.status === 401 && !original?._retry) {
      if (!auth.canRefresh) {
        await auth.logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push([resolve, reject]);
        }).then(() => {
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${auth.accessToken}` };
          return http(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await auth.refresh();
        queue.forEach(([resolve]) => resolve?.(null));
        queue = [];
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${auth.accessToken}` };
        return http(original);
      } catch (e) {
        queue.forEach(([, reject]) => reject?.(e));
        queue = [];
        await auth.logout();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default http;
