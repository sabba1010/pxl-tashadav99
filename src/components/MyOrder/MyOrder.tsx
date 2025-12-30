import React, { useState, useEffect, useRef, useMemo } from "react";
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
  FaPaperPlane,
  FaSmile,
  FaPaperclip,
  FaCircle,
  FaCheck, // Added for Confirm button
  FaBan, // Added for Cancel button
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
const FaPaperPlaneIcon = FaPaperPlane as unknown as React.ComponentType<any>;
const FaSmileIcon = FaSmile as unknown as React.ComponentType<any>;
const FaPaperclipIcon = FaPaperclip as unknown as React.ComponentType<any>;
const FaCircleIcon = FaCircle as unknown as React.ComponentType<any>;
const FaCheckIcon = FaCheck as unknown as React.ComponentType<any>;
const FaBanIcon = FaBan as unknown as React.ComponentType<any>;

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

const NOTIFICATION_SOUND =
  "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3";
const EMOJI_LIST = [
  "😀",
  "😂",
  "🥰",
  "😍",
  "😎",
  "😭",
  "😡",
  "👍",
  "👎",
  "🔥",
  "❤️",
  "✅",
  "🎉",
  "👋",
];

/* ---------------------------------------------
   Types
---------------------------------------------- */
type OrderStatus = "Pending" | "Completed" | "Cancelled";
type PlatformType =
  | "instagram"
  | "facebook"
  | "twitter"
  | "whatsapp"
  | "telegram"
  | "other";

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
}

interface IMessage {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  orderId?: string;
  createdAt?: string;
}

interface ApiUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
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
    case "instagram":
      return FaInstagram;
    case "facebook":
      return FaFacebookF;
    case "twitter":
      return FaTwitter;
    case "whatsapp":
      return FaWhatsapp;
    case "telegram":
      return FaTelegram;
    default:
      return FaGlobe;
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

