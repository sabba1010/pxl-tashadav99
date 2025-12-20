// src/MyOrder/MyOrder.tsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { IconType } from "react-icons";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPlus,
  FaTimes,
  FaStar,
  FaEnvelope,
  FaDownload,
  FaComments,
} from "react-icons/fa";

/* ---------------------------------------------
    Types & Interfaces
---------------------------------------------- */
interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp?: string;
}

type OrderStatus = "Pending" | "Completed" | "Cancelled";

interface Order {
  id: string;
  platform: "Instagram" | "Facebook" | "Twitter";
  title: string;
  desc?: string;
  orderNumber: string;
  seller: string;
  price: number;
  date: string;
  status: OrderStatus;
  icon: IconType;
  trackingId?: string | null;
  supportEmail?: string | null;
}

/* ---------------------------------------------
   Brand color map & gradients
---------------------------------------------- */
const FaCommentsIcon = FaComments as unknown as React.ComponentType<any>;
const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaInstagram, "#E1306C"],
  [FaFacebookF, "#1877F2"],
  [FaTwitter, "#1DA1F2"],
  [FaPlus, "#111827"],
]);

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
  "linear-gradient(135deg,#FCCF31 0%,#F55555 100%)",
  "linear-gradient(135deg,#9BE15D 0%,#00E3AE 100%)",
];

const gradientFromHex = (hex?: string) => {
  if (!hex) return vibrantGradients[0];
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.28);
  const r2 = mix(r);
  const g2 = mix(g);
  const b2 = mix(b);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `linear-gradient(135deg, ${hex} 0%, #${toHex(r2)}${toHex(g2)}${toHex(
    b2
  )} 100%)`;
};

const renderBadge = (IconComponent: IconType, size = 40) => {
  const badgeSize = Math.max(36, size);
  const brandHex = ICON_COLOR_MAP.get(IconComponent);
  const bg = brandHex
    ? gradientFromHex(brandHex)
    : vibrantGradients[String(IconComponent).length % vibrantGradients.length];
  const C = IconComponent as unknown as React.ComponentType<any>;
  return (
    <div
      aria-hidden
      style={{
        width: badgeSize,
        height: badgeSize,
        minWidth: badgeSize,
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 10px 20px rgba(16,24,40,0.08)",
      }}
      className="shrink-0"
    >
      {React.createElement(C, {
        size: Math.round(size * 0.66),
        style: { color: "#fff", fill: "#fff" },
      })}
    </div>
  );
};

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    platform: "Instagram",
    title: "Aged Instagram Account 7 years",
    desc: "Strong account with real followers and organic growth. Login provided with email recovery.",
    orderNumber: "e4a70600-58e5-4878-9a81",
    seller: "Ibrahim",
    price: 7,
    date: "Dec 5, 2025 01:50",
    status: "Completed",
    icon: FaInstagram,
    trackingId: "TRACK-IG-001",
    supportEmail: "ibrahim@example.com",
  },
  {
    id: "2",
    platform: "Facebook",
    title: "Old Facebook Account (7 years)",
    desc: "Marketplace enabled account, verified email, low risk.",
    orderNumber: "12d983b1-aa18-4585",
    seller: "Rahman",
    price: 15,
    date: "Dec 4, 2025 19:53",
    status: "Completed",
    icon: FaFacebookF,
    trackingId: "TRACK-FB-002",
    supportEmail: "rahman@example.com",
  },
  {
    id: "3",
    platform: "Twitter",
    title: "Aged Twitter account 3 years",
    desc: "Good standing account with authentic followers.",
    orderNumber: "174029fc-8237-44ca",
    seller: "Alban",
    price: 7,
    date: "Dec 4, 2025 19:21",
    status: "Completed",
    icon: FaTwitter,
    trackingId: null,
    supportEmail: "alban@example.com",
  },
  {
    id: "4",
    platform: "Instagram",
    title: "Fresh Instagram PVA",
    desc: "Phone verified & secure. Includes recovery email.",
    orderNumber: "bb92a-aff3-55f1",
    seller: "Afsar",
    price: 5,
    date: "Dec 9, 2025 14:10",
    status: "Pending",
    icon: FaInstagram,
    trackingId: null,
    supportEmail: "afsar@example.com",
  },
  {
    id: "5",
    platform: "Facebook",
    title: "Facebook Marketplace Enabled",
    desc: "Real friends + Marketplace ready.",
    orderNumber: "a1021f-8892-aa99",
    seller: "Rahim",
    price: 10,
    date: "Dec 9, 2025 10:30",
    status: "Pending",
    icon: FaFacebookF,
    trackingId: null,
    supportEmail: "rahim@example.com",
  },
];

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
const FaStarIcon = FaStar as unknown as React.ComponentType<any>;

const Stars: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStarIcon
        key={i}
        className={`w-3 h-3 ${i < value ? "text-yellow-400" : "text-gray-300"}`}
      />
    ))}
  </div>
);

