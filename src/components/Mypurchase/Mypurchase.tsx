import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthHook } from "../../hook/useAuthHook";
import { sendNotification } from "../Notification/Notification";
import { toast } from "sonner"; // Toast Import

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
type PurchaseStatus = "Pending" | "Completed" | "Cancelled";
type PlatformType =
  | "instagram"
  | "facebook"
  | "twitter"
  | "whatsapp"
  | "telegram"
  | "other";

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
  const n = name ? name.toLowerCase() : "";
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

const formatDate = (d: string) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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
   Main Component
============================================= */
const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Seller Names Map
  const [sellerNames, setSellerNames] = useState<Record<string, string>>({});

  const loginUserData = useAuthHook();
  const buyerId =
    loginUserData.data?.email || localStorage.getItem("userEmail");

  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Specific Chat Identifiers
  const [activeChatSellerEmail, setActiveChatSellerEmail] = useState<
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API URLs
  const PURCHASE_API = "http://localhost:3200/purchase";
  const CHAT_API = "http://localhost:3200/chat";
  const USER_API = "http://localhost:3200/user";

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

        // Filter: Get only items where I am the BUYER
        const myData = (res.data as ApiPurchase[]).filter(
          (item) => item.buyerEmail === buyerId
        );

        const mapped = myData.map((item) => ({
          id: item._id,
          platform: inferPlatform(item.productName),
          title: item.productName || "Untitled Product",
          desc: `Product ID: ${item.productId}`,
          sellerEmail: item.sellerEmail || "Unknown",
          price: item.price || 0,
          date: formatDate(item.purchaseDate),
          status: (item.status
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : "Pending") as PurchaseStatus,
          purchaseNumber: `ORD-${item._id.slice(-6).toUpperCase()}`,
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

  /* -------- Fetch Seller Names -------- */
  useEffect(() => {
    const fetchNames = async () => {
      if (purchases.length === 0) return;

      const uniqueEmails = Array.from(
        new Set(purchases.map((p) => p.sellerEmail))
      ).filter((email) => email && email !== "Unknown");

      const newNames: Record<string, string> = {};
      const emailsToFetch = uniqueEmails.filter((email) => !sellerNames[email]);

      if (emailsToFetch.length === 0) return;

      await Promise.all(
        emailsToFetch.map(async (email) => {
          if (!email) return;
          try {
            const res = await axios.get<ApiUser>(`${USER_API}/${email}`);
            if (res.data && res.data.name) {
              newNames[email] = res.data.name;
            } else {
              newNames[email] = email.includes("@")
                ? email.split("@")[0]
                : email;
            }
          } catch (error) {
            newNames[email] = email.includes("@") ? email.split("@")[0] : email;
          }
        })
      );
      setSellerNames((prev) => ({ ...prev, ...newNames }));
    };
    fetchNames();
  }, [purchases]);

  /* -------- Unread Messages Logic -------- */
  useEffect(() => {
    const checkUnread = async () => {
      if (!buyerId || purchases.length === 0) return;
      const newUnreadMap: Record<string, boolean> = { ...unreadState };
      let hasChange = false;

      await Promise.all(
        purchases.map(async (p) => {
          if (isChatOpen && activeChatOrderId === p.id) return;
          if (!p.sellerEmail || p.sellerEmail === "Unknown") return;

          try {
            const res = await axios.get(
              `${CHAT_API}/history/${buyerId}/${p.sellerEmail}`,
              {
                params: { orderId: p.id },
              }
            );
            const msgs = res.data as IMessage[];
            if (msgs.length > 0) {
              const lastMsg = msgs[msgs.length - 1];
              if (
                lastMsg.senderId &&
                buyerId &&
                lastMsg.senderId.toLowerCase() !== buyerId.toLowerCase()
              ) {
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

    if (purchases.length > 0) {
      checkUnread();
      const interval = setInterval(checkUnread, 10000);
      return () => clearInterval(interval);
    }
  }, [purchases, buyerId, isChatOpen, activeChatOrderId]);

  /* -------- Status Actions (WITH TOAST) -------- */
  const handleUpdateStatus = async (status: "completed" | "cancelled") => {
    if (!selected || !buyerId) return;
    try {
      await axios.patch(`${PURCHASE_API}/update-status/${selected.id}`, {
        status,
      });
      setPurchases((prev) =>
        prev.map((p) =>
          p.id === selected.id
            ? {
                ...p,
                status: (status.charAt(0).toUpperCase() +
                  status.slice(1)) as PurchaseStatus,
              }
            : p
        )
      );

      setSelected((prev) =>
        prev
          ? {
              ...prev,
              status: (status.charAt(0).toUpperCase() +
                status.slice(1)) as PurchaseStatus,
            }
          : null
      );

      // TOAST ALERT
      if (status === "completed") {
        toast.success("Order received and confirmed successfully!");
      } else {
        toast.success("Order cancelled successfully.");
      }
    } catch (err) {
      toast.error("Failed to update status. Please try again.");
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
  const fetchChat = async (sellerEmail: string, orderId: string) => {
    if (!buyerId || !sellerEmail || !orderId) return;
    try {
      const res = await axios.get(
        `${CHAT_API}/history/${buyerId}/${sellerEmail}`,
        {
          params: { orderId: orderId },
        }
      );
      let newData = res.data as IMessage[];

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
        if (
          lastMsg.senderId &&
          buyerId &&
          lastMsg.senderId.toLowerCase() !== buyerId.toLowerCase()
        ) {
          playNotificationSound();
          toast.info(`New message from ${getSellerDisplayName(sellerEmail)}`);
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
      setUnreadState((prev) => ({ ...prev, [activeChatOrderId!]: false }));
      fetchChat(activeChatSellerEmail, activeChatOrderId);
      timer = setInterval(
        () => fetchChat(activeChatSellerEmail, activeChatOrderId),
        3000
      );
    }
    return () => clearInterval(timer);
  }, [isChatOpen, activeChatSellerEmail, activeChatOrderId, buyerId]);

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !typedMessage.trim() ||
      !activeChatSellerEmail ||
      !buyerId ||
      !activeChatOrderId
    )
      return;
    try {
      await axios.post(`${CHAT_API}/send`, {
        senderId: buyerId,
        receiverId: activeChatSellerEmail,
        message: typedMessage,
        orderId: activeChatOrderId,
      });
      setTypedMessage("");
      setShowEmojiPicker(false);
      fetchChat(activeChatSellerEmail, activeChatOrderId);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTypedMessage((prev) => prev + ` [File: ${file.name}] `);
      toast.success(`File "${file.name}" attached!`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddEmoji = (emoji: string) => {
    setTypedMessage((prev) => prev + emoji);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return purchases;
    return purchases.filter((p) => p.status === activeTab);
  }, [activeTab, purchases]);

  const handleOpenChat = (p: Purchase) => {
    setActiveChatSellerEmail(p.sellerEmail);
    setActiveChatOrderId(p.id);
    setActiveChatProductTitle(p.title);
    setUnreadState((prev) => ({ ...prev, [p.id]: false }));
    setIsChatOpen(true);
  };

  const getSellerDisplayName = (email: string | null) => {
    if (!email || email === "Unknown") return "Unknown Seller";
    if (sellerNames[email]) return sellerNames[email];
    return email.includes("@") ? email.split("@")[0] : email;
  };

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#0A1A3A]">
                My Purchase
              </h1>
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
                    Loading your purchases...
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-20 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-2xl">
                      🛒
                    </div>
                    <h3 className="text-lg font-semibold text-[#0A1A3A]">
                      No Purchases Found
                    </h3>
                    <Link
                      to="/marketplace"
                      className="mt-4 bg-[#33ac6f] text-white px-6 py-2 rounded-full text-sm font-medium"
                    >
                      Browse Marketplace
                    </Link>
                  </div>
                ) : (
                  filtered.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#F8FAFB] rounded-xl p-3 sm:p-4 flex items-start gap-3 border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {renderBadge(p.platform)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#0A1A3A] truncate">
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
                            Seller: {getSellerDisplayName(p.sellerEmail)}
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
                        <div className="flex gap-1">
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
                  {selected.platform} • Purchased on {selected.date}
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
                  <p className="text-gray-500">Purchase Number</p>
                  <p className="font-medium text-gray-900">
                    {selected.purchaseNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Seller</p>
                  <p className="font-medium text-gray-900">
                    {getSellerDisplayName(selected.sellerEmail)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Description</p>
                  <p className="text-sm text-gray-600">
                    {selected.desc ?? "No additional details."}
                  </p>
                </div>
              </div>

              {/* --- RESTORED CONFIRM & CANCEL BUTTONS --- */}
              {selected.status === "Pending" && (
                <div className="grid grid-cols-2 gap-2 mt-6">
                  <button
                    onClick={() => handleUpdateStatus("completed")}
                    className="py-2.5 bg-[#33ac6f] hover:bg-[#2aa46a] text-white rounded-lg font-medium transition shadow-sm"
                  >
                    Confirm Received
                  </button>
                  <button
                    onClick={() => handleUpdateStatus("cancelled")}
                    className="py-2.5 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition border border-red-100"
                  >
                    Cancel Order
                  </button>
                </div>
              )}

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    setSelected(null);
                    handleOpenChat(selected);
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 relative"
                >
                  <FaCommentsIcon /> Chat Seller
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

      {/* --- CHAT MODAL --- */}
      {isChatOpen && activeChatSellerEmail && (
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
                    {getSellerDisplayName(activeChatSellerEmail)[0]}
                  </div>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-gray-800 text-sm truncate max-w-[160px]">
                    {getSellerDisplayName(activeChatSellerEmail)}
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
                  m.senderId.toLowerCase() === buyerId?.toLowerCase();
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
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-blue-500 transition"
              >
                <FaPlusIcon />
              </button>

              <div className="flex-1 relative">
                <input
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  placeholder="Type a message..."
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
                disabled={!typedMessage.trim()}
                className={`p-3 rounded-full shadow-lg transition-all transform active:scale-95 flex items-center justify-center ${
                  typedMessage.trim()
                    ? "bg-[#33ac6f] text-white hover:bg-[#2aa46a] shadow-green-500/30"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FaPaperPlaneIcon className="ml-0.5" size={14} />
              </button>
            </form>
          </div>
        </>
      )}
      <Link
        to="/add-product"
        className="hidden sm:flex fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] text-white rounded-full shadow-2xl items-center justify-center text-xl hover:scale-110 transition-transform hover:shadow-green-500/50 z-30"
      >
        <FaPlusIcon />
      </Link>
    </>
  );
};

export default MyPurchase;
