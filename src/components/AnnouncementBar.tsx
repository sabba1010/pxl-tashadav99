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
                // Filter for announcements that target this user or "all"
                const announcements = res.filter((n: NItem) => {
                    if (n.type !== "announcement") return false;

                    const isAll = n.target === "all";
                    const isRoleMatch = userRole && n.target === `${userRole}s`;
                    const isDirect = n.userEmail === currentUserEmail;

                    return isAll || isRoleMatch || isDirect;
                });

                if (announcements.length > 0) {
                    // Get the most recent one
                    const latest = announcements.sort((a, b) =>
                        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                    )[0];

                    // Check if user has dismissed this specific announcement
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
        // Poll for new announcements every 30 seconds
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
        <div className="relative isolate flex items-center w-full overflow-hidden px-4 py-3 md:px-6 md:py-2.5"
            style={{ background: 'linear-gradient(90deg, #0A1A3A 0%, #1a3a6e 50%, #D4A643 100%)' }}>

            {/* Content Container */}
            <div className="w-full flex flex-row items-center justify-between gap-x-4 pr-8 md:pr-10">
                <div className="flex flex-row items-center gap-x-2 text-sm leading-6 text-white">
                    <span className="flex items-center gap-2 font-bold text-[#D4A643]">
                        <Megaphone className="h-4 w-4" />
                        {currentAnnouncement.title}
                    </span>

                    <span className="hidden md:inline text-white/40">•</span>

                    <span className="opacity-90 text-xs md:text-sm">
                        {currentAnnouncement.message || currentAnnouncement.description}
                    </span>
                </div>

                {currentAnnouncement.link && (
                    <a
                        href={currentAnnouncement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-fit rounded-full bg-white/10 px-4 py-1 text-xs font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20 transition-all flex items-center gap-2 ml-auto"
                    >
                        Learn more <ArrowRight className="h-3 w-3" />
                    </a>
                )}
            </div>

            {/* Close Button */}
            <div className="absolute right-2 top-2 md:relative md:right-auto md:top-auto md:flex-shrink-0">
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}