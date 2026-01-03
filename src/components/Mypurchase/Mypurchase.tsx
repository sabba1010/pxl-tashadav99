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

  // Pagination State
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
      await axios.patch(`${PURCHASE_API}/update-status/${selected.id}`, { status, sellerEmail });
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

  useEffect(() => setCurrentPage(1), [activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Improved Pagination Logic for Dots (...)
const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisibleBeforeDots = 4; // ৪ নম্বর পর্যন্ত সরাসরি দেখাবে

    if (totalPages <= 5) {
      // ৫ বা তার কম পেজ হলে সব দেখাবে
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // যদি পেজ সংখ্যা ৫ এর বেশি হয়
      if (currentPage <= maxVisibleBeforeDots - 1) {
        // ইউজার শুরুতে থাকলে: ১ ২ ৩ ৪ ... ২০
        for (let i = 1; i <= maxVisibleBeforeDots; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // ইউজার শেষে থাকলে: ১ ... ১৭ ১৮ ১৯ ২০
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // ইউজার মাঝখানে থাকলে: ১ ... ৫ ৬ ৭ ... ২০
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

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

        {/* Pagination Section - Fixed Design & Logic */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 mb-10 select-none">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5">
              {pageNumbers.map((page, i) =>
                page === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-400 font-bold">...</span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(page as number)}
                    className={`min-w-[38px] h-[38px] px-3 rounded-lg text-sm font-bold border transition-all duration-200
                      ${currentPage === page
                        ? "bg-[#33ac6f] border-[#33ac6f] text-white shadow-md transform scale-105"
                        : "bg-white border-gray-300 text-gray-700 hover:border-[#33ac6f] hover:text-[#33ac6f]"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Modals & Chat remain unchanged as per request */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 relative animate-in slide-in-from-bottom-5">
            <button onClick={() => setSelected(null)} className="absolute right-6 top-6 text-gray-400"><FaTimesIcon size={20} /></button>
            <div className="text-center mb-6">
              {renderBadge(selected.platform, 60)}
              <h2 className="text-xl font-bold mt-4">{selected.title}</h2>
              <p className="text-3xl font-black text-[#33ac6f] mt-2">${selected.price.toFixed(2)}</p>
            </div>
            
            <div className="space-y-3 border-t pt-4 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Seller</span><span className="font-medium">{selected.sellerEmail}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-mono font-bold">{selected.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{selected.date}</span></div>
            </div>

            {selected.status === "Pending" && (
              <div className="mt-8 space-y-3">
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-center gap-3">
                   <FaClockIcon className="text-amber-600 animate-pulse" />
                   <p className="text-xs text-amber-800">
                     Auto-cancels in: <strong>{getRemainingTime(selected.rawDate)}</strong>
                   </p>
                </div>
                <button onClick={() => handleUpdateStatus("completed", selected.sellerEmail)} className="w-full bg-[#33ac6f] text-white py-3 rounded-xl font-bold hover:bg-[#2aa46a]">Confirm & Complete Order</button>
              </div>
            )}
          </div>
        </div>
      )}

      {isReportModalOpen && reportTargetOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-red-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><FaFlagIcon /> Report Order</h3>
              <button onClick={() => setIsReportModalOpen(false)}><FaTimesIcon /></button>
            </div>
            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              <div className="bg-gray-50 p-3 rounded text-center border">
                <p className="text-[10px] text-gray-400 uppercase">Order Ref</p>
                <p className="font-mono text-sm font-bold">{reportTargetOrder.purchaseNumber}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reason</label>
                <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-200">
                  {REPORT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Details</label>
                <textarea value={reportMessage} onChange={(e) => setReportMessage(e.target.value)} placeholder="Describe the issue..." className="w-full border p-3 rounded-lg text-sm h-32 focus:ring-2 focus:ring-red-200" required />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsReportModalOpen(false)} className="flex-1 py-2.5 text-gray-500 font-medium">Cancel</button>
                <button type="submit" disabled={isSubmittingReport} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50">
                  {isSubmittingReport ? "Sending..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isChatOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
          <div className="bg-[#ECE5DD] w-full max-w-md h-[90vh] sm:h-[600px] sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-white p-4 border-b flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-[#33ac6f] rounded-full flex items-center justify-center text-white font-bold uppercase">{activeChatSellerEmail?.[0]}</div>
                 <span className="font-bold text-sm truncate max-w-[150px]">{activeChatSellerEmail}</span>
               </div>
               <button onClick={() => setIsChatOpen(false)} className="p-2 text-gray-400 hover:text-red-500"><FaTimesIcon size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {chatMessages.map((m, i) => {
                 const isMe = m.senderId === buyerId;
                 return (
                   <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-[#D9FDD3] text-gray-800 rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}`}>
                        {m.message}
                        <p className="text-[9px] text-gray-400 text-right mt-1">{timeAgo(m.createdAt)}</p>
                     </div>
                   </div>
                 );
               })}
               <div ref={scrollRef} />
            </div>

            <form onSubmit={sendChat} className="p-3 bg-white border-t flex gap-2">
               <input value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} className="flex-1 bg-gray-100 p-3 rounded-full text-sm outline-none" placeholder="Type a message..." />
               <button type="submit" className="bg-[#33ac6f] text-white p-3 rounded-full"><FaPaperPlaneIcon size={16} /></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPurchase;