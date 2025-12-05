// src/components/MyOrder/MyOrder.tsx
import React, { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPlus,
  FaRegCommentDots,
} from "react-icons/fa";

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
  // ---------------- Completed ----------------
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

  // ---------------- Pending ----------------
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

  // ---------------- Cancelled ----------------
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

// tabs
const tabs = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof tabs)[number];

const renderIcon = (Icon: IconType, size = 28) => {
  const C = Icon as React.ComponentType<any>;
  return <C size={size} aria-hidden />;
};

const MyOrder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filtered = useMemo(() => {
    if (activeTab === "All") return MOCK_ORDERS;
    return MOCK_ORDERS.filter((o) => o.status === activeTab);
  }, [activeTab]);

  return (
    <div style={{ background: "#F3EFEE", minHeight: "100vh", padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 30, margin: 0, color: "#0A1A3A" }}>Orders</h1>
        <div style={{ color: "#6B7280", marginBottom: 16 }}>
          All orders placed on your platform
        </div>

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
                  color: activeTab === t ? "#FF6B2D" : "#6B7280",
                  borderBottom: activeTab === t ? "2px solid #FF6B2D" : "2px solid transparent",
                }}
              >
                {t}
              </button>
            ))}
          </nav>

          {/* Orders */}
          <div style={{ marginTop: 18, maxHeight: "70vh", overflowY: "auto" }}>
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
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 66,
                    height: 66,
                    borderRadius: 12,
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  {renderIcon(o.icon, 40)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#FF6B2D", fontWeight: 600, fontSize: 13 }}>
                    Sell <span style={{ color: "#6B7280", marginLeft: 8 }}>{o.platform}</span>
                  </div>

                  <div style={{ color: "#6B7280", marginTop: 6 }}>
                    Order number{" "}
                    <span style={{ color: "#111", fontWeight: 600 }}>#{o.orderNumber}</span>
                  </div>

                  <h3 style={{ margin: "10px 0 4px", color: "#0A1A3A", fontSize: 16 }}>
                    {o.title}
                  </h3>
                  <p style={{ color: "#6B7280", fontSize: 14 }}>{o.desc}</p>

                  <div style={{ marginTop: 10, color: "#6B7280" }}>
                    • {o.seller}
                  </div>
                </div>

                {/* Right Section */}
                <div style={{ textAlign: "right", width: 180 }}>
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
                      background: "#FF6B2D",
                      color: "#fff",
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    {renderIcon(FaRegCommentDots, 14)} See Trade
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Add Button */}
        <button
          style={{
            position: "fixed",
            bottom: 30,
            right: 30,
            background: "#FF6B2D",
            width: 54,
            height: 54,
            borderRadius: "50%",
            border: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderIcon(FaPlus, 22)}
        </button>
      </div>
    </div>
  );
};

export default MyOrder;
