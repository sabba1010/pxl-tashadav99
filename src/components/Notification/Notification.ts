// src/services/notification.ts
export type NotificationPayload = {
  userId?: string;
  type?: string;
  title: string;
  message?: string;
  data?: Record<string, any>;
};


const API_BASE = process.env.REACT_APP_API_URL?.replace(/\/$/, "") ?? "https://vps-backend-server-beta.vercel.app";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleRes(res: Response) {
  const txt = await res.text();
  try {
    const parsed = txt ? JSON.parse(txt) : {};
    if (!res.ok)
      throw new Error(parsed?.error || parsed?.message || res.statusText);
    return parsed;
  } catch (e: any) {
    if (!res.ok) throw new Error(txt || res.statusText);
    // if json parse failed but status ok, return empty obj
    return {};
  }
}

/** helper to do fetch with timeout */
async function fetchWithTimeout(
  input: RequestInfo,
  init?: RequestInit,
  timeoutMs = 8000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function sendNotification(payload: NotificationPayload) {
  const url = `${API_BASE}/api/notification/notify`;
  try {
    const res = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      },
      8000
    );
    return await handleRes(res);
  } catch (err) {
    // don't throw blindly — bubble up or return null depending on your app needs
    // Here we rethrow so callers can show UI error/toast if they want:
    throw err;
  }
}

export async function getAllNotifications(userId?: string) {
  const url = `${API_BASE}/api/notification/getall${
    userId ? "?userId=" + encodeURIComponent(userId) : ""
  }`;
  try {
    const res = await fetchWithTimeout(
      url,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      },
      8000
    );
    return await handleRes(res);
  } catch (err) {
    throw err;
  }
}
