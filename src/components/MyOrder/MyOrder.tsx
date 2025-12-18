import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { IconType } from "react-icons";
import { FaInstagram, FaFacebookF, FaTwitter, FaPlus, FaTimes, FaStar, FaEnvelope, FaDownload, FaComments } from "react-icons/fa";

/* ---------------------------------------------
   Icon casts & Types
---------------------------------------------- */
const FaCommentsIcon = FaComments as unknown as React.ComponentType<any>;
const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
const FaStarIcon = FaStar as unknown as React.ComponentType<any>;
const FaPlusIcon = FaPlus as unknown as React.ComponentType<any>;

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
  supportEmail?: string | null;
}

interface IMessage {
  senderId: string;
  receiverId: string;
  message: string;
}

/* ---------------------------------------------
   Styles & Helpers (Same as original)
---------------------------------------------- */
const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaInstagram, "#E1306C"],
  [FaFacebookF, "#1877F2"],
  [FaTwitter, "#1DA1F2"],
]);

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
];

const renderBadge = (IconComponent: IconType, size = 40) => {
  const brandHex = ICON_COLOR_MAP.get(IconComponent);
  const bg = brandHex ? `linear-gradient(135deg, ${brandHex} 0%, #ffffff 150%)` : vibrantGradients[0];
  const C = IconComponent as any;
  return (
    <div style={{ width: size, height: size, minWidth: size, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", background: bg, boxShadow: "0 10px 20px rgba(16,24,40,0.08)" }}>
      <C size={Math.round(size * 0.66)} style={{ color: "#fff" }} />
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
   Main Component
---------------------------------------------- */
const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- CHAT STATES ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeSeller, setActiveSeller] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentBuyerId = "buyer123"; 
  const API_URL = "http://localhost:3200/chat";

  const MOCK_ORDERS: Order[] = [
    { id: "1", platform: "Instagram", title: "Aged Instagram Account 7 years", desc: "Strong account with real followers.", orderNumber: "ORD-123", seller: "Ibrahim", price: 7, date: "Dec 5, 2025", status: "Completed", icon: FaInstagram },
    { id: "4", platform: "Instagram", title: "Fresh Instagram PVA", desc: "Phone verified & secure.", orderNumber: "ORD-456", seller: "Afsar", price: 5, date: "Dec 9, 2025", status: "Pending", icon: FaInstagram },
  ];

  const filtered = useMemo(() => {
    return activeTab === "All" ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === activeTab);
  }, [activeTab]);

  // --- CHAT LOGIC ---
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

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 sm:pt-20 pb-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#0A1A3A]">Orders</h1>
              <p className="text-xs sm:text-sm text-gray-600">All orders placed on your platform</p>
            </div>
            <Link to="/report" className="bg-[#d4a643] text-white px-6 py-2 rounded-full text-sm font-medium shadow">Report Order</Link>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 pt-4 border-b">
              <nav className="flex gap-6 pb-3 overflow-x-auto">
                {["All", "Pending", "Completed", "Cancelled"].map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`text-sm pb-2 whitespace-nowrap ${activeTab === t ? "text-[#d4a643] border-b-2 border-[#d4a643]" : "text-gray-500"}`}>{t}</button>
                ))}
              </nav>
            </div>

            <div className="p-4 sm:p-6 space-y-3">
              {filtered.map((o) => (
                <div key={o.id} className="bg-[#F8FAFB] rounded-xl p-4 flex items-start gap-3 border border-gray-100 hover:shadow-md transition">
                  <div className="mt-1">{renderBadge(o.icon, 36)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#0A1A3A] truncate">{o.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">{o.desc}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100">{o.platform}</span>
                      <span className="text-base font-bold text-[#0A1A3A]">${o.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${o.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{o.status}</span>
                      <div className="flex gap-2">
                        <button onClick={() => { setActiveSeller(o.seller); setIsChatOpen(true); }} className="p-1.5 border rounded bg-white hover:bg-blue-50 text-blue-600"><FaCommentsIcon className="w-4 h-4" /></button>
                        <button onClick={() => setSelectedOrder(o)} className="px-3 py-1 bg-white border rounded text-xs">View</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- REAL CHAT MODAL --- */}
      {isChatOpen && activeSeller && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[100]" onClick={() => setIsChatOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full bg-white rounded-t-3xl sm:rounded-2xl z-[110] shadow-2xl flex flex-col h-[80vh] sm:h-[550px] overflow-hidden">
            <div className="bg-[#0A1A3A] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">{activeSeller[0]}</div>
                <div><h3 className="font-bold text-sm">{activeSeller}</h3><p className="text-[10px] text-green-400 font-medium">Chatting as Buyer</p></div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><FaTimesIcon size={20} /></button>
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
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none" />
              <button type="submit" className="bg-[#33ac6f] text-white px-5 py-2 rounded-full text-sm font-bold">Send</button>
            </form>
          </div>
        </>
      )}

      {/* --- ORDER DETAILS MODAL --- */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelectedOrder(null)} />
          <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl z-50 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-center mb-4">
               <div>
                  <h2 className="text-lg font-bold text-[#0A1A3A]">{selectedOrder.title}</h2>
                  <p className="text-xs text-gray-500">Order ID: {selectedOrder.orderNumber}</p>
               </div>
               <button onClick={() => setSelectedOrder(null)}><FaTimesIcon size={20}/></button>
             </div>
             <div className="flex justify-center my-6">{renderBadge(selectedOrder.icon, 72)}</div>
             <div className="text-3xl font-bold text-center mb-6">${selectedOrder.price.toFixed(2)}</div>
             <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <p className="text-sm text-gray-600 leading-relaxed">{selectedOrder.desc}</p>
             </div>
             <div className="flex gap-3">
               <button onClick={() => { setSelectedOrder(null); setActiveSeller(selectedOrder.seller); setIsChatOpen(true); }} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">💬 Chat Seller</button>
               <button onClick={() => setSelectedOrder(null)} className="flex-1 py-3 border rounded-xl font-bold">Confirm Order</button>
             </div>
          </div>
        </>
      )}

      <Link to="/add-product" className="hidden sm:flex sm:fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] text-white rounded-full shadow-2xl items-center justify-center transition-all"><FaPlusIcon size={18} /></Link>
    </>
  );
};

export default MyOrder;