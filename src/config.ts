// src/config.ts
const isDevelopment = process.env.NODE_ENV === "development";

export const API_BASE_URL = isDevelopment
    ? "https://tasha-vps-backend-2.onrender.com"
    : "https://tasha-vps-backend-2.onrender.com";

export const FLUTTERWAVE_BACKEND_URL = `${API_BASE_URL}/flutterwave`;
export const KORAPAY_BACKEND_URL = `${API_BASE_URL}/korapay`;