const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [cartCount, setCartCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- Chat State & Logic ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeSellerId, setActiveSellerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typedMsg, setTypedMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const buyerId = "current_user_123";

const fetchMessages = async () => {
  if (!activeSellerId || !buyerId) return;

  try {
    const res = await axios.get(
      `http://localhost:3200/chat/history/${buyerId}/${activeSellerId}`
    );

    setMessages(res.data as ChatMessage[]);
  } catch (err) {
    console.error("Chat Error:", err);
  }
};


  useEffect(() => {
    let interval: any;
    if (isChatOpen && activeSellerId) {
      fetchMessages();
      interval = setInterval(fetchMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [isChatOpen, activeSellerId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMsg.trim() || !activeSellerId) return;
    try {
      await axios.post("http://localhost:3200/chat/send", {
        senderId: buyerId,
        receiverId: activeSellerId,
        message: typedMsg,
      });
      await axios.post("http://localhost:3200/chat/send", { senderId: buyerId, receiverId: activeSellerId, message: typedMsg });
      setTypedMsg("");
      fetchMessages();
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  const orders = MOCK_ORDERS;
  const filtered = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [activeTab, orders]);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 sm:pt-20 pb-20 sm:pb-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A1A3A]">
                Orders
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                All orders placed on your platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/report"
                className="mt-2 sm:mt-0 bg-[#d4a643] text-white px-4 sm:px-6 py-2 rounded-full font-medium shadow hover:opacity-95 transition"
              >
                Report Order
              </Link>
              <Link to="/cart" className="relative">
                <div className="p-2 bg-white border rounded-md shadow-sm">
                  🛒
                </div>
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </div>
                )}
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6">
              <nav className="flex gap-4 sm:gap-6 border-b border-gray-100 pb-3 sm:pb-4 overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`pb-2 text-xs sm:text-sm ${
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
                {filtered.map((o) => (
                  <article
                    key={o.id}
                    className="bg-[#F8FAFB] rounded-xl p-3 sm:p-4 flex items-start gap-3 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {renderBadge(o.icon, 36)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-[#0A1A3A] truncate">
                        {o.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1 sm:line-clamp-2">
                        {o.desc}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          {o.platform}
                        </span>
                        <span className="text-base font-bold text-[#0A1A3A]">
                          ${o.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                            o.status === "Completed"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : o.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {o.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActiveSellerId(o.seller);
                              setIsChatOpen(true);
                            }}
                            className="px-2 py-1 border rounded text-md bg-white hover:bg-blue-50"
                          >
                            <FaCommentsIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs shadow-sm"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/add-product"
        className="hidden sm:flex sm:fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] hover:bg-[#c4963a] text-white rounded-full shadow-2xl items-center justify-center z-50 transition-all"
      >
        {/* Fixed Line 217 below */}
        {React.createElement(FaPlus as any, { size: 18 })}
      </Link>

      {/* --- Real Chat Modal --- */}
      {isChatOpen && activeSellerId && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsChatOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md h-[80vh] sm:h-[600px] flex flex-col rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#0A1A3A] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                  {activeSellerId[0]}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{activeSellerId}</h3>
                  <p className="text-[10px] text-green-400">
                    Online | Order Support
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <FaTimesIcon size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.senderId === buyerId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                      m.senderId === buyerId
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white border text-gray-800 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t flex gap-2"
            >
              <input
                value={typedMsg}
                onChange={(e) => setTypedMsg(e.target.value)}
                placeholder="Type message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="bg-[#0A1A3A] text-white px-5 py-2 rounded-full font-bold text-sm"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- View Modal --- */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl z-50 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full" />
            <div className="sticky top-0 bg-white border-b sm:border-b-0 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-[#0A1A3A]">
                  {selectedOrder.title}
                </h2>
                <div className="text-xs text-gray-500 mt-0.5">
                  {selectedOrder.platform} • Ordered on {selectedOrder.date}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    selectedOrder.status === "Completed"
                      ? "bg-green-50 text-green-700"
                      : selectedOrder.status === "Pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {selectedOrder.status}
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <FaTimesIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-center">
                {renderBadge(selectedOrder.icon, 72)}
              </div>
              <div className="mt-4 text-3xl font-bold text-[#0A1A3A]">
                ${selectedOrder.price.toFixed(2)}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Order Number</p>
                  <p className="font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Seller</p>
                  <p className="font-medium">{selectedOrder.seller}</p>
                </div>
                <div>
                  <p className="text-gray-500">Description</p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.desc ?? "No additional details."}
                  </p>
                </div>
              </div>
              <div className="mt-4 border p-3 rounded-md bg-[#FBFFFB]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Buyer Protection</div>
                    <div className="text-xs text-gray-600">
                      Protected purchase — secure transaction & refund policy
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-green-600">
                    Verified
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Stars value={4} />
                    <div className="text-xs text-gray-600">
                      4.0 (120 reviews)
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Warranty: 7 days</div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-600">
                    Note: Check the buyer description & rating before purchase.
                    Fraud protection available when you pay through our
                    checkout.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-2 border rounded"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-2 border rounded"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyOrder;
