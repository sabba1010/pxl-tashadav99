// src/MyPurchase/MyPurchase.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp, FaPlus } from "react-icons/fa";

/* ---------------------------------------------
   Brand color map & gradients (robust for prod)
   Use Map keyed by component references to avoid name-mangling
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
  "linear-gradient(135deg,#FCCF31 0%,#F55555 100%)",
  "linear-gradient(135deg,#9BE15D 0%,#00E3AE 100%)",
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
   Render round badge (marketplace style)
   Force white icon color & prevent blend overrides
---------------------------------------------- */
const renderBadge = (Icon: IconType, size = 36) => {
  // make badges slightly smaller by default so cards match Marketplace sizing
  const badgeSize = Math.max(36, size + 8);
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
        minWidth: badgeSize,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 10px 28px rgba(16,24,40,0.12)",
        transition: "transform .18s ease, box-shadow .18s ease",
        mixBlendMode: "normal",
        isolation: "isolate",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-6px) scale(1.02)";
        el.style.boxShadow = "0 18px 44px rgba(16,24,40,0.18)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 10px 28px rgba(16,24,40,0.12)";
      }}
    >
      {React.createElement(C, {
        size: Math.round(size * 0.75),
        // force both color & fill to prevent inheritance / blend tint in production
        style: { color: "#fff", fill: "#fff", WebkitTextFillColor: "#fff", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))" },
        className: "standout-icon",
      })}
    </div>
  );
};

/* ---------------------------------------------
   Data types & mock purchases
---------------------------------------------- */
type PurchaseStatus = "Pending" | "Completed" | "Cancelled";

interface Purchase {
  id: string;
  platform: "instagram" | "facebook" | "twitter" | "whatsapp";
  title: string;
  desc?: string;
  seller: string;
  price: number;
  date: string; // human readable for demo
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
  {
    id: "p5",
    platform: "instagram",
    title: "Instagram PVA 2020",
    desc: "Aged instagram PVA account 2020 active and secure.",
    seller: "IG King",
    price: 12,
    date: "Sunday, Sep 21st, 7:12 PM",
    status: "Pending",
  },
  {
    id: "p6",
    platform: "twitter",
    title: "Twitter Verified Helper",
    desc: "Helper for getting verified features, supports 1 device login",
    seller: "X Helper",
    price: 7,
    date: "Tuesday, Jul 8th, 11:05 AM",
    status: "Cancelled",
  },
];

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

/* ---------------------------------------------
   PlatformIcon: use renderBadge (no white box)
---------------------------------------------- */
function PlatformIcon({ platform }: { platform: Purchase["platform"] }) {
  const size = 36;
  if (platform === "instagram") return renderBadge(FaInstagram, size);
  if (platform === "facebook") return renderBadge(FaFacebookF, size);
  if (platform === "twitter") return renderBadge(FaTwitter, size);
  if (platform === "whatsapp") return renderBadge(FaWhatsapp, size);
  // fallback neutral badge
  return <div style={{ width: size, height: size, borderRadius: "50%", background: "#E5E7EB" }} />;
}

/* ---------------------------------------------
   Component (responsive)
---------------------------------------------- */
const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const purchases = MOCK_PURCHASES;

  const filtered = useMemo(() => {
    if (activeTab === "All") return purchases;
    return purchases.filter((p) => p.status === activeTab);
  }, [activeTab, purchases]);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 sm:pt-20 pb-20 sm:pb-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A1A3A]">My Purchase</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">All of your product Purchase shows here</p>
            </div>

            <Link
              to="/report"
              className="mt-2 sm:mt-0 bg-[#d4a643] text-white px-4 sm:px-6 py-2 rounded-full font-medium hover:opacity-95 transition-shadow shadow"
            >
              Report Product
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-6">
              <nav className="flex gap-4 sm:gap-6 border-b border-gray-100 pb-3 sm:pb-4 overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`pb-2 text-xs sm:text-sm ${activeTab === t ? "text-[#d4a643] border-b-2 border-[#d4a643]" : "text-gray-500"}`}
                  >
                    {t}
                  </button>
                ))}
              </nav>
            </div>

            {/* List */}
            <div className="p-4 sm:p-6">
              <div className="max-h-[62vh] overflow-y-auto pr-2 sm:pr-4 space-y-4 sm:space-y-6">
                {filtered.length === 0 ? (
                  <div className="py-12 sm:py-20 flex flex-col items-center text-center text-gray-500">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#0A1A3A] flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 sm:w-14 sm:h-14 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7H11.5a.5.5 0 01-.5-.5v-3a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v3a.5.5 0 01-.5.5H5.638a4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662 0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7H8.5a.5.5 0 01.5.5v3a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-3a.5.5 0 01.5-.5h4.162a4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#0A1A3A] mb-2">No Purchases</h3>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md">You haven't purchased anything yet. Explore the marketplace and grab amazing deals!</p>
                    <Link to="/marketplace" className="mt-4 sm:mt-6 bg-[#D4A643] text-[#111111] px-5 py-2 rounded-full font-medium hover:bg-[#1BC47D] transition">
                      Browse Marketplace
                    </Link>
                  </div>
                ) : (
                  filtered.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#F8FAFB] rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 border border-[rgba(0,0,0,0.03)]"
                    >
                      {/* left icon (responsive) */}
                        <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                          <PlatformIcon platform={p.platform} />
                        </div>
                      </div>

                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-6">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-[#0A1A3A]">{p.title}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.desc}</p>

                            <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                              <span className="inline-block w-2 h-2 bg-gray-300 rounded-full" />
                              <span>{p.seller}</span>
                            </div>
                          </div>

                          {/* right meta - becomes full width under content on mobile */}
                          <div className="w-full sm:w-36 flex sm:flex-col flex-row justify-between sm:items-end items-center gap-2">
                            <div className="text-lg sm:text-xl font-bold text-[#0A1A3A]">${p.price}</div>

                            <div className="flex items-center gap-2">
                              <button className="px-2 py-1 rounded-md bg-[#d4a643] text-white text-xs">See Trade</button>
                              <button className="p-1 rounded-md bg-white border border-gray-100 shadow-sm" title="Chat">
                                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                              </button>
                            </div>

                            <div className="mt-1 sm:mt-3">
                              <div>
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs ${
                                    p.status === "Completed" ? "bg-[#ECFDF3] text-[#0F9D58]" :
                                    p.status === "Pending" ? "bg-[#FFFBEB] text-[#B45309]" :
                                    "bg-[#FFF1F2] text-[#9E2A2B]"
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </div>

                              <div className="text-xs text-gray-600 mt-1 sm:mt-2">{p.date}</div>
                            </div>
                          </div>
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

      {/* Floating + button (visible on mobile & desktop) */}
      <Link
        to="/add-product"
        className="hidden sm:flex sm:fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] hover:bg-[#c4963a] text-white rounded-full shadow-2xl items-center justify-center z-50 transition-all"
        aria-label="Add product"
      >
        {React.createElement(FaPlus as any, { size: 18 })}
      </Link>
    </>
  );
};

export default MyPurchase;
