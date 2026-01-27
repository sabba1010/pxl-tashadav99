import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthHook } from '../../hook/useAuthHook'; 
import { 
    Box, Typography, Avatar, Paper, Stack, 
    InputBase, IconButton 
} from '@mui/material';
import { 
    Send, FiberManualRecord, AttachFile, 
    AdminPanelSettings 
} from '@mui/icons-material';

// প্রপসগুলোকে অপশনাল (?) করে দেওয়া হয়েছে যেন Routes.tsx এ এরর না আসে
interface ChatProps {
    sellerId?: string;
    adminId?: string;
    orderId?: string;
}

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    message: string;
    imageUrl?: string | null;
    timestamp: string;
}

interface StatusResponse {
    online: boolean;
    lastSeenText: string;
}

const API_BASE_URL = 'http://localhost:3200/api'; 

const SellerAdminChat: React.FC<ChatProps> = () => {
    const auth = useAuthHook() as any; 
    const user = auth?.user;

    // আপনার স্ক্রিনশট অনুযায়ী আইডিগুলো
    const sellerEmail = user?.email; 
    const adminEmail = "admin@gmail.com"; 

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [onlineStatus, setOnlineStatus] = useState({ online: false, text: 'Connecting...' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    // চ্যাট হিস্টোরি ফেচ
    const fetchChatHistory = async () => {
        if (!sellerEmail) return;
        try {
            const res = await axios.get<Message[]>(`${API_BASE_URL}/history/${sellerEmail}/${adminEmail}`);
            setMessages(res.data);
        } catch (err) {
            console.error("History fetch error:", err);
        }
    };

    // অ্যাডমিন অনলাইন স্ট্যাটাস ফেচ
    const fetchStatus = async () => {
        try {
            const res = await axios.get<StatusResponse>(`${API_BASE_URL}/status/${adminEmail}`);
            setOnlineStatus({ 
                online: res.data.online, 
                text: res.data.lastSeenText 
            });
        } catch (err) {
            console.error("Status check error:", err);
        }
    };

    useEffect(() => {
        if (sellerEmail) {
            fetchChatHistory();
            fetchStatus();
            const interval = setInterval(() => {
                fetchChatHistory();
                fetchStatus();
            }, 3200); 
            return () => clearInterval(interval);
        }
    }, [sellerEmail]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() && !selectedFile) return;
        if (!sellerEmail) return alert("Please login as a seller first!");

        const formData = new FormData();
        formData.append('senderId', sellerEmail);
        formData.append('receiverId', adminEmail);
        formData.append('message', inputValue);
        if (selectedFile) formData.append('image', selectedFile);

        try {
            await axios.post(`${API_BASE_URL}/send`, formData);
            setInputValue('');
            setSelectedFile(null);
            fetchChatHistory();
        } catch (err) {
            console.error("Send error:", err);
            alert("Connection error! Is your backend server running on port 3200?");
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '20px auto', height: '80vh', display: 'flex', flexDirection: 'column', bgcolor: '#F8FAFC', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            
            <Stack direction="row" p={2} spacing={2} alignItems="center" bgcolor="#fff" borderBottom="1px solid #E2E8F0">
                <Avatar sx={{ bgcolor: '#6366F1' }}><AdminPanelSettings /></Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800}>Admin Support</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <FiberManualRecord sx={{ fontSize: 10, color: onlineStatus.online ? '#10B981' : '#CBD5E1' }} />
                        <Typography variant="caption" color="textSecondary">{onlineStatus.text}</Typography>
                    </Stack>
                </Box>
            </Stack>

            <Box ref={scrollRef} sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {!sellerEmail && <Typography color="error" textAlign="center">Seller not logged in!</Typography>}
                {messages.map((msg, index) => {
                    const isFromAdmin = msg.senderId === adminEmail;
                    return (
                        <Box key={msg._id || index} sx={{ alignSelf: isFromAdmin ? 'flex-start' : 'flex-end', maxWidth: '75%' }}>
                            <Stack direction={isFromAdmin ? 'row' : 'row-reverse'} spacing={1} alignItems="flex-end">
                                <Box>
                                    <Paper sx={{ 
                                        p: 1.5, 
                                        borderRadius: isFromAdmin ? '15px 15px 15px 2px' : '15px 15px 2px 15px',
                                        bgcolor: isFromAdmin ? '#fff' : '#6366F1',
                                        color: isFromAdmin ? '#1E293B' : '#fff'
                                    }}>
                                        {msg.imageUrl && <Box component="img" src={`http://localhost:3200${msg.imageUrl}`} sx={{ width: '100%', borderRadius: 1, mb: 1 }} />}
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.message}</Typography>
                                    </Paper>
                                    <Typography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: isFromAdmin ? 'left' : 'right', color: '#94A3B8' }}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    );
                })}
            </Box>

            <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #E2E8F0' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton component="label" size="small">
                        <input hidden type="file" accept="image/*" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} />
                        <AttachFile color={selectedFile ? "primary" : "inherit"} />
                    </IconButton>
                    <InputBase
                        fullWidth
                        placeholder="অ্যাডমিনকে মেসেজ দিন..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        sx={{ bgcolor: '#F1F5F9', px: 2, py: 1, borderRadius: 10, fontSize: '14px' }}
                    />
                    <IconButton onClick={handleSend} sx={{ bgcolor: '#6366F1', color: '#fff' }}><Send sx={{ fontSize: 20 }} /></IconButton>
                </Stack>
            </Box>
        </Box>
    );
};

export default SellerAdminChat;