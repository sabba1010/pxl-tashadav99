import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaSnapchatGhost,
  FaFacebookF,
  FaPlus,
  FaPencilAlt,
  FaTrash,
} from "react-icons/fa";
import type { IconType } from "react-icons";

/* ---------------------------------------------
   Brand color map & gradients (robust for production)
   Use Map keyed by component references to avoid name-mangling
---------------------------------------------- */
const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaInstagram, "#E1306C"],
  [FaSnapchatGhost, "#FFFC00"],
  [FaFacebookF, "#1877F2"],
]);

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
  "linear-gradient(135deg,#FCCF31 0%,#F55555 100%)",
  "linear-gradient(135deg,#9BE15D 0%,#00E3AE 100%)",
];

const gradientFromHex = (hex?: string | null): string => {
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
  return `linear-gradient(135deg, ${hex} 0%, #${toHex(r2)}${toHex(g2)}${toHex(b2)} 100%)`;
};

/* ---------------------------------------------
   Helper: render marketplace-style badge
   Force white icon fill & prevent blend-mode overrides
---------------------------------------------- */
const renderBadge = (IconComponent: IconType, size = 36): React.ReactElement => {
  // smaller badges to align with Marketplace/MyPurchase styling
  const badgeSize = Math.max(36, size + 8);
  const brandHex = ICON_COLOR_MAP.get(IconComponent) ?? null;
  // deterministic fallback index using component function string length
  const fallback = vibrantGradients[String(IconComponent).length % vibrantGradients.length];
  const bg = brandHex ? gradientFromHex(brandHex) : fallback;
  const C = IconComponent as unknown as React.ComponentType<any>;

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
        // Force white fills to avoid host CSS tinting the SVG
        style: { color: "#fff", fill: "#fff", WebkitTextFillColor: "#fff", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))" },
        className: "standout-icon",
      })}
    </div>
  );
};

/* ---------------------------------------------
   Types, Mock data & tabs
---------------------------------------------- */
type Status = "restore" | "active" | "pending" | "denied" | "approved";
type Platform = "instagram" | "snapchat" | "facebook" | string;

interface Ad {
  id: number;
  title: string;
  desc: string;
  price: number;
  status: Status | string;
  platform: Platform;
}

const MOCK: Ad[] = [
  {
    id: 1,
    title: "Aged instagram Account 7 years",
    desc:
      "Aged instagram account with real friends and active follower very sharp good and strong just login with good vpn it doesn't get blocked easily.",
    price: 7,
    status: "restore",
    platform: "instagram",
  },
  {
    id: 2,
    title: "Aged Snapchat Account (1 year)",
    desc: "Aged Snapchat account, good snapscore and activity.",
    price: 6,
    status: "restore",
    platform: "snapchat",
  },
  {
    id: 3,
    title: "Aged instagram Account 7 years (alt)",
    desc:
      "Another aged IG account with healthy followers and activity.",
    price: 9,
    status: "restore",
    platform: "instagram",
  },
  {
    id: 4,
    title: "Aged Facebook dating account activated",
    desc:
      "Activated Facebook dating account — marketplace ready, use a paid VPN for best reliability.",
    price: 30,
    status: "denied",
    platform: "facebook",
  },
];

const TABS: string[] = ["All", "Active", "Pending", "Denied", "Restore"];

/* ---------------------------------------------
   PlatformIcon using same badge style
---------------------------------------------- */
function PlatformIcon({ p }: { p: Platform }) {
  const size = 36;
  if (p === "instagram") return renderBadge(FaInstagram as IconType, size);
  if (p === "snapchat") return renderBadge(FaSnapchatGhost as IconType, size);
  if (p === "facebook") return renderBadge(FaFacebookF as IconType, size);
  return <div style={{ width: size, height: size, borderRadius: "50%", background: "#E5E7EB" }} />;
}

