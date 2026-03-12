// src/services/notification.ts

// --- Types ---
export type TargetAudience = "all" | "buyers" | "sellers";
export type DisplayType = "alert" | "popup";

export type AnnouncementPayload = {
  title: string;
  message: string;
  target: TargetAudience;
  displayType: DisplayType;
};

export type NotificationPayload = {
  userId?: string;
  type?: string;
  title: string;
  message?: string;
  data?: Record<string, any>;
};

// --- Config & Helpers ---
const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/$/, "") ?? "http://localhost:3200";

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
    return {};
  }
}

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

// --- Exported Functions ---

/**
 * ১. এডমিনের জন্য নতুন এনাউন্সমেন্ট (Buyer/Seller/All) তৈরির ফাংশন
 */
export async function createAnnouncement(payload: AnnouncementPayload) {
  const url = `${API_BASE}/api/notification/announcement`;
  try {
    const res = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return await handleRes(res);
  } catch (err) {
    throw err;
  }
}

/**
 * ২. স্পেসিফিক নোটিফিকেশন পাঠানোর ফাংশন (Admin events)
 */
export async function sendNotification(payload: NotificationPayload) {
  const url = `${API_BASE}/api/notification/notify`;
  try {
    const res = await fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    return await handleRes(res);
  } catch (err) {
    throw err;
  }
}

/**
 * ৩. সব নোটিফিকেশন ফেচ করার ফাংশন
 */
export async function getAllNotifications(userId?: string, role?: string) {
  const params = new URLSearchParams();
  if (userId) params.append("userId", userId);
  if (role) params.append("role", role);

  const url = `${API_BASE}/api/notification/getall${params.toString() ? "?" + params.toString() : ""
    }`;
  try {
    const res = await fetchWithTimeout(url, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return await handleRes(res);
  } catch (err) {
    throw err;
  }
}

/**
 * ৩.১ সব নোটিফিকেশন ক্লিয়ার করার ফাংশন
 */
export async function clearNotifications(userId: string, role: string) {
  const url = `${API_BASE}/api/notification/clear-all/${userId}?role=${role}`;
  try {
    const res = await fetchWithTimeout(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return await handleRes(res);
  } catch (err) {
    throw err;
  }
}

/**
 * ৪. নোটিফিকেশন ডিলিট করার ফাংশন
 */
export async function deleteNotification(id: string) {
  const url = `${API_BASE}/api/notification/${id}`;
  try {
    const res = await fetchWithTimeout(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return await handleRes(res);
  } catch (err) {
    throw err;
  }
}