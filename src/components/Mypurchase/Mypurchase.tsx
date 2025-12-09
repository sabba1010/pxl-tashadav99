// src/MyPurchase/MyPurchase.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp, FaPlus, FaTimes } from "react-icons/fa";

const Icon = FaPlus as React.ElementType;
const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;

const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaInstagram, "#E1306C"],
  [FaFacebookF, "#1877F2"],
  [FaTwitter, "#1DA1F2"],
  [FaWhatsapp, "#25D366"],
]);

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
];

const gradientFromHex = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.28);
  const r2 = mix(r);
  const g2 = mix(g);
  const b2 = mix(b);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `linear-gradient(135deg, ${hex} 0%, #${toHex(r2)}${toHex(g2)}${toHex(b2)} 100%)`;
};

const renderBadge = (IconComp: IconType, size = 30) => {
  const badgeSize = size + 10;
  const brandHex = ICON_COLOR_MAP.get(IconComp);
  const bg = brandHex ? gradientFromHex(brandHex) : vibrantGradients[String(IconComp).length % vibrantGradients.length];
  const C = IconComp as unknown as React.ComponentType<any>;
  return (
    <div
      aria-hidden
      style={{
        width: badgeSize,
        height: badgeSize,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 12px 30px rgba(16,24,40,0.12)",
      }}
    >
      {React.createElement(C, { size: Math.round(size * 0.7), style: { color: "#fff", fill: "#fff" } })}
    </div>
  );
};

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
}

const MOCK_PURCHASES: Purchase[] = [
  { id: "p1", platform: "instagram", title: "USA GMAIL NUMBER", desc: "Valid +1 US number attached Gmail with full access & recovery email.", seller: "Senior man", price: 2.5, date: "2 mins", status: "Cancelled" },
  { id: "p2", platform: "instagram", title: "Aged Gmail (14y)", desc: "14-year-old strong Gmail, perfect for ads & socials.", seller: "MailKing", price: 4.0, date: "1 min", status: "Completed" },
  { id: "p3", platform: "whatsapp", title: "USA WhatsApp number", desc: "One-time verification number, works worldwide.", seller: "AS Digitals", price: 3.5, date: "5 mins", status: "Completed" },
  { id: "p4", platform: "whatsapp", title: "WhatsApp Business + API", desc: "Ready for business messaging & automation.", seller: "BizTools", price: 15.0, date: "Instant", status: "Pending" },
];

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

function PlatformIcon({ platform, size = 30 }: { platform: Purchase["platform"]; size?: number }) {
  if (platform === "instagram") return renderBadge(FaInstagram, size);
  if (platform === "facebook") return renderBadge(FaFacebookF, size);
  if (platform === "twitter") return renderBadge(FaTwitter, size);
  if (platform === "whatsapp") return renderBadge(FaWhatsapp, size);
  return <div style={{ width: size, height: size, borderRadius: 999, background: "#E5E7EB" }} />;
}

