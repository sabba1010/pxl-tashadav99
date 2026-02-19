import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthHook } from "../../hook/useAuthHook";
import { toast } from "sonner";
import RatingModal from "../Rating/RatingModal";
import { useSocket } from "../../context/SocketContext";
import NotificationBadge from "../NotificationBadge";
import UserActivityStatus from "../UserActivityStatus";
import ChatWindow from "../Chat/ChatWindow";

import {
  FaTimes,
  FaEye,
  FaComments,
  FaPaperPlane,
  FaClock,
  FaFlag,
  FaCheckCircle,
  FaImage,
} from "react-icons/fa";

const FaTimesIcon = FaTimes as any;
const FaEyeIcon = FaEye as any;
const FaCommentsIcon = FaComments as any;
const FaPaperPlaneIcon = FaPaperPlane as any;
const FaClockIcon = FaClock as any;
const FaFlagIcon = FaFlag as any;
const FaCheckCircleIcon = FaCheckCircle as any;
const FaImageIcon = FaImage as any;

type PurchaseStatus = "Pending" | "Completed" | "Cancelled" | "Refunded";
type PlatformType = "instagram" | "facebook" | "twitter" | "whatsapp" | "telegram" | "other";

interface Purchase {
  id: string;
  platform: PlatformType;
  title: string;
  desc?: string;
  sellerEmail: string;
  price: number;
  date: string;
  rawDate: string;
  status: PurchaseStatus;
  purchaseNumber?: string;
  buyerEmail: string;
  accountUsername?: string;
  accountPassword?: string;
  recoveryEmail?: string;
  recoveryEmailPassword?: string;
  previewLink?: string;
  icon?: string;
  deliveryType?: string;
  deliveryTime?: string;
}

interface RawPurchaseItem {
  _id: string;
  productName: string;
  productId: string;
  sellerEmail: string;
  buyerEmail: string;
  price: number;
  purchaseDate: string;
  status: string;
  username?: string;
  accountPass?: string;
  email?: string;
  password?: string;
  previewLink?: string;
  additionalInfo?: string;
  categoryIcon?: string;
  deliveryType?: string;
  deliveryTime?: string;
}

interface ChatMessage {
  _id?: string;
  senderId: string;
  receiverId: string;
  message: string;
  imageUrl?: string;
  orderId?: string;
  createdAt: string;
}

interface PresenceResponse {
  userId: string;
  lastSeen?: string | null;
  online?: boolean;
}

const REPORT_REASONS = ["Scam or Fraud", "Item not received", "Wrong item delivered", "Abusive behavior", "Other"];

const inferPlatform = (name: string): PlatformType => {
  const n = name?.toLowerCase() || "";
  if (n.includes("instagram")) return "instagram";
  if (n.includes("facebook")) return "facebook";
  if (n.includes("twitter")) return "twitter";
  if (n.includes("whatsapp")) return "whatsapp";
  if (n.includes("telegram")) return "telegram";
  return "other";
};

const formatDate = (d: string) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
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

const maskEmail = (email: string) => {
  if (!email) return "User";
  return email.split('@')[0];
};

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

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

const STORAGE_KEY = 'lastReadIds';

