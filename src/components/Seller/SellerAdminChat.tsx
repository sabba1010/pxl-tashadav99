import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Avatar, Paper, Stack, 
    InputBase, IconButton, Divider 
} from '@mui/material';
import { 
    Send, FiberManualRecord, AttachFile, 
    AdminPanelSettings 
} from '@mui/icons-material';

// Dummy Data: Admin theke asha message gulo
const initialMessages = [
    { id: 1, text: "Hello! Apnar listing ti approve kora hoyeche.", sender: 'admin', time: '10:30 AM' },
    { id: 2, text: "Kintu apnar store image ti clear na, kindly update korun.", sender: 'admin', time: '10:31 AM' },
    { id: 3, text: "Okay sir, ami ekhon-e update kore dicchi.", sender: 'seller', time: '10:35 AM' },
    { id: 4, text: "Update hole amake janaben.", sender: 'admin', time: '10:40 AM' },
];

const SellerAdminChat = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'seller',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);
        setInputValue('');
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '20px auto', height: '80vh', display: 'flex', flexDirection: 'column', bgcolor: '#F8FAFC', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            
            {/* --- Chat Header --- */}
            <Stack direction="row" p={2} spacing={2} alignItems="center" bgcolor="#fff" borderBottom="1px solid #E2E8F0">
                <Avatar sx={{ bgcolor: '#6366F1' }}>
                    <AdminPanelSettings />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800}>Support Admin</Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <FiberManualRecord sx={{ fontSize: 10, color: '#10B981' }} />
                        <Typography variant="caption" color="textSecondary">Online</Typography>
                    </Stack>
                </Box>
            </Stack>

            {/* --- Chat Messages --- */}
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.map((msg) => {
                    const isAdmin = msg.sender === 'admin';
                    return (
                        <Box key={msg.id} sx={{ 
                            alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                            maxWidth: '75%'
                        }}>
                            <Stack direction={isAdmin ? 'row' : 'row-reverse'} spacing={1} alignItems="flex-end">
                                {isAdmin && <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>AD</Avatar>}
                                <Box>
                                    <Paper sx={{ 
                                        p: 1.5, 
                                        borderRadius: isAdmin ? '15px 15px 15px 2px' : '15px 15px 2px 15px',
                                        bgcolor: isAdmin ? '#fff' : '#6366F1',
                                        color: isAdmin ? '#1E293B' : '#fff',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                    }}>
                                        <Typography variant="body2">{msg.text}</Typography>
                                    </Paper>
                                    <Typography variant="caption" sx={{ mt: 0.5, display: 'block', textAlign: isAdmin ? 'left' : 'right', color: '#94A3B8' }}>
                                        {msg.time}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    );
                })}
            </Box>

            {/* --- Message Input --- */}
            <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #E2E8F0' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton size="small"><AttachFile /></IconButton>
                    <InputBase
                        fullWidth
                        placeholder="Admin ke kichu bolun..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        sx={{ 
                            bgcolor: '#F1F5F9', 
                            px: 2, py: 1, 
                            borderRadius: 10,
                            fontSize: '14px' 
                        }}
                    />
                    <IconButton 
                        onClick={handleSend}
                        sx={{ bgcolor: '#6366F1', color: '#fff', '&:hover': { bgcolor: '#4F46E5' } }}
                    >
                        <Send sx={{ fontSize: 20 }} />
                    </IconButton>
                </Stack>
            </Box>
        </Box>
    );
};

export default SellerAdminChat;