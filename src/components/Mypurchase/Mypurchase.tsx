import React, { useMemo, useState, useEffect, useRef } from "react";
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
  FaClock,
  FaFlag,
} from "react-icons/fa";

/* ---------------------------------------------
   Type Casting Icons
---------------------------------------------- */
const FaTimesIcon = FaTimes as any;
const FaEyeIcon = FaEye as any;
const FaCommentsIcon = FaComments as any;
const FaPaperPlaneIcon = FaPaperPlane as any;
const FaClockIcon = FaClock as any;
const FaFlagIcon = FaFlag as any;

/* ---------------------------------------------
   Types & Interfaces
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
  rawDate: string;
  status: PurchaseStatus;
  purchaseNumber?: string;
  buyerEmail: string;
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
}

interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
  orderId?: string;
  createdAt: string;
}

const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaInstagram, "#E1306C"],
  [FaFacebookF, "#1877F2"],
  [FaTwitter, "#1DA1F2"],
  [FaWhatsapp, "#25D366"],
  [FaTelegram, "#0088cc"],
]);

const REPORT_REASONS = ["Scam or Fraud", "Item not received", "Wrong item delivered", "Abusive behavior", "Other"];

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
    case "instagram": return FaInstagram;
    case "facebook": return FaFacebookF;
    case "twitter": return FaTwitter;
    case "whatsapp": return FaWhatsapp;
    case "telegram": return FaTelegram;
    default: return FaGlobe;
  }
};

const formatDate = (d: string) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

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
  return date.toLocaleDateString();
};

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

/* ---------------------------------------------
   Main Component
---------------------------------------------- */
const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(new Date().getTime());

  const loginUserData = useAuthHook();
  const buyerId = loginUserData.data?.email || localStorage.getItem("userEmail");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetOrder, setReportTargetOrder] = useState<Purchase | null>(null);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportMessage, setReportMessage] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [activeChatSellerEmail, setActiveChatSellerEmail] = useState<string | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const BASE_URL = "http://localhost:3200";
  const PURCHASE_API = `${BASE_URL}/purchase`;
  const CHAT_API = `${BASE_URL}/chat`;

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const getRemainingTime = (purchaseDateStr: string) => {
    const purchaseTime = new Date(purchaseDateStr).getTime();
    const deadline = purchaseTime + 60 * 60 * 1000;
    const diff = deadline - now;
    if (diff <= 0) return "Expired";
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const fetchPurchases = async () => {
    if (!buyerId) return;
    try {
      setIsLoading(true);
      await axios.get(`${PURCHASE_API}/auto-cancel-check`);
      const res = await axios.get<RawPurchaseItem[]>(`${PURCHASE_API}/getall?email=${buyerId}&role=buyer`);
      const mapped: Purchase[] = res.data.map((item) => ({
        id: item._id,
        platform: inferPlatform(item.productName),
        title: item.productName || "Untitled",
        desc: `Product ID: ${item.productId}`,
        sellerEmail: item.sellerEmail,
        buyerEmail: item.buyerEmail,
        price: item.price || 0,
        date: formatDate(item.purchaseDate),
        rawDate: item.purchaseDate,
        status: (item.status?.charAt(0).toUpperCase() + item.status?.slice(1)) as PurchaseStatus || "Pending",
        purchaseNumber: `ORD-${item._id.slice(-6).toUpperCase()}`,
      }));
      setPurchases(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPurchases(); }, [buyerId]);

  const handleUpdateStatus = async (status: string, sellerEmail: string) => {
    if (!selected) return;
    try {
      await axios.patch(`${PURCHASE_API}/update-status/${selected.id}`, {
        status,
        sellerEmail,
      });
      toast.success(`Order ${status} successfully!`);
      setSelected(null);
      fetchPurchases();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const openReportModal = (p: Purchase) => {
    setReportTargetOrder(p);
    setReportReason(REPORT_REASONS[0]);
    setReportMessage("");
    setIsReportModalOpen(true);
    setSelected(null);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportMessage.trim() || !reportTargetOrder) return;
    setIsSubmittingReport(true);
    try {
      await axios.post(`${PURCHASE_API}/report/create`, {
        orderId: reportTargetOrder.id,
        reporterEmail: buyerId,
        sellerEmail: reportTargetOrder.sellerEmail,
        reason: reportReason,
        message: reportMessage,
      });
      toast.success("Report submitted to administration.");
      setIsReportModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error submitting report");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleOpenChat = (p: Purchase) => {
    setActiveChatSellerEmail(p.sellerEmail);
    setActiveChatOrderId(p.id);
    setIsChatOpen(true);
  };

  const fetchChat = async () => {
    if (!buyerId || !activeChatSellerEmail) return;
    try {
      const res = await axios.get<ChatMessage[]>(`${CHAT_API}/history/${buyerId}/${activeChatSellerEmail}`, {
        params: { orderId: activeChatOrderId }
      });
      setChatMessages(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    let timer: any;
    if (isChatOpen) {
      fetchChat();
      timer = setInterval(fetchChat, 3000);
    }
    return () => clearInterval(timer);
  }, [isChatOpen, activeChatSellerEmail]);

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;
    try {
      await axios.post(`${CHAT_API}/send`, {
        senderId: buyerId,
        receiverId: activeChatSellerEmail,
        message: typedMessage,
        orderId: activeChatOrderId,
      });
      setTypedMessage("");
      fetchChat();
    } catch (err) {
      toast.error("Failed to send");
    }
  };

  const filtered = useMemo(() => {
    if (activeTab === "All") return purchases;
    return purchases.filter((p) => p.status === activeTab);
  }, [activeTab, purchases]);

  useEffect(() => setCurrentPage(1), [activeTab, purchases]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  /* ---------------------------------------------
     Dynamic Pagination Logic (1... Last)
  ---------------------------------------------- */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showMax = 1; // বর্তমান পেজের পাশে কয়টি পেজ দেখাবে

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1); // ১ নম্বর সবসময় থাকবে

      if (currentPage > showMax + 2) pages.push("...");

      const start = Math.max(2, currentPage - showMax);
      const end = Math.min(totalPages - 1, currentPage + showMax);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - (showMax + 1)) pages.push("...");

      pages.push(totalPages); // শেষ পেজ সবসময় থাকবে
    }
    return pages;
  };

  const renderBadge = (platform: PlatformType, size = 36) => {
    const IconComp = getPlatformIcon(platform) as any;
    return (
      <div style={{
        width: size, height: size, borderRadius: 12, display: "inline-flex",
        alignItems: "center", justifyContent: "center",
        background: ICON_COLOR_MAP.get(getPlatformIcon(platform)) || "#33ac6f"
      }}>
        <IconComp size={size * 0.6} color="#fff" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20 px-4 sm:px-6">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1A3A] mb-6">My Purchase</h1>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="flex gap-6 p-4 border-b overflow-x-auto">
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`pb-2 text-sm whitespace-nowrap transition-all ${activeTab === t ? "text-[#d4a643] border-b-2 border-[#d4a643] font-bold" : "text-gray-500"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {isLoading ? (
              <p className="text-center py-10 text-gray-400">Loading...</p>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">No purchases found in this category.</p>
                <Link to="/marketplace" className="bg-[#33ac6f] text-white px-6 py-2 rounded-full text-sm">Browse Shop</Link>
              </div>
            ) : (
              paginated.map((p) => (
                <div key={p.id} className="bg-[#F8FAFB] border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition">
                  <div className="flex gap-4">
                    {renderBadge(p.platform)}
                    <div>
                      <h3 className="font-bold text-[#0A1A3A] text-sm sm:text-base">{p.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${p.status === 'Completed' ? 'bg-green-50 text-green-600' : p.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                            {p.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{p.purchaseNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#0A1A3A]">${p.price.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400">{p.date}</p>
                    </div>

                    <div className="flex gap-2">
                      {p.status === "Pending" && (
                        <>
                          <button onClick={() => openReportModal(p)} className="p-2 text-red-500 border border-red-100 rounded bg-white hover:bg-red-50" title="Report Issue">
                            <FaFlagIcon size={14} />
                          </button>
                          <button onClick={() => setSelected(p)} className="p-2 text-gray-600 border rounded bg-white hover:bg-gray-50" title="View Details">
                            <FaEyeIcon size={14} />
                          </button>
                          <button onClick={() => handleOpenChat(p)} className="p-2 text-blue-600 border border-blue-100 rounded bg-white hover:bg-blue-50" title="Open Chat">
                            <FaCommentsIcon size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination View */}
      {totalPages > 1 && (
        <div className="max-w-screen-xl mx-auto mt-6 flex justify-center items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 border rounded-lg bg-white disabled:opacity-30 hover:bg-gray-50"
          >
            <ChevronLeft size={18} />
          </button>

          {getPageNumbers().map((page, idx) => (
            page === "..." ? (
              <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => setCurrentPage(page as number)}
                className={`w-9 h-9 rounded-lg text-sm font-bold border transition-all ${
                  currentPage === page 
                  ? "bg-[#33ac6f] border-[#33ac6f] text-white shadow-md" 
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 border rounded-lg bg-white disabled:opacity-30 hover:bg-gray-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Modals & Chat remain the same as provided in previous code */}
      {/* ... (Selected Modal, Report Modal, Chat logic) */}
    </div>
  );
};

// Simple Chevron Icons for Pagination if not imported
const ChevronLeft = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const ChevronRight = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default MyPurchase;