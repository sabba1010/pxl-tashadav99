import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthHook } from "../../hook/useAuthHook";
import { toast } from "sonner";

import type { IconType } from "react-icons";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaTelegram,
  FaTimes,
  FaEye,
  FaComments,
  FaGlobe,
  FaPaperPlane,
  FaBan,
  FaFlag,
  FaImage,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

// Icon Casting
const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
const FaEyeIcon = FaEye as unknown as React.ComponentType<any>;
const FaCommentsIcon = FaComments as unknown as React.ComponentType<any>;
const FaPaperPlaneIcon = FaPaperPlane as unknown as React.ComponentType<any>;
const FaBanIcon = FaBan as unknown as React.ComponentType<any>;
const FaFlagIcon = FaFlag as unknown as React.ComponentType<any>;
const FaImageIcon = FaImage as unknown as React.ComponentType<any>;
const FaClockIcon = FaClock as unknown as React.ComponentType<any>;
const FaCheckCircleIcon = FaCheckCircle as unknown as React.ComponentType<any>;

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

type OrderStatus = "Pending" | "Completed" | "Cancelled";
type PlatformType = "instagram" | "facebook" | "twitter" | "whatsapp" | "telegram" | "other";

interface Order {
  id: string;
  platform: PlatformType;
  title: string;
  desc?: string;
  buyerEmail: string;
  price: number;
  date: string;
  rawDate: string;
  status: OrderStatus;
  orderNumber?: string;
  icon?: string;
}

interface ApiOrder {
  _id: string;
  buyerEmail: string;
  productName: string;
  price: number;
  sellerEmail: string;
  productId: string;
  purchaseDate: string;
  status: string;
  categoryIcon?: string;
}

interface IMessage {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  imageUrl?: string;
  orderId?: string;
  createdAt?: string;
}

interface PresenceResponse {
  userId: string;
  lastSeen?: string | null;
  online?: boolean;
}

const truncateTitle = (title: string, maxLength: number = 30): string => {
  if (title.length <= maxLength) return title;
  return title.slice(0, maxLength) + "...";
};

const RenderIcon = ({ icon, size = 40 }: { icon?: string; size?: number }) => {
  if (icon && icon.startsWith("http")) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full overflow-hidden shadow-md flex-shrink-0"
      >
        <img src={icon} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      style={{ width: size, height: size, background: "#daab4c" }}
      className="rounded-full flex items-center justify-center shadow-md text-white font-bold text-lg flex-shrink-0"
    >
      📦
    </div>
  );
};

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

const formatChatTime = (dateString?: string) => {
  if (!dateString) return "Just now";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Just now";
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds >= 0 && diffInSeconds < 86400) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return "Just now";
  }
};

const timeAgo = (dateString?: string) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

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

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

const SELLER_REPORT_REASONS = [
  "Scam or Fraud",
  "Fake Payment Proof",
  "Abusive Language",
  "Not Following Instructions",
  "Harassment",
  "Other",
];

const maskEmail = (email: string) => {
  if (!email) return "User";
  return email.split('@')[0];
};

