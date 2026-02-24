/**
 * Utility functions for formatting dates and times in Nigerian Time (WAT).
 * Nigerian Time is UTC+1 (Africa/Lagos)
 */

export const WAT_TIMEZONE = "Africa/Lagos";

/**
 * Formats a date into a localized Nigerian time string.
 * @param date - Date object, ISO string, or timestamp
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted time string
 */
export const formatToWAT = (
    date: Date | string | number | undefined,
    options: Intl.DateTimeFormatOptions = {}
): string => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";

    return d.toLocaleString("en-GB", {
        timeZone: WAT_TIMEZONE,
        ...options,
    });
};

/**
 * Specific formatter for chat-like time displays.
 * e.g., "10:30 AM" or "Feb 24, 10:30 AM"
 */
export const formatChatTimeWAT = (dateString?: string): string => {
    if (!dateString) return "Just now";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Just now";

        // Get current time in WAT
        const nowStr = new Date().toLocaleString("en-US", { timeZone: WAT_TIMEZONE });
        const now = new Date(nowStr);

        const msgTimeStr = date.toLocaleString("en-US", { timeZone: WAT_TIMEZONE });
        const msgTime = new Date(msgTimeStr);

        const diffInSeconds = Math.floor((now.getTime() - msgTime.getTime()) / 1000);

        // If less than 24 hours ago, just show time
        if (diffInSeconds >= 0 && diffInSeconds < 86400) {
            return date.toLocaleTimeString("en-US", {
                timeZone: WAT_TIMEZONE,
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        }

        // Otherwise show date and time
        return date.toLocaleDateString("en-US", {
            timeZone: WAT_TIMEZONE,
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    } catch {
        return "Just now";
    }
};

/**
 * Returns a relative time string (e.g., "2 minutes ago") aligned with WAT.
 */
export const getRelativeTimeWAT = (dateString?: string): string => {
    if (!dateString) return "Offline";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime()) || date.getTime() === 0) return "Offline";

        // Since we want relative time, we compare current system time with the date.
        // However, we must ensure we are comparing "now" and "date" accurately.
        // Relative time is inherently independent of timezone IF both timestamps are UTC.
        // But for display consistency, we use the same date parsing.

        const now = new Date(); // local runtime "now"
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin < 1) return "Last seen just now";
        if (diffMin < 60) return `Last seen ${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;

        const diffHours = Math.floor(diffMin / 60);
        if (diffHours < 24) return `Last seen ${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;

        return `Last seen on ${date.toLocaleDateString("en-US", {
            timeZone: WAT_TIMEZONE,
            month: "short",
            day: "numeric",
        })}`;
    } catch {
        return "Offline";
    }
};
