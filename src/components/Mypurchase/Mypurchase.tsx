import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthHook } from "../../hook/useAuthHook"; 
import { sendNotification } from "../Notification/Notification";
import { toast } from "sonner"; 

import type { IconType } from "react-icons";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaTelegram,
  FaPlus,
  FaTimes,
  FaEye,
  FaStar,
  FaComments,
  FaGlobe,
} from "react-icons/fa";

/* ---------------------------------------------
   Icon casts & Brand Assets
---------------------------------------------- */
const FaPlusIcon = FaPlus as unknown as React.ComponentType<any>;
const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
const FaStarIcon = FaStar as unknown as React.ComponentType<any>;
const FaCommentsIcon = FaComments as unknown as React.ComponentType<any>;
const FaEyeIcon = FaEye as unknown as React.ComponentType<any>;
const FaGlobeIcon = FaGlobe as unknown as React.ComponentType<any>;

const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaInstagram, "#E1306C"],
  [FaFacebookF, "#1877F2"],
  [FaTwitter, "#1DA1F2"],
  [FaWhatsapp, "#25D366"],
  [FaTelegram, "#0088cc"],
]);

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
];

const NOTIFICATION_SOUND = "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3";

/* ---------------------------------------------
   Types
---------------------------------------------- */
type PurchaseStatus = "Pending" | "Completed" | "Cancelled";
type PlatformType = "instagram" | "facebook" | "twitter" | "whatsapp" | "telegram" | "other";

interface Purchase {
  id: string;
  platform: PlatformType;
  title: string;
  desc?: string;
  sellerEmail: string;
  price: number;
  date: string;
  status: PurchaseStatus;
  purchaseNumber?: string;
}

interface ApiPurchase {
  _id: string;
  buyerEmail: string;
  productName: string;
  price: number;
  sellerEmail: string;
  productId: string;
  purchaseDate: string;
  status: string;
}

interface IMessage {
  senderId: string;
  receiverId: string;
  message: string;
  orderId?: string; // New Field to separate chats
}

/* ---------------------------------------------
   Helpers
---------------------------------------------- */
const inferPlatform = (name: string): PlatformType => {
  const n = name.toLowerCase();
  if (n.includes("instagram")) return "instagram";
  if (n.includes("facebook")) return "facebook";
  if (n.includes("twitter")) return "twitter";
  if (n.includes("whatsapp")) return "whatsapp";
  if (n.includes("telegram")) return "telegram";
  return "other";
};

const getPlatformIcon = (platform: PlatformType): IconType => {
  switch (platform) {
    case "instagram": return FaInstagram;
    case "facebook": return FaFacebookF;
    case "twitter": return FaTwitter;
    case "whatsapp": return FaWhatsapp;
    case "telegram": return FaTelegram;
    default: return FaGlobe;
  }
};

const formatDate = (d: string) =>
  new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const renderBadge = (platform: PlatformType, size = 36) => {
  const IconComp = getPlatformIcon(platform);
  const brandHex = ICON_COLOR_MAP.get(IconComp);
  const bg = brandHex ?? vibrantGradients[platform.length % vibrantGradients.length];
  const C = IconComp as any;

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 10px 20px rgba(16,24,40,0.08)",
      }}
    >
      <C size={Math.round(size * 0.6)} style={{ color: "#fff" }} />
    </div>
  );
};

const Stars: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStarIcon key={i} className={`w-3 h-3 ${i < value ? "text-yellow-400" : "text-gray-300"}`} />
    ))}
  </div>
);

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

