import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { IconType } from "react-icons";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaPlus,
  FaTimes,
  FaEye,
  FaStar,
  FaComments,
} from "react-icons/fa";

/* ---------------------------------------------
   Icon casts for TSX
---------------------------------------------- */
const FaPlusIcon = FaPlus as unknown as React.ComponentType<any>;
const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
const FaStarIcon = FaStar as unknown as React.ComponentType<any>;
const FaCommentsIcon = FaComments as unknown as React.ComponentType<any>;
const FaEyeIcon = FaEye as unknown as React.ComponentType<any>;

/* ---------------------------------------------
   Brand Color Maps & Gradients
---------------------------------------------- */
const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaInstagram, "#E1306C"],
  [FaFacebookF, "#1877F2"],
  [FaTwitter, "#1DA1F2"],
  [FaWhatsapp, "#25D366"],
  [FaPlus, "#111827"],
]);

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
];

/* ---------------------------------------------
   Render circular badge
---------------------------------------------- */
const renderBadge = (IconComp: IconType, size = 36) => {
  const brandHex = ICON_COLOR_MAP.get(IconComp);
  const bg =
    brandHex ??
    vibrantGradients[String(IconComp).length % vibrantGradients.length];

  const C = IconComp as unknown as React.ComponentType<any>;

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
      <C size={Math.round(size * 0.65)} style={{ color: "#fff" }} />
    </div>
  );
};

/* ---------------------------------------------
   Stars
---------------------------------------------- */
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

/* ---------------------------------------------
   Types
---------------------------------------------- */
type PurchaseStatus = "Pending" | "Completed" | "Cancelled";

interface Purchase {
  id: string;
  platform: "instagram" | "facebook" | "twitter" | "whatsapp";
  title: string;
  desc?: string;
  seller: string;
  price: number;
  date: string;
  status: PurchaseStatus;
  purchaseNumber?: string;
  supportEmail?: string | null;
}

interface IMessage {
  senderId: string;
  receiverId: string;
  message: string;
}

/* ---------------------------------------------
   Mock purchases
---------------------------------------------- */
const MOCK_PURCHASES: Purchase[] = [
  {
    id: "p1",
    platform: "instagram",
    title: "USA GMAIL NUMBER",
    desc: "Valid +1 US number attached Gmail with full access & recovery email.",
    seller: "Senior man",
    price: 2.5,
    date: "Dec 5, 2025 02:12",
    status: "Cancelled",
    purchaseNumber: "PUR-0001",
    supportEmail: "senior@example.com",
  },
  {
    id: "p2",
    platform: "instagram",
    title: "Aged Gmail (14y)",
    desc: "14-year-old strong Gmail, perfect for ads & socials.",
    seller: "MailKing",
    price: 4.0,
    date: "Dec 4, 2025 13:01",
    status: "Completed",
    purchaseNumber: "PUR-0002",
    supportEmail: "mailking@example.com",
  },
  {
    id: "p3",
    platform: "whatsapp",
    title: "USA WhatsApp number",
    desc: "One-time verification number, works worldwide.",
    seller: "AS Digitals",
    price: 3.5,
    date: "Dec 3, 2025 09:21",
    status: "Completed",
    purchaseNumber: "PUR-0003",
    supportEmail: "asdigitals@example.com",
  },
  {
    id: "p4",
    platform: "whatsapp",
    title: "WhatsApp Business + API",
    desc: "Ready for business messaging & automation.",
    seller: "BizTools",
    price: 15.0,
    date: "Dec 2, 2025 18:00",
    status: "Pending",
    purchaseNumber: "PUR-0004",
    supportEmail: "biztools@example.com",
  },
];

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

/* ---------------------------------------------
   Platform icon helper
---------------------------------------------- */
function PlatformIcon({
  platform,
  size = 36,
}: {
  platform: Purchase["platform"];
  size?: number;
}) {
  if (platform === "instagram") return renderBadge(FaInstagram, size);
  if (platform === "facebook") return renderBadge(FaFacebookF, size);
  if (platform === "twitter") return renderBadge(FaTwitter, size);
  if (platform === "whatsapp") return renderBadge(FaWhatsapp, size);
  return null;
}

const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>(MOCK_PURCHASES);

  // --- Chat State Management ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<IMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [activeChatSeller, setActiveChatSeller] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buyerId = "currentBuyer123"; 
  const CHAT_API = "https://vps-backend-server-beta.vercel.app/chat";

