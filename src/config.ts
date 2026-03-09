// src/config.ts
const isDevelopment = process.env.NODE_ENV === "development";

export const API_BASE_URL = isDevelopment
    ? "http://72.244.153.24:3200"
    : "http://72.244.153.24:3200";

export const FLUTTERWAVE_BACKEND_URL = `${API_BASE_URL}/flutterwave`;
export const KORAPAY_BACKEND_URL = `${API_BASE_URL}/korapay`;
