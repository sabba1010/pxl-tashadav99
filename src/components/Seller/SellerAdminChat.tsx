import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useAuthHook } from "../../hook/useAuthHook";
import { FaPaperPlane } from "react-icons/fa";

// TypeScript ke ignore korar jonno ekhane icon ke 'any' type-e assign kora holo
const SendIcon = FaPaperPlane as any;

interface IMessage {
  _id?: string;
  senderEmail: string;
  receiverEmail: string;
  message: string;
  createdAt?: string;
}

const BASE_URL = "http://localhost:3200";
const ADMIN_CHAT_API = `${BASE_URL}/api/adminchat`;

const SellerAdminChat: React.FC = () => {
  const loginUserData = useAuthHook();
  const currentUserEmail: string | null =
    loginUserData?.data?.email || localStorage.getItem("userEmail");

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState<string>("");
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevMessageCount = useRef<number>(0);
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    notificationSound.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  }, []);

  const fetchChat = async (isInitial = false) => {
    if (!currentUserEmail) return;
    try {
      const res = await axios.get<IMessage[]>(
        `${ADMIN_CHAT_API}/history/${currentUserEmail}`
      );
      
      const newMessages = res.data;

      if (newMessages.length !== prevMessageCount.current) {
        const lastMsg = newMessages[newMessages.length - 1];
        
        if (newMessages.length > prevMessageCount.current && 
            lastMsg?.senderEmail !== currentUserEmail && 
            !isInitial) {
          notificationSound.current?.play().catch(() => {});
        }

        setMessages(newMessages);
        prevMessageCount.current = newMessages.length;

        setTimeout(() => {
          scrollToBottom(isInitial ? "auto" : "smooth");
        }, 100);
      }
    } catch (err) {
      console.error("Chat fetch error:", err);
    }
  };

  useEffect(() => {
    if (!currentUserEmail) return;
    fetchChat(true);
    const interval = setInterval(() => fetchChat(false), 3000);
    return () => clearInterval(interval);
  }, [currentUserEmail]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !currentUserEmail) return;

    const messageToSend = typedMessage;
    setTypedMessage("");

    try {
      await axios.post(`${ADMIN_CHAT_API}/send`, {
        senderEmail: currentUserEmail,
        message: messageToSend,
      });
      await fetchChat(false);
      scrollToBottom("smooth");
    } catch (err: any) {
      setTypedMessage(messageToSend);
      alert(err.response?.data?.error || "Failed to send message");
    }
  };

  if (!currentUserEmail) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-[85vh] md:h-[80vh] border rounded-xl shadow-2xl bg-white overflow-hidden my-4">
      <div className="h-16 flex items-center px-4 bg-green-600 text-white shrink-0">
        <h2 className="font-bold">Admin Support</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 flex flex-col">
        {messages.map((msg, idx) => {
          const isMe = msg.senderEmail === currentUserEmail;
          return (
            <div key={msg._id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-2 rounded-2xl shadow-sm ${
                isMe ? "bg-green-600 text-white rounded-tr-none" : "bg-white text-gray-800 border rounded-tl-none"
              }`}>
                <div className="break-words text-sm md:text-base">{msg.message}</div>
                <div className="text-[10px] mt-1 opacity-60 text-right">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="pt-2" />
      </div>

      <form onSubmit={sendMessage} className="h-20 p-3 md:p-4 bg-white border-t flex items-center gap-2 shrink-0">
        <input
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={!typedMessage.trim()}
          className="bg-green-600 hover:bg-green-700 text-white p-3.5 rounded-full disabled:bg-gray-400 flex items-center justify-center transition-all"
        >
          {/* Component hishebe ekhon SendIcon (any type) call korchi */}
          <SendIcon style={{ fontSize: '18px' }} />
        </button>
      </form>
    </div>
  );
};

export default SellerAdminChat;