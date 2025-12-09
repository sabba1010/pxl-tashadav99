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
  FaEnvelope,
  FaDownload,
} from "react-icons/fa";

/* ---------------------------------------------
   Icon casts for TSX
---------------------------------------------- */
const FaPlusIcon = FaPlus as unknown as React.ComponentType<any>;
const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
const FaStarIcon = FaStar as unknown as React.ComponentType<any>;
const FaEnvelopeIcon = FaEnvelope as unknown as React.ComponentType<any>;
const FaDownloadIcon = FaDownload as unknown as React.ComponentType<any>;

/* ---------------------------------------------
   Brand Color Maps & Gradients
---------------------------------------------- */
const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaInstagram, "#E1306C"],
  [FaFacebookF, "#1877F2"],
  [FaTwitter, "#1DA1F2"],
  [FaWhatsapp, "#25D366"],
  [FaPlus, "#111827"],
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

/* ---------------------------------------------
   Render circular badge
---------------------------------------------- */
const renderBadge = (IconComp: IconType, size = 36) => {
  const brandHex = ICON_COLOR_MAP.get(IconComp);
  const bg =
    brandHex ?? vibrantGradients[String(IconComp).length % vibrantGradients.length];

  const C = IconComp as unknown as React.ComponentType<any>;

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: 12,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        boxShadow: "0 10px 20px rgba(16,24,40,0.08)",
      }}
    >
      <C size={Math.round(size * 0.65)} style={{ color: "#fff" }} />
    </div>
  );
};

/* ---------------------------------------------
   Stars
---------------------------------------------- */
const Stars: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStarIcon key={i} className={`w-3 h-3 ${i < value ? "text-yellow-400" : "text-gray-300"}`} />
    ))}
  </div>
);

/* ---------------------------------------------
   Types
---------------------------------------------- */
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
  purchaseNumber?: string;
  trackingId?: string | null;
  supportEmail?: string | null;
}

/* ---------------------------------------------
   Mock purchases (with extra fields)
---------------------------------------------- */
const MOCK_PURCHASES: Purchase[] = [
  {
    id: "p1",
    platform: "instagram",
    title: "USA GMAIL NUMBER",
    desc: "Valid +1 US number attached Gmail with full access & recovery email.",
    seller: "Senior man",
    price: 2.5,
    date: "Dec 5, 2025 02:12",
    status: "Cancelled",
    purchaseNumber: "PUR-0001",
    trackingId: null,
    supportEmail: "senior@example.com",
  },
  {
    id: "p2",
    platform: "instagram",
    title: "Aged Gmail (14y)",
    desc: "14-year-old strong Gmail, perfect for ads & socials.",
    seller: "MailKing",
    price: 4.0,
    date: "Dec 4, 2025 13:01",
    status: "Completed",
    purchaseNumber: "PUR-0002",
    trackingId: "TRACK-GM-002",
    supportEmail: "mailking@example.com",
  },
  {
    id: "p3",
    platform: "whatsapp",
    title: "USA WhatsApp number",
    desc: "One-time verification number, works worldwide.",
    seller: "AS Digitals",
    price: 3.5,
    date: "Dec 3, 2025 09:21",
    status: "Completed",
    purchaseNumber: "PUR-0003",
    trackingId: null,
    supportEmail: "asdigitals@example.com",
  },
  {
    id: "p4",
    platform: "whatsapp",
    title: "WhatsApp Business + API",
    desc: "Ready for business messaging & automation.",
    seller: "BizTools",
    price: 15.0,
    date: "Dec 2, 2025 18:00",
    status: "Pending",
    purchaseNumber: "PUR-0004",
    trackingId: null,
    supportEmail: "biztools@example.com",
  },
];

const TABS = ["All", "Pending", "Completed", "Cancelled"] as const;
type Tab = (typeof TABS)[number];

/* ---------------------------------------------
   Platform icon helper
---------------------------------------------- */
function PlatformIcon({ platform, size = 36 }: { platform: Purchase["platform"]; size?: number }) {
  if (platform === "instagram") return renderBadge(FaInstagram, size);
  if (platform === "facebook") return renderBadge(FaFacebookF, size);
  if (platform === "twitter") return renderBadge(FaTwitter, size);
  if (platform === "whatsapp") return renderBadge(FaWhatsapp, size);
  return null;
}

/* ---------------------------------------------
   Helper actions (mock)
---------------------------------------------- */
const contactSeller = (email?: string, purchaseNumber?: string) => {
  const to = email ?? "support@example.com";
  const subject = encodeURIComponent(`Order enquiry: ${purchaseNumber ?? "unknown"}`);
  const body = encodeURIComponent(`Hi, I have a question about my order ${purchaseNumber}.\n\nRegards,`);
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
};

const downloadInvoice = (id: string) => {
  // placeholder — replace with real invoice URL or PDF generator
  window.open(`/orders/${id}/invoice`, "_blank");
};

