// src/components/Mypurchase/MyPurchase.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaPlus,
  FaTimes,
  FaStar,
} from "react-icons/fa";

const Icon = FaPlus as React.ElementType;
const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
const FaStarIcon = FaStar as unknown as React.ComponentType<any>;

/* Color Maps */
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

const renderBadge = (IconComp: IconType, size = 30) => {
  const badgeSize = size + 10;
  const brandHex = ICON_COLOR_MAP.get(IconComp);
  const bg =
    brandHex ??
    vibrantGradients[
      String(IconComp).length % vibrantGradients.length
    ];

  const C = IconComp as React.ComponentType<any>;
  return (
    <div
      style={{
        width: badgeSize,
        height: badgeSize,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 8px 20px rgba(16,24,40,0.12)",
      }}
    >
      <C size={Math.round(size * 0.7)} style={{ color: "#fff" }} />
    </div>
  );
};

/* Stars */
const Stars: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStarIcon
        key={i}
        className={`w-3 h-3 ${
          i < value ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

/* Types */
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

/* Mock Data */
const MOCK_PURCHASES: Purchase[] = [
  {
    id: "p1",
    platform: "instagram",
    title: "USA GMAIL NUMBER",
    desc: "Valid +1 US number attached Gmail with full access & recovery email.",
    seller: "Senior man",
    price: 2.5,
    date: "2 mins",
    status: "Cancelled",
  },
  {
    id: "p2",
    platform: "instagram",
    title: "Aged Gmail (14y)",
    desc: "14-year-old strong Gmail, perfect for ads & socials.",
    seller: "MailKing",
    price: 4.0,
    date: "1 min",
    status: "Completed",
  },
  {
    id: "p3",
    platform: "whatsapp",
    title: "USA WhatsApp number",
    desc: "One-time verification number, works worldwide.",
    seller: "AS Digitals",
    price: 3.5,
    date: "5 mins",
    status: "Completed",
  },
  {
    id: "p4",
    platform: "whatsapp",
    title: "WhatsApp Business + API",
    desc: "Ready for business messaging & automation.",
    seller: "BizTools",
    price: 15.0,
    date: "Instant",
    status: "Pending",
  },
];

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

function PlatformIcon({ platform, size = 30 }: { platform: Purchase["platform"]; size?: number }) {
  if (platform === "instagram") return renderBadge(FaInstagram, size);
  if (platform === "facebook") return renderBadge(FaFacebookF, size);
  if (platform === "twitter") return renderBadge(FaTwitter, size);
  if (platform === "whatsapp") return renderBadge(FaWhatsapp, size);
  return <div className="w-10 h-10 bg-gray-200 rounded-full" />;
}

const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const filtered = useMemo(() => {
    if (activeTab === "All") return MOCK_PURCHASES;
    return MOCK_PURCHASES.filter((p) => p.status === activeTab);
  }, [activeTab]);

  const addToCart = (item: Purchase) => setCartCount((c) => c + 1);
  const buyNow = (item: Purchase) => alert(`Buying ${item.title}`);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20">
        <div className="max-w-screen-xl mx-auto px-4">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0A1A3A]">My Purchase</h1>
              <p className="text-sm text-gray-500">All purchased items appear here</p>
            </div>

            <Link to="/cart" className="relative">
              <div className="p-3 bg-white border rounded-lg shadow-sm">🛒</div>
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </div>
              )}
            </Link>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="px-6 pt-6 border-b">
              <nav className="flex gap-6">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`pb-2 text-sm font-medium border-b-2 ${
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

            {/* Compact Card List */}
            <div className="p-4 space-y-3">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-lg p-3 border hover:shadow-sm transition flex items-center gap-3"
                  style={{ minHeight: 60 }}
                >
                  <PlatformIcon platform={p.platform} size={30} />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#0A1A3A] truncate">
                      {p.title}
                    </h3>

                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {p.desc}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-gray-500">
                        {p.seller}
                      </span>

                      <span
                        className={`px-2 py-[1px] rounded-full text-[10px] border font-medium ${
                          p.status === "Completed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : p.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1 ml-2">
                    <div className="text-[13px] font-bold text-[#0A1A3A]">
                      ${p.price.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-gray-400">{p.date}</div>

                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={() => setSelected(p)}
                        className="px-2 py-1 border rounded text-[10px]"
                      >
                        View
                      </button>
                      <button
                        onClick={() => addToCart(p)}
                        className="px-2 py-1 bg-[#33ac6f] text-white rounded text-[10px]"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal (same as marketplace) */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelected(null)} />

          <div className="fixed inset-x-0 bottom-0 sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-xl z-50 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">{selected.title}</h2>
              <button onClick={() => setSelected(null)}>
                <FaTimesIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-center">
                <PlatformIcon platform={selected.platform} size={70} />
              </div>

              <div className="text-3xl font-bold text-[#0A1A3A] mt-4">
                ${selected.price.toFixed(2)}
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-sm text-gray-600">{selected.desc}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Seller</p>
                    <p className="font-medium">{selected.seller}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Delivery</p>
                    <p className="font-medium text-green-600">{selected.date}</p>
                  </div>
                </div>

                <div className="border p-3 rounded-lg bg-[#FBFFFB]">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Buyer Protection</p>
                      <p className="text-xs text-gray-600">
                        Secure checkout & refund covered
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-green-600">
                      Verified
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2">
                      <Stars value={4} />
                      <span className="text-xs text-gray-600">
                        4.0 (120 reviews)
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Warranty: 7 days
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    buyNow(selected);
                    setSelected(null);
                  }}
                  className="w-full py-3 bg-[#33ac6f] text-white rounded-xl font-bold text-lg"
                >
                  Buy Now
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(selected);
                      setSelected(null);
                    }}
                    className="flex-1 py-2 border rounded"
                  >
                    Add to cart
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 py-2 border rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Link
        to="/add-product"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] text-white rounded-full shadow-xl flex items-center justify-center text-2xl"
      >
        +
      </Link>
    </>
  );
};

export default MyPurchase;
