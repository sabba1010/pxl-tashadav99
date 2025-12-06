// src/components/MyOrder/MyOrder.tsx
import React, { useMemo, useState, useEffect } from "react";
import type { IconType } from "react-icons";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPlus,
  FaRegCommentDots,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

/**
 * MyOrder.tsx (fixed)
 * - "Moogo"-style colourful icon badges
 * - Fix TS2786 by using React.createElement for a couple inline icons
 */

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

const ICON_COLOR_MAP: Record<string, string> = {
  FaInstagram: "#E1306C",
  FaFacebookF: "#1877F2",
  FaTwitter: "#1DA1F2",
  FaEnvelope: "#D44638",
  FaLock: "#0A1A3A",
  FaRegCommentDots: "#6B46C1",
  FaPlus: "#111827",
};

const gradientFromHex = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.32);
  const r2 = mix(r);
  const g2 = mix(g);
  const b2 = mix(b);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `linear-gradient(135deg, ${hex} 0%, #${toHex(r2)}${toHex(g2)}${toHex(b2)} 100%)`;
};

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
  "linear-gradient(135deg,#FCCF31 0%,#F55555 100%)",
  "linear-gradient(135deg,#9BE15D 0%,#00E3AE 100%)",
];

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    platform: "Instagram",
    title: "Aged instagram Account 7 years",
    desc: "Aged instagram account with real friends and active follower very sharp good and strong.",
    orderNumber: "e4a70600-58e5-4878-9a81-69b16843185c",
    seller: "Ibrahim",
    price: 7,
    date: "Friday, December 5th, 1:50 AM",
    status: "Completed",
    icon: FaInstagram,
  },
  {
    id: "2",
    platform: "Facebook",
    title: "Old very strong Facebook account",
    desc: "Old Facebook account 7 years strong and doesn't get blocked easily.",
    orderNumber: "12d983b1-aa18-4585-a94a-795991078c4d",
    seller: "Olaleke Rahman",
    price: 15,
    date: "Thursday, December 4th, 7:53 PM",
    status: "Completed",
    icon: FaFacebookF,
  },
  {
    id: "3",
    platform: "Twitter",
    title: "Aged Twitter account 3 years",
    desc: "Aged strong Twitter account with real followers.",
    orderNumber: "174029fc-8237-44ca-927a-11bcbef56459",
    seller: "Alban",
    price: 7,
    date: "Thursday, December 4th, 7:21 PM",
    status: "Completed",
    icon: FaTwitter,
  },
  {
    id: "4",
    platform: "Instagram",
    title: "Fresh Instagram PVA account",
    desc: "Phone verified, secure login, works with VPN.",
    orderNumber: "bb92a-af33-55f1-a9aa-91cde121",
    seller: "Afsar",
    price: 5,
    date: "Today, 2:10 PM",
    status: "Pending",
    icon: FaInstagram,
  },
  {
    id: "5",
    platform: "Facebook",
    title: "Facebook Marketplace Enabled",
    desc: "Real friends, marketplace enabled instantly.",
    orderNumber: "a1021f-8892-aa99-8873aa28",
    seller: "Rahim",
    price: 10,
    date: "Today, 10:30 AM",
    status: "Pending",
    icon: FaFacebookF,
  },
  {
    id: "6",
    platform: "Twitter",
    title: "Twitter aged account cancelled",
    desc: "Order was cancelled due to verification issues.",
    orderNumber: "c1188f-a1930-a912fa-1881",
    seller: "Mizan",
    price: 6,
    date: "Wednesday, December 3rd, 3:00 PM",
    status: "Cancelled",
    icon: FaTwitter,
  },
  {
    id: "7",
    platform: "Instagram",
    title: "Instagram aged + followers",
    desc: "Cancelled by buyer request.",
    orderNumber: "19ff28-00a19fd-aa882f",
    seller: "Hasib",
    price: 12,
    date: "Tuesday, December 2nd, 11:21 AM",
    status: "Cancelled",
    icon: FaInstagram,
  },
];

const tabs = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof tabs)[number];

const getIconKey = (Icon: IconType) => {
  const anyI = Icon as any;
  return anyI.displayName || anyI.name || String(anyI);
};

const renderIconBadge = (Icon: IconType, size = 28) => {
  const badgeSize = Math.max(46, size + 14);
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
        minWidth: badgeSize,
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 8px 22px rgba(10,26,58,0.12)",
        transition: "transform .16s ease, box-shadow .16s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-4px) scale(1.02)";
        el.style.boxShadow = "0 14px 34px rgba(10,26,58,0.16)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 8px 22px rgba(10,26,58,0.12)";
      }}
    >
      <C size={Math.round(size * 0.8)} style={{ color: "#ffffff", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.12))" }} />
    </div>
  );
};

