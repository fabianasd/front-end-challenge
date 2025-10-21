/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_WITH_CREDENTIALS?: 'true' | 'false'
  readonly VITE_AUTH_LOGIN: string
  readonly VITE_AUTH_REFRESH: string
  readonly VITE_AUTH_LOGOUT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
