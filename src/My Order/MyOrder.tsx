import React, { useMemo, useState, useEffect } from "react";
import type { IconType } from "react-icons";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPlus,
  FaRegCommentDots,
} from "react-icons/fa";

/* ---------------------------------------------
    Brand Color Map
---------------------------------------------- */
const ICON_COLOR_MAP: Record<string, string> = {
  FaInstagram: "#E1306C",
  FaFacebookF: "#1877F2",
  FaTwitter: "#1DA1F2",
  FaRegCommentDots: "#6B46C1",
  FaPlus: "#111827",
};

/* ---------------------------------------------
    Gradient Generator
---------------------------------------------- */
const gradientFromHex = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.28);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `linear-gradient(135deg, ${hex} 0%, #${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))} 100%)`;
};

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
  "linear-gradient(135deg,#FCCF31 0%,#F55555 100%)",
  "linear-gradient(135deg,#9BE15D 0%,#00E3AE 100%)",
];

/* ---------------------------------------------
    Badge renderer (responsive-friendly)
---------------------------------------------- */
const getIconKey = (C: IconType) => {
  const anyI = C as any;
  return anyI.displayName || anyI.name || "UnknownIcon";
};

const renderBadge = (Icon: IconType, size = 36) => {
  const badgeSize = Math.max(44, size + 8);
  const key = getIconKey(Icon);
  const hex = ICON_COLOR_MAP[key];
  const bg = hex ? gradientFromHex(hex) : vibrantGradients[key.length % vibrantGradients.length];
  const C = Icon as React.ComponentType<any>;

  return (
    <div
      aria-hidden
      style={{
        width: badgeSize,
        height: badgeSize,
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        transition: "transform .18s ease, box-shadow .18s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-3px) scale(1.03)";
        el.style.boxShadow = "0 12px 28px rgba(0,0,0,0.16)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
      }}
    >
      <C size={Math.round(size * 0.7)} style={{ color: "#fff", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))" }} />
    </div>
  );
};

/* ---------------------------------------------
    ORDERS DATA
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

/* ---------------------------------------------
    COMPONENT
---------------------------------------------- */
const tabs = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof tabs)[number];

const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filtered = useMemo(
    () => (activeTab === "All" ? MOCK_ORDERS : MOCK_ORDERS.filter((o) => o.status === activeTab)),
    [activeTab]
  );

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F3EFEE] py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1A3A]">Orders</h1>
          <p className="text-sm sm:text-base text-[#6B7280] mt-2">All orders placed on your platform</p>
        </header>

        <section className="bg-white rounded-2xl p-4 sm:p-6">
          {/* Tabs (horiz scroll on small screens) */}
          <nav className="flex gap-4 overflow-x-auto pb-3 border-b border-gray-100 -mx-4 px-4 sm:px-0">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`whitespace-nowrap pb-2 border-b-2 ${activeTab === t ? "border-[#D4A643] text-[#D4A643] font-semibold" : "border-transparent text-[#6B7280]"}`}
                style={{ background: "transparent" }}
              >
                {t}
              </button>
            ))}
          </nav>

          {/* Orders list */}
          <div className="mt-4 max-h-[65vh] overflow-y-auto pr-2">
            <div className="space-y-4">
              {filtered.map((o) => (
                <article key={o.id} className="bg-[#F4F7FA] rounded-xl p-3 sm:p-4 flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 mt-1">{renderBadge(o.icon, 36)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-[#D4A643] inline-block">Sell <span className="text-[#6B7280] font-medium ml-2">{o.platform}</span></div>
                        <div className="text-sm text-[#6B7280] mt-1">Order number <span className="text-[#111827] font-semibold">#{o.orderNumber}</span></div>
                      </div>

                      <div className="text-right">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${o.status === 'Completed' ? 'bg-[#ECFDF3] text-[#0F9D58]' : o.status === 'Pending' ? 'bg-[#FFFBEB] text-[#B45309]' : 'bg-[#FFF1F2] text-[#B91C1C]'}`}>
                          {o.status}
                        </div>
                        <div className="text-sm text-[#6B7280] mt-2">{o.date}</div>
                        <div className="text-lg font-bold text-[#0A1A3A] mt-2">${o.price}</div>
                      </div>
                    </div>

                    <h3 className="mt-3 text-base sm:text-lg font-semibold text-[#0A1A3A] truncate">{o.title}</h3>
                    <p className="text-sm text-[#6B7280] mt-1">{o.desc}</p>

                    <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                      <div className="text-sm text-[#6B7280]">• {o.seller}</div>

                      <div className="ml-auto">
                        <button className="mt-2 sm:mt-0 inline-flex items-center gap-2 bg-[#D4A643] text-white px-3 py-2 rounded-lg font-semibold" aria-label={`See trade ${o.orderNumber}`}>
                          {React.createElement(FaRegCommentDots as any, { size: 14 })}
                          <span>See Trade</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {filtered.length === 0 && <div className="text-center text-[#6B7280] py-8">No orders found.</div>}
            </div>
          </div>
        </section>

        {/* Floating add button */}
        <button className="fixed right-6 bottom-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl" style={{ background: "linear-gradient(135deg,#FF6B6B 0%,#FFD166 100%)", color: "#fff" }} aria-label="Add order">
          {React.createElement(FaPlus as any, { size: 20, color: "#fff" })}
        </button>
      </div>
    </div>
  );
};

export default MyOrder;
