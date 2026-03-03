import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: Map<string, any>;
    unreadCounts: Map<string, number>;
    isConnected: boolean;
    markOrderRead: (orderId: string) => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: new Map(),
    unreadCounts: new Map(),
    isConnected: false,
    markOrderRead: () => { },
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<Map<string, any>>(new Map());
    const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map());

    const { user } = useAuth();
    const userId = user?.email;

    useEffect(() => {
        const newSocket = io("http://localhost:3200"); // Adjust URL for production
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log("Socket Connected", newSocket.id);
            setIsConnected(true);
            if (userId) {
                newSocket.emit('user_connected', userId);
                fetchInitialCounts(userId);
            }
        });

        newSocket.on('disconnect', () => {
            console.log("Socket Disconnected");
            setIsConnected(false);
        });

        newSocket.on('user_status_update', (data: { userId: string, status: string, lastSeen: string }) => {
            setOnlineUsers(prev => {
                const newMap = new Map(prev);
                newMap.set(data.userId, { status: data.status, lastSeen: data.lastSeen });
                return newMap;
            });
        });

        newSocket.on('unread_count_update', (data: { orderId: string, count: number }) => {
            setUnreadCounts(prev => {
                const newMap = new Map(prev);
                newMap.set(data.orderId, data.count);
                return newMap;
            });
        });

        newSocket.on('notification_update', (data: any) => {
            // Can show toast here if needed
            console.log("New Notification", data);
        });

        return () => {
            newSocket.close();
        };
    }, [userId]);

    const fetchInitialCounts = async (uid: string) => {
        try {
            const res = await axios.get<Record<string, number>>(`http://localhost:3200/chat/unread/counts/${uid}`);
            const counts = res.data; // Now correctly inferred as Record<string, number>
            const countMap = new Map<string, number>();
            Object.keys(counts).forEach(key => {
                countMap.set(key, counts[key]);
            });
            setUnreadCounts(countMap);
        } catch (error) {
            console.error("Failed to fetch unread counts", error);
        }
    };

    const markOrderRead = (orderId: string) => {
        // Optimistic update
        setUnreadCounts(prev => {
            const newMap = new Map(prev);
            newMap.set(orderId, 0);
            return newMap;
        });

        if (socket && userId) {
            // Also call API
            axios.post(`http://localhost:3200/chat/mark-read`, { userId, orderId })
                .catch(err => console.error(err));
        }
    };

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, unreadCounts, isConnected, markOrderRead }}>
            {children}
        </SocketContext.Provider>
    );
};
