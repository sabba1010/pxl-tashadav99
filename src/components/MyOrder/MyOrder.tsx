// src/MyOrder/MyOrder.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import { FaInstagram, FaFacebookF, FaTwitter, FaPlus } from "react-icons/fa";

/* ---------------------------------------------
   Brand color map & gradients (Marketplace style)
---------------------------------------------- */
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
  return `linear-gradient(135deg, ${hex} 0%, #${toHex(r2)}${toHex(g2)}${toHex(b2)} 100%)`;
};

/* ---------------------------------------------
   Render round badge (marketplace style) — tuned for compact mobile
---------------------------------------------- */
const renderBadge = (IconComponent: IconType, size = 40) => {
  const badgeSize = Math.max(36, size);
  const brandHex = ICON_COLOR_MAP.get(IconComponent);
  const bg = brandHex ? gradientFromHex(brandHex) : vibrantGradients[String(IconComponent).length % vibrantGradients.length];
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
      {React.createElement(C, { size: Math.round(size * 0.66), style: { color: "#fff", fill: "#fff" } })}
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
    date: "Dec 5, 01:50",
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
    date: "Dec 4, 19:53",
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
    date: "Dec 4, 19:21",
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
   Component (responsive) — full file, clean & compact mobile cards
---------------------------------------------- */
const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [cartCount, setCartCount] = useState(0);
  const orders = MOCK_ORDERS;
  const filtered = useMemo(() => {
    if (activeTab === "All") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [activeTab, orders]);

  const addToCart = (o: Order) => {
    setCartCount((c) => c + 1);
    // TODO: replace with real action
    alert(`${o.title} added to cart (mock).`);
  };

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 sm:pt-20 pb-20 sm:pb-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A1A3A]">Orders</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">All orders placed on your platform</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/report"
                className="mt-2 sm:mt-0 bg-[#d4a643] text-white px-4 sm:px-6 py-2 rounded-full font-medium shadow hover:opacity-95 transition"
              >
                Report Order
              </Link>

              <Link to="/cart" className="relative">
                <div className="p-2 bg-white border rounded-md shadow-sm">🛒</div>
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </div>
                )}
              </Link>
            </div>
          </div>

          {/* Card wrapper */}
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
              <div className="space-y-3">
                {filtered.length === 0 ? (
                  <div className="py-12 sm:py-20 flex flex-col items-center text-center text-gray-500">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#0A1A3A] flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 sm:w-14 sm:h-14 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7H11.5a.5.5 0 01-.5-.5v-3a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v3a.5.5 0 01-.5.5H5.638a4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662 0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7H8.5a.5.5 0 01.5.5v3a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-3a.5.5 0 01.5-.5h4.162a4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#0A1A3A] mb-2">No Orders</h3>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md">You haven't placed any orders yet. Explore the marketplace and grab great offers!</p>
                    <Link to="/marketplace" className="mt-4 sm:mt-6 bg-[#33ac6f] text-[#111111] px-5 py-2 rounded-full font-medium hover:bg-[#2aa46a] transition">
                      Browse Marketplace
                    </Link>
                  </div>
                ) : (
                  filtered.map((o) => (
                    /* ---------- CLEAN & COMPACT CARD ---------- */
                    <article
                      key={o.id}
                      className="bg-[#F8FAFB] rounded-xl p-3 sm:p-4 flex items-start gap-3 border border-gray-100 hover:shadow-md transition-shadow"
                      role="article"
                      style={{ minHeight: 74 }}
                    >
                      {/* Left Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {renderBadge(o.icon, 36)}
                      </div>

                      {/* Middle Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#0A1A3A] truncate">{o.title}</h3>

                        {/* Single-line desc on mobile, 2-lines on sm+ */}
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1 sm:line-clamp-2">
                          {o.desc}
                        </p>

                        {/* platform + price row */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{o.platform}</span>
                          <span className="text-base font-bold text-[#0A1A3A]">${o.price.toFixed(2)}</span>
                        </div>

                        {/* footer: status + actions (compact) */}
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
                              onClick={() => alert(`Viewing order ${o.orderNumber} (mock)`)}
                              className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs shadow-sm"
                            >
                              View
                            </button>

                            <button
                              onClick={() => addToCart(o)}
                              className="px-3 py-1.5 bg-[#33ac6f] text-white text-xs rounded-md shadow-sm"
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating + button (visible on desktop) */}
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

export default MyOrder;
