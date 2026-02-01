import React, { useState, useEffect } from 'react';
import { createAnnouncement, AnnouncementPayload } from '../../components/Notification/Notification';
import { toast } from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query";

// TypeScript এর এরর ফিক্স করার জন্য এখানে টাইপটি এক্সটেন্ড করা হয়েছে
interface UpdatedAnnouncementPayload extends AnnouncementPayload {
    link?: string;
}

interface Notification {
    _id?: string;
    id?: string;
    title: string;
    message: string;
    target?: string;
    timestamp?: string;
    createdAt?: string;
}

const SentNotification = () => {
    const [formData, setFormData] = useState<UpdatedAnnouncementPayload>({
        title: '',
        message: '',
        target: 'all',
        displayType: 'alert',
        link: ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    // const [notifications, setNotifications] = useState<Notification[]>([]); // Replaced via useQuery
    // const [loadingNotifications, setLoadingNotifications] = useState(false);

    // Play notification sound
    const playNotificationSound = () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Create a pleasant notification sound (bell-like)
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    };

    // Fetch all notifications using React Query
    const fetchNotificationsData = async (): Promise<Notification[]> => {
        const API_BASE = process.env.REACT_APP_API_URL?.replace(/\/$/, "") ?? "http://localhost:3200";
        const response = await fetch(`${API_BASE}/api/notification/getall`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        }
        return [];
    };

    const { data: notifications = [], isLoading: loadingNotifications, refetch } = useQuery({
        queryKey: ["adminSentNotifications"],
        queryFn: fetchNotificationsData,
        refetchInterval: 5000,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await createAnnouncement(formData as AnnouncementPayload);

            const successMsg = 'Announcement sent successfully!';
            setStatus({ type: 'success', msg: successMsg });

            // Play notification sound
            playNotificationSound();

            // Show toast alert
            toast.success(
                <div>
                    <p className="font-semibold">{formData.title}</p>
                    <p className="text-sm">{formData.message}</p>
                </div>,
                {
                    duration: 5000,
                    position: "top-right",
                    icon: "📢",
                }
            );

            setFormData({ title: '', message: '', target: 'all', displayType: 'alert', link: '' });
            await refetch();
        } catch (err: any) {
            const errorMsg = err.message || 'Something went wrong';
            setStatus({ type: 'error', msg: errorMsg });
            toast.error(errorMsg, { duration: 5000, position: "top-right" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '0' }}>
            {/* Send Notification Form */}
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
                <h2 style={{ marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>📢 Broadcast Announcement</h2>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>Send notifications to users with sound alert and optional action links.</p>
                <hr style={{ marginBottom: '20px' }} />

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Title:</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            placeholder="E.g. System Maintenance"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Message Body */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Message:</label>
                        <textarea
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            placeholder="Write your announcement details here..."
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        />
                    </div>

                    {/* Action Link */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Action Link (Optional):</label>
                        <input
                            type="url"
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            placeholder="https://example.com/details"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        />
                    </div>

                    {/* Target Selection */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Send To:</label>
                        <select
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                            value={formData.target}
                            onChange={(e) => setFormData({ ...formData, target: e.target.value as any })}
                        >
                            <option value="all">Everyone (All Users)</option>
                            <option value="buyers">Buyers Only</option>
                            <option value="sellers">Sellers Only</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#4F46E5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? '🔄 Processing...' : '📤 Send Announcement'}
                    </button>
                </form>

                {/* Status Feedback */}
                {status && (
                    <div style={{
                        marginTop: '20px',
                        padding: '12px',
                        borderRadius: '6px',
                        backgroundColor: status.type === 'success' ? '#DEF7EC' : '#FDE8E8',
                        color: status.type === 'success' ? '#03543F' : '#9B1C1C',
                        textAlign: 'center',
                        border: `1px solid ${status.type === 'success' ? '#31C48D' : '#F98080'}`,
                        fontWeight: '500'
                    }}>
                        {status.type === 'success' ? '✅' : '❌'} {status.msg}
                    </div>
                )}
            </div>

            {/* All Notifications List */}
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>🔔 All Notifications ({notifications.length})</h2>
                    <button
                        onClick={() => refetch()}
                        disabled={loadingNotifications}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: loadingNotifications ? 'not-allowed' : 'pointer',
                            opacity: loadingNotifications ? 0.7 : 1
                        }}
                    >
                        {loadingNotifications ? '🔄 Refreshing...' : '🔃 Refresh'}
                    </button>
                </div>

                {notifications.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No notifications yet.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                        {notifications.map((notif, index) => (
                            <div
                                key={notif._id || notif.id || index}
                                style={{
                                    padding: '12px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '6px',
                                    backgroundColor: '#f9fafb',
                                    borderLeft: '4px solid #4F46E5'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '1rem' }}>
                                            🔔 {notif.title}
                                        </p>
                                        <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
                                            {notif.message}
                                        </p>
                                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#999', flexWrap: 'wrap' }}>
                                            {notif.target && <span>👥 Target: <strong>{notif.target}</strong></span>}
                                            {(notif.timestamp || notif.createdAt) && (
                                                <span>
                                                    📅 {new Date(notif.timestamp || notif.createdAt || '').toLocaleDateString()} {new Date(notif.timestamp || notif.createdAt || '').toLocaleTimeString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SentNotification;