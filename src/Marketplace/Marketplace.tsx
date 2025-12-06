import React, { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import { FaWhatsapp, FaEnvelope, FaPlus, FaBullhorn, FaFacebookF, FaInstagram, FaTwitter, FaLock, FaShoppingCart } from "react-icons/fa";
import { SiNetflix, SiAmazon, SiSteam, SiGoogle } from "react-icons/si";

/**
 * Marketplace.tsx
 * - Many items added (colorful)
 * - Icon badge color derived from known brand/icon colors (ICON_COLOR_MAP)
 * - If brand color unknown, uses deterministic vibrant gradient
 */

interface Item {
  id: number;
  title: string;
  desc?: string;
  price: number;
  seller: string;
  delivery: string;
  icon: IconType | string;
  category: string;
  subcategory?: string;
}

const CATEGORY_MAP: Record<string, string[]> = {
  "Social Media": ["Instagram", "Facebook", "WhatsApp", "Twitter"],
  "Emails & Messaging Service": ["Gmail", "Outlook", "ProtonMail"],
  "Giftcards": ["Amazon", "Steam", "Google Play"],
  "VPN & PROXYs": ["PIA", "NordVPN", "ExpressVPN"],
  "Accounts & Subscriptions": ["Netflix", "Spotify", "Disney+"],
  "Websites": ["WordPress", "Shopify"],
  "E-commerce Platforms": ["Shopify", "WooCommerce"],
  "Gaming": ["Steam", "Epic Games"],
  "Others": ["Misc"],
};

type SubcatState = Record<string, string[]>;

const ICON_COLOR_MAP: Record<string, string> = {
  // react-icons displayName or component name guesses
  FaWhatsapp: "#25D366",
  SiNetflix: "#E50914",
  SiAmazon: "#FF9900",
  FaEnvelope: "#D44638", // Gmail-ish red
  FaFacebookF: "#1877F2",
  FaInstagram: "#E1306C",
  FaTwitter: "#1DA1F2",
  SiSteam: "#171A21",
  SiGoogle: "#4285F4",
  FaBullhorn: "#6B46C1",
  FaLock: "#0A1A3A",
  FaShoppingCart: "#FF6B6B",
  FaPlus: "#111827",
};

const gradientFromHex = (hex: string) => {
  // simple lighten: convert to rgb and mix with white
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.28); // 28% toward white
  const r2 = mix(r);
  const g2 = mix(g);
  const b2 = mix(b);
  const hex2 = (n: number) => n.toString(16).padStart(2, "0");
  return `linear-gradient(135deg, ${hex} 0%, #${hex2(r2)}${hex2(g2)}${hex2(b2)} 100%)`;
};

const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
  "linear-gradient(135deg,#FCCF31 0%,#F55555 100%)",
  "linear-gradient(135deg,#9BE15D 0%,#00E3AE 100%)",
];

type CategorySelectorProps = {
  categoryMap: Record<string, string[]>;
  selectedSubcats: SubcatState;
  setSelectedSubcats: React.Dispatch<React.SetStateAction<SubcatState>>;
};

