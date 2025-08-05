/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVICE_BASE_URL: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_INVOICE_CC_EMAILS: string
  readonly VITE_FRONTEND_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 