import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_BASE_URL, SOCKET_URL } from '../config';

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
        const newSocket = io(SOCKET_URL); 
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
            // Derived purely from top-bar notifications logic
            const res = await axios.get(`${API_BASE_URL}/notification/getall?userId=${uid}`);
            const notifications = res.data;
            
            if (Array.isArray(notifications)) {
                const countMap = new Map<string, number>();
                notifications.forEach((n: any) => {
                    const isUnread = n.userEmail === uid ? !n.read : !n.readBy?.includes(uid);
                    if (n.type === 'chat' && isUnread && n.relatedId) {
                        const current = countMap.get(n.relatedId) || 0;
                        countMap.set(n.relatedId, current + 1);
                    }
                });
                setUnreadCounts(countMap);
            }
        } catch (error) {
            console.error("Failed to fetch unread counts from notifications", error);
        }
    };

    useEffect(() => {
        if (!userId) return;
        fetchInitialCounts(userId);
        // Sync identically with Navbar's 8-second polling
        const intervalId = setInterval(() => {
            fetchInitialCounts(userId);
        }, 8000);
        return () => clearInterval(intervalId);
    }, [userId]);

    const markOrderRead = (orderId: string) => {
        // Optimistic update
        setUnreadCounts(prev => {
            const newMap = new Map(prev);
            newMap.set(orderId, 0);
            return newMap;
        });

        if (socket && userId) {
            // Also call API
            axios.post(`${API_BASE_URL}/chat/mark-read`, { userId, orderId })
                .catch(err => console.error(err));
        }
    };

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, unreadCounts, isConnected, markOrderRead }}>
            {children}
        </SocketContext.Provider>
    );
};
