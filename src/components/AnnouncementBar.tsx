import { useState, useEffect, useCallback } from "react";
import { X, Megaphone, ArrowRight } from "lucide-react";
import { getAllNotifications } from "./Notification/Notification";
import { useAuthHook } from "../hook/useAuthHook";

interface NItem {
    _id?: string;
    type?: string;
    title: string;
    message?: string;
    description?: string;
    link?: string;
    read?: boolean;
    createdAt?: string;
    userEmail?: string;
    target?: string;
}

export default function AnnouncementBar() {
    const [currentAnnouncement, setCurrentAnnouncement] = useState<NItem | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const loginUserData = useAuthHook();
    const currentUserEmail = loginUserData.data?.email || localStorage.getItem("userEmail");
    const userRole = loginUserData.data?.role;

    const fetchAnnouncements = useCallback(async () => {
        try {
            const res = await getAllNotifications();
            if (Array.isArray(res)) {
                const announcements = res.filter((n: NItem) => {
                    if (n.type !== "announcement") return false;

                    const isAll = n.target === "all";
                    const isRoleMatch = userRole && n.target === `${userRole}s`;
                    const isDirect = n.userEmail === currentUserEmail;

                    return isAll || isRoleMatch || isDirect;
                });

                if (announcements.length > 0) {
                    const latest = announcements.sort((a, b) =>
                        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                    )[0];

                    const dismissedId = localStorage.getItem(`dismissed_announcement_${latest._id}`);
                    if (!dismissedId) {
                        setCurrentAnnouncement(latest);
                        setIsVisible(true);
                    }
                } else {
                    setIsVisible(false);
                }
            }
        } catch (err) {
            console.error("Failed to fetch announcements:", err);
        }
    }, [currentUserEmail, userRole]);

    useEffect(() => {
        fetchAnnouncements();
        const interval = setInterval(fetchAnnouncements, 30000);
        return () => clearInterval(interval);
    }, [fetchAnnouncements]);

    const handleDismiss = () => {
        if (currentAnnouncement?._id) {
            localStorage.setItem(`dismissed_announcement_${currentAnnouncement._id}`, "true");
        }
        setIsVisible(false);
    };

    if (!isVisible || !currentAnnouncement) return null;

    return (
        <div 
            className="relative isolate w-full overflow-hidden px-3 py-2 sm:px-4 sm:py-2.5"
            style={{ background: 'linear-gradient(90deg, #0A1A3A 0%, #1a3a6e 50%, #D4A643 100%)' }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-center relative">
                {/* All content very close & centered */}
                <div className="flex flex-row flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-1.5 text-white">
                    {/* Icon + Title */}
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <Megaphone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#D4A643]" />
                        <span className="font-bold text-[#D4A643] text-xs sm:text-sm whitespace-nowrap">
                            {currentAnnouncement.title}
                        </span>
                    </div>

                    {/* Separator */}
                    <span className="text-white/40 text-xs sm:text-sm">•</span>

                    {/* Message - centered on mobile, left on desktop */}
                    <span className="text-xs sm:text-sm opacity-90 text-center sm:text-left flex-grow max-w-[60%] sm:max-w-none">
                        {currentAnnouncement.message || currentAnnouncement.description}
                    </span>

                    {/* Learn More Button */}
                    {currentAnnouncement.link && (
                        <a
                            href={currentAnnouncement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs sm:text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20 transition-all flex-shrink-0"
                        >
                            Learn more
                            <ArrowRight className="h-3 w-3" />
                        </a>
                    )}
                </div>

                {/* Close Button - very close to content */}
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
            </div>
        </div>
    );
}