import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuthHook } from '../../hook/useAuthHook';
import { FiSend, FiLoader, FiMessageSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import io, { Socket } from 'socket.io-client';

// ──────────────────────────────────────────────
const BASE_URL = "https://tasha-vps-backend-2.onrender.com";
const ADMIN_CHAT_API = `${BASE_URL}/api/adminchat`;
const SOCKET_URL = BASE_URL; // Assume backend has socket.io setup at same base

interface Message {
  _id?: string;
  senderEmail: string;
  receiverEmail?: string;
  message: string;
  createdAt?: string;
}

const SellerAdminChat = () => {
  const { data: authData } = useAuthHook();
  const currentUserEmail = authData?.email || localStorage.getItem('userEmail');

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);
  const notificationAudio = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Notification sound
  useEffect(() => {
    notificationAudio.current = new Audio(
      'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3'
    );
    notificationAudio.current.volume = 0.4;
  }, []);

  // Socket setup for real-time typing
  useEffect(() => {
    if (!currentUserEmail) return;

    socketRef.current = io(SOCKET_URL, {
      query: { userEmail: currentUserEmail },
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('joinChat', { userEmail: currentUserEmail });
    });

    // Listen for admin typing
    socketRef.current.on('typing', (data: { from: string }) => {
      if (data.from === 'admin') { // Assume admin identifier
        setShowTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setShowTyping(false), 3000);
      }
    });

    // Listen for new message (to reduce polling reliance, but keep polling as fallback)
    socketRef.current.on('newMessage', async () => {
      await fetchMessages();
    });

    return () => {
      socketRef.current?.disconnect();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [currentUserEmail]);

  const scrollToBottom = useCallback((instant = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: instant ? 'auto' : 'smooth',
      block: 'end',
    });
  }, []);

  const fetchMessages = async (isFirstLoad = false) => {
    if (!currentUserEmail) return;

    try {
      const { data } = await axios.get<Message[]>(
        `${ADMIN_CHAT_API}/history/${currentUserEmail}`
      );

      if (data.length !== prevLengthRef.current) {
        const hadMessages = prevLengthRef.current > 0;
        const latest = data[data.length - 1];

        if (!isFirstLoad && hadMessages && latest?.senderEmail !== currentUserEmail) {
          notificationAudio.current?.play().catch(() => {});
        }

        setMessages(data);
        prevLengthRef.current = data.length;

        setTimeout(() => scrollToBottom(isFirstLoad), 60);
      }
    } catch (err) {
      console.error('Admin chat fetch failed:', err);
    }
  };

  useEffect(() => {
    if (!currentUserEmail) return;
    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 5000);
    return () => clearInterval(interval);
  }, [currentUserEmail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (socketRef.current && e.target.value.trim()) {
      socketRef.current.emit('typing', { from: currentUserEmail });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentUserEmail) return;

    const text = inputValue.trim();
    setInputValue('');
    setIsSending(true);

    try {
      await axios.post(`${ADMIN_CHAT_API}/send`, {
        senderEmail: currentUserEmail,
        message: text,
      });

      await fetchMessages();
      scrollToBottom();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to send message');
      setInputValue(text);
    } finally {
      setIsSending(false);
    }
  };

  if (!currentUserEmail) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-400">
        Loading session...
      </div>
    );
  }

  const formatMessageTime = (iso?: string) =>
    iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] mt-16 mb-10 max-w-2xl mx-auto bg-gradient-to-b from-gray-50 to-white rounded-3xl shadow-2xl border border-gray-100/80 overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white px-5 py-4 flex items-center gap-3.5 backdrop-blur-md border-b border-white/10">
        <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center text-xl font-semibold shadow-inner">
          A
        </div>
        <div>
          <h2 className="font-semibold text-lg tracking-tight">Admin Support</h2>
          <p className="text-xs text-emerald-100/85 font-light">Online • usually replies instantly</p>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 bg-gradient-to-b from-transparent via-gray-50/40 to-gray-100/30">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-20"
            >
              {/* @ts-ignore */}
              <FiMessageSquare className="w-16 h-16 mb-4 opacity-30" />
              <p className="font-medium text-lg text-gray-600">Welcome to Admin Support</p>
              <p className="text-sm mt-2 max-w-xs opacity-80">
                Send a message and we'll get back to you as soon as possible
              </p>
            </motion.div>
          ) : (
            messages.map((msg, idx) => {
              const isOwn = msg.senderEmail === currentUserEmail;
              return (
                <motion.div
                  key={msg._id || idx}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex items-start gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {!isOwn && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm mt-1">
                      A
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] px-4 py-3 rounded-2xl shadow-md transition-all duration-200 ${
                      isOwn
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-br-none'
                        : 'bg-white/90 backdrop-blur-sm border border-gray-200/70 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <div className="text-[15px] leading-relaxed break-words">
                      {msg.message}
                    </div>
                    <div className="text-[11px] mt-1.5 opacity-70 text-right font-light">
                      {formatMessageTime(msg.createdAt)}
                    </div>
                  </div>

                  {isOwn && (
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-semibold mt-1 shadow-sm">
                      You
                    </div>
                  )}
                </motion.div>
              );
            })
          )}

          {/* Typing indicator */}
          <AnimatePresence>
            {showTyping && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center text-sm font-semibold mt-1">
                  A
                </div>
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 px-5 py-3 rounded-2xl rounded-bl-none flex gap-1.5 items-center">
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:180ms]" />
                  <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:360ms]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatePresence>

        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="border-t border-gray-200/70 bg-white/80 backdrop-blur-lg px-5 py-4 flex items-center gap-3"
      >
        <input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          disabled={isSending}
          className="flex-1 bg-gray-100/70 backdrop-blur-sm border border-gray-300/50 rounded-full px-6 py-3.5 text-base outline-none focus:border-emerald-500 focus:bg-white focus:shadow-sm transition-all duration-200 disabled:opacity-60"
        />

        <motion.button
          type="submit"
          disabled={!inputValue.trim() || isSending}
          whileTap={{ scale: 0.94 }}
          className={`
            p-4 rounded-full flex items-center justify-center transition-all duration-200 min-w-[56px]
            ${
              isSending
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : inputValue.trim()
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:shadow-lg hover:from-emerald-500 hover:to-teal-500'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isSending ? (
            // @ts-ignore
            <FiLoader className="animate-spin" size={22} />
          ) : (
            // @ts-ignore
            <FiSend size={21} />
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default SellerAdminChat;