// --- Time Helper ---
const timeAgo = (dateString?: string) => {
  if (!dateString) return null;
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
  const bg =
    brandHex ?? vibrantGradients[platform.length % vibrantGradients.length];
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

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

/* =============================================
   Main Component (Seller View)
============================================= */
const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // New loading state for updates

  // Store Buyer Names (Email -> Name)
  const [buyerNames, setBuyerNames] = useState<Record<string, string>>({});

  const loginUserData = useAuthHook();
  const sellerId =
    loginUserData.data?.email || localStorage.getItem("userEmail");

  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [activeChatBuyerEmail, setActiveChatBuyerEmail] = useState<
    string | null
  >(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(
    null
  );
  const [activeChatProductTitle, setActiveChatProductTitle] =
    useState<string>("");

  const [unreadState, setUnreadState] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatLengthRef = useRef(0);

  const PURCHASE_API = "http://localhost:3200/purchase";
  const CHAT_API = "http://localhost:3200/chat";
  const USER_API = "http://localhost:3200/user";

  const playNotificationSound = () => {
    const audio = new Audio(NOTIFICATION_SOUND);
    audio.play().catch((err) => console.log("Audio play failed:", err));
  };

  /* -------- Fetch Data (Seller Orders) -------- */
  useEffect(() => {
    const fetchOrders = async () => {
      if (!sellerId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const res = await axios.get(`${PURCHASE_API}/getall`);
        const allData = res.data as ApiOrder[];
        // Filter where I am the seller
        const mySales = allData.filter((item) => item.sellerEmail === sellerId);

        const mapped = mySales.map((item) => ({
          id: item._id,
          platform: inferPlatform(item.productName),
          title: item.productName,
          desc: `Product ID: ${item.productId}`,
          buyerEmail: item.buyerEmail,
          price: item.price,
          date: formatDate(item.purchaseDate),
          status: (item.status.charAt(0).toUpperCase() +
            item.status.slice(1)) as OrderStatus,
          orderNumber: `ORD-${item._id.slice(-6).toUpperCase()}`,
        }));

        setOrders(mapped);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [sellerId]);

  /* -------- Fetch Buyer Names -------- */
  useEffect(() => {
    const fetchNames = async () => {
      if (orders.length === 0) return;
      const uniqueEmails = Array.from(new Set(orders.map((p) => p.buyerEmail)));
      const newNames: Record<string, string> = {};
      const emailsToFetch = uniqueEmails.filter((email) => !buyerNames[email]);

      if (emailsToFetch.length === 0) return;

      await Promise.all(
        emailsToFetch.map(async (email) => {
          try {
            // Fetch user data for the BUYER
            const res = await axios.get<ApiUser>(`${USER_API}/${email}`);
            if (res.data && res.data.name) {
              newNames[email] = res.data.name;
            } else {
              newNames[email] = email.split("@")[0];
            }
          } catch (error) {
            newNames[email] = email.split("@")[0];
          }
        })
      );
      setBuyerNames((prev) => ({ ...prev, ...newNames }));
    };
    fetchNames();
  }, [orders]);

  /* -------- Unread Messages Logic -------- */
  useEffect(() => {
    const checkUnread = async () => {
      if (!sellerId || orders.length === 0) return;
      const newUnreadMap: Record<string, boolean> = { ...unreadState };
      let hasChange = false;

      await Promise.all(
        orders.map(async (p) => {
          if (isChatOpen && activeChatOrderId === p.id) return;
          try {
            const res = await axios.get(
              `${CHAT_API}/history/${sellerId}/${p.buyerEmail}`,
              {
                params: { orderId: p.id },
              }
            );
            const msgs = res.data as IMessage[];
            if (msgs.length > 0) {
              const lastMsg = msgs[msgs.length - 1];
              // If sender is NOT me (Seller), it is unread
              if (lastMsg.senderId.toLowerCase() !== sellerId.toLowerCase()) {
                if (newUnreadMap[p.id] !== true) {
                  newUnreadMap[p.id] = true;
                  hasChange = true;
                }
              }
            }
          } catch (e) {}
        })
      );
      if (hasChange) setUnreadState(newUnreadMap);
    };

    if (orders.length > 0) {
      checkUnread();
      const interval = setInterval(checkUnread, 10000);
      return () => clearInterval(interval);
    }
  }, [orders, sellerId, isChatOpen, activeChatOrderId]);

  /* -------- Update Status Logic (Confirm/Cancel) -------- */
  const updateOrderStatus = async (
    orderId: string,
    newStatus: "Completed" | "Cancelled"
  ) => {
    if (!orderId) return;

    try {
      setIsUpdating(true);

      // ✅ PATCH REQUEST: Matches your existing backend route /update-status/:id
      await axios.patch(`${PURCHASE_API}/update-status/${orderId}`, {
        status: newStatus, // Backend receives this status
      });

      // Update Local State immediately
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      // Update Selected Modal if open
      if (selected && selected.id === orderId) {
        setSelected((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  /* -------- Auto Delete Function -------- */
  const autoDeleteOldMessages = async (messages: IMessage[]) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldMessages = messages.filter((m) => {
      if (!m.createdAt || !m._id) return false;
      return new Date(m.createdAt) < thirtyDaysAgo;
    });

    if (oldMessages.length > 0) {
      for (const msg of oldMessages) {
        try {
          await axios.delete(`${CHAT_API}/${msg._id}`);
        } catch (err) {}
      }
      return true;
    }
    return false;
  };

  /* -------- Chat Logic -------- */
  const fetchChat = async (buyerEmail: string, orderId: string) => {
    if (!sellerId || !buyerEmail || !orderId) return;
    try {
      const res = await axios.get(
        `${CHAT_API}/history/${sellerId}/${buyerEmail}`,
        {
          params: { orderId: orderId },
        }
      );
      let newData = res.data as IMessage[];

      // Filter old messages
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const validMessages = newData.filter((m) => {
        if (!m.createdAt) return true;
        return new Date(m.createdAt) >= thirtyDaysAgo;
      });

      if (validMessages.length < newData.length) {
        autoDeleteOldMessages(newData);
        newData = validMessages;
      }

      if (
        newData.length > chatLengthRef.current &&
        chatLengthRef.current !== 0
      ) {
        const lastMsg = newData[newData.length - 1];
        // If NEW message from Buyer
        if (lastMsg.senderId.toLowerCase() !== sellerId.toLowerCase()) {
          playNotificationSound();
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
    if (isChatOpen && activeChatBuyerEmail && activeChatOrderId) {
      setUnreadState((prev) => ({ ...prev, [activeChatOrderId!]: false }));
      fetchChat(activeChatBuyerEmail, activeChatOrderId);
      timer = setInterval(
        () => fetchChat(activeChatBuyerEmail, activeChatOrderId),
        3000
      );
    }
    return () => clearInterval(timer);
  }, [isChatOpen, activeChatBuyerEmail, activeChatOrderId, sellerId]);

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !typedMessage.trim() ||
      !activeChatBuyerEmail ||
      !sellerId ||
      !activeChatOrderId
    )
      return;

    try {
      await axios.post(`${CHAT_API}/send`, {
        senderId: sellerId,
        receiverId: activeChatBuyerEmail,
        message: typedMessage,
        orderId: activeChatOrderId,
      });

      await sendNotification({
        type: "message",
        title: "New Message from Seller",
        message: `Re: ${activeChatProductTitle}: ${typedMessage}`,
        data: { sender: sellerId, orderId: activeChatOrderId },
        userEmail: activeChatBuyerEmail,
      } as any);

      setTypedMessage("");
      setShowEmojiPicker(false);
      fetchChat(activeChatBuyerEmail, activeChatOrderId);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setTypedMessage((prev) => prev + emoji);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter((p) => p.status === activeTab);
  }, [activeTab, orders]);

  // Helper to get Buyer Name
  const getBuyerDisplayName = (email: string | null) => {
    if (!email) return "Unknown";
    if (buyerNames[email]) return buyerNames[email];
    return email.split("@")[0];
  };

  const handleOpenChat = (p: Order) => {
    setActiveChatBuyerEmail(p.buyerEmail);
    setActiveChatOrderId(p.id);
    setActiveChatProductTitle(p.title);
    setUnreadState((prev) => ({ ...prev, [p.id]: false }));
    setIsChatOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#0A1A3A]">
                My Sales
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Manage your sold items
              </p>
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
                      activeTab === t
                        ? "text-[#d4a643] border-b-2 border-[#d4a643]"
                        : "text-gray-500"
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
                  <div className="py-20 text-center text-gray-400">
                    Loading your sales...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-20 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-2xl">
                      🏷️
                    </div>
                    <h3 className="text-lg font-semibold text-[#0A1A3A]">
                      No Sales Yet
                    </h3>
                    <Link
                      to="/add-product"
                      className="mt-4 bg-[#33ac6f] text-white px-6 py-2 rounded-full text-sm font-medium"
                    >
                      Add Product
                    </Link>
                  </div>
                ) : (
                  filtered.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelected(p)} // Changed: Click anywhere to open details
                      className="bg-[#F8FAFB] cursor-pointer rounded-xl p-3 sm:p-4 flex items-start gap-3 border border-gray-100 hover:shadow-md transition-all group"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {renderBadge(p.platform)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#0A1A3A] truncate group-hover:text-blue-600 transition-colors">
                          {p.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {p.desc}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              p.status === "Completed"
                                ? "bg-green-50 text-green-700 border-green-100"
                                : p.status === "Pending"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : "bg-red-50 text-red-700 border-red-100"
                            }`}
                          >
                            {p.status}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-medium">
                            Buyer: {getBuyerDisplayName(p.buyerEmail)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                        <div className="text-sm font-bold text-[#0A1A3A]">
                          ${p.price.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {p.date}
                        </div>
                        <div
                          className="flex gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setSelected(p)}
                            className="p-1.5 border rounded bg-white hover:bg-gray-50"
                          >
                            <FaEyeIcon size={14} />
                          </button>

                          <button
                            onClick={() => handleOpenChat(p)}
                            className="relative p-1.5 border rounded bg-white hover:bg-blue-50 text-blue-600 transition-colors"
                          >
                            <FaCommentsIcon size={14} />
                            {unreadState[p.id] && (
                              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                              </span>
                            )}
                          </button>
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
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelected(null)}
          />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg w-full bg-white rounded-t-3xl sm:rounded-3xl z-50 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="sticky top-0 bg-white border-b sm:border-b-0 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-lg font-bold text-[#0A1A3A]">
                  {selected.title}
                </h2>
                <div className="text-xs text-gray-500 mt-0.5">
                  {selected.platform} • Sold on {selected.date}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FaTimesIcon className="w-5 h-5 text-gray-600" />
              </button>
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
                  <p className="text-gray-500">Order Status</p>
                  <span
                    className={`inline-block px-3 py-1 mt-1 rounded-full text-xs font-bold border ${
                      selected.status === "Completed"
                        ? "bg-green-50 text-green-700 border-green-100"
                        : selected.status === "Pending"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    {selected.status}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500">Order Number</p>
                  <p className="font-medium">{selected.orderNumber || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Buyer</p>
                  <p className="font-medium text-blue-600">
                    {getBuyerDisplayName(selected.buyerEmail)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Description</p>
                  <p className="text-sm text-gray-600">
                    {selected.desc ?? "No additional details."}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS: ONLY SHOW IF PENDING */}
              {selected.status === "Pending" && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Order Actions
                  </p>
                  <div className="flex gap-3">
                    <button
                      disabled={isUpdating}
                      onClick={() =>
                        updateOrderStatus(selected.id, "Completed")
                      }
                      className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isUpdating ? (
                        "Updating..."
                      ) : (
                        <>
                          <FaCheckIcon size={14} /> Confirm
                        </>
                      )}
                    </button>
                    <button
                      disabled={isUpdating}
                      onClick={() =>
                        updateOrderStatus(selected.id, "Cancelled")
                      }
                      className="flex-1 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaBanIcon size={14} /> Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => {
                    setSelected(null);
                    handleOpenChat(selected);
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 relative"
                >
                  <FaCommentsIcon /> Chat with Buyer
                  {unreadState[selected.id] && (
                    <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                      New
                    </span>
                  )}
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
        </>
      )}

      {/* --- Chat Modal --- */}
      {isChatOpen && activeChatBuyerEmail && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/70 z-[100] backdrop-blur-sm transition-opacity"
            onClick={() => setIsChatOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full bg-[#ECE5DD] sm:rounded-2xl z-[110] shadow-2xl flex flex-col h-[85vh] sm:h-[600px] overflow-hidden animate-in slide-in-from-bottom-10 duration-300 border border-gray-200">
            <div className="bg-white/95 backdrop-blur-md px-4 py-3 border-b flex justify-between items-center shadow-sm z-20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md uppercase">
                    {getBuyerDisplayName(activeChatBuyerEmail)[0]}
                  </div>
                </div>
                <div className="flex flex-col">
                  {/* Display Name */}
                  <h3 className="font-bold text-gray-800 text-sm truncate max-w-[160px]">
                    {getBuyerDisplayName(activeChatBuyerEmail)}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <FaTimesIcon size={14} />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{
                backgroundImage:
                  "radial-gradient(#cbd5e1 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              <div className="text-center my-4">
                <span className="text-[10px] bg-gray-200/60 px-3 py-1 rounded-full text-gray-500 font-medium">
                  Today
                </span>
              </div>
              {chatMessages.map((m, i) => {
                const isMe =
                  m.senderId.toLowerCase() === sellerId?.toLowerCase();
                const timeLabel = timeAgo(m.createdAt);
                return (
                  <div
                    key={i}
                    className={`flex w-full ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 text-sm shadow-sm relative group ${
                        isMe
                          ? "bg-gradient-to-r from-[#33ac6f] to-[#2d9660] text-white rounded-2xl rounded-tr-sm"
                          : "bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100"
                      }`}
                    >
                      {m.message}
                      {timeLabel && (
                        <div
                          className={`text-[9px] mt-1 opacity-70 flex justify-end ${
                            isMe ? "text-green-100" : "text-gray-400"
                          }`}
                        >
                          {timeLabel}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {showEmojiPicker && (
              <div className="bg-white border rounded-xl shadow-lg p-2 absolute bottom-20 left-4 z-30 w-64 grid grid-cols-7 gap-1">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddEmoji(emoji)}
                    className="p-1 hover:bg-gray-100 rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={sendChat}
              className="p-3 bg-white border-t flex gap-2 items-center z-20"
            >
              <div className="flex-1 relative">
                <input
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Type here..."
                  className="w-full bg-gray-100 text-gray-800 rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#33ac6f]/50 transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition"
                >
                  <FaSmileIcon />
                </button>
              </div>
              <button
                type="submit"
                className="bg-[#0A1A3A] text-white p-2.5 rounded-full hover:bg-black transition-colors"
              >
                <FaPaperPlaneIcon size={14} className="ml-0.5" />
              </button>
            </form>
          </div>
        </>
      )}

      <Link
        to="/add-product"
        className="hidden sm:flex fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] text-white rounded-full shadow-2xl items-center justify-center text-xl hover:scale-110 transition-transform"
      >
        <FaPlusIcon />
      </Link>
    </>
  );
};

export default MyOrder;
