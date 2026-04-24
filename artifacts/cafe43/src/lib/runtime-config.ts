const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
const rawApiMode = import.meta.env.VITE_API_MODE?.trim().toLowerCase() ?? "";

export const API_BASE_URL = rawApiBaseUrl
  ? rawApiBaseUrl.replace(/\/+$/, "")
  : null;

export const API_MODE = rawApiMode;

export const USE_MOCK_API = !API_BASE_URL && API_MODE !== "live";