const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [now, setNow] = useState(Date.now());
  const autoCompletedRef = useRef<Set<string>>(new Set());

  const loginUserData = useAuthHook();
  const buyerId = loginUserData.data?.email || localStorage.getItem("userEmail");

  // Login URL mapping - moved inside component for proper scope
  const getLoginUrl = (productName: string): string => {
    const name = productName?.toLowerCase().trim() || "";

    const loginMap: Record<string, string> = {
      "facebook": "https://www.facebook.com/login",
      "instagram": "https://www.instagram.com/accounts/login",
      "twitter": "https://twitter.com/i/flow/login",
      "twitter (x)": "https://twitter.com/i/flow/login",
      "x": "https://twitter.com/i/flow/login",
      "linkedin": "https://www.linkedin.com/login",
      "pinterest": "https://www.pinterest.com/login",
      "whatsapp": "https://www.whatsapp.com",
      "telegram": "https://web.telegram.org",
      "threads": "https://www.threads.net/login",
      "snapchat": "https://accounts.snapchat.com/accounts/login",
      "reddit": "https://www.reddit.com/login",
      "tiktok": "https://www.tiktok.com/login",
      "tinder": "https://www.tinder.com/",
      "bumble": "https://www.bumble.com/en/login",
      "pof": "https://www.pof.com/",
      "discord": "https://discord.com/login",
      "hinge": "https://hinge.co/",
      "grindr": "https://www.grindr.com/",
      "viber": "https://www.viber.com/",
      "gmx": "https://login.gmx.net/",
      "quora": "https://www.quora.com/login",
      "match": "https://www.match.com/",
      "ourtime": "https://www.ourtime.com/",
      "hellotalk": "https://m.hellotalk.com/",
      "zoosk": "https://www.zoosk.com/",
      "okcupid": "https://www.okcupid.com/",
      "smsmode": "https://smsmode.com/",
      "noplace": "https://www.noplace.tv/",
      "tenten": "https://tenten.com/",
      "bereal": "https://bere.al/",
      "airchat": "https://airchat.fm/",
      "yikyak": "https://www.yikyakapp.com/",
      "substacknotes": "https://notes.substack.com/",
      "coverstar": "https://www.coverstarapp.com/",
      "jagat": "https://jagat.co/",
      "fizz": "https://fizz.co/",
      "lemon8": "https://www.lemon8-app.com/",
      "lapse": "https://www.lapse.photos/",
      "gmail": "https://mail.google.com/",
      "ymail": "https://mail.yahoo.com/",
      "hotmail": "https://outlook.live.com/",
      "mailru": "https://mail.ru/",
      "outlook": "https://outlook.live.com/",
      "google voice": "https://voice.google.com/",
      "wechat": "https://web.wechat.com/",
      "textplus": "https://www.textplus.com/",
      "signal": "https://signal.org/",
      "amazon": "https://www.amazon.com/ap/signin",
      "amex": "https://www.americanexpress.com/login",
      "ebay": "https://www.ebay.com/signin",
      "google play": "https://play.google.com/store",
      "nike": "https://www.nike.com/login",
      "nordstrom": "https://www.nordstrom.com/account/signin",
      "playstation": "https://www.playstation.com/en-us/",
      "sephora": "https://www.sephora.com/login",
      "steam": "https://steamcommunity.com/login",
      "windscribe": "https://windscribe.com/login",
      "nord": "https://account.nordaccount.com/",
      "911 proxy": "https://911.re/",
      "pia": "https://www.privateinternetaccess.com/",
      "cyberghost": "https://www.cyberghostvpn.com/",
      "private": "https://www.privatevpn.com/",
      "total": "https://www.totalvpn.com/",
      "surfshark": "https://account.surfshark.com/",
      "onlyfans": "https://onlyfans.com/login",
      "aliexpress": "https://www.aliexpress.com/p/login",
      "alibaba": "https://www.alibaba.com/",
      "shopify": "https://accounts.shopify.com/",
      "shopee": "https://shopee.com/buyer/login",
      "ozon": "https://www.ozon.ru/login",
      "redbook": "https://www.xiaohongshu.com/",
      "olx": "https://www.olx.in/login",
      "vinted": "https://www.vinted.com/auth/login",
      "youla.ru": "https://youla.ru/",
      "jdcom": "https://www.jd.com/",
      "magicbricks": "https://www.magicbricks.com/",
      "wish": "https://www.wish.com/",
      "call of duty": "https://www.callofduty.com/",
      "pubg": "https://www.pubg.com/",
      "gta": "https://www.rockstargames.com/",
      "fortnite": "https://www.epicgames.com/fortnite/",
      "epic": "https://www.epicgames.com/",
      "netflix": "https://www.netflix.com/login",
      "apple": "https://appleid.apple.com/",
      "trustwallet": "https://trustwallet.com/",
      "prime videos": "https://www.primevideo.com/",
      "apple music": "https://music.apple.com/",
      "apple tv": "https://tv.apple.com/",
      "spotify": "https://www.spotify.com/login",
      "audiomack": "https://www.audiomack.com/login",
      "damus": "https://damusapp.com/",
      "rtro": "https://www.rtro.app/",
      "gowalla": "https://gowalla.com/",
      "yandex": "https://yandex.com/",
      "uber": "https://www.uber.com/",
      "grab": "https://www.grab.com/",
      "bolt": "https://bolt.eu/",
      "blablacar": "https://www.blablacar.com/",
      "indriver": "https://indriver.com/",
      "careem": "https://www.careem.com/",
      "ontaxi": "https://www.ontaxi.com/",
      "gett": "https://gett.com/",
      "youtube": "https://www.youtube.com/login",
      "github": "https://github.com/login",
      "canva": "https://www.canva.com/login",
      "chatgpt": "https://openai.com/auth/login",
      "office365": "https://www.office.com/",
      "paypal": "https://www.paypal.com/signin",
      "bluesky": "https://bsky.app/login",
      "qq": "https://z.qq.com/",
      "kick": "https://kick.com/",
      "other": "https://www.google.com/",
    };

    if (loginMap[name]) return loginMap[name];

    for (const [key, url] of Object.entries(loginMap)) {
      if (name.startsWith(key) || name.startsWith(key.split(' ')[0])) {
        return url;
      }
    }

    const firstWord = name.split(/[\s\-()]/)[0];
    if (firstWord && loginMap[firstWord]) {
      return loginMap[firstWord];
    }

    for (const [key, url] of Object.entries(loginMap)) {
      if (firstWord === key.split(' ')[0]) {
        return url;
      }
    }

    return "https://www.google.com/";
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [activeChatSellerEmail, setActiveChatSellerEmail] = useState<string | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetOrder, setReportTargetOrder] = useState<Purchase | null>(null);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportMessage, setReportMessage] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false); // Added back for socket deps

  // const [onlineSellersMap, setOnlineSellersMap] = useState<Record<string, boolean>>({});
  // const [lastSeenMap, setLastSeenMap] = useState<Record<string, string | null>>({});
  // const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [lastMessageTimes, setLastMessageTimes] = useState<Record<string, string | undefined>>({});

  const { socket, onlineUsers } = useSocket();

  const itemsPerPage = 40;
  const [currentPage, setCurrentPage] = useState(1);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  // Rating Modal States
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingTargetOrder, setRatingTargetOrder] = useState<Purchase | null>(null);

  const BASE_URL = "https://tasha-vps-backend-2.onrender.com";
  const PURCHASE_API = `${BASE_URL}/purchase`;
  const CHAT_API = `${BASE_URL}/chat`;

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

  const getStatusDisplay = (online: boolean, lastSeen?: string | null): string => {
    if (online) return "Online";
    if (!lastSeen) return "Offline";

    const date = new Date(lastSeen);
    if (isNaN(date.getTime())) return "Offline";

    const nowTime = new Date();
    const diffMs = nowTime.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const setPresence = async (status: 'online' | 'offline') => {
    if (!buyerId) return;
    try {
      await axios.post(`${CHAT_API}/status`, { userId: buyerId, status });
    } catch (err) { }
  };

  // Removed fetchSellerStatus as logic moved to ChatWindow

  // Removed checkNotifications

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-reload disabled per user request

  const getDeliveryTimeInMs = (p: Purchase) => {
    if (p.deliveryTime) {
      const match = p.deliveryTime.match(/(\d+)\s*(mins?|minutes?|h|hours?|d|days?)/i);
      if (match) {
        const num = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        if (unit.startsWith('min')) return num * 60000;
        if (unit.startsWith('h')) return num * 3600000;
        if (unit.startsWith('d')) return num * 86400000;
      }
    }
    return 14400000; // default 4h
  };

  const getRemainingTime = (p: Purchase) => {
    const addedMs = getDeliveryTimeInMs(p);
    const diff = (new Date(p.rawDate).getTime() + addedMs) - now;
    if (diff <= 0) return "Confirming...";
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    return `${h}h ${m}m ${s}s`;
  };

  const fetchPurchases = async () => {
    if (!buyerId) return;
    try {
      setIsLoading(true);
      const res = await axios.get<RawPurchaseItem[]>(`${PURCHASE_API}/getall?email=${buyerId}&role=buyer`);

      const enrichedData = await Promise.all(res.data.map(async (item) => {
        if (item.productId) {
          try {
            const productRes = await axios.get<any>(`${BASE_URL}/product/${item.productId}`);
            if (productRes?.data) {
              return {
                ...item,
                username: productRes.data.username,
                accountPass: productRes.data.accountPass,
                email: productRes.data.email,
                password: productRes.data.password,
                previewLink: productRes.data.previewLink,
                additionalInfo: productRes.data.additionalInfo,
                categoryIcon: productRes.data.categoryIcon,
                // Use purchase deliveryTime if exists (stored at purchase time), fallback to product
                deliveryType: item.deliveryType || productRes.data.deliveryType,
                deliveryTime: item.deliveryTime || productRes.data.deliveryTime,
              };
            }
          } catch (err) {
            console.error(`Failed to fetch product ${item.productId}:`, err);
          }
        }
        return item;
      }));

      const mapped: Purchase[] = enrichedData.map((item) => ({
        id: item._id,
        platform: inferPlatform(item.productName),
        title: item.productName || "Uncategorized Product",
        desc: item.additionalInfo || "No additional details provided.",
        sellerEmail: item.sellerEmail,
        buyerEmail: item.buyerEmail,
        price: item.price || 0,
        date: formatDate(item.purchaseDate),
        rawDate: item.purchaseDate,
        status: (item.status?.charAt(0).toUpperCase() + item.status?.slice(1)) as PurchaseStatus || "Pending",
        purchaseNumber: `ORD-${item._id.slice(-6).toUpperCase()}`,
        accountUsername: item.username,
        accountPassword: item.accountPass,
        recoveryEmail: item.email,
        recoveryEmailPassword: item.password,
        icon: item.categoryIcon,
        previewLink: item.previewLink,
        deliveryType: item.deliveryType,
        deliveryTime: item.deliveryTime,
      }));
      setPurchases(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [buyerId]);

  const handleUpdateStatus = async (status: string, sellerEmail: string, orderId?: string) => {
    const id = orderId || selected?.id;
    if (!id) return;

    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await axios.patch(`${PURCHASE_API}/update-status/${id}`, { status, email: buyerId, role: "buyer" });
      toast.success(`Order ${status} successfully!`);
      setSelected(null);
      fetchPurchases();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to update status";
      toast.error(errMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenRatingModal = (purchase: Purchase) => {
    setRatingTargetOrder(purchase);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmitted = () => {
    // Rating submitted, refresh the list to show updated rating
    fetchPurchases();
    setRatingTargetOrder(null);
  };

  // Removed fetchChat as logic moved to ChatWindow
  const handleOpenChat = (p: Purchase) => {
    setActiveChatSellerEmail(p.sellerEmail);
    setActiveChatOrderId(p.id);
    setIsChatOpen(true);
  };

  useEffect(() => {
    if (!socket) return () => { };

    const handleReceiveMessage = (newMsg: any) => {
      setLastMessageTimes(prev => ({
        ...prev,
        [newMsg.orderId]: newMsg.createdAt || new Date().toISOString(),
      }));

      if (newMsg.senderId !== buyerId && (newMsg.orderId !== activeChatOrderId || !isChatOpen)) {
        setUnreadCounts(prev => {
          const newMap = new Map(prev);
          const count = newMap.get(newMsg.orderId) || 0;
          newMap.set(newMsg.orderId, count + 1);
          return newMap;
        });
      } else if (newMsg.orderId === activeChatOrderId && isChatOpen && newMsg._id) {
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
  }, [socket, buyerId, activeChatOrderId, isChatOpen]);

  // Removed sendChat as logic moved to ChatWindow

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportMessage.trim() || !reportTargetOrder) return;
    setIsSubmittingReport(true);
    try {
      await axios.post(`${PURCHASE_API}/report/create`, {
        orderId: reportTargetOrder.id,
        productName: reportTargetOrder.title,
        reporterEmail: buyerId,
        sellerEmail: reportTargetOrder.sellerEmail,
        reason: reportReason,
        message: reportMessage,
        role: "buyer"
      });
      toast.success("Report submitted successfully.");
      setIsReportModalOpen(false);
      setReportMessage("");
    } catch (err) {
      toast.error("Error submitting report");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const filtered = useMemo(() => {
    if (activeTab === "All") return purchases;
    return purchases.filter((p) => p.status === activeTab);
  }, [activeTab, purchases]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (buyerId) {
        for (const p of paginated) {
          if (!fetchedOrders.has(p.id)) {
            try {
              const res = await axios.get<ChatMessage[]>(`${CHAT_API}/history/${buyerId}/${p.sellerEmail}`, {
                params: { orderId: p.id }
              });
              const messages = res.data;
              if (messages.length > 0) {
                const last = messages[messages.length - 1];
                setLastMessageTimes(prev => ({
                  ...prev,
                  [p.id]: last.createdAt,
                }));

                const lastReadId = lastReadIds[p.id];
                let unread = 0;
                if (lastReadId) {
                  const lastReadIndex = messages.findIndex(m => m._id === lastReadId);
                  if (lastReadIndex > -1) {
                    unread = messages.slice(lastReadIndex + 1).filter(m => m.senderId !== buyerId).length;
                  } else {
                    unread = messages.filter(m => m.senderId !== buyerId).length;
                  }
                } else {
                  unread = messages.filter(m => m.senderId !== buyerId).length;
                }
                setUnreadCounts(prev => {
                  const newMap = new Map(prev);
                  newMap.set(p.id, unread);
                  return newMap;
                });
              }
              setFetchedOrders(prev => {
                const newSet = new Set(prev);
                newSet.add(p.id);
                return newSet;
              });
            } catch (err) {
              console.error(`Failed to fetch chat for order ${p.id}`, err);
            }
          }
        }
      }
    };

    fetchInitialData();
  }, [paginated, buyerId, fetchedOrders, lastReadIds]);

  return (
    <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-24 px-3 sm:px-4 md:px-6 font-sans">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1A3A]">My Purchase</h1>
          <button
            onClick={fetchPurchases}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#33ac6f] hover:bg-[#28935a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-sm"
            title="Refresh purchases"
          >
            <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reload</span>
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="flex gap-6 p-4 border-b overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => { setActiveTab(t); setCurrentPage(1); }}
                className={`pb-2 text-sm whitespace-nowrap transition-all ${activeTab === t ? "text-[#d4a643] border-b-2 border-[#d4a643] font-bold" : "text-gray-500"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
            {isLoading ? (
              <p className="text-center py-10 text-gray-400">Loading...</p>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">No purchases found.</p>
                <Link to="/" className="bg-[#33ac6f] text-white px-6 py-2 rounded-full text-sm font-bold">
                  Browse Shop
                </Link>
              </div>
            ) : (
              paginated.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#F8FAFB] border rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 hover:shadow-md transition"
                >
                  <div className="flex gap-4 items-start">
                    <RenderIcon icon={p.icon} size={40} />
                    <div>
                      <h3 className="font-bold text-[#0A1A3A] text-sm sm:text-base leading-tight">{p.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 font-medium">Seller: {maskEmail(p.sellerEmail)}</span>
                        <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border shadow-sm">
                          <UserActivityStatus userId={p.sellerEmail} />
                        </div>
                      </div>
                      {lastMessageTimes[p.id] && (
                        <p className="text-[10px] text-gray-500 mt-0.5 ml-0.5 flex items-center gap-1">
                          <FaClockIcon size={8} />  Last msg {timeAgo(lastMessageTimes[p.id])}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${p.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' :
                          (p.status === 'Cancelled' || p.status === 'Refunded') ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                          {p.status}
                        </span>
                        {p.status === "Pending" && (
                          <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                            <FaClockIcon size={10} /> {getRemainingTime(p)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex flex-col sm:items-end gap-3 mt-2 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
                      <p className="text-lg font-bold text-[#0A1A3A]">${p.price.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{p.date}</p>
                    </div>

                    {p.status !== "Cancelled" && p.status !== "Refunded" && (
                      <div className="flex gap-2 w-full flex-wrap justify-end sm:justify-start">
                        {p.status === "Completed" && (
                          <button
                            onClick={() => handleOpenRatingModal(p)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 text-amber-600 border border-amber-100 rounded-lg bg-amber-50 hover:bg-amber-100 transition text-xs font-semibold"
                            title="Give rating"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784 .57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81 .588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="hidden sm:inline">Rate</span>
                          </button>
                        )}

                        <button
                          onClick={() => { setReportTargetOrder(p); setIsReportModalOpen(true); }}
                          className="flex-1 sm:flex-none flex justify-center p-2 text-red-500 border border-red-100 rounded-lg bg-white hover:bg-red-50 transition"
                        >
                          <FaFlagIcon size={14} />
                        </button>

                        <button
                          onClick={() => setSelected(p)}
                          className="flex-1 sm:flex-none flex justify-center p-2 text-gray-600 border rounded-lg bg-white hover:bg-gray-50 transition"
                        >
                          <FaEyeIcon size={14} />
                        </button>

                        <button
                          onClick={() => handleOpenChat(p)}
                          className="flex-1 sm:flex-none flex justify-center p-2 text-blue-600 border border-blue-100 rounded-lg bg-white hover:bg-blue-50 transition relative overflow-visible"
                        >
                          <FaCommentsIcon size={14} />
                          <NotificationBadge count={unreadCounts.get(p.id) || 0} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Pagination Controls */}
            {filtered.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                {Array.from({ length: Math.ceil(filtered.length / itemsPerPage) }).map((_, i) => {
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
      {
        selected && (
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
                  <span className="font-bold">{selected.purchaseNumber}</span>
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

              {(selected.accountUsername || selected.accountPassword || selected.recoveryEmail || selected.recoveryEmailPassword || selected.previewLink) && (
                <div className="bg-blue-50 rounded-2xl p-4 space-y-3 border border-blue-100 mb-6 text-sm">
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-blue-900 font-bold flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Account Access Details
                    </span>
                    <button
                      onClick={() => setShowAccountDetails(!showAccountDetails)}
                      className="p-1.5 hover:bg-blue-200 rounded-lg transition"
                    >
                      <FaEyeIcon size={16} className={showAccountDetails ? "text-blue-600" : "text-gray-400"} />
                    </button>
                  </div>

                  {showAccountDetails ? (
                    <div className="space-y-3 pt-2">
                      {selected.accountUsername && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Username</span>
                          <span className="font-mono bg-white p-2 rounded border text-xs break-all max-w-[150px]">{selected.accountUsername}</span>
                        </div>
                      )}
                      {selected.accountPassword && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Password</span>
                          <span className="font-mono bg-white p-2 rounded border text-xs break-all max-w-[150px]">{selected.accountPassword}</span>
                        </div>
                      )}
                      {selected.desc && (
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-gray-600">Additional Info</span>
                          <span className="font-mono bg-white p-2 rounded border text-xs break-all max-w-[150px]">{selected.desc}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-xs italic pt-2">
                      Click the eye icon to reveal account access details
                    </div>
                  )}
                </div>
              )}

              {/* Warning Notice and Login Button */}
              {selected.accountUsername && selected.accountPassword && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 mb-6">
                  <div className="flex gap-3">
                    <div className="text-xl flex-shrink-0">⚠️</div>
                    <div>
                      <p className="text-sm font-bold text-amber-900 mb-2">Important Notice</p>
                      <p className="text-xs text-amber-800 leading-relaxed mb-4">
                        "Login now before the time expires to avoid future complaints."
                      </p>
                      <button
                        onClick={() => window.open(getLoginUrl(selected.title), '_blank')}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg transition active:scale-95 text-sm"
                      >
                        🔓 Login Now to {selected.title.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Buyer Confirmation Button */}
              {selected.status === "Pending" && (
                <button
                  onClick={() => handleUpdateStatus("completed", selected.sellerEmail)}
                  disabled={isUpdating}
                  className={`w-full bg-[#33ac6f] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-lg ${isUpdating ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheckCircleIcon /> Confirm & Complete Order
                    </>
                  )}
                </button>
              )}

              {/* Cancel Order button - HIDDEN/COMMENTED OUT
              {selected.status !== "Cancelled" && selected.status !== "Refunded" && (
                <button
                  onClick={() => handleUpdateStatus("cancelled", selected.sellerEmail)}
                  className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-lg mt-3"
                >
                  <FaTimesIcon /> Cancel Order
                </button>
              )}
              */}
            </div>
          </div>
        )
      }

      {/* Report Modal */}
      {
        isReportModalOpen && reportTargetOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-red-600 p-4 text-white font-bold flex justify-between items-center">
                <span className="flex items-center gap-2"><FaFlagIcon /> Report Order</span>
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
                  {REPORT_REASONS.map(r => (
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
        )
      }

      {/* Chat Modal */}
      {activeChatSellerEmail && activeChatOrderId && isChatOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <ChatWindow
            orderId={activeChatOrderId}
            buyerEmail={buyerId || ""}
            sellerEmail={activeChatSellerEmail}
            currentUserEmail={buyerId || ""}
            onClose={() => {
              setActiveChatSellerEmail(null);
              setActiveChatOrderId(null);
              setIsChatOpen(false);
              // Mark as read in local state when closing
              setUnreadCounts(prev => {
                const newMap = new Map(prev);
                newMap.set(activeChatOrderId, 0);
                return newMap;
              });
            }}
          />
        </div>
      )}

      {/* Rating Modal */}
      {
        isRatingModalOpen && ratingTargetOrder && (
          <RatingModal
            isOpen={isRatingModalOpen}
            onClose={() => {
              setIsRatingModalOpen(false);
              setRatingTargetOrder(null);
            }}
            orderId={ratingTargetOrder!.id}
            productName={ratingTargetOrder!.title}
            sellerEmail={ratingTargetOrder!.sellerEmail}
            buyerEmail={ratingTargetOrder!.buyerEmail}
            onRatingSubmitted={handleRatingSubmitted}

          />
        )
      }
    </div>

  );
};

export default MyPurchase;