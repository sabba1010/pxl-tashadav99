// src/services/notification.ts
export type NotificationPayload = {
  type?: string;
  title: string;
  message?: string;
  data?: Record<string, any>;
  userId?: string;
};

const API_BASE = process.env.REACT_APP_API_URL?.replace(/\/$/, "") ?? "";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleRes(res: Response) {
  const txt = await res.text();
  try {
    const parsed = txt ? JSON.parse(txt) : {};
    if (!res.ok) throw new Error(parsed?.error || parsed?.message || res.statusText);
    return parsed;
  } catch (e) {
    if (!res.ok) throw new Error(txt || res.statusText);
    return {};                 // << FIX HERE
  }
}

export async function sendNotification(payload: NotificationPayload) {
  const url = `${API_BASE}/api/notification/notify`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });
  return handleRes(res);
}

export async function getAllNotifications() {
  const url = `${API_BASE}/api/notification/getall`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  return handleRes(res);
}
