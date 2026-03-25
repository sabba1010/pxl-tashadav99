// src/config.ts
const isDevelopment = process.env.NODE_ENV === "development";

export const API_BASE_URL = isDevelopment
  ? "http://localhost:3200/api" // Local backend
  : "https://acctempire.com/api"; // Live production

export const FLUTTERWAVE_BACKEND_URL = `${API_BASE_URL}/flutterwave`;
export const KORAPAY_BACKEND_URL = `${API_BASE_URL}/korapay`;

export const SOCKET_URL = isDevelopment
  ? "https://acctempire.com/api"
  : "https://acctempire.com";
