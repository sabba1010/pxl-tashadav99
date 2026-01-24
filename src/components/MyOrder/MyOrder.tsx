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
} from "react-icons/fa";

// Icon Casting
const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
const FaEyeIcon = FaEye as unknown as React.ComponentType<any>;
const FaCommentsIcon = FaComments as unknown as React.ComponentType<any>;
const FaPaperPlaneIcon = FaPaperPlane as unknown as React.ComponentType<any>;
const FaBanIcon = FaBan as unknown as React.ComponentType<any>;
const FaFlagIcon = FaFlag as unknown as React.ComponentType<any>;
const FaImageIcon = FaImage as unknown as React.ComponentType<any>;

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
  imageUrl?: string; // ব্যাকএন্ড থেকে এই ফিল্ড নামে ডেটা আসে
  orderId?: string;
  createdAt?: string;
}

interface ApiUser {
  _id: string;
  name: string;
  email: string;
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

const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [buyerNames, setBuyerNames] = useState<Record<string, string>>({});

  const loginUserData = useAuthHook();
  const sellerId = loginUserData.data?.email || localStorage.getItem("userEmail");

  const BASE_URL = "https://tasha-vps-backend-2.onrender.com"; // ব্যাকএন্ড পোর্ট
  const PURCHASE_API = `${BASE_URL}/purchase`;
  const CHAT_API = `${BASE_URL}/chat`;
  const USER_API = `${BASE_URL}/user`;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeChatBuyerEmail, setActiveChatBuyerEmail] = useState<string | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
  const [activeChatProductTitle, setActiveChatProductTitle] = useState<string>("");
  const [unreadState, setUnreadState] = useState<Record<string, boolean>>({});
  const [presenceMap, setPresenceMap] = useState<Record<string, { online: boolean; lastSeen?: string | null }>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const chatLengthRef = useRef(0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const fetchPresence = async (email: string) => {
    if (!email) return;
    try {
      const res = await axios.get<PresenceResponse>(`${CHAT_API}/status/${encodeURIComponent(email)}`);
      const data = res.data;
      setPresenceMap((p) => ({ ...p, [email]: { online: Boolean(data?.online), lastSeen: data?.lastSeen ?? null } }));
    } catch (e) {
      setPresenceMap((p) => ({ ...p, [email]: { online: false, lastSeen: null } }));
    }
  };

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetOrder, setReportTargetOrder] = useState<Order | null>(null);
  const [reportReason, setReportReason] = useState(SELLER_REPORT_REASONS[0]);
  const [reportMessage, setReportMessage] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
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
        
        // Fetch product details to get categoryIcon
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
          title: item.productName,
          desc: `Product ID: ${item.productId}`,
          buyerEmail: item.buyerEmail,
          price: item.price,
          date: formatDate(item.purchaseDate),
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
    fetchOrders();
  }, [sellerId]);

  useEffect(() => {
    const fetchNames = async () => {
      if (orders.length === 0) return;
      const uniqueEmails = Array.from(new Set(orders.map((o) => o.buyerEmail)));
      const emailsToFetch = uniqueEmails.filter((e) => !buyerNames[e]);
      if (emailsToFetch.length === 0) return;

      const newNames: Record<string, string> = {};
      await Promise.all(
        emailsToFetch.map(async (email) => {
          try {
            const res = await axios.get<ApiUser>(`${USER_API}/${email}`);
            newNames[email] = res.data.name || email.split("@")[0];
          } catch {
            newNames[email] = email.split("@")[0];
          }
        })
      );
      setBuyerNames((prev) => ({ ...prev, ...newNames }));
    };
    fetchNames();
  }, [orders]);

  useEffect(() => {
    const checkUnread = async () => {
      if (!sellerId || orders.length === 0) return;
      const newUnread: Record<string, boolean> = { ...unreadState };
      let changed = false;

      for (const order of orders) {
        if (isChatOpen && activeChatOrderId === order.id) continue;
        try {
          const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerId}/${order.buyerEmail}`, {
            params: { orderId: order.id },
          });
          const msgs = res.data;
          if (msgs.length > 0) {
            const last = msgs[msgs.length - 1];
            if (last.senderId.toLowerCase() !== sellerId.toLowerCase()) {
              if (!newUnread[order.id]) {
                newUnread[order.id] = true;
                changed = true;
              }
            }
          }
        } catch {}
      }
      if (changed) setUnreadState(newUnread);
    };

    if (orders.length > 0) {
      checkUnread();
      const interval = setInterval(checkUnread, 10000);
      const unique = Array.from(new Set(orders.map((o) => o.buyerEmail)));
      unique.forEach((e) => fetchPresence(e));
      const presInterval = setInterval(() => unique.forEach((e) => fetchPresence(e)), 60000);
      return () => { clearInterval(interval); clearInterval(presInterval); };
    }
  }, [orders, sellerId, isChatOpen, activeChatOrderId]);

  const updateOrderStatus = async (orderId: string) => {
    try {
      setIsUpdating(true);
      await axios.patch(`${PURCHASE_API}/update-status/${orderId}`, { status: "Cancelled" });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o)));
      if (selected?.id === orderId) setSelected({ ...selected, status: "Cancelled" });
      toast.success("Order cancelled");
    } catch {
      toast.error("Failed to cancel");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large (max 5MB)");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fetchChat = async (buyerEmail: string, orderId: string) => {
    if (!sellerId) return;
    try {
      const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerId}/${buyerEmail}`, {
        params: { orderId },
      });
      const newMsgs = res.data;
      if (newMsgs.length > chatLengthRef.current && chatLengthRef.current > 0) {
        const last = newMsgs[newMsgs.length - 1];
        if (last.senderId.toLowerCase() !== sellerId.toLowerCase()) {
          new Audio("https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3").play().catch(() => {});
        }
      }
      chatLengthRef.current = newMsgs.length;
      setChatMessages(newMsgs);
    } catch {}
  };

  useEffect(() => {
    chatLengthRef.current = 0;
  }, [isChatOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isChatOpen && activeChatBuyerEmail && activeChatOrderId) {
      setUnreadState((prev) => ({ ...prev, [activeChatOrderId]: false }));
      fetchChat(activeChatBuyerEmail, activeChatOrderId);
      interval = setInterval(() => fetchChat(activeChatBuyerEmail, activeChatOrderId), 3000);
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
      removeImage();
      fetchChat(activeChatBuyerEmail, activeChatOrderId);
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleOpenChat = (order: Order) => {
    setActiveChatBuyerEmail(order.buyerEmail);
    setActiveChatOrderId(order.id);
    setActiveChatProductTitle(order.title);
    setIsChatOpen(true);
  };

  const getBuyerDisplayName = (email: string | null) => {
    if (!email) return "Unknown";
    return buyerNames[email] || email.split("@")[0];
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportMessage.trim() || !reportTargetOrder || !sellerId) return;
    setIsSubmittingReport(true);
    try {
      await axios.post(`${PURCHASE_API}/report/create`, {
        orderId: reportTargetOrder.id,
        reporterEmail: sellerId,
        sellerEmail: sellerId,
        buyerEmail: reportTargetOrder.buyerEmail,
        reason: reportReason,
        message: reportMessage,
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
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-bold transition ${
                    activeTab === tab ? "text-[#d4a643] border-b-2 border-[#d4a643]" : "text-gray-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-4">
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
                    {/* Left Side: Icon & Product Info */}
                    <div className="flex gap-4 items-start">
                      <RenderIcon icon={order.icon} size={40} />
                      <div>
                        <h3 className="font-bold text-[#0A1A3A] text-sm sm:text-base leading-tight">{order.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 font-medium">Buyer: {getBuyerDisplayName(order.buyerEmail)}</span>
                          <span className={`w-2 h-2 rounded-full ${presenceMap[order.buyerEmail]?.online ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-[10px] text-gray-500 font-medium">
                            {presenceMap[order.buyerEmail]?.online ? "Online" : (presenceMap[order.buyerEmail]?.lastSeen ? `Last seen ${timeAgo((presenceMap[order.buyerEmail]?.lastSeen ?? undefined))}` : "Offline")}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                            order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                            (order.status === 'Cancelled') ? 'bg-red-50 text-red-600 border-red-100' : 
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Right Side: Price, Date & Actions - FIXED ALIGNMENT */}
                    <div className="w-full sm:w-auto flex flex-col sm:items-end gap-3 mt-2 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
                        <p className="text-lg font-bold text-[#0A1A3A]">${order.price.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{order.date}</p>
                      </div>
                      
                      {!["Cancelled", "Refunded"].includes(order.status) && (
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
                            <FaCommentsIcon size={14} />
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
        <>
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
                    onClick={() => updateOrderStatus(selected.id)}
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
        </>
      )}

      {/* Chat Modal */}
      {isChatOpen && activeChatBuyerEmail && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-[#F8FAFB] w-full max-w-md h-full sm:h-[620px] sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl border">
            <div className="bg-white p-4 flex justify-between items-center border-b shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border text-[#0A1A3A] font-bold text-sm">
                  {getBuyerDisplayName(activeChatBuyerEmail)[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0A1A3A]">{getBuyerDisplayName(activeChatBuyerEmail)}</h4>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className={`w-2 h-2 rounded-full ${presenceMap[activeChatBuyerEmail!]?.online ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className="text-gray-500 font-medium">
                      {presenceMap[activeChatBuyerEmail!]?.online ? "Online" : (presenceMap[activeChatBuyerEmail!]?.lastSeen ? `Last seen ${timeAgo((presenceMap[activeChatBuyerEmail!]?.lastSeen ?? undefined))}` : "Offline")}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setIsChatOpen(false); }} 
                className="p-2 text-gray-400 hover:text-red-500 transition rounded-full hover:bg-gray-100"
              >
                <FaTimesIcon size={20} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F3EFEE]/30 scroll-smooth"
              onScroll={(e) => {
                const container = e.currentTarget;
                const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
                shouldAutoScrollRef.current = isAtBottom;
              }}
            >
              {chatMessages.map((msg, index) => (
                <div
                  key={`${msg.createdAt}-${index}`}
                  className={`flex ${msg.senderId.toLowerCase() === sellerId?.toLowerCase() ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${msg.senderId.toLowerCase() === sellerId?.toLowerCase() ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div 
                      className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                        msg.senderId.toLowerCase() === sellerId?.toLowerCase()
                          ? 'bg-[#33ac6f] text-white rounded-tr-none' 
                          : 'bg-white text-[#0A1A3A] border rounded-tl-none font-medium'
                      }`}
                    >
                      {msg.imageUrl && (
                        <div className="mb-2 -mx-1 -mt-1">
                          <img
                            src={msg.imageUrl.startsWith('http') ? msg.imageUrl : `${BASE_URL}${msg.imageUrl}`}
                            alt="attachment"
                            className="rounded-xl max-w-xs h-auto max-h-64 object-cover border border-black/5"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        </div>
                      )}
                      <p className="leading-relaxed break-words">{msg.message}</p>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 px-1 font-bold">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {imagePreview && (
              <div className="flex justify-end px-4 py-2">
                <div className="max-w-[70%] p-1 bg-[#33ac6f] rounded-2xl rounded-tr-none shadow-md">
                  <div className="relative">
                    <img src={imagePreview} alt="preview" className="rounded-xl max-w-xs h-auto max-h-64 object-cover" />
                    <button
                      onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white"
                    > × </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-white border-t">
              <form 
                onSubmit={sendChat} 
                className="flex items-center gap-2 bg-[#F8FAFB] border rounded-2xl p-1.5 focus-within:border-[#33ac6f] transition-all"
              >
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-[#33ac6f]"
                >
                  <FaImageIcon size={18} />
                </button>
                <input
                  type="text"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-1"
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
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && reportTargetOrder && (
        <>
          <div className="fixed inset-0 bg-black/70 z-50" onClick={() => setIsReportModalOpen(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl shadow-2xl z-50">
            <div className="bg-red-600 text-white p-4 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2"><FaFlagIcon /> Report Buyer</span>
              <button onClick={() => setIsReportModalOpen(false)}><FaTimesIcon /></button>
            </div>
            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full border p-3 rounded-lg">
                {SELLER_REPORT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <textarea value={reportMessage} onChange={(e) => setReportMessage(e.target.value)} placeholder="Describe the issue..." required rows={5} className="w-full border p-3 rounded-lg resize-none" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsReportModalOpen(false)} className="flex-1 py-3 border rounded-lg">Cancel</button>
                <button type="submit" disabled={isSubmittingReport} className="flex-1 py-3 bg-red-600 text-white rounded-lg">
                  {isSubmittingReport ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default MyOrder;