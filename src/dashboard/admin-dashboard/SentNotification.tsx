import React, { useState } from 'react';
import { createAnnouncement, AnnouncementPayload } from '../../components/Notification/Notification';

const SentNotification = () => {
    const [formData, setFormData] = useState<AnnouncementPayload>({
        title: '',
        message: '',
        target: 'all',
        displayType: 'alert'
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            await createAnnouncement(formData);
            setStatus({ type: 'success', msg: 'ঘোষণাটি সফলভাবে পাঠানো হয়েছে!' });
            setFormData({ title: '', message: '', target: 'all', displayType: 'alert' }); // রিসেট ফর্ম
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.message || 'কিছু একটা ভুল হয়েছে' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Announcements & Notifications</h2>
            <hr />
            
            <form onSubmit={handleSubmit}>
                {/* টাইটেল */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Title:</label>
                    <input 
                        type="text" 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>

                {/* মেসেজ বডি */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Message:</label>
                    <textarea 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                    />
                </div>

                {/* টার্গেট সিলেকশন (কার কাছে যাবে) */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Send To:</label>
                    <select 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        value={formData.target}
                        onChange={(e) => setFormData({...formData, target: e.target.value as any})}
                    >
                        <option value="all">All Users</option>
                        <option value="buyers">Buyers Only</option>
                        <option value="sellers">Sellers Only</option>
                    </select>
                </div>

                {/* ডিসপ্লে টাইপ (এলার্ট না পপআপ) */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Show As:</label>
                    <select 
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        value={formData.displayType}
                        onChange={(e) => setFormData({...formData, displayType: e.target.value as any})}
                    >
                        <option value="alert">Alert (Toast)</option>
                        <option value="popup">Popup (Modal)</option>
                    </select>
                </div>

                {/* সাবমিট বাটন */}
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        backgroundColor: '#ff4d4d', 
                        color: 'white', 
                        border: 'none', 
                        cursor: loading ? 'not-allowed' : 'pointer' 
                    }}
                >
                    {loading ? 'Sending...' : 'Send Announcement'}
                </button>
            </form>

            {/* স্ট্যাটাস মেসেজ */}
            {status && (
                <p style={{ marginTop: '15px', color: status.type === 'success' ? 'green' : 'red', textAlign: 'center' }}>
                    {status.msg}
                </p>
            )}
        </div>
    );
};

export default SentNotification;