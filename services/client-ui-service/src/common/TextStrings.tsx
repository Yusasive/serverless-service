// Base API URL from environment variable
export const AUTH_BASE_URL =
  import.meta.env.AUTH_SERVICE_URL || "http://localhost:4000";
export const USER_BASE_URL =
  import.meta.env.USER_SERVICE_URL || "http://localhost:4001";
export const PAYMENT_BASE_URL =
  import.meta.env.VITE_PAYMENT_SERVICE_URL || "http://localhost:4005";
export const BOOTH_BASE_URL =
  import.meta.env.VITE_BOOTH_SERVICE_URL || "http://localhost:4006";
export const EMAIL_BASE_URL =
  import.meta.env.VITE_EMAIL_SERVICE_URL || "http://localhost:4008";
export const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || "http://localhost:3010";
export const CONTENT_BASE_URL =
  import.meta.env.VITE_CONTENT_SERVICE_URL || "http://localhost:4010";
