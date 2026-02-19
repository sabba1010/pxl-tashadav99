import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthHook } from "../../hook/useAuthHook";
import { toast } from "sonner";
import { useSocket } from "../../context/SocketContext";
import NotificationBadge from "../NotificationBadge";
import UserActivityStatus from "../UserActivityStatus";
import ChatWindow from "../Chat/ChatWindow";

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
  deliveryMs?: number;
  deliveryType?: string;
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

interface IReport {
  _id: string;
  orderId: string;
  productName: string;
  reporterEmail: string;
  sellerEmail: string;
  reason: string;
  message: string;
  status: string;
  createdAt: string;
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

const TABS = ["All", "Pending", "Completed", "Cancelled", "Reported"] as const;
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

const parseDeliveryTime = (str?: string): number | undefined => {
  if (!str) return undefined;
  const match = str.match(/(\d+)\s*(mins?|minutes?|h|hours?|d|days?)/i);
  if (!match) return undefined;
  const num = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.startsWith('min')) return num * 60000;
  if (unit.startsWith('h')) return num * 3600000;
  if (unit.startsWith('d')) return num * 86400000;
  return undefined;
};

const STORAGE_KEY = 'lastReadIds';

const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [buyerNames, setBuyerNames] = useState<Record<string, string>>({});
  const [now, setNow] = useState(Date.now());
  const [reports, setReports] = useState<IReport[]>([]);
  const autoCompletedRef = useRef<Set<string>>(new Set());

  const loginUserData = useAuthHook();
  const sellerId = loginUserData.data?.email || localStorage.getItem("userEmail");

  const BASE_URL = "https://tasha-vps-backend-2.onrender.com";
  const PURCHASE_API = `${BASE_URL}/purchase`;
  const CHAT_API = `${BASE_URL}/chat`;
  const USER_API = `${BASE_URL}/user`;

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [activeChatBuyerEmail, setActiveChatBuyerEmail] = useState<string | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
  const [activeChatProductTitle, setActiveChatProductTitle] = useState<string>("");

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetOrder, setReportTargetOrder] = useState<Order | null>(null);
  const [reportReason, setReportReason] = useState(SELLER_REPORT_REASONS[0]);
  const [reportMessage, setReportMessage] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 40;

  const [lastMessageTimes, setLastMessageTimes] = useState<Record<string, string | undefined>>({});
  const [lastSeenMap, setLastSeenMap] = useState<Record<string, string | null>>({}); // Keeping for specific logic if needed, or replace with Context

  const { socket, onlineUsers } = useSocket();

  const [unreadCounts, setUnreadCounts] = useState(new Map<string, number>());
  const [fetchedOrders, setFetchedOrders] = useState(new Set<string>());
  const [lastReadIds, setLastReadIds] = useState<Record<string, string | undefined>>({});


  // Load lastReadIds from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLastReadIds(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);



  // Auto-reload disabled per user request

  const getRemainingTime = (rawDate: string, deliveryMs?: number, deliveryType?: string) => {
    const timeoutMs = deliveryMs ?? 14400000;
    const diff = (new Date(rawDate).getTime() + timeoutMs) - now;
    if (diff <= 0) return deliveryType === 'manual' ? "Overdue" : "Confirming...";
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    return `${h}h ${m}m ${s}s`;
  };

  const getTimeLabel = (deliveryType?: string) => {
    return deliveryType === 'manual' ? "Expected delivery in" : "Auto-confirm in";
  };

  const setPresence = async (status: 'online' | 'offline') => {
    if (!sellerId) return;
    try {
      await axios.post(`${CHAT_API}/status`, { userId: sellerId, status });
    } catch (err) { }
  };

  // Removed fetchBuyerStatus as logic moved to ChatWindow

  // Removed fetchAllBuyersStatus as we use SocketContext for status

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
              const deliveryMs = parseDeliveryTime(productRes.data.deliveryTime);
              return {
                ...item,
                categoryIcon: productRes.data.categoryIcon,
                deliveryType: productRes.data.deliveryType,
                deliveryMs,
              };
            }
          } catch (err) {
            console.error(`Failed to fetch product ${item.productId}:`, err);
          }
        }
        return item;
      }));

      const mapped: Order[] = enrichedData.map((item: any) => ({
        id: item._id,
        platform: inferPlatform(item.productName),
        title: item.productName || "Uncategorized Product",
        desc: item.productId ? `Product ID: ${item.productId}` : "No product ID",
        buyerEmail: item.buyerEmail,
        price: item.price,
        date: formatDate(item.purchaseDate),
        rawDate: item.purchaseDate,
        status: (item.status.charAt(0).toUpperCase() + item.status.slice(1)) as OrderStatus,
        orderNumber: `ORD-${item._id.slice(-6).toUpperCase()}`,
        icon: item.categoryIcon,
        deliveryMs: item.deliveryMs,
        deliveryType: item.deliveryType,
      }));
      setOrders(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReports = async () => {
    if (!sellerId) return;
    try {
      const res = await axios.get<IReport[]>(`${PURCHASE_API}/my-reports?email=${sellerId}`);
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchReports();
  }, [sellerId]);

  // Removed sendChat as logic moved to ChatWindow

  const handleOpenChat = (order: Order) => {
    setActiveChatBuyerEmail(order.buyerEmail);
    setActiveChatOrderId(order.id);
    setActiveChatProductTitle(order.title);
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
    setIsUpdating(true);
    try {
      await axios.patch(`${PURCHASE_API}/update-status/${id}`, { status, email: sellerId, role: "seller" });
      toast.success(`Order ${status} successfully!`);
      setSelected(null);
      fetchOrders();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to update status";
      toast.error(errMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === "All") return orders;
    if (activeTab === "Reported") {
      const reportedOrderIds = new Set(reports.map(r => r.orderId));
      return orders.filter(o => reportedOrderIds.has(o.id));
    }
    return orders.filter((o) => o.status === activeTab);
  }, [activeTab, orders, reports]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (newMsg: any) => {
        setLastMessageTimes(prev => ({
          ...prev,
          [newMsg.orderId]: newMsg.createdAt || new Date().toISOString(),
        }));

        if (newMsg.senderId !== sellerId && (newMsg.orderId !== activeChatOrderId)) {
          setUnreadCounts(prev => {
            const newMap = new Map(prev);
            const count = newMap.get(newMsg.orderId) || 0;
            newMap.set(newMsg.orderId, count + 1);
            return newMap;
          });
        } else if (newMsg.orderId === activeChatOrderId && newMsg._id) {
          setLastReadIds(prev => {
            const updated = { ...prev, [newMsg.orderId]: newMsg._id };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
        }
      };

      socket.on('receive_message', handleReceiveMessage);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
      };
    }
  }, [socket, sellerId, activeChatOrderId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (sellerId) {
        for (const order of paginatedOrders) {
          if (!fetchedOrders.has(order.id)) {
            try {
              const res = await axios.get<IMessage[]>(`${CHAT_API}/history/${sellerId}/${order.buyerEmail}`, {
                params: { orderId: order.id },
              });
              const messages = res.data;
              if (messages.length > 0) {
                const last = messages[messages.length - 1];
                setLastMessageTimes(prev => ({
                  ...prev,
                  [order.id]: last.createdAt,
                }));

                const lastReadId = lastReadIds[order.id];
                let unread = 0;
                if (lastReadId) {
                  const lastReadIndex = messages.findIndex(m => m._id === lastReadId);
                  if (lastReadIndex > -1) {
                    unread = messages.slice(lastReadIndex + 1).filter(m => m.senderId !== sellerId).length;
                  } else {
                    unread = messages.filter(m => m.senderId !== sellerId).length;
                  }
                } else {
                  unread = messages.filter(m => m.senderId !== sellerId).length;
                }
                setUnreadCounts(prev => {
                  const newMap = new Map(prev);
                  newMap.set(order.id, unread);
                  return newMap;
                });
              }
              setFetchedOrders(prev => {
                const newSet = new Set(prev);
                newSet.add(order.id);
                return newSet;
              });
            } catch (err) {
              console.error(`Failed to fetch chat for order ${order.id}`, err);
            }
          }
        }
      }
    };

    fetchInitialData();
  }, [paginatedOrders, sellerId, fetchedOrders, lastReadIds]);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1A3A]">My Sales</h1>
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#33ac6f] hover:bg-[#28935a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all active:scale-95 shadow-sm"
              title="Refresh sales"
            >
              <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reload</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="flex gap-6 p-4 border-b overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
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
                          <UserActivityStatus userId={order.buyerEmail} />
                        </div>
                        {lastMessageTimes[order.id] && (
                          <p className="text-[10px] text-gray-500 mt-0.5">{timeAgo(lastMessageTimes[order.id])}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' :
                            (order.status === 'Cancelled') ? 'bg-red-50 text-red-600 border-red-100' :
                              'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                            {order.status}
                          </span>
                          {order.status === "Pending" && (
                            <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                              <FaClockIcon size={10} /> {getTimeLabel(order.deliveryType)}: {getRemainingTime(order.rawDate, order.deliveryMs, order.deliveryType)}
                            </span>
                          )}
                          {reports.some(r => r.orderId === order.id) && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              ⚠️ Reported
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
                              <NotificationBadge count={unreadCounts.get(order.id) || 0} />
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {filteredOrders.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }).map((_, i) => {
                  const pageNumber = i + 1;
                  const isActive = pageNumber === currentPage;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive
                        ? 'bg-[#33ac6f] text-white'
                        : 'border hover:bg-gray-50'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
            )}
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
                <span className={`font-bold ${selected.status === 'Completed' ? 'text-green-600' : selected.status === 'Cancelled' ? 'text-red-600' : 'text-amber-600'}`}>
                  {selected.status}
                </span>
              </div>
              {selected.status === "Pending" && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">{getTimeLabel(selected.deliveryType)}</span>
                  <span className="font-bold text-blue-600">{getRemainingTime(selected.rawDate, selected.deliveryMs, selected.deliveryType)}</span>
                </div>
              )}
              <div className="pt-2">
                <p className="text-gray-500 mb-1">Product Details</p>
                <div className="bg-white p-3 rounded-lg border font-mono text-xs break-all">
                  {selected.desc || "No additional details provided."}
                </div>
              </div>

              {(() => {
                const report = reports.find(r => r.orderId === selected?.id);
                if (!report) return null;
                return (
                  <div className="pt-4 border-t mt-4">
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaFlagIcon className="text-red-500" size={14} />
                        <span className="text-sm font-bold text-red-700 uppercase">Order Reported</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-red-600/70">Reason:</span>
                          <span className="font-bold text-red-800">{report.reason}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-red-600/70">Message:</span>
                          <p className="bg-white/50 p-2 rounded border border-red-100 italic">
                            "{report.message}"
                          </p>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-red-600/70">Time:</span>
                          <span className="text-red-800 font-medium">
                            {new Date(report.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 bg-red-100/50 p-2 rounded">
                          <span className="text-red-600/70 font-semibold">Status:</span>
                          <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                            {report.status || "Pending Review"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 italic text-center">
                      This order is currently under review by administrators.
                    </p>
                  </div>
                );
              })()}
            </div>
            {selected.status !== "Cancelled" && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* <button
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('cancelled')}
                  className="py-3.5 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2 font-semibold text-base transition disabled:opacity-50"
                >
                  <FaBanIcon size={20} /> Cancel
                </button> */}
                <button
                  onClick={() => {
                    setReportTargetOrder(selected);
                    setIsReportModalOpen(true);
                  }}
                  disabled={reports.some(r => r.orderId === selected.id)}
                  className="py-3.5 px-4 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2 font-semibold text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaFlagIcon size={20} /> {reports.some(r => r.orderId === selected.id) ? "Already Reported" : "Report"}
                </button>
              </div>
            )}
            {/* Seller Confirmation Button */}
            {selected.status === "Pending" && (
              <div className="mt-4">
                <button
                  disabled={isUpdating || reports.some(r => r.orderId === selected.id)}
                  onClick={() => handleUpdateStatus('completed')}
                  className="w-full py-3.5 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-semibold text-base transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaCheckCircleIcon size={20} /> {reports.some(r => r.orderId === selected.id) ? "Under Review" : "Confirm Delivery"}
                </button>
                {reports.some(r => r.orderId === selected.id) && (
                  <p className="text-[10px] text-red-500 font-bold mt-2 text-center animate-pulse">
                    ⚠️ Actions disabled while under review.
                  </p>
                )}
              </div>
            )}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      {activeChatBuyerEmail && activeChatOrderId && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <ChatWindow
            orderId={activeChatOrderId}
            buyerEmail={activeChatBuyerEmail}
            sellerEmail={sellerId || ""}
            currentUserEmail={sellerId || ""}
            onClose={() => {
              setActiveChatBuyerEmail(null);
              setActiveChatOrderId(null);
              // Mark as read in local state when closing
              setUnreadCounts(prev => {
                const newMap = new Map(prev);
                newMap.set(activeChatOrderId, 0);
                return newMap;
              });
            }}
            productTitle={activeChatProductTitle}
          />
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