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
            setStatus({ type: 'success', msg: 'Announcement sent successfully!' });
            setFormData({ title: '', message: '', target: 'all', displayType: 'alert' }); // Reset form
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.message || 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h2 style={{ marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>Announcements & Notifications</h2>
            <hr style={{ marginBottom: '20px' }} />
            
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: '600' }}>Title:</label>
                    <input 
                        type="text" 
                        style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        placeholder="Enter announcement title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>

                {/* Message Body */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: '600' }}>Message:</label>
                    <textarea 
                        style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        placeholder="Write your message here..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                    />
                </div>

                {/* Target Selection */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: '600' }}>Send To:</label>
                    <select 
                        style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        value={formData.target}
                        onChange={(e) => setFormData({...formData, target: e.target.value as any})}
                    >
                        <option value="all">All Users</option>
                        <option value="buyers">Buyers Only</option>
                        <option value="sellers">Sellers Only</option>
                    </select>
                </div>

                {/* Display Type */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontWeight: '600' }}>Show As:</label>
                    <select 
                        style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                        value={formData.displayType}
                        onChange={(e) => setFormData({...formData, displayType: e.target.value as any})}
                    >
                        <option value="alert">Alert (Toast)</option>
                        <option value="popup">Popup (Modal)</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        backgroundColor: '#ff4d4d', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                >
                    {loading ? 'Sending...' : 'Send Announcement'}
                </button>
            </form>

            {/* Status Message */}
            {status && (
                <div style={{ 
                    marginTop: '15px', 
                    padding: '10px', 
                    borderRadius: '4px',
                    backgroundColor: status.type === 'success' ? '#e6fffa' : '#fff5f5',
                    color: status.type === 'success' ? '#2f855a' : '#c53030', 
                    textAlign: 'center',
                    border: `1px solid ${status.type === 'success' ? '#38a169' : '#e53e3e'}`
                }}>
                    {status.msg}
                </div>
            )}
        </div>
    );
};

export default SentNotification;