const CategorySelector: React.FC<CategorySelectorProps> = ({ categoryMap, selectedSubcats, setSelectedSubcats }) => {
  const [openMain, setOpenMain] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpenMain({});
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMain({});
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const toggleMain = (main: string) => setOpenMain((p) => ({ ...p, [main]: !p[main] }));

  const toggleSubcat = (main: string, sub: string) => {
    setSelectedSubcats((prev) => {
      const prevArr = prev[main] ?? [];
      if (prevArr.includes(sub)) {
        const next = prevArr.filter((s) => s !== sub);
        if (next.length === 0) {
          const { [main]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [main]: next };
      }
      return { ...prev, [main]: [...prevArr, sub] };
    });
  };

  const clearAll = () => setSelectedSubcats({});

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-3">
        <div style={{ color: "#0A1A3A", fontSize: 14, fontWeight: 600 }}>Account Category</div>
        <button onClick={clearAll} style={{ color: "#0A1A3A", fontSize: 12 }}>
          Clear
        </button>
      </div>

      <div className="bg-white border rounded-lg p-2" style={{ borderColor: "#E5E7EB" }}>
        {Object.keys(categoryMap).map((main) => {
          const selectedForMain = selectedSubcats[main] ?? [];
          return (
            <div key={main} className="border-b last:border-b-0" style={{ borderColor: "#F3F4F6" }}>
              <button
                type="button"
                onClick={() => toggleMain(main)}
                className="w-full flex items-center justify-between px-3 py-2"
                aria-expanded={!!openMain[main]}
                style={{ color: "#111827", fontSize: 14 }}
              >
                <div className="flex items-center gap-3">
                  <div style={{ fontWeight: 600 }}>{main}</div>
                  {selectedForMain.length > 0 && (
                    <div style={{ backgroundColor: "#F8F9FA", color: "#6B7280", fontSize: 12 }} className="text-xs rounded px-2 py-0.5">
                      {selectedForMain.length} selected
                    </div>
                  )}
                </div>

                <svg className={`w-4 h-4 transform transition-transform ${openMain[main] ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>

              {openMain[main] && (
                <div className="px-3 pb-3 pt-1">
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {categoryMap[main].map((sub) => (
                      <label key={sub} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(selectedSubcats[main] ?? []).includes(sub)}
                          onChange={() => toggleSubcat(main, sub)}
                          className="w-4 h-4 rounded focus:ring"
                          style={{ accentColor: "#D4A643" }}
                        />
                        <div style={{ fontSize: 14, color: "#111827" }}>{sub}</div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Marketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcats, setSelectedSubcats] = useState<SubcatState>({});
  const [priceRange, setPriceRange] = useState(1000);
  const [showBanner, setShowBanner] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // many colorful items added
  const allItems: Item[] = [
    { id: 1, title: "USA GMAIL NUMBER", desc: "Valid +1 for gmail", price: 2.5, seller: "Senior man", delivery: "2 mins", icon: FaEnvelope, category: "Emails & Messaging Service", subcategory: "Gmail" },
    { id: 2, title: "Aged Gmail (14y)", desc: "Strong aged gmail", price: 4.0, seller: "MailKing", delivery: "1 min", icon: FaEnvelope, category: "Emails & Messaging Service", subcategory: "Gmail" },
    { id: 3, title: "USA WhatsApp number", desc: "One-time verification", price: 3.5, seller: "AS Digitals", delivery: "5 mins", icon: FaWhatsapp, category: "Social Media", subcategory: "WhatsApp" },
    { id: 4, title: "WhatsApp Business + API", desc: "Business ready", price: 15.0, seller: "BizTools", delivery: "Instant", icon: FaWhatsapp, category: "Social Media", subcategory: "WhatsApp" },
    { id: 5, title: "Instagram Active Account", desc: "High follower", price: 8.0, seller: "InstaPro", delivery: "Instant", icon: FaInstagram, category: "Social Media", subcategory: "Instagram" },
    { id: 6, title: "Facebook Page Admin", desc: "Admin access", price: 12.0, seller: "FBDeals", delivery: "Instant", icon: FaFacebookF, category: "Social Media", subcategory: "Facebook" },
    { id: 7, title: "Twitter Verified-ish (old)", desc: "Old active account", price: 20.0, seller: "TweetMart", delivery: "Instant", icon: FaTwitter, category: "Social Media", subcategory: "Twitter" },
    { id: 8, title: "Netflix Premium 4K", desc: "Family plan", price: 7.99, seller: "StreamZone", delivery: "Instant", icon: SiNetflix, category: "Accounts & Subscriptions", subcategory: "Netflix" },
    { id: 9, title: "$50 Amazon Gift Card US", desc: "Instant code", price: 46.5, seller: "GiftPro", delivery: "1 min", icon: SiAmazon, category: "Giftcards", subcategory: "Amazon" },
    { id: 10, title: "Steam Wallet $20", desc: "Region-free", price: 18.0, seller: "GameKeys", delivery: "Instant", icon: SiSteam, category: "Giftcards", subcategory: "Steam" },
    { id: 11, title: "Google Play $10", desc: "Instant code", price: 9.0, seller: "AppGifts", delivery: "Instant", icon: SiGoogle, category: "Giftcards", subcategory: "Google Play" },
    { id: 12, title: "Promoted: Boosted Listing", desc: "Promoted placement (ad)", price: 12.0, seller: "AdSeller", delivery: "Instant", icon: FaBullhorn, category: "Others", subcategory: "Misc" },
    { id: 13, title: "Secure VPN (Nord)", desc: "Fast VPN", price: 5.5, seller: "SafeNet", delivery: "Instant", icon: FaLock, category: "VPN & PROXYs", subcategory: "NordVPN" },
    { id: 14, title: "Shopify Store (starter)", desc: "Basic store + themes", price: 35.0, seller: "ShopBuilders", delivery: "2 days", icon: FaShoppingCart, category: "E-commerce Platforms", subcategory: "Shopify" },
  ];

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = q.length === 0 || item.title.toLowerCase().includes(q) || (item.desc?.toLowerCase().includes(q) ?? false);
      const matchesPrice = item.price <= priceRange;

      const mainFilters = Object.keys(selectedSubcats);
      if (mainFilters.length === 0) return matchesSearch && matchesPrice;
      if (!mainFilters.includes(item.category)) return false;

      const selectedSubsForMain = selectedSubcats[item.category] ?? [];
      if (selectedSubsForMain.length === 0) return matchesSearch && matchesPrice;
      return matchesSearch && matchesPrice && !!item.subcategory && selectedSubsForMain.includes(item.subcategory);
    });
  }, [searchQuery, selectedSubcats, priceRange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
  }, [drawerOpen]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!drawerOpen) return;
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setDrawerOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [drawerOpen]);

  const handlePurchase = (item: Item) => {
    alert(`Purchasing: ${item.title} — $${item.price.toFixed(2)}`);
  };

  // Determine icon "key" for ICON_COLOR_MAP
  const getIconKey = (icon: Item["icon"]) => {
    if (typeof icon === "string") return String(icon);
    // react-icons components usually have 'displayName' or 'name'
    const anyIcon = icon as any;
    return anyIcon.displayName || anyIcon.name || String(anyIcon);
  };

  // Moogo-style badge using icon brand color when available
  const renderIcon = (icon: Item["icon"], size = 36) => {
    const badgeSize = Math.max(40, size + 8);
    const key = getIconKey(icon);
    const brandHex = ICON_COLOR_MAP[key];
    const bg = brandHex ? gradientFromHex(brandHex) : vibrantGradients[String(icon).length % vibrantGradients.length];

    if (typeof icon === "string") {
      return (
        <div
          style={{
            width: badgeSize,
            height: badgeSize,
            minWidth: badgeSize,
            borderRadius: 999,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: bg,
            boxShadow: "0 8px 20px rgba(10,26,58,0.10)",
            transform: "translateZ(0)",
            transition: "transform .18s ease, box-shadow .18s ease",
            color: "#fff",
            fontWeight: 700,
            fontSize: Math.round(size * 0.6),
          }}
        >
          {icon}
        </div>
      );
    }

    const IconComponent = icon as React.ComponentType<any>;
    return (
      <div
        aria-hidden
        style={{
          width: badgeSize,
          height: badgeSize,
          minWidth: badgeSize,
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          boxShadow: "0 8px 20px rgba(10,26,58,0.10)",
          transform: "translateZ(0)",
          transition: "transform .18s ease, box-shadow .18s ease",
          cursor: "default",
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(-4px) scale(1.02)";
          el.style.boxShadow = "0 12px 30px rgba(10,26,58,0.16)";
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "0 8px 20px rgba(10,26,58,0.10)";
        }}
      >
        <IconComponent size={Math.round(size * 0.65)} style={{ color: "#fff", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.15))" }} />
      </div>
    );
  };

  return (
    <>
      {showBanner && (
        <div className="px-4 py-3 flex items-center justify-between text-sm font-medium" style={{ backgroundColor: "#D4A643", borderLeft: "4px solid #0A1A3A", color: "#111111" }}>
          <div className="flex items-center gap-2">
            <span style={{ fontWeight: 700 }}>🔥</span>
            <span style={{ fontSize: 14 }}>Black Friday is live on AcctBazaar! Every price you’re seeing right now is a special Black Friday discount.</span>
          </div>
          <button onClick={() => setShowBanner(false)} aria-label="Close banner" style={{ color: "#111111", fontSize: 20, fontWeight: 700 }}>×</button>
        </div>
      )}

      <div className="min-h-screen" style={{ background: "#F7F5F4" }}>
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-md lg:hidden bg-white border border-gray-200" aria-label="Open filters">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div>
                <h1 style={{ color: "#0A1A3A", fontSize: 28, margin: 0, fontWeight: 700 }}>Marketplace</h1>
                <div style={{ color: "#6B7280", fontSize: 13 }}>Access all products on the marketplace by our verified sellers</div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode("list")} className={`px-4 py-2 ${viewMode === "list" ? "text-white" : "bg-white"} transition`} style={viewMode === "list" ? { backgroundColor: "#0A1A3A" } : undefined}>List</button>
                <button onClick={() => setViewMode("grid")} className={`px-4 py-2 ${viewMode === "grid" ? "text-white" : "bg-white"} transition`} style={viewMode === "grid" ? { backgroundColor: "#0A1A3A" } : undefined}>Grid</button>
              </div>

              <input
                type="text"
                placeholder="Search by name or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none"
                style={{ boxShadow: "none", fontSize: 14 }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,26,58,0.12)")}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-md bg-white border border-gray-200" aria-label="Open filters and search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-6" style={{ fontSize: 18 }}>Filter</h3>

                <CategorySelector categoryMap={CATEGORY_MAP} selectedSubcats={selectedSubcats} setSelectedSubcats={setSelectedSubcats} />

                <div className="mt-6" style={{ color: "#0A1A3A", fontSize: 14, fontWeight: 600 }}>Price range</div>
                <input type="range" min={0} max={1000} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full h-2 rounded-lg mt-2" style={{ backgroundColor: "#EDE7DA", accentColor: "#D4A643" }} />
                <div className="flex justify-between text-xs" style={{ color: "#6B7280", marginTop: 8 }}><span>$0</span><span>${priceRange}</span></div>
              </div>
            </aside>

            <main className="lg:col-span-9">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-4 py-4 border-b flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-3">
                      <div style={{ color: "#6B7280", fontSize: 14 }}>View:</div>
                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button onClick={() => setViewMode("list")} className={`px-3 py-1 ${viewMode === "list" ? "text-white" : "bg-white"} transition`} style={viewMode === "list" ? { backgroundColor: "#0A1A3A" } : undefined}>List</button>
                        <button onClick={() => setViewMode("grid")} className={`px-3 py-1 ${viewMode === "grid" ? "text-white" : "bg-white"} transition`} style={viewMode === "grid" ? { backgroundColor: "#0A1A3A" } : undefined}>Grid</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 px-4 sm:px-0">
                    <div className="sm:hidden">
                      <input type="text" placeholder="Search marketplace..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" style={{ boxShadow: "none", fontSize: 14 }} onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,26,58,0.12)")} onBlur={(e) => (e.currentTarget.style.boxShadow = "none")} />
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm" style={{ color: "#6B7280" }}>{filteredItems.length} results</div>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-3">
                    <div className="text-sm" style={{ color: "#6B7280" }}>{filteredItems.length} results</div>
                  </div>
                </div>

                {/* LIST VIEW */}
                {viewMode === "list" && (
                  <div className="divide-y">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition">
                        <div style={{ lineHeight: 1, minWidth: 56 }}>{renderIcon(item.icon, 36)}</div>

                        <div className="flex-1">
                          <h3 style={{ color: "#0A1A3A", fontSize: 16, fontWeight: 600, margin: 0 }}>{item.title}</h3>
                          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 6 }}>{item.desc || "High-quality account • Instant delivery • Full warranty"}</p>

                          <div className="flex items-center gap-3 mt-3" style={{ color: "#6B7280", fontSize: 13 }}>
                            <span className="flex items-center gap-2"><span style={{ width: 8, height: 8, background: "#9CA3AF", borderRadius: 999 }}></span>{item.seller}</span>
                            <span>•</span>
                            <span style={{ color: "#1BC47D", fontSize: 13 }}>{item.delivery}</span>
                            {item.subcategory && <span className="ml-2 text-xs rounded px-2 py-0.5" style={{ backgroundColor: "#F8F9FA", color: "#6B7280", fontSize: 12 }}>{item.subcategory}</span>}
                          </div>

                          <div className="mt-3 text-xs p-2 bg-gray-50 rounded" style={{ color: "#6B7280", fontSize: 13 }}>Buyer note: Check seller rating & delivery time before purchase.</div>
                        </div>

                        <div style={{ textAlign: "right", minWidth: 160 }}>
                          <div style={{ color: "#0A1A3A", fontSize: 18, fontWeight: 700 }}>${item.price.toFixed(2)}</div>
                          <div className="mt-3 flex gap-3 justify-end">
                            <button className="font-medium" style={{ color: "#D4A643", fontSize: 14 }}>Add to cart</button>
                            <button className="font-medium" onClick={() => handlePurchase(item)} style={{ color: "#0A1A3A", border: "1px solid #E5E7EB", padding: "6px 10px", borderRadius: 8, fontSize: 14 }}>Purchase</button>
                            <button className="text-gray-500" style={{ fontSize: 14 }}>View</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredItems.length === 0 && <div className="p-6 text-center" style={{ color: "#6B7280", fontSize: 14 }}>No items found.</div>}
                  </div>
                )}

                {/* GRID VIEW */}
                {viewMode === "grid" && (
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-xl transition-shadow">
                        <div className="text-center mb-3" style={{ lineHeight: 1 }}>{renderIcon(item.icon, 48)}</div>
                        <h3 style={{ color: "#0A1A3A", fontSize: 16, fontWeight: 600 }}>{item.title}</h3>
                        <p style={{ color: "#6B7280", fontSize: 14, marginTop: 6 }}>{item.desc || "Premium account • Instant delivery"}</p>
                        <div className="mt-3 text-sm" style={{ color: "#6B7280", fontSize: 13 }}>
                          <div>{item.seller}</div>
                          <div style={{ color: "#1BC47D" }}>{item.delivery}</div>
                          {item.subcategory && <div className="text-xs mt-1 rounded px-2 py-0.5" style={{ backgroundColor: "#F8F9FA", color: "#6B7280", fontSize: 12 }}>{item.subcategory}</div>}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div style={{ color: "#0A1A3A", fontSize: 18, fontWeight: 700 }}>${item.price.toFixed(2)}</div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: "#D4A643", color: "#111111", fontSize: 14 }} onClick={() => handlePurchase(item)} onMouseEnter={(e) => (e.currentTarget.style.background = "#1BC47D")} onMouseLeave={(e) => (e.currentTarget.style.background = "#D4A643")}>Buy Now</button>
                            <button className="px-3 py-1 rounded-lg border font-medium" style={{ borderColor: "#E5E7EB", color: "#0A1A3A", fontSize: 14 }} onClick={() => alert(`Purchase: ${item.title}`)}>Purchase</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredItems.length === 0 && <div className="col-span-full p-6 text-center" style={{ color: "#6B7280", fontSize: 14 }}>No items found.</div>}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Drawer backdrop */}
      <div className={`fixed inset-0 z-40 transition-opacity ${drawerOpen ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"}`} style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={() => setDrawerOpen(false)} aria-hidden={!drawerOpen} />

      {/* Mobile drawer */}
      <aside ref={drawerRef} className={`fixed top-0 left-0 z-50 h-full w-80 max-w-full bg-white shadow-xl transform transition-transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`} role="dialog" aria-modal="true" aria-hidden={!drawerOpen}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 style={{ color: "#0A1A3A", fontSize: 18 }}>Filters & Search</h3>
          <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-md" aria-label="Close filters" style={{ color: "#6B7280" }}>×</button>
        </div>

        <div className="p-4 overflow-auto h-full">
          <div className="mb-4">
            <input type="text" placeholder="Search by name or description" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" style={{ fontSize: 14 }} onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,26,58,0.12)")} onBlur={(e) => (e.currentTarget.style.boxShadow = "none")} />
          </div>

          <div className="mb-4">
            <CategorySelector categoryMap={CATEGORY_MAP} selectedSubcats={selectedSubcats} setSelectedSubcats={setSelectedSubcats} />
          </div>

          <div className="mb-6">
            <div style={{ color: "#0A1A3A", fontSize: 14, fontWeight: 600 }}>Price range</div>
            <input type="range" min={0} max={1000} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full h-2 rounded-lg mt-2" style={{ backgroundColor: "#EDE7DA", accentColor: "#D4A643" }} />
            <div className="flex justify-between text-xs" style={{ color: "#6B7280", marginTop: 8 }}><span>$0</span><span>${priceRange}</span></div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setDrawerOpen(false)} className="flex-1 px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: "#D4A643", color: "#111111" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#1BC47D")} onMouseLeave={(e) => (e.currentTarget.style.background = "#D4A643")}>Apply</button>
            <button onClick={() => { setSelectedSubcats({}); setPriceRange(1000); setSearchQuery(""); }} className="flex-1 border px-4 py-2 rounded-lg" style={{ borderColor: "#E5E7EB", color: "#111111" }}>Reset</button>
          </div>

          <div className="h-24" />
        </div>
      </aside>

      {/* Floating add button */}
      <button style={{
        position: "fixed",
        right: 28,
        bottom: 28,
        width: 56,
        height: 56,
        borderRadius: 999,
        background: "linear-gradient(135deg,#FF6B6B 0%,#FFD166 100%)",
        color: "#fff",
        border: "none",
        boxShadow: "0 10px 28px rgba(16,24,40,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60
      }} aria-label="Add">
        {renderIcon(FaPlus, 18)}
      </button>
    </>
  );
};

export default Marketplace;
