// src/MyOrder/MyOrder.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import { FaInstagram, FaFacebookF, FaTwitter, FaPlus, FaRegCommentDots } from "react-icons/fa";

/* ---------------------------------------------
   Brand color map & gradients (Marketplace style)
---------------------------------------------- */
const ICON_COLOR_MAP: Record<string, string> = {
  FaInstagram: "#E1306C",
  FaFacebookF: "#1877F2",
  FaTwitter: "#1DA1F2",
  FaRegCommentDots: "#6B46C1",
  FaPlus: "#111827",
};

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
  return `linear-gradient(135deg, ${hex} 0%, #${toHex(r2)}${toHex(g2)}${toHex(b2)} 100%)`;
};

const getIconKey = (Icon: IconType | any) => {
  const anyI = Icon;
  return anyI.displayName || anyI.name || "Icon";
};

const renderBadge = (IconComponent: IconType, size = 44) => {
  const badgeSize = Math.max(56, size + 12);
  const key = getIconKey(IconComponent);
  const hex = ICON_COLOR_MAP[key] || null;
  const bg = hex ? gradientFromHex(hex) : vibrantGradients[key.length % vibrantGradients.length];
  const C = IconComponent as any;

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
      {React.createElement(C, { size: Math.round(size * 0.75), style: { color: "#fff", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))" } })}
    </div>
  );
};

/* ---------------------------------------------
   Types & mock orders
---------------------------------------------- */
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
}

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    platform: "Instagram",
    title: "Aged Instagram Account 7 years",
    desc: "Strong account with real followers.",
    orderNumber: "e4a70600-58e5-4878-9a81",
    seller: "Ibrahim",
    price: 7,
    date: "Friday, December 5, 01:50",
    status: "Completed",
    icon: FaInstagram,
  },
  {
    id: "2",
    platform: "Facebook",
    title: "Old Facebook Account (7 years)",
    desc: "Marketplace enabled, no restrictions.",
    orderNumber: "12d983b1-aa18-4585",
    seller: "Rahman",
    price: 15,
    date: "Thursday, December 4, 19:53",
    status: "Completed",
    icon: FaFacebookF,
  },
  {
    id: "3",
    platform: "Twitter",
    title: "Aged Twitter account 3 years",
    desc: "Good standing, real followers.",
    orderNumber: "174029fc-8237-44ca",
    seller: "Alban",
    price: 7,
    date: "Thursday, December 4, 19:21",
    status: "Completed",
    icon: FaTwitter,
  },
  {
    id: "4",
    platform: "Instagram",
    title: "Fresh Instagram PVA",
    desc: "Phone verified & secure.",
    orderNumber: "bb92a-aff3-55f1",
    seller: "Afsar",
    price: 5,
    date: "Today, 14:10",
    status: "Pending",
    icon: FaInstagram,
  },
  {
    id: "5",
    platform: "Facebook",
    title: "Facebook Marketplace Enabled",
    desc: "Real friends + Marketplace ready.",
    orderNumber: "a1021f-8892-aa99",
    seller: "Rahim",
    price: 10,
    date: "Today, 10:30",
    status: "Pending",
    icon: FaFacebookF,
  },
];

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

/* ---------------------------------------------
   Component (responsive)
---------------------------------------------- */
const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const orders = MOCK_ORDERS;

  const filtered = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [activeTab, orders]);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 sm:pt-20 pb-20 sm:pb-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A1A3A]">Orders</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">All orders placed on your platform</p>
            </div>

            <Link
              to="/report"
              className="mt-2 sm:mt-0 bg-[#d4a643] text-white px-4 sm:px-6 py-2 rounded-full font-medium hover:opacity-95 transition-shadow shadow"
            >
              Report Order
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
                        <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7H11.5a.5.5 0 01-.5-.5v-3a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v3a.5.5 0 01-.5.5H5.638a4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662 0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7H8.5a.5.5 0 01.5.5v3a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-3a.5.5 0 01.5-.5h4.162a4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#0A1A3A] mb-2">No Orders</h3>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md">You haven't placed any orders yet. Explore the marketplace and grab great offers!</p>
                    <Link to="/marketplace" className="mt-4 sm:mt-6 bg-[#D4A643] text-[#111111] px-5 py-2 rounded-full font-medium hover:bg-[#1BC47D] transition">
                      Browse Marketplace
                    </Link>
                  </div>
                ) : (
                  filtered.map((o) => (
                    <div
                      key={o.id}
                      className="bg-[#F8FAFB] rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 border border-[rgba(0,0,0,0.03)]"
                    >
                      {/* left icon (responsive) */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                          {renderBadge(o.icon, 48)}
                        </div>
                      </div>

                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-6">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-[#D4A643]">Sell <span className="text-sm font-medium text-[#6B7280] ml-2">{o.platform}</span></div>
                            <div className="text-xs text-[#6B7280] mt-2">Order number <span className="text-[#0A1A3A] font-semibold">#{o.orderNumber}</span></div>

                            <h3 className="text-sm sm:text-base font-semibold text-[#0A1A3A] mt-3 truncate">{o.title}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-3">{o.desc}</p>

                            <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                              <span className="inline-block w-2 h-2 bg-gray-300 rounded-full" />
                              <span>{o.seller}</span>
                            </div>
                          </div>

                          {/* right meta - becomes full width under content on mobile */}
                          <div className="w-full sm:w-44 flex sm:flex-col flex-row justify-between sm:items-end items-center gap-3">
                            <div className="text-lg sm:text-xl font-bold text-[#0A1A3A]">${o.price}</div>

                            <div className="flex items-center gap-2">
                              <button className="px-3 py-1 rounded-md bg-[#d4a643] text-white text-xs sm:text-sm inline-flex items-center gap-2">
                                {React.createElement(FaRegCommentDots as any, { size: 14, color: "#fff" })}
                                <span className="hidden sm:inline">See Trade</span>
                                <span className="sm:hidden">Chat</span>
                              </button>
                            </div>

                            <div className="mt-1 sm:mt-3">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs ${
                                  o.status === "Completed" ? "bg-[#ECFDF3] text-[#0F9D58]" :
                                  o.status === "Pending" ? "bg-[#FFFBEB] text-[#B45309]" :
                                  "bg-[#FFF1F2] text-[#9E2A2B]"
                                }`}
                              >
                                {o.status}
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

      {/* Floating + button (visible on mobile & desktop) */}
      <Link
        to="/add-order"
        className="fixed bottom-6 right-6 bg-[#d4a643] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl sm:text-3xl font-light hover:opacity-95 transition z-40"
        aria-label="Add order"
      >
        {React.createElement(FaPlus as any, { size: 18, color: "#fff" })}
      </Link>
    </>
  );
};

export default MyOrder;