/* ---------------------------------------------
   MyPurchase component (cards like MyOrder; modal = ORDER style)
---------------------------------------------- */
const MyPurchase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [selected, setSelected] = useState<Purchase | null>(null);

  const filtered = useMemo(() => {
    if (activeTab === "All") return MOCK_PURCHASES;
    return MOCK_PURCHASES.filter((p) => p.status === activeTab);
  }, [activeTab]);

  return (
    <>
      <div className="min-h-screen bg-[#F3EFEE] pt-16 pb-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#0A1A3A]">My Purchase</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">All purchased items appear here</p>
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

            {/* Purchases list — styled like MyOrder cards */}
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {filtered.length === 0 ? (
                  <div className="py-12 sm:py-20 flex flex-col items-center text-center text-gray-500">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#0A1A3A] flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 sm:w-14 sm:h-14 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7H11.5a.5.5 0 01-.5-.5v-3a.5.5 0 00-.5-.5h-1a.5.5 0 00-.5.5v3a.5.5 0 01-.5.5H5.638a4.006 4.006 0 00-3.7 3.7c-.092 1.209-.138 2.43-.138 3.662 0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7H8.5a.5.5 0 01.5.5v3a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-3a.5.5 0 01.5-.5h4.162a4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z" />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#0A1A3A] mb-2">No Purchases</h3>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md">You haven't purchased anything yet. Explore the marketplace!</p>
                    <Link to="/marketplace" className="mt-4 sm:mt-6 bg-[#33ac6f] text-[#111111] px-5 py-2 rounded-full font-medium hover:bg-[#2aa46a] transition">
                      Browse Marketplace
                    </Link>
                  </div>
                ) : (
                  filtered.map((p) => (
                    <article
                      key={p.id}
                      className="bg-[#F8FAFB] rounded-xl p-3 sm:p-4 flex items-start gap-3 border border-gray-100 hover:shadow-md transition-shadow"
                      role="article"
                      style={{ minHeight: 74 }}
                    >
                      {/* left icon */}
                      <div className="flex-shrink-0 mt-1">
                        {renderBadge(
                          p.platform === "instagram" ? FaInstagram :
                          p.platform === "facebook" ? FaFacebookF :
                          p.platform === "twitter" ? FaTwitter :
                          FaWhatsapp,
                          36
                        )}
                      </div>

                      {/* middle */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#0A1A3A] truncate">{p.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1 sm:line-clamp-2">{p.desc}</p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                            {p.platform}
                          </span>
                        </div>

                        <div className="mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                            p.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" :
                            p.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-red-50 text-red-700 border-red-200"
                          }`}>
                            {p.status}
                          </span>
                        </div>
                      </div>

                      {/* right: price, date, view */}
                      <div className="flex-shrink-0 w-24 text-right flex flex-col items-end gap-2">
                        <div className="text-sm font-medium text-[#0A1A3A]">${p.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-400">{p.date}</div>

                        <div className="mt-1">
                          <button
                            onClick={() => setSelected(p)}
                            className="px-3 py-1 border rounded text-xs bg-white"
                          >
                            View
                          </button>
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

      {/* ---------------------------
          Centered non-fullscreen ORDER-style modal
          (shows same details as MyOrder)
         --------------------------- */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelected(null)} />

          <div className="fixed inset-x-0 left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-4">
                  <PlatformIcon platform={selected.platform} size={48} />
                  <div>
                    <h2 className="text-xl font-bold text-[#0A1A3A]">{selected.title}</h2>
                    <div className="text-xs text-gray-500 mt-0.5">{selected.seller} • {selected.date}</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-md hover:bg-gray-100">
                  <FaTimesIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-700 leading-relaxed">{selected.desc}</p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Status</p>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${selected.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" : selected.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200"}`}>{selected.status}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-500">Price</p>
                    <div className="text-3xl font-bold text-[#0A1A3A] mt-1">${selected.price.toFixed(2)}</div>
                  </div>
                </div>

                {/* extra order fields like Order #, Tracking, Support */}
                <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Purchase Number</p>
                    <p className="font-medium">{selected.purchaseNumber ?? "—"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Tracking ID</p>
                    <p className="font-medium">{selected.trackingId ?? "Not available"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Support Email</p>
                    <p className="font-medium">{selected.supportEmail ?? "support@example.com"}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Platform</p>
                    <p className="font-medium">{selected.platform}</p>
                  </div>
                </div>

                {/* Seller Protection block */}
                <div className="mt-4 border p-3 rounded-md bg-[#FBFFFB]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Seller Protection</div>
                      <div className="text-xs text-gray-600">Seller-backed guarantee — contact seller for support & refund policy</div>
                    </div>
                    <div className="text-xs font-semibold text-green-600">Verified</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Stars value={4} />
                      <div className="text-xs text-gray-600">4.0 (120 reviews)</div>
                    </div>
                    <div className="text-xs text-gray-500">Warranty: 7 days</div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-600">If you face any issue with this purchase, contact the seller or download the invoice.</p>
                  </div>
                </div>

                {/* Actions: Contact seller + Download invoice + Close */}
                <div className="mt-6 grid grid-cols-1 gap-3">
                  <div className="flex gap-2">
                  <button
  onClick={() => contactSeller(selected.supportEmail ?? undefined, selected.purchaseNumber ?? undefined)}
  className="flex-1 py-2 border rounded flex items-center justify-center gap-2"
>
  <FaEnvelopeIcon /> Contact seller
</button>


                    <button
                      onClick={() => downloadInvoice(selected.id)}
                      className="flex-1 py-2 border rounded flex items-center justify-center gap-2"
                    >
                      <FaDownloadIcon /> Download invoice
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setSelected(null)} className="flex-1 py-2 border rounded">Close</button>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">Note: This is a mock detail panel — connect APIs to perform real actions.</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Floating Add product */}
      <Link
        to="/add-product"
        className="hidden sm:flex sm:fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] hover:bg-[#c4963a] text-white rounded-full shadow-2xl items-center justify-center text-2xl"
      >
        <FaPlusIcon />
      </Link>
    </>
  );
};

export default MyPurchase;