/* ---------------------------------------------
   Component (Tailwind look matching MyPurchase/MyOrder)
---------------------------------------------- */
const MyAds: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Restore");
  const [items, setItems] = useState<Ad[]>(MOCK);

  const filtered = items.filter((i) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return i.status === "active";
    if (activeTab === "Pending") return i.status === "pending";
    if (activeTab === "Denied") return i.status === "denied";
    if (activeTab === "Restore") return i.status === "restore";
    return true;
  });

  const handleRestore = (id: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: "active" } : it)));
    window.alert("Ad restored");
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Delete this ad?")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 sm:pt-20 pb-20 sm:pb-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A1A3A]">My products</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">All of your product ads show here</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-10 h-6 rounded-full bg-[#FFECE6] p-1 flex items-center">
                  <div className="w-4 h-4 rounded-full bg-[#d4a643] ml-auto" />
                </div>
                <span className="text-sm text-gray-600">Turn Ads Off</span>
              </div>

              <Link
                to="/add-product"
                className="mt-1 sm:mt-0 bg-[#d4a643] text-white px-4 py-2 rounded-full font-medium hover:opacity-95 transition-shadow shadow"
              >
                Create Ad
              </Link>
            </div>
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
                        <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7H11.5a.5.5 0 01-.5-.5v-3a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v3a.5.5 0 01-.5.5H5.638a4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662 0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7H8.5a.5.5 0 01.5.5v3a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-3a.5.5 0 01.5-.5h4.162a4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#0A1A3A] mb-2">No Ads</h3>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md">Add products for customers to buy from you.</p>
                    <Link to="/add-product" className="mt-4 sm:mt-6 bg-[#D4A643] text-[#111] px-5 py-2 rounded-full font-medium hover:bg-[#1BC47D] transition">
                      Start selling
                    </Link>
                  </div>
                ) : (
                  filtered.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-[#F8FAFB] rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 border border-[rgba(0,0,0,0.03)]`}
                    >
                      {/* left icon (responsive sizes) */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                          <PlatformIcon p={item.platform} />
                        </div>
                      </div>

                      {/* middle content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-6">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-[#0A1A3A] truncate">{item.title}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>

                            {item.status === "denied" && (
                              <div className="mt-3 p-3 sm:p-4 rounded-lg bg-[#fff4db] text-[#926B00]">
                                <strong>⚠️ Reason for denied</strong>
                                <div className="mt-2 text-xs sm:text-sm text-[#6B4F00]">
                                  Kindly send a screen record of the ads account logged in on your mobile device to our official Telegram number (+2347073823800), thank you.
                                </div>
                              </div>
                            )}

                            <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                              <span className="inline-block w-2 h-2 bg-gray-300 rounded-full" />
                              <span>{item.platform}</span>
                            </div>
                          </div>

                          {/* right meta (price/status/buttons) - responsive layout */}
                          <div className="w-full sm:w-36 flex sm:flex-col flex-row justify-between sm:items-end items-center gap-2">
                            <div className="text-lg font-bold text-[#0A1A3A]">${item.price}</div>

                            <div className="flex items-center gap-2">
                              {item.status === "restore" && (
                                <button
                                  onClick={() => handleRestore(item.id)}
                                  className="px-2 py-1 rounded-md bg-[#d4a643] text-white text-xs"
                                >
                                  Restore
                                </button>
                              )}

                              <button title="Edit" className="p-1 rounded-md bg-white border border-gray-100 shadow-sm">
                                {React.createElement(FaPencilAlt as any, { size: 12 })}
                              </button>
                              <button
                                title="Delete"
                                onClick={() => handleDelete(item.id)}
                                className="p-1 rounded-md bg-white border border-gray-100 shadow-sm"
                              >
                                {React.createElement(FaTrash as any, { size: 12 })}
                              </button>
                            </div>

                            <div className="mt-1 sm:mt-3">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs ${
                                  item.status === "approved" ? "bg-[#ECFDF3] text-[#0F9D58]" :
                                  item.status === "active" ? "bg-[#ECF8FF] text-[#2B6CB0]" :
                                  item.status === "pending" ? "bg-[#FFFBEB] text-[#B45309]" :
                                  item.status === "denied" ? "bg-[#FFF1F2] text-[#9E2A2B]" :
                                  "bg-[#F3F4F6] text-[#6B7280]"
                                }`}
                              >
                                {item.status === "approved" ? "Approved" : item.status === "restore" ? "Restore" : item.status}
                              </span>
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

      {/* Floating + button - visible on mobile as well */}
      <Link
        to="/add-product"
        className="hidden sm:flex sm:fixed bottom-6 right-6 w-14 h-14 bg-[#d4a643] hover:bg-[#c4963a] text-white rounded-full shadow-2xl items-center justify-center z-50 transition-all"
        aria-label="Add product"
      >
        {React.createElement(FaPlus as any, { size: 18 })}
      </Link>
    </>
  );
};

export default MyAds;
