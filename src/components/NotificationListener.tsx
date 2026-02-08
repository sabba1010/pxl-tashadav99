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
        position="top-center"
        reverseOrder={false}
        gutter={16}
        containerStyle={{
          top: 20,
        }}
        toastOptions={{
          duration: 6000,
          style: {
            background: "rgba(17, 24, 39, 0.97)",
            color: "#ffffff",
            padding: "28px 36px",
            borderRadius: "16px",
            fontSize: "19px",
            fontWeight: "500",
            minWidth: "600px",
            maxWidth: "800px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 40px rgba(59, 130, 246, 0.3)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            backdropFilter: "blur(20px)",
            zIndex: 99999,
          },
          success: {
            duration: 6000,
            style: {
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)",
              color: "white",
              padding: "32px 40px",
              borderRadius: "16px",
              fontSize: "20px",
              fontWeight: "600",
              minWidth: "650px",
              maxWidth: "850px",
              boxShadow: "0 25px 70px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 50px rgba(16, 185, 129, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(20px)",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#10b981",
            },
          },
          error: {
            duration: 6000,
            style: {
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)",
              color: "white",
              padding: "32px 40px",
              borderRadius: "16px",
              fontSize: "20px",
              fontWeight: "600",
              minWidth: "650px",
              maxWidth: "850px",
              boxShadow: "0 25px 70px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 50px rgba(239, 68, 68, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(20px)",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#ef4444",
            },
          },
          loading: {
            style: {
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)",
              color: "white",
              padding: "32px 40px",
              borderRadius: "16px",
              fontSize: "20px",
              fontWeight: "600",
              minWidth: "650px",
              maxWidth: "850px",
              boxShadow: "0 25px 70px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2), 0 0 50px rgba(59, 130, 246, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(20px)",
            },
          },
        }}
      />
    </>
  );
};

export default NotificationListener;