/* =============================================
   Main Component
============================================= */
const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loginUserData = useAuthHook();
  const buyerId = loginUserData.data?.email || localStorage.getItem("userEmail");

  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  
  // Specific Chat Identifiers
  const [activeChatSellerEmail, setActiveChatSellerEmail] = useState<string | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null); // NEW: Track distinct order ID
  const [activeChatProductTitle, setActiveChatProductTitle] = useState<string>(""); // NEW: For UI display

  const scrollRef = useRef<HTMLDivElement>(null);
  const chatLengthRef = useRef(0);

  const PURCHASE_API = "http://localhost:3200/purchase";
  const CHAT_API = "http://localhost:3200/chat";

  // --- Audio Player ---
  const playNotificationSound = () => {
    const audio = new Audio(NOTIFICATION_SOUND);
    audio.play().catch((err) => console.log("Audio play failed:", err));
  };

  /* -------- Fetch Data -------- */
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!buyerId) {
         setIsLoading(false);
         return;
      }

      try {
        setIsLoading(true);
        const res = await axios.get(`${PURCHASE_API}/getall`); 
        
        const myData = (res.data as ApiPurchase[]).filter(
            (item) => item.buyerEmail === buyerId
        );

        const mapped = myData.map((item) => ({
          id: item._id,
          platform: inferPlatform(item.productName),
          title: item.productName,
          desc: `Product ID: ${item.productId}`,
          sellerEmail: item.sellerEmail,
          price: item.price,
          date: formatDate(item.purchaseDate),
          status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as PurchaseStatus,
          purchaseNumber: `ORD-${item._id.slice(-6).toUpperCase()}`
        }));
        setPurchases(mapped);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [buyerId]);

  /* -------- Status Actions -------- */
  const handleUpdateStatus = async (status: "completed" | "cancelled") => {
    if (!selected || !buyerId) return;

    try {
      await axios.patch(`${PURCHASE_API}/update-status/${selected.id}`, { status });

      try {
        if (status === "completed") {
            await sendNotification({
                type: "buy",
                title: "Order Confirmed",
                message: `You have confirmed receipt of ${selected.title}.`,
                data: { orderId: selected.id, price: selected.price },
                userEmail: buyerId,
            } as any);
        } else if (status === "cancelled") {
            await sendNotification({
                type: "alert",
                title: "Order Cancelled",
                message: `You have cancelled the order for ${selected.title}.`,
                data: { orderId: selected.id },
                userEmail: buyerId,
            } as any);
        }
      } catch (notifErr) {
        console.error("Failed to send notification", notifErr);
      }

      setPurchases((prev) =>
        prev.map((p) =>
          p.id === selected.id ? { ...p, status: (status.charAt(0).toUpperCase() + status.slice(1)) as PurchaseStatus } : p
        )
      );
      setSelected(null);
      alert(`Order ${status} successfully!`);
    } catch (err) {
      alert("Failed to update status");
    }
  };

  /* -------- Chat Logic (Separated by Order ID) -------- */
  const fetchChat = async (sellerEmail: string, orderId: string) => {
    if (!buyerId || !sellerEmail || !orderId) return;
    
    try {
      // NOTE: We are passing orderId as a query parameter to separate chats
      const res = await axios.get(`${CHAT_API}/history/${buyerId}/${sellerEmail}`, {
          params: { orderId: orderId } 
      });
      
      const newData = res.data as IMessage[];
      
      // New Message Detection
      if (newData.length > chatLengthRef.current && chatLengthRef.current !== 0) {
          const lastMsg = newData[newData.length - 1];
          if (lastMsg.senderId !== buyerId) {
              playNotificationSound();
              toast.info(`New message on order: ${activeChatProductTitle}`);
              
              await sendNotification({
                  type: "message",
                  title: "New Message",
                  message: `Regarding ${activeChatProductTitle}: ${lastMsg.message}`,
                  data: { seller: sellerEmail, orderId: orderId },
                  userEmail: buyerId,
              } as any);
          }
      }

      chatLengthRef.current = newData.length;
      setChatMessages(newData);

    } catch (err) {
      console.error("Chat fetch error:", err);
    }
  };

  useEffect(() => {
      chatLengthRef.current = 0; 
  }, [isChatOpen, activeChatOrderId]);

  useEffect(() => {
    let timer: any;
    if (isChatOpen && activeChatSellerEmail && activeChatOrderId) {
      fetchChat(activeChatSellerEmail, activeChatOrderId);
      timer = setInterval(() => fetchChat(activeChatSellerEmail, activeChatOrderId), 3000);
    }
    return () => clearInterval(timer);
  }, [isChatOpen, activeChatSellerEmail, activeChatOrderId, buyerId]);

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChatSellerEmail || !buyerId || !activeChatOrderId) return;
    
    try {
      await axios.post(`${CHAT_API}/send`, {
        senderId: buyerId,
        receiverId: activeChatSellerEmail,
        message: typedMessage,
        orderId: activeChatOrderId, // Sending Order ID to separate chat
      });
      setTypedMessage("");
      fetchChat(activeChatSellerEmail, activeChatOrderId);
    } catch (err) {
      alert("Failed to send message");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return purchases;
    return purchases.filter((p) => p.status === activeTab);
  }, [activeTab, purchases]);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#0A1A3A]">My Purchase</h1>
            
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6">
              <nav className="flex gap-4 sm:gap-6 border-b border-gray-100 pb-3 sm:pb-4 overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`pb-2 text-xs sm:text-sm whitespace-nowrap transition-colors ${
                      activeTab === t ? "text-[#d4a643] border-b-2 border-[#d4a643]" : "text-gray-500"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {isLoading ? (
                  <div className="py-20 text-center text-gray-400">Loading your purchases...</div>
                ) : filtered.length === 0 ? (
                  <div className="py-20 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-2xl">🛒</div>
                    <h3 className="text-lg font-semibold text-[#0A1A3A]">No Purchases Found</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        {buyerId ? "You haven't bought anything yet." : "Please log in to see purchases."}
                    </p>
                    <Link to="/marketplace" className="mt-4 bg-[#33ac6f] text-white px-6 py-2 rounded-full text-sm font-medium">
                      Browse Marketplace
                    </Link>
                  </div>
                ) : (
                  filtered.map((p) => (
                    <div key={p.id} className="bg-[#F8FAFB] rounded-xl p-3 sm:p-4 flex items-start gap-3 border border-gray-100 hover:shadow-md transition-all">
                      <div className="flex-shrink-0 mt-1">{renderBadge(p.platform)}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#0A1A3A] truncate">{p.title}</h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">{p.desc}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.status === "Completed" ? "bg-green-50 text-green-700 border-green-100" :
                            p.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-red-50 text-red-700 border-red-100"
                          }`}>
                            {p.status}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-medium">{p.platform}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                        <div className="text-sm font-bold text-[#0A1A3A]">${p.price.toFixed(2)}</div>
                        <div className="text-[10px] text-gray-400">{p.date}</div>
                        <div className="flex gap-1">
                          <button onClick={() => setSelected(p)} className="p-1.5 border rounded bg-white hover:bg-gray-50"><FaEyeIcon size={14} /></button>
                          
                          {/* Chat Button: Sets Unique Order ID */}
                          <button onClick={() => { 
                              setActiveChatSellerEmail(p.sellerEmail); 
                              setActiveChatOrderId(p.id); // UNIQUE ID
                              setActiveChatProductTitle(p.title);
                              setIsChatOpen(true); 
                          }} className="p-1.5 border rounded bg-white hover:bg-blue-50 text-blue-600"><FaCommentsIcon size={14} /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Details Modal --- */}
      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setSelected(null)}
          />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg w-full bg-white rounded-t-3xl sm:rounded-3xl z-50 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full" />
            <div className="sticky top-0 bg-white border-b sm:border-b-0 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-[#0A1A3A]">
                  {selected.title}
                </h2>
                <div className="text-xs text-gray-500 mt-0.5">
                  {selected.platform} • Purchased on {selected.date}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    selected.status === "Completed"
                      ? "bg-green-50 text-green-700"
                      : selected.status === "Pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {selected.status}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <FaTimesIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-center">
                {renderBadge(selected.platform, 72)}
              </div>
              <div className="mt-4 text-3xl font-bold text-[#0A1A3A] text-center sm:text-left">
                ${selected.price.toFixed(2)}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Purchase Number</p>
                  <p className="font-medium">
                    {selected.purchaseNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Seller Email</p>
                  <p className="font-medium">{selected.sellerEmail}</p>
                </div>
                <div>
                  <p className="text-gray-500">Description</p>
                  <p className="text-sm text-gray-600">
                    {selected.desc ?? "No additional details."}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 border p-3 rounded-md bg-[#FBFFFB]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Buyer Protection</div>
                    <div className="text-xs text-gray-600">
                      Secure transaction & refund policy
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-green-600">
                    Verified
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Stars value={4} />
                    <div className="text-xs text-gray-600">
                      4.0 (120 reviews)
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Warranty: 7 days</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                {selected.status === "Pending" && (
                   <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handleUpdateStatus("completed")}
                        className="py-2 bg-[#33ac6f] hover:bg-[#2aa46a] text-[#111111] rounded font-medium transition shadow-sm"
                    >
                        Confirm Order
                    </button>
                    <button 
                        onClick={() => handleUpdateStatus("cancelled")} 
                        className="py-2 bg-red-50 text-red-600 rounded font-bold text-sm hover:bg-red-100 transition"
                    >
                        Cancel
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelected(null);
                      setActiveChatSellerEmail(selected.sellerEmail);
                      setActiveChatOrderId(selected.id); // Unique ID
                      setActiveChatProductTitle(selected.title);
                      setIsChatOpen(true);
                    }}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition"
                  >
                    💬 Chat
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 py-2 border rounded hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- Chat Modal --- */}
      {isChatOpen && activeChatSellerEmail && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={() => setIsChatOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full bg-white rounded-t-3xl sm:rounded-2xl z-[110] shadow-2xl flex flex-col h-[80vh] sm:h-[550px] overflow-hidden">
            <div className="bg-[#0A1A3A] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold uppercase">
                  {activeChatSellerEmail[0]}
                </div>
                <div>
                  <h3 className="font-bold text-sm truncate max-w-[150px]">{activeChatSellerEmail}</h3>
                  {/* Shows which product is being discussed */}
                  <p className="text-[10px] text-green-400 truncate w-40">
                      Ref: {activeChatProductTitle}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)}>
                <FaTimesIcon size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.senderId === buyerId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      m.senderId === buyerId
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white border text-gray-800 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            
            <form
              onSubmit={sendChat}
              className="p-4 border-t bg-white flex gap-2"
            >
              <input
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Type here..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="bg-[#33ac6f] text-white px-5 py-2 rounded-full text-sm font-bold"
              >
                Send
              </button>
            </form>
          </div>
        </>
      )}

      <Link to="/add-product" className="hidden sm:flex fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] text-white rounded-full shadow-2xl items-center justify-center text-xl hover:scale-110 transition-transform">
        <FaPlusIcon />
      </Link>
    </>
  );
};

export default MyPurchase;