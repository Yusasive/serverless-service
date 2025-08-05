/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_SERVICE_URL: string;
  readonly VITE_USER_SERVICE_URL: string;
  readonly VITE_CONTENT_SERVICE_URL: string;
  readonly VITE_SERVICE_BASE_URL: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_BOOTH_SERVICE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
