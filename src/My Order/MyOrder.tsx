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

/* ---------------------------------------------
    Brand Color Map
---------------------------------------------- */
const ICON_COLOR_MAP: Record<string, string> = {
  FaInstagram: "#E1306C",
  FaFacebookF: "#1877F2",
  FaTwitter: "#1DA1F2",
  FaEnvelope: "#D44638",
  FaLock: "#0A1A3A",
  FaRegCommentDots: "#6B46C1",
  FaPlus: "#111827",
};

/* ---------------------------------------------
    Gradient Generator (same as marketplace)
---------------------------------------------- */
const gradientFromHex = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.28);

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `linear-gradient(135deg, ${hex} 0%, #${toHex(mix(r))}${toHex(
    mix(g)
  )}${toHex(mix(b))} 100%)`;
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
    Marketplace-style round icon badge
---------------------------------------------- */
const getIconKey = (C: IconType) => {
  const anyI = C as any;
  return anyI.displayName || anyI.name || "UnknownIcon";
};

const renderBadge = (Icon: IconType, size = 36) => {
  const badgeSize = Math.max(50, size + 10);
  const key = getIconKey(Icon);
  const hex = ICON_COLOR_MAP[key];
  const bg = hex
    ? gradientFromHex(hex)
    : vibrantGradients[key.length % vibrantGradients.length];

  const C = Icon as React.ComponentType<any>;

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
        boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
        transition: "all .2s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-4px) scale(1.04)";
        el.style.boxShadow = "0 12px 28px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 8px 22px rgba(0,0,0,0.12)";
      }}
    >
      <C
        size={Math.round(size * 0.75)}
        style={{
          color: "#fff",
          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))",
        }}
      />
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
    date: "Friday, December 5th, 1:50 AM",
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
    date: "Thursday, December 4th, 7:53 PM",
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
    date: "Thursday, December 4th, 7:21 PM",
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
    date: "Today, 2:10 PM",
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
    date: "Today, 10:30 AM",
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
    () =>
      activeTab === "All"
        ? MOCK_ORDERS
        : MOCK_ORDERS.filter((o) => o.status === activeTab),
    [activeTab]
  );

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div style={{ background: "#F3EFEE", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 30, margin: 0, color: "#0A1A3A" }}>Orders</h1>
        <div style={{ color: "#6B7280", marginBottom: 16 }}>
          All orders placed on your platform
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 20 }}>
          {/* Tabs */}
          <nav
            style={{
              display: "flex",
              gap: 22,
              borderBottom: "1px solid #eee",
              paddingBottom: 12,
            }}
          >
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  paddingBottom: 8,
                  fontWeight: activeTab === t ? 700 : 500,
                  color: activeTab === t ? "#D4A643" : "#6B7280",
                  borderBottom:
                    activeTab === t
                      ? "2px solid #D4A643"
                      : "2px solid transparent",
                }}
              >
                {t}
              </button>
            ))}
          </nav>

          {/* Orders */}
          <div
            style={{
              marginTop: 18,
              maxHeight: "70vh",
              overflowY: "auto",
              paddingRight: 6,
            }}
          >
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
                {/* icon (marketplace style) */}
                <div style={{ minWidth: 64 }}>{renderBadge(o.icon, 36)}</div>

                {/* content */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: "#D4A643",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    Sell{" "}
                    <span style={{ color: "#6B7280", marginLeft: 8 }}>
                      {o.platform}
                    </span>
                  </div>

                  <div style={{ color: "#6B7280", marginTop: 6 }}>
                    Order number{" "}
                    <span style={{ color: "#111", fontWeight: 600 }}>
                      #{o.orderNumber}
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: "10px 0 4px",
                      color: "#0A1A3A",
                      fontSize: 16,
                    }}
                  >
                    {o.title}
                  </h3>

                  <p style={{ color: "#6B7280", fontSize: 14 }}>{o.desc}</p>

                  <div style={{ marginTop: 10, color: "#6B7280" }}>
                    • {o.seller}
                  </div>
                </div>

                {/* right section */}
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

                  <div style={{ color: "#6B7280", marginBottom: 6 }}>
                    {o.date}
                  </div>

                  <div style={{ fontSize: 20, fontWeight: 700 }}>
                    ${o.price}
                  </div>

                  <button
                    style={{
                      marginTop: 12,
                      background: "#D4A643",
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
                  >
                    {React.createElement(FaRegCommentDots as any, {
                      color: "#fff",
                      size: 14,
                    })}
                    <span style={{ fontWeight: 600 }}>See Trade</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating button */}
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
            boxShadow: "0 10px 28px rgba(0,0,0,0.16)",
            cursor: "pointer",
          }}
        >
          {React.createElement(FaPlus as any, { size: 20, color: "#fff" })}
        </button>
      </div>
    </div>
  );
};

export default MyOrder;
