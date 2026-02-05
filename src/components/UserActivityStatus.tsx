import React, { useMemo } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';

interface UserActivityStatusProps {
    userId: string;
    showText?: boolean;
}

interface StatusResponse {
    online: boolean;
    lastSeen: string;
}

const UserActivityStatus: React.FC<UserActivityStatusProps> = ({ userId, showText = true }) => {
    const { onlineUsers } = useSocket();

    const userStatus = onlineUsers.get(userId);
    const [fetchedStatus, setFetchedStatus] = React.useState<{ status: string, lastSeen: string } | null>(null);
    const [tick, setTick] = React.useState(0);

    // Initial fetch if socket doesn't have it yet
    React.useEffect(() => {
        if (!userStatus && userId) {
            axios.get<StatusResponse>(`http://localhost:3200/chat/status/${userId}`)
                .then(res => {
                    const data = res.data;
                    setFetchedStatus({
                        status: data.online ? 'online' : 'offline',
                        lastSeen: data.lastSeen
                    });
                })
                .catch(err => console.error("Failed to fetch user status", err));
        }
    }, [userId, userStatus]);

    // Force re-render every minute to update "Xm ago" text
    React.useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(timer);
    }, []);

    const finalStatus = userStatus || fetchedStatus;
    const isOnline = finalStatus?.status === 'online';
    const lastSeen = finalStatus?.lastSeen;

    return (
        <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
            {showText && (
                <span className={`text-[10px] font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                    {(() => {
                        if (isOnline) return "Active now";
                        if (!lastSeen) return "Offline";
                        const date = new Date(lastSeen);
                        if (isNaN(date.getTime()) || date.getTime() === 0) return "Offline";
                        const now = new Date();
                        const diffMs = now.getTime() - date.getTime();
                        const diffMin = Math.floor(diffMs / 60000);
                        if (diffMin < 1) return "Just now";
                        if (diffMin < 60) return `${diffMin}m ago`;
                        if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
                        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    })()}
                </span>
            )}
        </div>
    );
};

export default UserActivityStatus;
