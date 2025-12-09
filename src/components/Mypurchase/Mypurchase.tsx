// src/MyPurchase/MyPurchase.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp, FaPlus } from "react-icons/fa";

// Fix for react-icons in strict mode
const Icon = FaPlus as React.ElementType;

/* ---------------------------------------------
   Brand color map & gradients
---------------------------------------------- */
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

/* ---------------------------------------------
   Render round badge - Smaller size
---------------------------------------------- */
const renderBadge = (Icon: IconType, size = 28) => { // Reduced from 36
  const badgeSize = size + 10; // Reduced from +12
  const brandHex = ICON_COLOR_MAP.get(Icon);
  const bg = brandHex
    ? gradientFromHex(brandHex)
    : vibrantGradients[String(Icon).length % vibrantGradients.length];

  const C = Icon as unknown as React.ComponentType<any>;
  return (
    <div
      aria-hidden
      style={{
        width: badgeSize,
        height: badgeSize,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 10px 28px rgba(16,24,40,0.12)",
        transition: "all .2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.05)";
        e.currentTarget.style.boxShadow = "0 18px 40px rgba(16,24,40,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(16,24,40,0.12)";
      }}
    >
      {React.createElement(C, {
        size: size * 0.7,
        style: { color: "#fff", fill: "#fff" },
      })}
    </div>
  );
};

/* ---------------------------------------------
   Types & Mock Data
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
}

const MOCK_PURCHASES: Purchase[] = [
  {
    id: "p1",
    platform: "instagram",
    title: "USA us ESIMs",
    desc: "USA us eSIM At &t and T_mobile 3month subscription from the day of purchase. Can be used to open and verify any app and to make calls",
    seller: "Oluwayemi",
    price: 19,
    date: "Friday, August 1st, 4:20 AM",
    status: "Cancelled",
  },
  {
    id: "p2",
    platform: "whatsapp",
    title: "1 Year Strong PIA VPN Access",
    desc: "Strong VPN For computer/phone, You cannot change password. Thanks",
    seller: "OneA Accs",
    price: 3,
    date: "Wednesday, March 12th, 8:15 PM",
    status: "Completed",
  },
  {
    id: "p3",
    platform: "twitter",
    title: "2023 Reddit account with 1 karma very strong",
    desc: "2023 Reddit account with 1 karma very strong No restriction working perfectly fine",
    seller: "RedSeller",
    price: 9,
    date: "Tuesday, October 15th, 1:43 AM",
    status: "Completed",
  },
  {
    id: "p4",
    platform: "facebook",
    title: "Aged Facebook dating account activated",
    desc: "Activated Facebook dating account very strong and active — works with VPN",
    seller: "FB Pro",
    price: 30,
    date: "Monday, Nov 3rd, 10:30 AM",
    status: "Pending",
  },
];

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

function PlatformIcon({ platform }: { platform: Purchase["platform"] }) {
  if (platform === "instagram") return renderBadge(FaInstagram);
  if (platform === "facebook") return renderBadge(FaFacebookF);
  if (platform === "twitter") return renderBadge(FaTwitter);
  if (platform === "whatsapp") return renderBadge(FaWhatsapp);
  return <div className="w-10 h-10 rounded-full bg-gray-200" />;
}

/* ---------------------------------------------
   Main Component
---------------------------------------------- */
const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const filtered = useMemo(() => {
    if (activeTab === "All") return MOCK_PURCHASES;
    return MOCK_PURCHASES.filter((p) => p.status === activeTab);
  }, [activeTab]);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 sm:pt-20 pb-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1A3A]">My Purchase</h1>
              <p className="text-sm text-gray-600 mt-1">All of your product Purchase shows here</p>
            </div>
            <Link
              to="/report"
              className="mt-4 sm:mt-0 bg-[#d4a643] text-white px-6 py-2.5 rounded-full font-medium shadow hover:opacity-90 transition"
            >
              Report Product
            </Link>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="px-6 pt-6 border-b border-gray-100">
              <nav className="flex gap-8 overflow-x-auto pb-4">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`text-sm font-medium pb-3 border-b-2 transition-colors ${
                      activeTab === t
                        ? "text-[#d4a643] border-[#d4a643]"
                        : "text-gray-500 border-transparent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </nav>
            </div>

            {/* Purchase List - Compact Cards */}
            <div className="p-4 sm:p-6">
              <div className="space-y-3"> {/* Reduced from space-y-4 */}
                {filtered.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <div className="w-28 h-28 bg-[#0A1A3A] rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7H11.5a.5.5 0 01-.5-.5v-3a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v3a.5.5 0 01-.5.5H5.638a4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662 0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7H8.5a.5.5 0 01.5.5v3a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-3a.5.5 0 01.5-.5h4.162a4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-[#0A1A3A]">No Purchases</h3>
                    <p className="mt-2 max-w-md mx-auto">You haven't purchased anything yet. Explore the marketplace!</p>
                    <Link to="/marketplace" className="mt-6 inline-block bg-[#d4a643] text-black px-6 py-3 rounded-full font-medium">
                      Browse Marketplace
                    </Link>
                  </div>
                ) : (
                  filtered.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#F8FAFB] rounded-lg p-4 flex flex-col sm:flex-row gap-4 border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      {/* Left Icon - Smaller */}
                      <div className="flex-shrink-0">
                        <PlatformIcon platform={p.platform} />
                      </div>

                      {/* Middle Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#0A1A3A] line-clamp-1">{p.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{p.desc}</p>

                        <div className="mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Manual (P2P)
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <div>
                            <div className="text-xs font-medium">{p.seller}</div>
                            <div className="text-xs text-gray-400">Offline</div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="text-xl font-bold text-[#0A1A3A]">${p.price}</span>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="flex flex-col justify-between items-end">
                        <div className="text-right">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${
                              p.status === "Completed"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : p.status === "Pending"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {p.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{p.date}</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                          <button className="p-1.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow transition">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </button>
                          <button className="px-3 py-1.5 bg-[#d4a643] text-white text-xs font-medium rounded-md hover:opacity-90 transition">
                            See Trade
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

      {/* Floating Add Button */}
      <Link
        to="/add-product"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] hover:bg-[#c4963a] text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all hover:scale-110"
      >
        <Icon size={28} />
      </Link>
    </>
  );
};

export default MyPurchase;