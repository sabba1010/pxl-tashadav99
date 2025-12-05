// src/Mypurchase/Mypurchase.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import { FaInstagram, FaFacebookF, FaTwitter, FaWhatsapp } from "react-icons/fa";

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

/** Render a react-icon safely in TSX by casting to a component */
const renderIcon = (Icon: IconType, size = 24, style?: React.CSSProperties) => {
  const C = Icon as React.ComponentType<any>;
  return <C size={size} style={style} aria-hidden />;
};

function PlatformIcon({ platform }: { platform: Purchase["platform"] }) {
  const size = 44;
  if (platform === "instagram") return renderIcon(FaInstagram, size, { color: "#E1306C" });
  if (platform === "facebook") return renderIcon(FaFacebookF, size, { color: "#1877F2" });
  if (platform === "twitter") return renderIcon(FaTwitter, size, { color: "#111827" });
  if (platform === "whatsapp") return renderIcon(FaWhatsapp, size, { color: "#25D366" });
  return <div style={{ width: size, height: size, borderRadius: 10, background: "#eee" }} />;
}

const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const purchases = MOCK_PURCHASES;

  const filtered = useMemo(() => {
    if (activeTab === "All") return purchases;
    return purchases.filter((p) => p.status === activeTab);
  }, [activeTab, purchases]);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-20 pb-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1A3A]">My Purchase</h1>
              <p className="text-sm text-gray-600 mt-1">All of your product Purchase shows here</p>
            </div>

            <Link
              to="/report"
              className="mt-6 bg-[#FF6B2D] text-white px-6 py-2 rounded-full font-medium hover:opacity-95 transition-shadow shadow"
            >
              Report Product
            </Link>
          </div>

          {/* Gold warning */}
         

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="px-6 pt-6">
              <nav className="flex gap-6 border-b border-gray-100 pb-4">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`pb-2 text-sm ${activeTab === t ? "text-[#FF6B2D] border-b-2 border-[#FF6B2D]" : "text-gray-500"}`}
                  >
                    {t}
                  </button>
                ))}
              </nav>
            </div>

            {/* List */}
            <div className="p-6">
              <div className="max-h-[62vh] overflow-y-auto pr-4">
                {filtered.length === 0 ? (
                  <div className="py-20 flex flex-col items-center text-center text-gray-500">
                    <div className="w-28 h-28 rounded-full bg-[#0A1A3A] flex items-center justify-center mb-4">
                      <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7H11.5a.5.5 0 01-.5-.5v-3a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v3a.5.5 0 01-.5.5H5.638a4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662 0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7H8.5a.5.5 0 01.5.5v3a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-3a.5.5 0 01.5-.5h4.162a4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-[#0A1A3A] mb-2">No Purchases</h3>
                    <p className="text-gray-500 max-w-md">You haven't purchased anything yet. Explore the marketplace and grab amazing deals!</p>
                    <Link to="/marketplace" className="mt-6 bg-[#D4A643] text-[#111111] px-6 py-2 rounded-full font-medium hover:bg-[#1BC47D] transition">
                      Browse Marketplace
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filtered.map((p) => (
                      <div key={p.id} className="bg-[#F8FAFB] rounded-lg p-6 flex items-start gap-6 border border-[rgba(0,0,0,0.03)]">
                        {/* left icon */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center shadow-sm">
                            <PlatformIcon platform={p.platform} />
                          </div>
                        </div>

                        {/* middle content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-[#0A1A3A]">{p.title}</h3>
                              <p className="text-sm text-gray-500 mt-2">{p.desc}</p>

                              <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                                <span className="inline-block w-2 h-2 bg-gray-300 rounded-full" />
                                <span>{p.seller}</span>
                              </div>
                            </div>

                            <div className="w-44 text-right flex flex-col items-end gap-3">
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

                              <div className="text-xs text-gray-600">{p.date}</div>

                              <div className="text-xl font-bold text-[#0A1A3A]">${p.price}</div>

                              <div className="flex items-center gap-2 mt-2">
                                <button className="px-3 py-1 rounded-md bg-[#FF6B2D] text-white text-sm">See Trade</button>
                                <button className="p-2 rounded-md bg-white border border-gray-100 shadow-sm" title="Chat">
                                  <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating + button (mobile-only is optional via lg:hidden) */}
      <Link
        to="/add-product"
        className="fixed bottom-6 right-6 bg-[#FF6B2D] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-3xl font-light hover:opacity-95 transition z-40 lg:hidden"
      >
        +
      </Link>
    </>
  );
};

export default MyPurchase;
