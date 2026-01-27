import React, { useEffect } from "react";
import { useNotificationAlert } from "../hook/useNotificationAlert";
import { Toaster } from "react-hot-toast";

interface NotificationListenerProps {
  userEmail?: string;
  pollInterval?: number;
}

/**
 * Component that listens for new notifications and displays toast alerts with sound
 */
export const NotificationListener: React.FC<NotificationListenerProps> = ({
  userEmail,
  pollInterval = 3000,
}) => {
  useNotificationAlert({
    userEmail,
    pollInterval,
  });

  useEffect(() => {
    console.log("NotificationListener mounted with email:", userEmail);
  }, [userEmail]);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#fff",
            color: "#333",
            zIndex: 9999,
          },
          success: {
            style: {
              background: "#10b981",
              color: "white",
            },
          },
          error: {
            style: {
              background: "#ef4444",
              color: "white",
            },
          },
        }}
      />
    </>
  );
};

export default NotificationListener;
