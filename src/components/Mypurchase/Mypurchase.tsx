import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthHook } from "../../hook/useAuthHook";
import { toast } from "sonner";

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
}

interface ChatMessage {
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

const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const autoCompletedRef = useRef<Set<string>>(new Set());

  const loginUserData = useAuthHook();
  const buyerId = loginUserData.data?.email || localStorage.getItem("userEmail");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sellerOnline, setSellerOnline] = useState<boolean>(false);
  const [sellerLastSeen, setSellerLastSeen] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetOrder, setReportTargetOrder] = useState<Purchase | null>(null);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportMessage, setReportMessage] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const [activeChatSellerEmail, setActiveChatSellerEmail] = useState<string | null>(null);
  const [activeChatOrderId, setActiveChatOrderId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const [onlineSellersMap, setOnlineSellersMap] = useState<Record<string, boolean>>({});

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const BASE_URL = "http://localhost:3200";
  const PURCHASE_API = `${BASE_URL}/purchase`;
  const CHAT_API = `${BASE_URL}/chat`;

  const setPresence = async (status: 'online' | 'offline') => {
    if (!buyerId) return;
    try {
      await axios.post(`${CHAT_API}/status`, { userId: buyerId, status });
    } catch (err) {}
  };

  const fetchSellerStatus = async () => {
    if (!activeChatSellerEmail) return;
    try {
      const res = await axios.get<PresenceResponse>(`${CHAT_API}/status/${activeChatSellerEmail}`);
      setSellerOnline(Boolean(res.data?.online));
      setSellerLastSeen(res.data.lastSeen || null);
    } catch (err) {
      setSellerOnline(false);
      setSellerLastSeen(null);
    }
  };

  const fetchAllSellersStatus = async () => {
    const sellers = Array.from(new Set(purchases.map(p => p.sellerEmail)));
    const statusMap: Record<string, boolean> = {};
    for (const email of sellers) {
      try {
        const res = await axios.get<PresenceResponse>(`${CHAT_API}/status/${email}`);
        statusMap[email] = Boolean(res.data?.online);
      } catch (err) {
        statusMap[email] = false;
      }
    }
    setOnlineSellersMap(statusMap);
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (purchases.length === 0) return;
    fetchAllSellersStatus();
    const interval = setInterval(fetchAllSellersStatus, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchases]);

  useEffect(() => {
    if (purchases.length === 0) return;
    purchases.forEach((p) => {
      if (p.status !== 'Pending') return;
      const expiresAt = new Date(p.rawDate).getTime() + 14400000;
      if (Date.now() >= expiresAt && !autoCompletedRef.current.has(p.id)) {
        autoCompletedRef.current.add(p.id);
        handleUpdateStatus('completed', p.sellerEmail, p.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchases, now]);

  const getRemainingTime = (rawDate: string) => {
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
                categoryIcon: productRes.data.categoryIcon,
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
        title: item.productName || "Untitled",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyerId]);

  const handleUpdateStatus = async (status: string, sellerEmail: string, orderId?: string) => {
    const id = orderId || selected?.id;
    if (!id) return;
    try {
      await axios.patch(`${PURCHASE_API}/update-status/${id}`, { status, sellerEmail });
      toast.success(`Order ${status} successfully!`);
      setSelected(null);
      fetchPurchases();
    } catch (err) {
      toast.error("Failed to update status");
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
    } catch (err) {
      console.error("Fetch chat error:", err);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isChatOpen) {
      setPresence('online');
      fetchChat();
      fetchSellerStatus();
      timer = setInterval(() => {
        fetchChat();
        fetchSellerStatus();
      }, 4000);
    } else {
      setPresence('offline');
      setSellerOnline(false);
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatOpen, activeChatSellerEmail]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    // Only auto-scroll if user hasn't scrolled up
    if (shouldAutoScrollRef.current) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [chatMessages, imagePreview]);

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() && !selectedImage) return;
    try {
      const formData = new FormData();
      formData.append("senderId", buyerId!);
      formData.append("receiverId", activeChatSellerEmail!);
      formData.append("message", typedMessage.trim());
      if (activeChatOrderId) formData.append("orderId", activeChatOrderId);
      if (selectedImage) formData.append("image", selectedImage);

      await axios.post(`${CHAT_API}/send`, formData);
      setTypedMessage("");
      setSelectedImage(null);
      setImagePreview(null);
      fetchChat();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to send message");
    }
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

  return (
    <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1A3A] mb-6">My Purchase</h1>
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="flex gap-6 p-4 border-b overflow-x-auto">
            {TABS.map((t) => (
              <button 
                key={t} 
                onClick={() => {setActiveTab(t); setCurrentPage(1);}}
                className={`pb-2 text-sm whitespace-nowrap transition-all ${activeTab === t ? "text-[#d4a643] border-b-2 border-[#d4a643] font-bold" : "text-gray-500"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6 space-y-4">
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
                  className="bg-[#F8FAFB] border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition"
                >
                  {/* Left Side: Icon & Product Info */}
                  <div className="flex gap-4 items-start">
                    <RenderIcon icon={p.icon} size={40} />
                    <div>
                      <h3 className="font-bold text-[#0A1A3A] text-sm sm:text-base leading-tight">{p.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 font-medium">Seller: {maskEmail(p.sellerEmail)}</span>
                        <span className={`w-2 h-2 rounded-full ${onlineSellersMap[p.sellerEmail] ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-[10px] text-gray-500 font-medium">
                          {onlineSellersMap[p.sellerEmail] ? "Online" : "Offline"}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                          p.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                          (p.status === 'Cancelled' || p.status === 'Refunded') ? 'bg-red-50 text-red-600 border-red-100' : 
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
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

                  {/* Right Side: Price, Date & Actions - FIXED ALIGNMENT */}
                  <div className="w-full sm:w-auto flex flex-col sm:items-end gap-3 mt-2 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
                      <p className="text-lg font-bold text-[#0A1A3A]">${p.price.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{p.date}</p>
                    </div>
                    
                    {p.status !== "Cancelled" && p.status !== "Refunded" && (
                      <div className="flex gap-2 w-full justify-end sm:justify-start">
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

            {selected.status === "Pending" && (
              <button 
                onClick={() => handleUpdateStatus("completed", selected.sellerEmail)} 
                className="w-full bg-[#33ac6f] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-lg"
              >
                <FaCheckCircleIcon /> Confirm & Complete Order
              </button>
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
      )}

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-[#F8FAFB] w-full max-w-md h-full sm:h-[620px] sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl border">
            <div className="bg-white p-4 flex justify-between items-center border-b shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border text-[#0A1A3A] font-bold text-sm">
                  {maskEmail(activeChatSellerEmail || "").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0A1A3A]">{maskEmail(activeChatSellerEmail || "")}</h4>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className={`w-2 h-2 rounded-full ${sellerOnline ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className="text-gray-500 font-medium">
                      {sellerOnline ? "Online" : (sellerLastSeen ? `Last seen ${timeAgo(sellerLastSeen)}` : "Offline")}
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
              {chatMessages.map((m, index) => (
                <div
                  key={`${m.createdAt}-${index}`}
                  className={`flex ${m.senderId === buyerId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${m.senderId === buyerId ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div 
                      className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                        m.senderId === buyerId 
                          ? 'bg-[#33ac6f] text-white rounded-tr-none' 
                          : 'bg-white text-[#0A1A3A] border rounded-tl-none font-medium'
                      }`}
                    >
                      {m.imageUrl && (
                        <div className="mb-2 -mx-1 -mt-1">
                          <img
                            src={m.imageUrl.startsWith('http') ? m.imageUrl : `${BASE_URL}${m.imageUrl}`}
                            alt="attachment"
                            className="rounded-xl max-w-xs h-auto max-h-64 object-cover border border-black/5"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                          />
                        </div>
                      )}
                      <p className="leading-relaxed break-words">{m.message}</p>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 px-1 font-bold">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {imagePreview && (
                <div className="flex justify-end">
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
            </div>

            <div className="p-4 bg-white border-t">
              <form 
                onSubmit={sendChat} 
                className="flex items-center gap-2 bg-[#F8FAFB] border rounded-2xl p-1.5 focus-within:border-[#33ac6f] transition-all"
              >
                <input
                  type="file"
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
    </div>
  );
};

export default MyPurchase;