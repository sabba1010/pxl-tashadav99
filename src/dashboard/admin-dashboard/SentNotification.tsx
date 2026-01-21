import React, { useState } from 'react';
import { createAnnouncement, AnnouncementPayload } from '../../components/Notification/Notification';

// TypeScript এর এরর ফিক্স করার জন্য এখানে টাইপটি এক্সটেন্ড করা হয়েছে
interface UpdatedAnnouncementPayload extends AnnouncementPayload {
    link?: string;
}

const SentNotification = () => {
    const [formData, setFormData] = useState<UpdatedAnnouncementPayload>({
        title: '',
        message: '',
        target: 'all',
        displayType: 'alert', // এটি ডিফল্ট হিসেবে থাকবে কিন্তু UI তে ইনপুট থাকবে না
        link: '' 
    });
    
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            // createAnnouncement কল করার সময় টাইপ কাস্টিং করা হয়েছে
            await createAnnouncement(formData as AnnouncementPayload);
            
            setStatus({ type: 'success', msg: 'Announcement sent successfully!' });
            // ফর্ম রিসেট
            setFormData({ title: '', message: '', target: 'all', displayType: 'alert', link: '' });
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.message || 'Something went wrong' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', fontFamily: 'sans-serif' }}>
            <h2 style={{ marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>Broadcast Announcement</h2>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>Send notifications to users with optional action links.</p>
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
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                    />
                </div>

                {/* Target Selection */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>Send To:</label>
                    <select 
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' }}
                        value={formData.target}
                        onChange={(e) => setFormData({...formData, target: e.target.value as any})}
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
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    {loading ? 'Processing...' : 'Send Announcement'}
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
                    border: `1px solid ${status.type === 'success' ? '#31C48D' : '#F98080'}`
                }}>
                    {status.msg}
                </div>
            )}
        </div>
    );
};

export default SentNotification;