const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filtered = useMemo(() => {
    if (activeTab === "All") return MOCK_ORDERS;
    return MOCK_ORDERS.filter((o) => o.status === activeTab);
  }, [activeTab]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div style={{ background: "#F3EFEE", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 30, margin: 0, color: "#0A1A3A" }}>Orders</h1>
        <div style={{ color: "#6B7280", marginBottom: 16 }}>All orders placed on your platform</div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 20 }}>
          {/* Tabs */}
          <nav style={{ display: "flex", gap: 22, borderBottom: "1px solid #eee", paddingBottom: 12 }}>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  paddingBottom: 8,
                  color: activeTab === t ? "#d4a643" : "#6B7280",
                  borderBottom: activeTab === t ? "2px solid #d4a643" : "2px solid transparent",
                  fontWeight: activeTab === t ? 700 : 500,
                }}
              >
                {t}
              </button>
            ))}
          </nav>

          {/* Orders List */}
          <div style={{ marginTop: 18, maxHeight: "70vh", overflowY: "auto", paddingRight: 6 }}>
            {filtered.map((o) => (
              <div
                key={o.id}
                style={{
                  background: "#F4F7FA",
                  borderRadius: 12,
                  padding: 18,
                  display: "flex",
                  gap: 18,
                  marginBottom: 14,
                  alignItems: "center",
                }}
              >
                {/* Icon badge */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  {renderIconBadge(o.icon, 36)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#d4a643", fontWeight: 600, fontSize: 13 }}>
                    Sell <span style={{ color: "#6B7280", marginLeft: 8 }}>{o.platform}</span>
                  </div>

                  <div style={{ color: "#6B7280", marginTop: 6 }}>
                    Order number <span style={{ color: "#111", fontWeight: 600 }}>#{o.orderNumber}</span>
                  </div>

                  <h3 style={{ margin: "10px 0 4px", color: "#0A1A3A", fontSize: 16 }}>{o.title}</h3>
                  <p style={{ color: "#6B7280", fontSize: 14 }}>{o.desc}</p>

                  <div style={{ marginTop: 10, color: "#6B7280" }}>• {o.seller}</div>
                </div>

                {/* Right section */}
                <div style={{ textAlign: "right", width: 200 }}>
                  <div
                    style={{
                      padding: "6px 12px",
                      borderRadius: 50,
                      fontSize: 12,
                      display: "inline-block",
                      marginBottom: 10,
                      background:
                        o.status === "Completed"
                          ? "#ECFDF3"
                          : o.status === "Pending"
                          ? "#FFFBEB"
                          : "#FFF1F2",
                      color:
                        o.status === "Completed"
                          ? "#0F9D58"
                          : o.status === "Pending"
                          ? "#B45309"
                          : "#B91C1C",
                    }}
                  >
                    {o.status}
                  </div>

                  <div style={{ color: "#6B7280", marginBottom: 6 }}>{o.date}</div>

                  <div style={{ fontSize: 20, fontWeight: 700 }}>${o.price}</div>

                  <button
                    style={{
                      marginTop: 12,
                      background: "#d4a643",
                      color: "#fff",
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => alert(`Open trade chat for order ${o.orderNumber}`)}
                    aria-label="See Trade"
                  >
                    {/* use React.createElement to avoid TS2786 */}
                    {React.createElement(FaRegCommentDots as any, { color: "#fff", size: 14 })}
                    <span style={{ fontWeight: 600 }}>See Trade</span>
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ padding: 24, color: "#6B7280", textAlign: "center" }}>No orders found.</div>
            )}
          </div>
        </div>

        {/* Floating Add Button */}
        <button
          style={{
            position: "fixed",
            bottom: 30,
            right: 30,
            background: "linear-gradient(135deg,#FF6B6B 0%,#FFD166 100%)",
            width: 54,
            height: 54,
            borderRadius: "50%",
            border: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 28px rgba(16,24,40,0.16)",
            cursor: "pointer",
          }}
          aria-label="Add order"
          onClick={() => alert("Add new order (placeholder)")}
        >
          <div style={{ width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "#111827" }}>
            {React.createElement(FaPlus as any, { color: "#fff", size: 16 })}
          </div>
        </button>
      </div>
    </div>
  );
};

export default MyOrder;
