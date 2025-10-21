import { defineStore } from 'pinia';
import http from '@/api/https';
import { useStudentsStore } from '@/stores/students';

type User = {
  id: string;
  name?: string;
  email: string;
  roles?: string[];
  permissions?: string[];
};

type LoginPayload = { email: string; password: string };

const LS_KEY = 'auth.v1';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: '' as string,
    refreshTokenValue: '' as string,
    user: null as User | null,
    loaded: false,
  }),
  getters: {
    isAuthenticated: (s) => Boolean(s.accessToken),
    canRefresh: (s) => !!s.refreshTokenValue || import.meta.env.VITE_WITH_CREDENTIALS === 'true',
  },
  actions: {
    _extractAuth(data: any) {
      const payload = data && typeof data === 'object' && 'data' in data && typeof (data as any).data === 'object'
        ? (data as any).data
        : data
      const accessToken = payload?.accessToken || payload?.access_token || payload?.token || payload?.jwt || payload?.id_token || ''
      const refreshToken = payload?.refreshToken || payload?.refresh_token || ''
      const user = payload?.user || payload?.profile || payload?.me || null
      return { accessToken, refreshToken, user }
    },
    hydrate() {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const { accessToken, refreshToken, user } = JSON.parse(raw);
        this.accessToken = accessToken || '';
        this.refreshTokenValue = refreshToken || '';
        this.user = user || null;
      }
      this.loaded = true;
    },
    persist() {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          accessToken: this.accessToken,
          refreshToken: this.refreshTokenValue,
          user: this.user,
        })
      );
    },
    async login(payload: LoginPayload) {
      const url = import.meta.env.VITE_AUTH_LOGIN as string;
      const { data } = await http.post(url, payload);
      const parsed = this._extractAuth(data);
      this.accessToken = parsed.accessToken;
      this.refreshTokenValue = parsed.refreshToken;
      this.user = parsed.user;
      this.persist();
      try { useStudentsStore().$reset() } catch {}
    },
    async refresh() {
      const url = import.meta.env.VITE_AUTH_REFRESH as string;

      if (import.meta.env.VITE_WITH_CREDENTIALS === 'true') {
        const { data } = await http.post(url);
        const parsed = this._extractAuth(data);
        this.accessToken = parsed.accessToken;
        if (parsed.user) this.user = parsed.user;
        this.persist();
        return;
      }

      const { data } = await http.post(url, { refreshToken: this.refreshTokenValue });
      const parsed = this._extractAuth(data);
      this.accessToken = parsed.accessToken;
      if (parsed.refreshToken) this.refreshTokenValue = parsed.refreshToken;
      if (parsed.user) this.user = parsed.user;
      this.persist();
    },
    async logout() {
      try {
        const url = import.meta.env.VITE_AUTH_LOGOUT as string;
        await http.post(url);
      } catch {}
      this.accessToken = '';
      this.refreshTokenValue = '';
      this.user = null;
      localStorage.removeItem(LS_KEY);
      try { useStudentsStore().$reset() } catch {}
    },
  },
});
