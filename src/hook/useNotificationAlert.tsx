import { useEffect, useCallback, useRef, ReactNode } from "react";
import { toast } from "react-hot-toast";

interface NotificationAlertOptions {
  pollInterval?: number;
  userEmail?: string;
}

interface Notification {
  _id?: string;
  id?: string;
  title: string;
  message: string;
  timestamp?: string;
}

// Function to play notification sound
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc1.frequency.value = 800;
    osc2.frequency.value = 1200;
    osc1.type = 'sine';
    osc2.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);

    osc1.start(audioContext.currentTime);
    osc2.start(audioContext.currentTime);

    osc1.stop(audioContext.currentTime + 0.6);
    osc2.stop(audioContext.currentTime + 0.6);
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
};

export const useNotificationAlert = (options: NotificationAlertOptions = {}) => {
  const { pollInterval = 3000, userEmail } = options;
  const lastNotificationIdRef = useRef<string | null>(null);
  const lastNotificationTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const API_BASE =
    (typeof process !== "undefined" && process.env.REACT_APP_API_URL?.replace(/\/$/, "")) ?? "http://localhost:3200";

  const fetchNotifications = useCallback(async () => {
    try {
      const endpoint = userEmail
        ? `${API_BASE}/api/notification/user/${userEmail}`
        : `${API_BASE}/api/notification/getall`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return;
      }

      if (!response.ok) {
        return;
      }

      const notifications: Notification[] = await response.json();

      if (Array.isArray(notifications) && notifications.length > 0) {
        const latestNotification = notifications[0];
        const notificationId = latestNotification._id || latestNotification.id;
        const currentTime = Date.now();

        if (
          notificationId &&
          (lastNotificationIdRef.current !== notificationId ||
            currentTime - lastNotificationTimeRef.current > 10000)
        ) {
          lastNotificationIdRef.current = notificationId;
          lastNotificationTimeRef.current = currentTime;

          // 🔥 আরও বড় সাইজ — মোবাইলের জন্য খুবই readable
          const content: ReactNode = (
            <div className="flex flex-col gap-6 py-3">
              <p className="text-5xl font-extrabold tracking-tight leading-none text-white">
                {latestNotification.title}
              </p>
              <p className="text-3xl font-medium leading-relaxed text-white/95">
                {latestNotification.message}
              </p>
            </div>
          );

          // Play sound
          playNotificationSound();

          // Toast styling — মোবাইলে বড় এবং clear দেখাবে
          toast.success(content, {
            duration: 8000,              // আরও বেশি সময় দেখাবে
            position: "top-right",
            icon: <span className="text-6xl">🔔</span>,
            style: {
              border: "3px solid #f59e0b",
              background: "linear-gradient(135deg, #1e293b 0%, #111827 100%)",
              color: "#ffffff",
              padding: "28px 32px",       // আরও বড় padding
              borderRadius: "24px",
              boxShadow: "0 30px 40px -10px rgba(0, 0, 0, 0.6)",
              maxWidth: "92vw",           // মোবাইলে প্রায় পুরো স্ক্রিন জুড়ে
              minWidth: "320px",
              fontFamily: "Inter, system-ui, sans-serif",
            },
          });

          console.log("Bigger notification shown:", latestNotification);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [API_BASE, userEmail]);

  useEffect(() => {
    fetchNotifications();

    intervalRef.current = setInterval(() => {
      fetchNotifications();
    }, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchNotifications, pollInterval]);

  return { fetchNotifications };
};