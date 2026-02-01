import React, { useMemo } from 'react';
import { useSocket } from '../context/SocketContext';

interface UserActivityStatusProps {
    userId: string;
    showText?: boolean;
}

const UserActivityStatus: React.FC<UserActivityStatusProps> = ({ userId, showText = true }) => {
    const { onlineUsers } = useSocket();

    const userStatus = onlineUsers.get(userId);
    const isOnline = userStatus?.status === 'online';
    const lastSeen = userStatus?.lastSeen;

    const statusText = useMemo(() => {
        if (isOnline) return "Active now";
        if (!lastSeen) return "Offline";

        const date = new Date(lastSeen);
        if (isNaN(date.getTime())) return "Offline";

        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin < 1) return "Just now";
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }, [isOnline, lastSeen]);

    return (
        <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
            {showText && (
                <span className={`text-[10px] font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                    {statusText}
                </span>
            )}
        </div>
    );
};

export default UserActivityStatus;