const getStatusDisplay = (online: boolean, lastSeen?: string | null): string => {
  if (online) return "Online";
  if (!lastSeen) return "Offline";

  const date = new Date(lastSeen);
  if (isNaN(date.getTime())) return "Offline";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [buyerNames, setBuyerNames] = useState<Record<string, string>>({});
  const [now, setNow] = useState(Date.now());
  const autoCompletedRef = useRef<Set<string>>(new Set());

  const loginUserData = useAuthHook();
  const sellerId = loginUserData.data?.email || localStorage.getItem("userEmail");

  const BASE_URL = "https://tasha-vps-backend-2.onrender.com";
  const PURCHASE_API = `${BASE_URL}/purchase`;
  const CHAT_API = `${BASE_URL}/chat`;
  const USER_API = `${BASE_URL}/user`;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [buyerOnline, setBuyerOnline] = useState<boolean>(false);
  const [buyerLastSeen, setBuyerLastSeen] = useState<string | null>(null);
  const [partnerStatusText, setPartnerStatusText] = useState<string>("Offline");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const [activeChatBuyerEmail, setActiveChatBuyerEmail] = useState<string | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
  const [activeChatProductTitle, setActiveChatProductTitle] = useState<string>("");

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetOrder, setReportTargetOrder] = useState<Order | null>(null);
  const [reportReason, setReportReason] = useState(SELLER_REPORT_REASONS[0]);
  const [reportMessage, setReportMessage] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10000;

  const [onlineBuyersMap, setOnlineBuyersMap] = useState<Record<string, boolean>>({});
  const [unreadOrders, setUnreadOrders] = useState<Record<string, boolean>>({});
  const [lastMessageTimes, setLastMessageTimes] = useState<Record<string, string>>({});

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

  // Auto focus textarea when chat opens
  useEffect(() => {
    if (isChatOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      messagesContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;
    fetchAllBuyersStatus();
    const interval = setInterval(fetchAllBuyersStatus, 10000);
    return () => clearInterval(interval);
  }, [orders]);

  useEffect(() => {
    if (orders.length === 0) return;
    orders.forEach((o) => {
      if (o.status !== 'Pending') return;
      const expiresAt = new Date(o.rawDate).getTime() + 14400000;
      if (Date.now() >= expiresAt && !autoCompletedRef.current.has(o.id)) {
        autoCompletedRef.current.add(o.id);
        handleUpdateStatus('completed', o.id);
      }
    });
  }, [orders, now]);

  const getRemainingTime = (rawDate: string) => {
    const diff = (new Date(rawDate).getTime() + 14400000) - now;
    if (diff <= 0) return "Confirming...";
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    return `${h}h ${m}m ${s}s`;
  };

  const setPresence = async (status: 'online' | 'offline') => {
    if (!sellerId) return;
    try {
      await axios.post(`${CHAT_API}/status`, { userId: sellerId, status });
    } catch (err) {}
  };

  const fetchBuyerStatus = async () => {
    if (!activeChatBuyerEmail) return;
    try {
      const res = await axios.get<PresenceResponse>(`${CHAT_API}/status/${activeChatBuyerEmail}`);
      const online = Boolean(res.data?.online);
      const lastSeen = res.data.lastSeen;

      setBuyerOnline(online);
      setBuyerLastSeen(lastSeen || null);
      setPartnerStatusText(getStatusDisplay(online, lastSeen));
    } catch (err) {
      setBuyerOnline(false);
      setBuyerLastSeen(null);
      setPartnerStatusText("Offline");
    }
  };

  const fetchAllBuyersStatus = async () => {
    const buyers = Array.from(new Set(orders.map(o => o.buyerEmail)));
    const statusMap: Record<string, boolean> = {};
    for (const email of buyers) {
      try {
        const res = await axios.get<PresenceResponse>(`${CHAT_API}/status/${email}`);
        statusMap[email] = Boolean(res.data?.online);
      } catch (err) {
        statusMap[email] = false;
      }
    }
    setOnlineBuyersMap(statusMap);
  };

  const checkNotifications = async () => {
    if (orders.length === 0 || !sellerId) return;
    try {
      const newUnreadStatus: Record<string, boolean> = { ...unreadOrders };
      const newLastTimes: Record<string, string> = { ...lastMessageTimes };
      for (const order of orders) {
        const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerId}/${order.buyerEmail}`, {
          params: { orderId: order.id }
        });
        const history = res.data;
        const lastMsg = history[history.length - 1];
        if (lastMsg) {
          newUnreadStatus[order.id] = lastMsg.senderId !== sellerId;
          newLastTimes[order.id] = lastMsg.createdAt!;
        } else {
          newUnreadStatus[order.id] = false;
          delete newLastTimes[order.id];
        }
      }
      setUnreadOrders(newUnreadStatus);
      setLastMessageTimes(newLastTimes);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const interval = setInterval(checkNotifications, 10000);
    return () => clearInterval(interval);
  }, [orders, sellerId]);

  const fetchOrders = async () => {
    if (!sellerId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.get<ApiOrder[]>(`${PURCHASE_API}/getall`);
      const allData = res.data;
      const mySales = allData.filter((item) => item.sellerEmail === sellerId);
      
      const enrichedData = await Promise.all(mySales.map(async (item) => {
        if (item.productId) {
          try {
            const productRes = await axios.get<any>(`${PURCHASE_API.replace('/purchase', '')}/product/${item.productId}`);
            if (productRes?.data) {
              return {
                ...item,
                categoryIcon: productRes.data.categoryIcon,
              };
            }
          } catch (err) {
            console.error(`Failed to fetch product ${item.productId}:`, err);
          }
        }
        return item;
      }));
      
      const mapped: Order[] = enrichedData.map((item) => ({
        id: item._id,
        platform: inferPlatform(item.productName),
        title: item.productName || "Product Deleted / Old Order",
        desc: item.productId ? `Product ID: ${item.productId}` : "No product ID",
        buyerEmail: item.buyerEmail,
        price: item.price,
        date: formatDate(item.purchaseDate),
        rawDate: item.purchaseDate,
        status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as OrderStatus,
        orderNumber: `ORD-${item._id.slice(-6).toUpperCase()}`,
        icon: item.categoryIcon,
      }));
      setOrders(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [sellerId]);

  const fetchChat = async () => {
    if (!sellerId || !activeChatBuyerEmail || !activeChatOrderId) return;
    try {
      const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerId}/${activeChatBuyerEmail}`, {
        params: { orderId: activeChatOrderId },
      });
      setChatMessages(res.data);
      setUnreadOrders(prev => ({ ...prev, [activeChatOrderId]: false }));
    } catch (err) {
      console.error("Chat fetch error:", err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isChatOpen && activeChatBuyerEmail && activeChatOrderId) {
      setPresence('online');
      fetchChat();
      fetchBuyerStatus();
      interval = setInterval(() => {
        fetchChat();
        fetchBuyerStatus();
      }, 4000);
    } else {
      setPresence('offline');
      setBuyerOnline(false);
      setPartnerStatusText("Offline");
    }
    return () => clearInterval(interval);
  }, [isChatOpen, activeChatBuyerEmail, activeChatOrderId]);

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!typedMessage.trim() && !selectedImage) || !activeChatBuyerEmail || !activeChatOrderId) return;
    
    try {
      const formData = new FormData();
      formData.append("senderId", sellerId!);
      formData.append("receiverId", activeChatBuyerEmail);
      formData.append("message", typedMessage);
      formData.append("orderId", activeChatOrderId);
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
      toast.error("Failed to send message");
    }
  };

  const handleOpenChat = (order: Order) => {
    setActiveChatBuyerEmail(order.buyerEmail);
    setActiveChatOrderId(order.id);
    setActiveChatProductTitle(order.title);
    setIsChatOpen(true);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportMessage.trim() || !reportTargetOrder || !sellerId) return;

    setIsSubmittingReport(true);
    try {
      await axios.post(`${PURCHASE_API}/report/create`, {
        orderId: reportTargetOrder.id,
        productName: reportTargetOrder.title || "Unknown Product",
        reporterEmail: sellerId,
        sellerEmail: sellerId,
        buyerEmail: reportTargetOrder.buyerEmail,
        reason: reportReason,
        message: reportMessage,
        role: "seller",
      });

      toast.success("Report submitted successfully");
      setIsReportModalOpen(false);
      setReportMessage("");
      setReportReason(SELLER_REPORT_REASONS[0]);
      setReportTargetOrder(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleUpdateStatus = async (status: string, orderId?: string) => {
    const id = orderId || selected?.id;
    if (!id) return;
    try {
      await axios.patch(`${PURCHASE_API}/update-status/${id}`, { status, sellerEmail: sellerId });
      toast.success(`Order ${status} successfully!`);
      setSelected(null);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [activeTab, orders]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-3xl font-bold text-[#0A1A3A] mb-6">My Sales</h1>

          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="flex gap-6 p-4 border-b overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {setActiveTab(tab); setCurrentPage(1);}}
                  className={`pb-2 text-sm whitespace-nowrap transition-all ${activeTab === tab ? "text-[#d4a643] border-b-2 border-[#d4a643] font-bold" : "text-gray-500"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {isLoading ? (
                <p className="text-center py-10 text-gray-400">Loading...</p>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 mb-4">No sales found</p>
                  <Link to="/add-product" className="bg-[#33ac6f] text-white px-6 py-3 rounded-full">
                    Add Product
                  </Link>
                </div>
              ) : (
                paginatedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#F8FAFB] border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelected(order)}
                  >
                    <div className="flex gap-4 items-start">
                      <RenderIcon icon={order.icon} size={40} />
                      <div>
                        <h3 className="font-bold text-[#0A1A3A] text-sm sm:text-base leading-tight">
                          {truncateTitle(order.title)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 font-medium">
                            Buyer: {buyerNames[order.buyerEmail] || maskEmail(order.buyerEmail)}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${onlineBuyersMap[order.buyerEmail] ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-[10px] text-gray-500 font-medium">
                            {onlineBuyersMap[order.buyerEmail] ? "Online" : "Offline"}
                          </span>
                        </div>
                        {lastMessageTimes[order.id] && (
                          <p className="text-[10px] text-gray-500 mt-0.5">{timeAgo(lastMessageTimes[order.id])}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                            order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                            (order.status === 'Cancelled') ? 'bg-red-50 text-red-600 border-red-100' : 
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {order.status}
                          </span>
                          {order.status === "Pending" && (
                            <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                              <FaClockIcon size={10} /> {getRemainingTime(order.rawDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex flex-col sm:items-end gap-3 mt-2 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
                        <p className="text-lg font-bold text-[#0A1A3A]">${order.price.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{order.date}</p>
                      </div>
                      
                      {!["Cancelled"].includes(order.status) && (
                        <div className="flex gap-2 w-full justify-end sm:justify-start" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => { setReportTargetOrder(order); setIsReportModalOpen(true); }} 
                            className="flex-1 sm:flex-none flex justify-center p-2 text-red-500 border border-red-100 rounded-lg bg-white hover:bg-red-50 transition"
                          >
                            <FaFlagIcon size={14} />
                          </button>
                          
                          <button 
                            onClick={() => setSelected(order)} 
                            className="flex-1 sm:flex-none flex justify-center p-2 text-gray-600 border rounded-lg bg-white hover:bg-gray-50 transition"
                          >
                            <FaEyeIcon size={14} />
                          </button>
                          
                          <button 
                            onClick={() => handleOpenChat(order)} 
                            className="flex-1 sm:flex-none flex justify-center p-2 text-blue-600 border border-blue-100 rounded-lg bg-white hover:bg-blue-50 transition"
                          >
                            <div className="relative">
                              <FaCommentsIcon size={14} />
                              {unreadOrders[order.id] && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />}
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelected(null)} className="absolute right-6 top-6 text-gray-400 hover:text-red-500">
              <FaTimesIcon size={20} />
            </button>
            <div className="text-center mb-6 pt-4 flex flex-col items-center justify-center">
              <RenderIcon icon={selected.icon} size={70} />
              <h2 className="text-xl font-bold mt-4 text-[#0A1A3A]">{selected.title}</h2>
              <p className="text-3xl font-black text-[#33ac6f] mt-2">${selected.price.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100 mb-6 text-sm">
               <div className="flex justify-between border-b pb-2">
                 <span className="text-gray-500">Order Number</span>
                 <span className="font-bold">{selected.orderNumber}</span>
               </div>
               <div className="flex justify-between border-b pb-2">
                 <span className="text-gray-500">Status</span>
                 <span className={`font-bold ${selected.status === 'Completed' ? 'text-green-600' : 'text-amber-600'}`}>
                   {selected.status}
                 </span>
               </div>
               <div className="pt-2">
                 <p className="text-gray-500 mb-1">Product Details</p>
                 <div className="bg-white p-3 rounded-lg border font-mono text-xs break-all">
                    {selected.desc || "No additional details provided."}
                 </div>
               </div>
            </div>
            {selected.status !== "Cancelled" && (
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  disabled={isUpdating}
                  onClick={() => {/* cancel logic if needed */}}
                  className="py-3.5 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 font-semibold text-base transition"
                >
                  <FaBanIcon size={20} /> Cancel
                </button>
                <button
                  onClick={() => {
                    setReportTargetOrder(selected);
                    setIsReportModalOpen(true);
                  }}
                  className="py-3.5 px-4 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2 font-semibold text-base transition"
                >
                  <FaFlagIcon size={20} /> Report
                </button>
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {selected.status !== "Cancelled" && (
                <button
                  onClick={() => {
                    setSelected(null);
                    handleOpenChat(selected);
                  }}
                  className="py-3.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold text-base transition"
                >
                  <FaCommentsIcon size={20} /> Chat
                </button>
              )}
              <button onClick={() => setSelected(null)} className="py-3.5 px-4 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold text-base transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatOpen && activeChatBuyerEmail && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-[#F8FAFB] w-full max-w-md h-full sm:h-[620px] sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl border">
            <div className="bg-white p-4 flex justify-between items-center border-b shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border text-[#0A1A3A] font-bold text-sm">
                  {maskEmail(activeChatBuyerEmail || "").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0A1A3A]">
                    {buyerNames[activeChatBuyerEmail] || maskEmail(activeChatBuyerEmail)}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className={`w-2 h-2 rounded-full ${buyerOnline ? "bg-green-500" : "bg-gray-300"}`} />
                    <span 
                      className={`font-medium ${buyerOnline ? "text-green-600" : "text-gray-500"}`}
                    >
                      {partnerStatusText}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setIsChatOpen(false); setPresence('offline'); }} 
                className="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-gray-100"
              >
                <FaTimesIcon size={20} />
              </button>
            </div>

            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F3EFEE]/30 scroll-smooth"
              onScroll={(e) => {
                const container = e.currentTarget;
                const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
                shouldAutoScrollRef.current = isAtBottom;
              }}
            >
              {chatMessages.map((msg, index) => (
                <div
                  key={`${msg.createdAt || 'msg'}-${index}`}
                  className={`flex ${msg.senderId === sellerId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.senderId === sellerId ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div 
                      className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                        msg.senderId === sellerId 
                          ? 'bg-[#33ac6f] text-white rounded-tr-none' 
                          : 'bg-white text-[#0A1A3A] border rounded-tl-none font-medium'
                      }`}
                    >
                      {msg.imageUrl && (
                        <div 
                          className="mb-2 cursor-pointer hover:opacity-90 transition"
                          onClick={() => setPreviewImage(msg.imageUrl!.startsWith('http') ? msg.imageUrl! : `${BASE_URL}${msg.imageUrl!}`)}
                        >
                          <img
                            src={msg.imageUrl!.startsWith('http') ? msg.imageUrl : `${BASE_URL}${msg.imageUrl}`}
                            alt="attachment"
                            className="rounded-lg max-w-full max-h-[220px] object-contain border border-black/5 mx-auto"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        </div>
                      )}
                      <p className="leading-relaxed break-words whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 px-1 font-bold">
                      {formatChatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              ))}

              {imagePreview && (
                <div className="flex justify-end px-4 py-2">
                  <div className="p-1 bg-[#33ac6f] rounded-2xl rounded-tr-none shadow-md">
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="preview" 
                        className="rounded-lg max-w-full max-h-[420px] object-contain"
                      />
                      <button
                        onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white"
                      > × </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t">
              <form 
                onSubmit={sendChat} 
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

                {/* চ্যাট ইনপুট এখানে - Shift + Enter = line break, Enter = send */}
                <textarea
                  ref={textareaRef}
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault(); // Enter চাপলে নতুন লাইন না করে submit করবে
                      sendChat(e as any);
                    }
                    // Shift + Enter চাপলে স্বাভাবিক লাইন ব্রেক হবে
                  }}
                  placeholder=""
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
            </div>
          </div>

          {/* Full-screen Image Preview */}
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
      )}

      {/* Report Modal */}
      {isReportModalOpen && reportTargetOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-red-600 p-4 text-white font-bold flex justify-between items-center">
              <span className="flex items-center gap-2"><FaFlagIcon /> Report Buyer</span>
              <button onClick={() => setIsReportModalOpen(false)}>
                <FaTimesIcon />
              </button>
            </div>
            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              <select 
                value={reportReason} 
                onChange={(e) => setReportReason(e.target.value)} 
                className="w-full border p-2.5 rounded-xl text-sm outline-none"
              >
                {SELLER_REPORT_REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <textarea 
                value={reportMessage} 
                onChange={(e) => setReportMessage(e.target.value)} 
                placeholder="Describe the issue..." 
                className="w-full border p-3 rounded-xl text-sm h-32 outline-none" 
                required 
              />
              <button 
                type="submit" 
                disabled={isSubmittingReport} 
                className="w-full bg-red-600 text-white py-3 rounded-xl font-bold"
              >
                {isSubmittingReport ? "Sending..." : "Submit Report"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrder;