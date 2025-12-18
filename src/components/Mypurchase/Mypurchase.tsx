import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { IconType } from "react-icons";
import {
  FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp,
  FaPlus, FaTimes, FaEye, FaStar, FaComments,
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
   Brand Color Maps & Gradients (Same as Original)
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
   Helper Components (Badge & Stars)
---------------------------------------------- */
const renderBadge = (IconComp: IconType, size = 36) => {
  const brandHex = ICON_COLOR_MAP.get(IconComp);
  const bg = brandHex ?? vibrantGradients[0];
  const C = IconComp as unknown as React.ComponentType<any>;
  return (
    <div style={{ width: size, height: size, minWidth: size, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", background: bg, boxShadow: "0 10px 20px rgba(16,24,40,0.08)" }}>
      <C size={Math.round(size * 0.65)} style={{ color: "#fff" }} />
    </div>
  );
};

const Stars: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStarIcon key={i} className={`w-3 h-3 ${i < value ? "text-yellow-400" : "text-gray-300"}`} />
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
}

interface IMessage {
  senderId: string;
  receiverId: string;
  message: string;
}

const MOCK_PURCHASES: Purchase[] = [
  { id: "p1", platform: "instagram", title: "USA GMAIL NUMBER", desc: "Valid +1 US number attached Gmail.", seller: "Senior man", price: 2.5, date: "Dec 5, 2025 02:12", status: "Cancelled", purchaseNumber: "PUR-0001" },
  { id: "p2", platform: "instagram", title: "Aged Gmail (14y)", desc: "14-year-old strong Gmail.", seller: "MailKing", price: 4.0, date: "Dec 4, 2025 13:01", status: "Completed", purchaseNumber: "PUR-0002" },
];

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;

const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("All");
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [purchases] = useState<Purchase[]>(MOCK_PURCHASES);

  // --- CHAT STATES ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeSeller, setActiveSeller] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentBuyerId = "buyer123";
  const API_URL = "http://localhost:3200/chat";

  const fetchMessages = async (sellerId: string) => {
    try {
      const res = await axios.get<IMessage[]>(`${API_URL}/history/${currentBuyerId}/${sellerId}`);
      setMessages(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    let interval: any;
    if (isChatOpen && activeSeller) {
      fetchMessages(activeSeller);
      interval = setInterval(() => fetchMessages(activeSeller), 3000);
    }
    return () => clearInterval(interval);
  }, [isChatOpen, activeSeller]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeSeller) return;
    try {
      await axios.post(`${API_URL}/send`, { senderId: currentBuyerId, receiverId: activeSeller, message: newMessage });
      setNewMessage("");
      fetchMessages(activeSeller);
    } catch (err) { alert("Error sending message"); }
  };

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const filtered = useMemo(() => {
    return activeTab === "All" ? purchases : purchases.filter((p) => p.status === activeTab);
  }, [activeTab, purchases]);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl sm:text-3xl font-bold text-[#0A1A3A]">My Purchase</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">All purchased items appear here</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-6 pt-4 border-b">
              <nav className="flex gap-4 sm:gap-6 pb-3 overflow-x-auto">
                {TABS.map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`pb-2 text-xs sm:text-sm ${activeTab === t ? "text-[#d4a643] border-b-2 border-[#d4a643]" : "text-gray-500"}`}>{t}</button>
                ))}
              </nav>
            </div>

            <div className="p-4 sm:p-6 space-y-3">
              {filtered.map((p) => (
                <div key={p.id} className="bg-[#F8FAFB] rounded-xl p-3 sm:p-4 flex items-start gap-3 border border-gray-100 hover:shadow-md transition">
                  <div className="flex-shrink-0 mt-1">
                    {renderBadge(p.platform === "instagram" ? FaInstagram : FaWhatsapp)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#0A1A3A] truncate">{p.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{p.desc}</p>
                    <div className="mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${p.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{p.status}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-24 text-right flex flex-col items-end gap-2">
                    <div className="text-sm font-medium text-[#0A1A3A]">${p.price.toFixed(2)}</div>
                    <div className="mt-1 flex gap-1">
                      <button onClick={() => setSelected(p)} className="px-2 py-1 border rounded bg-white flex items-center justify-center"><FaEyeIcon className="w-4 h-4" /></button>
                      <button onClick={() => { setActiveSeller(p.seller); setIsChatOpen(true); }} className="px-2 py-1 border rounded bg-white hover:bg-blue-50 text-blue-600 flex items-center justify-center"><FaCommentsIcon className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- REAL CHAT MODAL (Styled to match your Order Modal) --- */}
      {isChatOpen && activeSeller && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[100]" onClick={() => setIsChatOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full bg-white rounded-t-3xl sm:rounded-2xl z-[110] shadow-2xl overflow-hidden flex flex-col h-[85vh] sm:h-[550px]">
            <div className="bg-[#0A1A3A] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-lg">{activeSeller[0]}</div>
                <div><h3 className="font-bold text-sm">{activeSeller}</h3><p className="text-[10px] text-green-400">Online Now</p></div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition"><FaTimesIcon size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.senderId === currentBuyerId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.senderId === currentBuyerId ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none shadow-sm'}`}>{msg.message}</div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-2">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none ring-1 ring-gray-200 focus:ring-blue-500" />
              <button type="submit" className="bg-[#33ac6f] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#2aa46a] transition shadow-md">Send</button>
            </form>
          </div>
        </>
      )}

      {/* --- DETAILS MODAL (Original Logic) --- */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelected(null)} />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl z-50 max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#0A1A3A]">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-full transition"><FaTimesIcon size={20} /></button>
            </div>
            <div className="flex justify-center mb-4">
              {selected.platform === "instagram" ? renderBadge(FaInstagram, 72) : renderBadge(FaWhatsapp, 72)}
            </div>
            <div className="text-3xl font-bold text-center text-[#0A1A3A] mb-6">${selected.price.toFixed(2)}</div>
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex justify-between border-b pb-2"><span>Seller:</span><span className="font-medium text-[#0A1A3A]">{selected.seller}</span></div>
              <div className="flex justify-between border-b pb-2"><span>Order #:</span><span className="font-medium text-[#0A1A3A]">{selected.purchaseNumber}</span></div>
              <p className="pt-2">{selected.desc}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setSelected(null); setActiveSeller(selected.seller); setIsChatOpen(true); }} className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-200">💬 Chat Now</button>
              <button onClick={() => setSelected(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition">Close</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MyPurchase;