const fetchChat = async (sId: string) => {
  try {
    const res = await axios.get(
      `${CHAT_API}/history/${buyerId}/${sId}`
    );

    setChatMessages(res.data as IMessage[]);
  } catch (err) {
    console.error("Chat fetch error:", err);
  }
};


  useEffect(() => {
    let timer: any;
    if (isChatOpen && activeChatSeller) {
      fetchChat(activeChatSeller);
      timer = setInterval(() => fetchChat(activeChatSeller), 3000);
    }
    return () => clearInterval(timer);
  }, [isChatOpen, activeChatSeller]);

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeChatSeller) return;
    try {
      await axios.post(`${CHAT_API}/send`, {
        senderId: buyerId,
        receiverId: activeChatSeller,
        message: typedMessage,
      });
      setTypedMessage("");
      fetchChat(activeChatSeller);
    } catch (err) {
      alert("Failed to send message");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return purchases;
    return purchases.filter((p) => p.status === activeTab);
  }, [activeTab, purchases]);

  const handleConfirmOrder = () => {
    if (!selected) return;
    const updatedPurchases = purchases.map((p) =>
      p.id === selected.id ? { ...p, status: "Completed" as PurchaseStatus } : p
    );
    setPurchases(updatedPurchases);
    setSelected(null);
    alert("Order Confirmed Successfully!");
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
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                All purchased items appear here
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
                    className={`pb-2 text-xs sm:text-sm whitespace-nowrap ${
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
                {filtered.length === 0 ? (
                  <div className="py-12 sm:py-20 flex flex-col items-center text-center text-gray-500">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#0A1A3A] flex items-center justify-center mb-4 text-white text-3xl font-bold">
                      🛒
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#0A1A3A] mb-2">
                      No Purchases
                    </h3>
                    <Link
                      to="/marketplace"
                      className="mt-4 sm:mt-6 bg-[#33ac6f] text-[#111111] px-5 py-2 rounded-full font-medium"
                    >
                      Browse Marketplace
                    </Link>
                  </div>
                ) : (
                  filtered.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#F8FAFB] rounded-xl p-3 sm:p-4 flex items-start gap-3 border border-gray-100 hover:shadow-md transition-shadow"
                      style={{ minHeight: 74 }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <PlatformIcon platform={p.platform} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#0A1A3A] truncate">
                          {p.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1 sm:line-clamp-2">
                          {p.desc}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                            {p.platform}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                              p.status === "Completed"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : p.status === "Pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 w-24 text-right flex flex-col items-end gap-2">
                        <div className="text-sm font-medium text-[#0A1A3A]">
                          ${p.price.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">{p.date}</div>
                        <div className="mt-1 flex gap-1">
                          <button
                            onClick={() => setSelected(p)}
                            className="px-2 py-1 border rounded text-xs bg-white"
                          >
                            <FaEyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveChatSeller(p.seller);
                              setIsChatOpen(true);
                            }}
                            className="px-2 py-1 border rounded text-md bg-white hover:bg-blue-50 text-blue-600"
                          >
                            <FaCommentsIcon className="w-4 h-4" />
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

      {/* --- Chat Modal (Persistent Styles) --- */}
      {isChatOpen && activeChatSeller && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={() => setIsChatOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full bg-white rounded-t-3xl sm:rounded-2xl z-[110] shadow-2xl flex flex-col h-[80vh] sm:h-[550px] overflow-hidden">
            <div className="bg-[#0A1A3A] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                  {activeChatSeller[0]}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{activeChatSeller}</h3>
                  <p className="text-[10px] text-green-400">Seller Support</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)}>
                <FaTimesIcon size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.senderId === buyerId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
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
              onSubmit={sendChat}
              className="p-4 border-t bg-white flex gap-2"
            >
              <input
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Type here..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="bg-[#33ac6f] text-white px-5 py-2 rounded-full text-sm font-bold"
              >
                Send
              </button>
            </form>
          </div>
        </>
      )}

      {/* --- Details Modal --- */}
      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setSelected(null)}
          />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl z-50 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full" />
            <div className="sticky top-0 bg-white border-b sm:border-b-0 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-[#0A1A3A]">
                  {selected.title}
                </h2>
                <div className="text-xs text-gray-500 mt-0.5">
                  {selected.platform} • Purchased on {selected.date}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    selected.status === "Completed"
                      ? "bg-green-50 text-green-700"
                      : selected.status === "Pending"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {selected.status}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <FaTimesIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-center">
                {PlatformIcon({ platform: selected.platform, size: 72 })}
              </div>
              <div className="mt-4 text-3xl font-bold text-[#0A1A3A]">
                ${selected.price.toFixed(2)}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Purchase Number</p>
                  <p className="font-medium">
                    {selected.purchaseNumber ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Seller</p>
                  <p className="font-medium">{selected.seller}</p>
                </div>
                <div>
                  <p className="text-gray-500">Description</p>
                  <p className="text-sm text-gray-600">
                    {selected.desc ?? "No additional details."}
                  </p>
                </div>
              </div>
              <div className="mt-4 border p-3 rounded-md bg-[#FBFFFB]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Buyer Protection</div>
                    <div className="text-xs text-gray-600">
                      Secure transaction & refund policy
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
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3">
                {selected.status === "Pending" && (
                  <button
                    onClick={handleConfirmOrder}
                    className="w-full py-2 bg-[#33ac6f] hover:bg-[#2aa46a] text-[#111111] rounded font-medium transition shadow-sm"
                  >
                    Confirm Order
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelected(null);
                      setActiveChatSeller(selected.seller);
                      setIsChatOpen(true);
                    }}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium transition"
                  >
                    💬 Chat
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 py-2 border rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Link
        to="/add-product"
        className="hidden sm:flex sm:fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] hover:bg-[#c4963a] text-white rounded-full shadow-2xl items-center justify-center text-2xl"
      >
        <FaPlusIcon />
      </Link>
    </>
  );
};

export default MyPurchase;
