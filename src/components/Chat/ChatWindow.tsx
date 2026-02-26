import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";
import NotificationBadge from "../NotificationBadge";
import UserActivityStatus from "../UserActivityStatus";
import {
    FaTimes,
    FaPaperPlane,
    FaImage,
} from "react-icons/fa";
import { formatChatTimeWAT } from "../../lib/timeUtils";

// Icon Casting to fix TS2786
const FaTimesIcon = FaTimes as any;
const FaPaperPlaneIcon = FaPaperPlane as any;
const FaImageIcon = FaImage as any;

// Component Types
interface IMessage {
    _id?: string;
    senderId: string;
    receiverId: string;
    message: string;
    imageUrl?: string;
    orderId?: string;
    createdAt?: string;
}

interface ChatWindowProps {
    orderId: string;
    buyerEmail: string;
    sellerEmail: string;
    currentUserEmail: string;
    readOnly?: boolean;
    onClose: () => void;
    productTitle?: string;
}

const BASE_URL = "https://tasha-vps-backend-2.onrender.com";
const CHAT_API = `${BASE_URL}/chat`;

const formatChatTime = (dateString?: string) => {
    return formatChatTimeWAT(dateString);
};

const maskEmail = (email: string) => {
    if (!email) return "User";
    return email.split('@')[0];
};

