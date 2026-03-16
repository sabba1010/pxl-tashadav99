// src/config.ts
const isDevelopment = process.env.NODE_ENV === "development";

export const API_BASE_URL = isDevelopment
  ? "https://acctempire.com/api/api"
  : "https://acctempire.com/api/api";

export const FLUTTERWAVE_BACKEND_URL = `${API_BASE_URL}/flutterwave`;
export const KORAPAY_BACKEND_URL = `${API_BASE_URL}/korapay`;

export const SOCKET_URL = isDevelopment
  ? "https://acctempire.com/api"
  : "https://acctempire.com";