const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  const filtered = React.useMemo(() => {
    if (activeTab === "All") return MOCK_PURCHASES;
    return MOCK_PURCHASES.filter((p) => p.status === activeTab);
  }, [activeTab]);

  const addToCart = (p: Purchase) => {
    setCartCount((c) => c + 1);
    alert(`${p.title} added to cart (mock).`);
  };

  const handleBuy = (p: Purchase) => {
    alert(`Buying ${p.title} — mock action.`);
  };

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 sm:pt-20 pb-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#0A1A3A]">My Purchase</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">All of your product Purchase shows here</p>
            </div>

            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <Link to="/report" className="bg-[#d4a643] text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow">Report Product</Link>

              <Link to="/cart" className="relative">
                <div className="p-2 bg-white border rounded-md shadow-sm">🛒</div>
                {cartCount > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{cartCount}</div>}
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-3 sm:px-6 pt-4 sm:pt-6 border-b border-gray-100">
              <nav className="flex gap-4 sm:gap-6 overflow-x-auto pb-3">
                {TABS.map((t) => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`text-xs sm:text-sm font-medium pb-2 border-b-2 transition-colors ${activeTab === t ? "text-[#d4a643] border-[#d4a643]" : "text-gray-500 border-transparent"}`}>{t}</button>
                ))}
              </nav>
            </div>

            <div className="p-3 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 sm:py-20 text-gray-500">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0A1A3A] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7H11.5a.5.5 0 01-.5-.5v-3a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v3a.5.5 0 01-.5.5H5.638a4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662 0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7H8.5a.5.5 0 01.5.5v3a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-3a.5.5 0 01.5-.5h4.162a4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" /></svg>
                    </div>
                    <h3 className="text-base sm:text-xl font-semibold text-[#0A1A3A]">No Purchases</h3>
                    <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm">You haven't purchased anything yet. Explore the marketplace!</p>
                    <Link to="/marketplace" className="mt-4 inline-block bg-[#d4a643] text-black px-4 py-2 rounded-full text-xs sm:text-sm font-medium">Browse Marketplace</Link>
                  </div>
                ) : (
                  filtered.map((p) => (
                    <div key={p.id} className="bg-white rounded-lg p-3 sm:p-4 flex items-center sm:flex-row gap-3 sm:gap-4 border border-gray-100 hover:shadow-md transition-shadow" style={{ minHeight: 72 }}>
                      <div className="flex-shrink-0 mr-3">
                        <PlatformIcon platform={p.platform} size={34} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <div className="truncate">
                            <h3 className="text-sm sm:text-base font-semibold text-[#0A1A3A] truncate">{p.title}</h3>
                            <p className="text-xs text-gray-500 hidden sm:block mt-1 line-clamp-2">{p.desc}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm sm:text-lg font-bold text-[#0A1A3A]">${p.price.toFixed(2)}</div>
                            <div className="text-[11px] text-gray-400">{p.date}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3">
                            <div className="text-[12px] text-gray-500 hidden sm:block">{p.seller}</div>
                            <div className="inline-block px-2 py-0.5 rounded text-[11px] bg-gray-100 text-gray-600">Manual (P2P)</div>
                          </div>

                          <div>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium border ${p.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" : p.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                              {p.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2 ml-3">
                        <button onClick={() => setSelected(p)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs sm:text-sm shadow-sm hover:bg-gray-50 transition">View</button>
                        <button onClick={() => addToCart(p)} className="px-3 py-1.5 bg-[#33ac6f] text-white rounded-md text-xs sm:text-sm">Buy</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* non-fullscreen overlay + centered modal */}
      {selected && (
        <div className="fixed left-0 right-0 top-16 bottom-16 z-60 flex items-center justify-center pointer-events-none">
          {/* subtle rounded dim only behind modal (NOT full-screen) */}
          <div
            className="absolute mx-auto w-full max-w-3xl rounded-3xl bg-black/12"
            style={{ height: "70%", pointerEvents: "auto" }}
            onClick={() => setSelected(null)}
          />

          {/* the actual modal (pointer-events enabled) */}
          <div className="relative w-full max-w-xl mx-auto pointer-events-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <div className="flex items-center gap-4">
                  <PlatformIcon platform={selected.platform} size={48} />
                  <div>
                    <h2 className="text-xl font-bold text-[#0A1A3A]">{selected.title}</h2>
                    <div className="text-xs text-gray-500 mt-0.5">{selected.seller} • {selected.date}</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-md hover:bg-gray-100">
                  <FaTimesIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                <p className="text-sm text-gray-700 leading-relaxed">{selected.desc}</p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Status</div>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${selected.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" : selected.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {selected.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Price</div>
                    <div className="text-3xl font-bold text-[#0A1A3A] mt-1">${selected.price.toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => { addToCart(selected); setSelected(null); }} className="flex-1 px-4 py-3 border rounded-lg text-sm font-medium bg-white hover:bg-gray-50">Add to cart</button>
                  <button onClick={() => { handleBuy(selected); setSelected(null); }} className="flex-1 px-4 py-3 rounded-lg text-sm font-bold bg-[#33ac6f] text-white">Buy now</button>
                </div>

                <div className="mt-4 text-xs text-gray-400">Note: This is a mock detail panel — connect APIs to perform real actions.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Link to="/add-product" className="fixed bottom-5 right-5 w-12 h-12 sm:w-14 sm:h-14 bg-[#33ac6f] hover:bg-[#c4963a] text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-all">
        <Icon size={20} />
      </Link>
    </>
  );
};

export default MyPurchase;