const ChatWindow: React.FC<ChatWindowProps> = ({
    orderId,
    buyerEmail,
    sellerEmail,
    currentUserEmail,
    readOnly = false,
    onClose,
    productTitle
}) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [typedMessage, setTypedMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const shouldAutoScrollRef = useRef(true);

    const { socket } = useSocket();

    // Determine partner info
    const isSeller = currentUserEmail === sellerEmail;
    const partnerEmail = isSeller ? buyerEmail : sellerEmail;
    const partnerLabel = isSeller ? "Buyer" : "Seller";

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        const resize = () => {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        };
        resize();
        textarea.addEventListener("input", resize);
        return () => textarea.removeEventListener("input", resize);
    }, [typedMessage]);

    // Auto focus textarea
    useEffect(() => {
        if (!readOnly && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [readOnly]);

    // Auto scroll
    useEffect(() => {
        if (shouldAutoScrollRef.current) {
            messagesContainerRef.current?.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, imagePreview]);

    const fetchChat = async () => {
        try {
            const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerEmail}/${buyerEmail}`, {
                params: { orderId },
            });
            setMessages(res.data);

            // Mark as read if not readOnly and user is receiving
            if (!readOnly) {
                await axios.post(`${CHAT_API}/mark-read`, { userId: currentUserEmail, orderId });
            }
        } catch (err) {
            console.error("Chat fetch error:", err);
        }
    };

    useEffect(() => {
        fetchChat();

        const interval = setInterval(fetchChat, 10000); // Polling fallback (lower frequency)

        return () => {
            clearInterval(interval);
        };
    }, [orderId, buyerEmail, sellerEmail, currentUserEmail, readOnly]);

    useEffect(() => {
        if (socket) {
            const handleMsg = (newMsg: any) => {
                if (newMsg.orderId === orderId) {
                    setMessages(prev => [...prev, newMsg]);
                    if (messagesContainerRef.current) {
                        const container = messagesContainerRef.current;
                        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
                        if (isNearBottom) {
                            shouldAutoScrollRef.current = true;
                        }
                    }
                }
            };
            socket.on('receive_message', handleMsg);
            return () => {
                socket.off('receive_message', handleMsg);
            };
        }
    }, [socket, orderId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (readOnly) return;
        if (!typedMessage.trim() && !selectedImage) return;

        try {
            const formData = new FormData();
            formData.append("senderId", currentUserEmail);
            formData.append("receiverId", partnerEmail);
            formData.append("message", typedMessage);
            formData.append("orderId", orderId);
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            await axios.post(`${CHAT_API}/send`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setTypedMessage("");
            setSelectedImage(null);
            setImagePreview(null);
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
            fetchChat();
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    return (
        <div className="bg-[#F8FAFB] w-full max-w-md h-full sm:h-[620px] sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl border">
            {/* Header */}
            <div className="bg-white p-4 flex justify-between items-center border-b shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border text-[#0A1A3A] font-bold text-sm">
                        {maskEmail(partnerEmail).charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-[#0A1A3A]">
                            {maskEmail(partnerEmail)}
                            {readOnly && <span className="text-xs text-gray-400 font-normal ml-2">({partnerLabel})</span>}
                        </h4>
                        <UserActivityStatus userId={partnerEmail} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {readOnly && (
                        <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold border border-amber-100">
                            READ ONLY
                        </span>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-gray-100"
                    >
                        <FaTimesIcon size={20} />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F3EFEE]/30 scroll-smooth"
                onScroll={(e) => {
                    const container = e.currentTarget;
                    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
                    shouldAutoScrollRef.current = isAtBottom;
                }}
            >
                {messages.map((msg, index) => {
                    const isCurrentUser = msg.senderId === currentUserEmail;
                    // If readOnly (admin), we determine side based on sender role if possible, 
                    // but for simplicity, let's keep it consistent: seller on right, buyer on left if admin, 
                    // or just use senderId comparison if admin is "extra".
                    // Actually, for admin view, let's show Seller on right, Buyer on left.
                    const alignRight = readOnly ? (msg.senderId === sellerEmail) : isCurrentUser;

                    return (
                        <div
                            key={`${msg.createdAt || 'msg'}-${index}`}
                            className={`flex ${alignRight ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] ${alignRight ? 'items-end' : 'items-start'} flex flex-col`}>
                                <div
                                    className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm ${alignRight
                                        ? 'bg-[#33ac6f] text-white rounded-tr-none'
                                        : 'bg-white text-[#0A1A3A] border rounded-tl-none font-medium'
                                        }`}
                                >
                                    {msg.imageUrl && (
                                        <div className="mb-2 relative group">
                                            <img
                                                src={msg.imageUrl.startsWith('http') ? msg.imageUrl : `${BASE_URL}${msg.imageUrl}`}
                                                alt="attachment"
                                                className="rounded-lg max-w-full max-h-[220px] object-contain border border-black/5 mx-auto cursor-pointer"
                                                onClick={() => setPreviewImage(msg.imageUrl!.startsWith('http') ? msg.imageUrl! : `${BASE_URL}${msg.imageUrl!}`)}
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                            <a
                                                href={msg.imageUrl.startsWith('http') ? msg.imageUrl : `${BASE_URL}${msg.imageUrl}`}
                                                download
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                            </a>
                                        </div>
                                    )}
                                    <p className="leading-relaxed break-words whitespace-pre-wrap">{msg.message}</p>
                                </div>
                                <span className="text-[9px] text-gray-400 mt-1 px-1 font-bold">
                                    {readOnly && (
                                        <span className="mr-1 text-gray-500 uppercase">
                                            {msg.senderId === buyerEmail ? "Buyer" : "Seller"} •
                                        </span>
                                    )}
                                    {formatChatTime(msg.createdAt)}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {imagePreview && (
                    <div className="flex justify-end px-4 py-2">
                        <div className="p-1 bg-[#33ac6f] rounded-2xl rounded-tr-none shadow-md">
                            <div className="relative">
                                <img src={imagePreview} alt="preview" className="rounded-lg max-w-full max-h-[420px] object-contain" />
                                <button
                                    onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white"
                                > × </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
                {readOnly ? (
                    <div className="bg-gray-50 border rounded-2xl p-4 text-center text-gray-400 text-xs italic">
                        Messaging is disabled in read-only mode.
                    </div>
                ) : (
                    <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-2 bg-[#F8FAFB] border rounded-2xl p-1.5 focus-within:border-[#33ac6f] transition-all"
                    >
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setSelectedImage(file);
                                    setImagePreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-gray-500 hover:text-[#33ac6f]"
                        >
                            <FaImageIcon size={18} />
                        </button>

                        <textarea
                            ref={textareaRef}
                            value={typedMessage}
                            onChange={(e) => setTypedMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e as any);
                                }
                            }}
                            placeholder="Type a message..."
                            rows={1}
                            className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-1 resize-none max-h-32 overflow-y-auto"
                        />

                        <button
                            type="submit"
                            className="bg-[#33ac6f] text-white p-2 rounded-xl hover:opacity-90 transition active:scale-95"
                        >
                            <FaPaperPlaneIcon size={16} />
                        </button>
                    </form>
                )}
            </div>

            {/* Full-screen Image Preview Overlay */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
                        <img
                            src={previewImage}
                            alt="Full size preview"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        <a
                            href={previewImage}
                            download={`chat-image-${Date.now()}.jpg`}
                            className="absolute bottom-6 right-6 bg-white/90 hover:bg-white text-black px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium transition"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                        </a>
                        <button
                            className="absolute top-6 right-6 text-white bg-black/60 hover:bg-black/80 rounded-full p-3"
                            onClick={() => setPreviewImage(null)}
                        >
                            <FaTimesIcon size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
