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
    
    // Create multiple oscillators for a pleasant bell-like sound
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Bell-like frequencies
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
    (typeof process !== "undefined" && process.env.REACT_APP_API_URL?.replace(/\/$/, "")) ?? "https://tasha-vps-backend-2.onrender.com";

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

      if (!response.ok) {
        console.error("Failed to fetch notifications");
        return;
      }

      const notifications: Notification[] = await response.json();

      if (Array.isArray(notifications) && notifications.length > 0) {
        const latestNotification = notifications[0];
        const notificationId = latestNotification._id || latestNotification.id;
        const currentTime = Date.now();

        console.log("Fetched notifications:", notifications.length);
        console.log("Latest notification ID:", notificationId);
        console.log("Last notification ID ref:", lastNotificationIdRef.current);

        if (
          notificationId &&
          (lastNotificationIdRef.current !== notificationId ||
            currentTime - lastNotificationTimeRef.current > 10000)
        ) {
          lastNotificationIdRef.current = notificationId;
          lastNotificationTimeRef.current = currentTime;

          const content: ReactNode = (
            <div>
              <p className="font-semibold">{latestNotification.title}</p>
              <p className="text-sm">{latestNotification.message}</p>
            </div>
          );

          console.log("Triggering toast for:", latestNotification.title);

          // Play notification sound
          playNotificationSound();

          // Show toast alert
          toast.success(content, {
            duration: 5000,
            position: "top-right",
            icon: "🔔",
          });

          console.log("Notification shown:", latestNotification);
        } else {
          console.log("Notification already shown or too recent");
        }
      } else {
        console.log("No notifications found");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [API_BASE, userEmail]);

  useEffect(() => {
    console.log("Starting notification polling with interval:", pollInterval);

    fetchNotifications();

    intervalRef.current = setInterval(() => {
      fetchNotifications();
    }, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log("Stopped notification polling");
      }
    };
  }, [fetchNotifications, pollInterval]);

  return { fetchNotifications };
};
