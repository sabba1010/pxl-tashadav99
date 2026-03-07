import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
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
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const checkOverflow = useCallback(() => {
        if (containerRef.current && contentRef.current) {
            // Measure the content's natural width (scrollWidth) against the container's available width (clientWidth)
            const contentWidth = contentRef.current.scrollWidth;
            const containerWidth = containerRef.current.clientWidth;

            // We consider it overflowing if the content width is greater than container width
            setIsOverflowing(contentWidth > containerWidth);
        }
    }, []);

    useLayoutEffect(() => {
        // Short delay to ensure browser has calculated layout
        const timeout = setTimeout(checkOverflow, 100);
        window.addEventListener('resize', checkOverflow);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', checkOverflow);
        };
    }, [checkOverflow, currentAnnouncement]);

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
            className="relative isolate w-full overflow-hidden px-0 py-2 sm:px-4 sm:py-2.5"
            style={{ background: 'linear-gradient(90deg, #0A1A3A 0%, #1a3a6e 50%, #D4A643 100%)' }}
        >
            <style>
                {`
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                    }
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        display: inline-flex;
                        animation: marquee 30s linear infinite;
                    }
                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                    .marquee-container {
                        display: flex;
                        justify-content: center;
                        width: 100%;
                    }
                    .marquee-container.is-overflowing {
                        justify-content: flex-start;
                    }
                `}
            </style>
            <div className="max-w-7xl mx-auto flex items-center relative px-2 sm:px-8 overflow-hidden h-full py-1">
                {/* FIXED TITLE SECTION */}
                <div className="flex items-center gap-x-1.5 sm:gap-x-3 flex-shrink-0 z-10">
                    <Megaphone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#D4A643]" />
                    <span className="font-bold text-[#D4A643] text-xs sm:text-sm uppercase tracking-wider">
                        {currentAnnouncement.title}
                    </span>
                    <span className="text-white/40 text-xs sm:text-sm px-1.5 opacity-60">·</span>
                </div>

                {/* ADAPTIVE SECTION - ONLY SCROLLS IF OVERFLOWING */}
                <div
                    className={`flex-1 overflow-hidden relative marquee-container ${isOverflowing ? 'is-overflowing' : ''}`}
                    ref={containerRef}
                >
                    <div
                        className={`flex items-center ${isOverflowing ? 'animate-marquee gap-x-8 sm:gap-x-16 whitespace-nowrap' : 'justify-center'} min-w-full`}
                        ref={contentRef}
                    >
                        {/* Set 1 */}
                        <span className="text-xs sm:text-sm text-white/95 leading-normal text-center px-2">
                            {currentAnnouncement.message || currentAnnouncement.description}
                        </span>

                        {/* Set 2 for seamless loop - ONLY RENDER IF OVERFLOWING */}
                        {isOverflowing && (
                            <span className="text-xs sm:text-sm text-white/95 leading-normal text-center px-2">
                                {currentAnnouncement.message || currentAnnouncement.description}
                            </span>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE (Link & Close) */}
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 z-10 ml-2">
                    {/* FIXED LINK SECTION */}
                    {currentAnnouncement.link && (
                        <div className="pl-2 sm:pl-4 border-l border-white/20">
                            <a
                                href={currentAnnouncement.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-[10px] sm:text-xs font-semibold text-white ring-1 ring-inset ring-white/20 hover:bg-white/20 transition-all flex-shrink-0"
                            >
                                <span className={`${isOverflowing ? 'inline' : 'hidden sm:inline'}`}>Learn more</span>
                                <ArrowRight className="h-3 w-3" />
                            </a>
                        </div>
                    )}

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="p-1 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/10"
                    >
                        <span className="sr-only">Dismiss</span>
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}