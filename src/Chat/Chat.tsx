import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. Message er structure define kora
interface IMessage {
    senderId: string;
    receiverId: string;
    message: string;
    timestamp?: string;
}

const Chat: React.FC = () => {
    // 2. State-e types set kora
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");

    const senderId = "buyer123"; 
    const receiverId = "seller456"; 
    const API_URL = "https://vps-backend-server-beta.vercel.app/chat"; 

    const fetchChats = async () => {
        try {
            // Axios response ke IMessage array hisebe cast kora
            const res = await axios.get<IMessage[]>(`${API_URL}/history/${senderId}/${receiverId}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Chat load korte somossya:", err);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const chatData: IMessage = {
            senderId,
            receiverId,
            message: newMessage
        };

        try {
            await axios.post(`${API_URL}/send`, chatData);
            setNewMessage(""); 
            fetchChats(); 
        } catch (err) {
            console.error("Message jachche na:", err);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Chat with Seller</h2>
            <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px', marginBottom: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.senderId === senderId ? 'right' : 'left' }}>
                        <p style={{ 
                            background: msg.senderId === senderId ? '#007bff' : '#eee', 
                            color: msg.senderId === senderId ? '#fff' : '#000',
                            display: 'inline-block',
                            padding: '8px',
                            borderRadius: '10px'
                        }}>
                            {msg.message}
                        </p>
                    </div>
                ))}
            </div>
            
            <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Message likhun..."
                style={{ width: '70%', padding: '8px' }}
            />
            <button onClick={handleSendMessage} style={{ padding: '8px', marginLeft: '5px' }}>Send</button>
        </div>
    );
};

export default Chat;