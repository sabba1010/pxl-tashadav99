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
        <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1"
            style={{ background: 'linear-gradient(90deg, #0A1A3A 0%, #1a3a6e 50%, #D4A643 100%)' }}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-sm leading-6 text-white flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-[#D4A643]" />
                    <strong className="font-semibold">{currentAnnouncement.title}</strong>
                    <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                        <circle cx={1} cy={1} r={1} />
                    </svg>
                    {currentAnnouncement.message || currentAnnouncement.description}
                </p>
                {currentAnnouncement.link && (
                    <a
                        href={currentAnnouncement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-none rounded-full bg-white/10 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white flex items-center gap-1 transition-all"
                    >
                        Learn more <ArrowRight className="h-3 w-3" />
                    </a>
                )}
            </div>
            <div className="flex flex-1 justify-end">
                <button type="button" onClick={handleDismiss} className="-m-3 p-3 focus-visible:outline-offset-[-4px] text-white/70 hover:text-white transition-colors">
                    <span className="sr-only">Dismiss</span>
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
