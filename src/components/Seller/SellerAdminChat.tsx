import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuthHook } from "../../hook/useAuthHook";
import { FaPaperPlane } from "react-icons/fa";

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
  const currentUserEmail =
    loginUserData?.data?.email || localStorage.getItem("userEmail");

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // নতুন মেসেজ চেক করার জন্য রেফারেন্স
  const prevMessageCount = useRef(0);
  // নোটিফিকেশন সাউন্ডের জন্য অডিও অবজেক্ট (একটি পাবলিক লিঙ্ক ব্যবহার করা হয়েছে)
  const notificationSound = useRef(new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3"));

  const fetchChat = async () => {
    if (!currentUserEmail) return;
    try {
      const res = await axios.get<IMessage[]>(
        `${ADMIN_CHAT_API}/history/${currentUserEmail}`
      );
      
      const newMessages = res.data;

      // অ্যালার্ট লজিক: যদি নতুন মেসেজ আসে এবং শেষ মেসেজটি আমার না হয় (অ্যাডমিনের হয়)
      if (newMessages.length > prevMessageCount.current) {
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.senderEmail !== currentUserEmail && prevMessageCount.current !== 0) {
          playNotification();
        }
      }

      setMessages(newMessages);
      prevMessageCount.current = newMessages.length;
    } catch (err) {
      console.error("Chat fetch error:", err);
    }
  };

  const playNotification = () => {
    // সাউন্ড প্লে করা
    notificationSound.current.play().catch(err => console.log("Audio play blocked by browser"));
    
    // ব্রাউজার টাইটেল আপডেট করা (ট্যাব নোটিফিকেশন)
    const oldTitle = document.title;
    document.title = "🔔 New Message from Admin!";
    setTimeout(() => {
      document.title = oldTitle;
    }, 3000);
  };

  useEffect(() => {
    if (!currentUserEmail) return;
    fetchChat();
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [currentUserEmail]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      fetchChat();
    } catch (err: any) {
      setTypedMessage(messageToSend);
      alert(err?.response?.data?.error || "Failed to send message");
    }
  };

  if (!currentUserEmail) {
    return (
      <p className="text-center text-red-500 mt-10">
        Please login to chat with admin
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto h-[80vh] flex flex-col border rounded-xl shadow bg-white">
      <div className="p-4 border-b font-bold text-center">
        Chat with Admin
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, idx) => {
          const isMe = msg.senderEmail === currentUserEmail;
          return (
            <div
              key={msg._id || idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                  isMe
                    ? "bg-green-500 text-white rounded-tr-none"
                    : "bg-white border rounded-tl-none shadow-sm"
                }`}
              >
                {msg.message}
                <div className="text-[10px] mt-1 opacity-60 text-right">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
        <input
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
          placeholder="Type message..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 transition-colors text-white px-4 rounded-lg flex items-center justify-center"
        >
          {React.createElement(FaPaperPlane as any)}
        </button>
      </form>
    </div>
  );
};

export default SellerAdminChat;