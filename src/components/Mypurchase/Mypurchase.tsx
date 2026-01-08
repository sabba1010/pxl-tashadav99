import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthHook } from "../../hook/useAuthHook";
import { toast } from "sonner";

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
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

/* ---------------------------------------------
   Type Casting Icons to fix TS2786 Error
---------------------------------------------- */
const FaTimesIcon = FaTimes as any;
const FaEyeIcon = FaEye as any;
const FaCommentsIcon = FaComments as any;
const FaPaperPlaneIcon = FaPaperPlane as any;
const FaClockIcon = FaClock as any;
const FaFlagIcon = FaFlag as any;
const FaCheckCircleIcon = FaCheckCircle as any;
const FaTimesCircleIcon = FaTimesCircle as any;

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

const ICON_COLOR_MAP = new Map<any, string>([
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

const getPlatformIcon = (platform: PlatformType): any => {
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

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const BASE_URL = "http://localhost:3200";
  const PURCHASE_API = `${BASE_URL}/purchase`;
  const CHAT_API = `${BASE_URL}/chat`;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

 const getRemainingTime = (rawDate: string) => {
    // ৪ ঘণ্টা = ৪ * ৬০ * ৬০ * ১০০০ = ১৪৪০০০০০ মিলিসেকেন্ড
    const diff = (new Date(rawDate).getTime() + 14400000) - now;
    
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
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchPurchases(); }, [buyerId]);

  const handleUpdateStatus = async (status: string, sellerEmail: string, orderId?: string) => {
    const id = orderId || selected?.id;
    if (!id) return;
    try {
      await axios.patch(`${PURCHASE_API}/update-status/${id}`, { status, sellerEmail });
      toast.success(`Order ${status} successfully!`);
      setSelected(null);
      fetchPurchases();
    } catch (err) { toast.error("Failed to update status"); }
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

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

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
    } catch (err) { toast.error("Failed to send"); }
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
        role: "buyer"
      });
      toast.success("Report submitted successfully.");
      setIsReportModalOpen(false);
      setReportMessage("");
    } catch (err) { toast.error("Error submitting report"); } finally { setIsSubmittingReport(false); }
  };

  const filtered = useMemo(() => {
    if (activeTab === "All") return purchases;
    return purchases.filter((p) => p.status === activeTab);
  }, [activeTab, purchases]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const renderBadge = (platform: PlatformType, size = 36) => {
    const IconComponent = getPlatformIcon(platform) as any;
    return (
      <div style={{
        width: size, height: size, borderRadius: 12, display: "inline-flex",
        alignItems: "center", justifyContent: "center",
        background: ICON_COLOR_MAP.get(getPlatformIcon(platform)) || "#33ac6f"
      }}>
        <IconComponent size={size * 0.6} color="#fff" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1A3A] mb-6">My Purchase</h1>
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="flex gap-6 p-4 border-b overflow-x-auto">
            {TABS.map((t) => (
              <button key={t} onClick={() => {setActiveTab(t); setCurrentPage(1);}}
                className={`pb-2 text-sm whitespace-nowrap transition-all ${activeTab === t ? "text-[#d4a643] border-b-2 border-[#d4a643] font-bold" : "text-gray-500"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {isLoading ? <p className="text-center py-10 text-gray-400">Loading...</p> : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">No purchases found.</p>
                <Link to="/" className="bg-[#33ac6f] text-white px-6 py-2 rounded-full text-sm font-bold">Browse Shop</Link>
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
                        {p.status === "Pending" && (
                          <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                            <FaClockIcon size={10} /> {getRemainingTime(p.rawDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#0A1A3A]">${p.price.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400">{p.date}</p>
                    </div>
                    
                    {/* BUTTONS LOGIC: Hide View/Chat if Completed or Cancelled */}
                    <div className="flex gap-2">
                      <button onClick={() => { setReportTargetOrder(p); setIsReportModalOpen(true); }} className="p-2 text-red-500 border border-red-100 rounded bg-white hover:bg-red-50" title="Report Issue">
                        <FaFlagIcon size={14} />
                      </button>
                      
                      {p.status === "Pending" && (
                        <>
                          <button onClick={() => setSelected(p)} className="p-2 text-gray-600 border rounded bg-white hover:bg-gray-50" title="View Details">
                            <FaEyeIcon size={14} />
                          </button>
                          <button onClick={() => handleOpenChat(p)} className="p-2 text-blue-600 border border-blue-100 rounded bg-white hover:bg-blue-50" title="Chat with Seller">
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

      {/* Details Modal (Only for Pending) */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 relative overflow-hidden">
            <button onClick={() => setSelected(null)} className="absolute right-6 top-6 text-gray-400 z-10 hover:text-red-500 transition"><FaTimesIcon size={20} /></button>
            <div className="text-center mb-6 pt-4">
              {renderBadge(selected.platform, 70)}
              <h2 className="text-xl font-bold mt-4 text-[#0A1A3A]">{selected.title}</h2>
              <p className="text-3xl font-black text-[#33ac6f] mt-2">${selected.price.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100 mb-6 text-sm">
               <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Order Number</span><span className="font-bold">{selected.purchaseNumber}</span></div>
               <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Purchase Date</span><span className="font-bold">{selected.date}</span></div>
               <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Order ID</span><span className="font-bold font-mono text-[11px]">{selected.id}</span></div>
               <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-bold">{selected.status}</span></div>
            </div>
            {selected.status === "Pending" && (
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col items-center gap-1">
                   <p className="text-[10px] text-blue-500 font-bold uppercase">Auto-Confirm Timer</p>
                   <p className="text-2xl font-mono font-black text-blue-900">{getRemainingTime(selected.rawDate)}</p>
                </div>
                <button onClick={() => handleUpdateStatus("completed", selected.sellerEmail)} className="w-full bg-[#33ac6f] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-lg">
                  <FaCheckCircleIcon /> Confirm & Complete Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && reportTargetOrder && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
               <div className="bg-red-600 p-4 text-white font-bold flex justify-between items-center">
                  <span className="flex items-center gap-2"><FaFlagIcon /> Report Order</span>
                  <button onClick={() => setIsReportModalOpen(false)}><FaTimesIcon /></button>
               </div>
               <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
                  <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full border p-2.5 rounded-xl text-sm outline-none">
                     {REPORT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <textarea value={reportMessage} onChange={(e) => setReportMessage(e.target.value)} placeholder="Describe the issue..." className="w-full border p-3 rounded-xl text-sm h-32 outline-none" required />
                  <button type="submit" disabled={isSubmittingReport} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">{isSubmittingReport ? "Sending..." : "Submit Report"}</button>
               </form>
            </div>
         </div>
      )}

      {/* Chat UI */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#ECE5DD] w-full max-w-md h-[90vh] sm:h-[600px] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-white p-4 flex justify-between items-center border-b">
               <span className="font-bold text-sm">{activeChatSellerEmail}</span>
               <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-red-500"><FaTimesIcon size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {chatMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.senderId === buyerId ? 'justify-end' : 'justify-start'}`}>
                     <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${m.senderId === buyerId ? 'bg-[#D9FDD3] rounded-tr-none' : 'bg-white rounded-tl-none shadow-sm'}`}>{m.message}</div>
                  </div>
               ))}
               <div ref={scrollRef} />
            </div>
            <form onSubmit={sendChat} className="p-3 bg-white flex gap-2 border-t">
               <input value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} className="flex-1 bg-gray-100 p-2.5 rounded-full px-5 outline-none text-sm" placeholder="Type a message..." />
               <button type="submit" className="bg-[#33ac6f] text-white p-3.5 rounded-full hover:bg-[#2aa46a] transition shadow-md"><FaPaperPlaneIcon size={16} /></button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPurchase;