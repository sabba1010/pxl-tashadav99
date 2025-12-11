import React, { useEffect, useMemo, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaWhatsapp,
  FaEnvelope,
  FaPlus,
  FaBullhorn,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLock,
  FaShoppingCart,
  FaTimes,
  FaSearch,
  FaStar,
} from "react-icons/fa";
import { SiNetflix, SiAmazon, SiSteam, SiGoogle } from "react-icons/si";
import { Link } from "react-router-dom";
import { sendNotification } from "../Notification/Notification"; // <-- adjust path if needed

/* ---- Workaround for react-icons + TS JSX typing issues ---- */
const FaTimesIcon = FaTimes as unknown as React.ComponentType<any>;
const FaPlusIcon = FaPlus as unknown as React.ComponentType<any>;
const FaSearchIcon = FaSearch as unknown as React.ComponentType<any>;
const FaShoppingCartIcon = FaShoppingCart as unknown as React.ComponentType<any>;
const FaStarIcon = FaStar as unknown as React.ComponentType<any>;

/* ----------------- Types & Constants ----------------- */
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
  Giftcards: ["Amazon", "Steam", "Google Play"],
  "VPN & PROXYs": ["PIA", "NordVPN", "ExpressVPN"],
  "Accounts & Subscriptions": ["Netflix", "Spotify", "Disney+"],
  Websites: ["WordPress", "Shopify"],
  "E-commerce Platforms": ["Shopify", "WooCommerce"],
  Gaming: ["Steam", "Epic Games"],
  Others: ["Misc"],
};

const ICON_COLOR_MAP = new Map<IconType, string>([
  [FaWhatsapp, "#25D366"],
  [SiNetflix, "#E50914"],
  [SiAmazon, "#FF9900"],
  [FaEnvelope, "#D44638"],
  [FaFacebookF, "#1877F2"],
  [FaInstagram, "#E1306C"],
  [FaTwitter, "#1DA1F2"],
  [SiSteam, "#171A21"],
  [SiGoogle, "#4285F4"],
  [FaBullhorn, "#6B46C1"],
  [FaLock, "#0A1A3A"],
  [FaShoppingCart, "#FF6B6B"],
  [FaPlus, "#111827"],
]);

const STRING_ICON_COLOR_MAP: Record<string, string> = {
  whatsapp: "#25D366",
  netflix: "#E50914",
  amazon: "#FF9900",
  envelope: "#D44638",
  facebook: "#1877F2",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  steam: "#171A21",
  google: "#4285F4",
  bullhorn: "#6B46C1",
  lock: "#0A1A3A",
  shoppingcart: "#FF6B6B",
};

const gradientFromHex = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * 0.28);
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

/* --- Sample data: ALL_ITEMS (use your real data if needed) --- */
const ALL_ITEMS: Item[] = [
  { id: 1, title: "USA GMAIL NUMBER", desc: "Valid +1 US number attached Gmail with full access & recovery email.", price: 2.5, seller: "Senior man", delivery: "2 mins", icon: FaEnvelope, category: "Emails & Messaging Service", subcategory: "Gmail" },
  { id: 2, title: "Aged Gmail (14y)", desc: "14-year-old strong Gmail, perfect for ads & socials.", price: 4.0, seller: "MailKing", delivery: "1 min", icon: FaEnvelope, category: "Emails & Messaging Service", subcategory: "Gmail" },
  { id: 3, title: "USA WhatsApp number", desc: "One-time verification number, works worldwide.", price: 3.5, seller: "AS Digitals", delivery: "5 mins", icon: FaWhatsapp, category: "Social Media", subcategory: "WhatsApp" },
  { id: 4, title: "WhatsApp Business + API", desc: "Ready for business messaging & automation.", price: 15.0, seller: "BizTools", delivery: "Instant", icon: FaWhatsapp, category: "Social Media", subcategory: "WhatsApp" },
  { id: 5, title: "Instagram Active Account", desc: "10K+ followers, high engagement.", price: 8.0, seller: "InstaPro", delivery: "Instant", icon: FaInstagram, category: "Social Media", subcategory: "Instagram" },
  { id: 6, title: "Facebook Page Admin", desc: "Full admin access with BM.", price: 12.0, seller: "FBDeals", delivery: "Instant", icon: FaFacebookF, category: "Social Media", subcategory: "Facebook" },
  { id: 7, title: "Twitter Verified-ish (old)", desc: "Legacy blue tick account.", price: 20.0, seller: "TweetMart", delivery: "Instant", icon: FaTwitter, category: "Social Media", subcategory: "Twitter" },
  { id: 8, title: "Netflix Premium 4K", desc: "Family plan, 4 screens, 1 year warranty.", price: 7.99, seller: "StreamZone", delivery: "Instant", icon: SiNetflix, category: "Accounts & Subscriptions", subcategory: "Netflix" },
  { id: 9, title: "$50 Amazon Gift Card US", desc: "Instant redeem code.", price: 46.5, seller: "GiftPro", delivery: "1 min", icon: SiAmazon, category: "Giftcards", subcategory: "Amazon" },
  { id: 10, title: "Steam Wallet $20", desc: "Region-free code.", price: 18.0, seller: "GameKeys", delivery: "Instant", icon: SiSteam, category: "Giftcards", subcategory: "Steam" },
  { id: 11, title: "Google Play $10", desc: "Instant code.", price: 9.0, seller: "AppGifts", delivery: "Instant", icon: SiGoogle, category: "Giftcards", subcategory: "Google Play" },
  { id: 12, title: "Promoted: Boosted Listing", desc: "Top placement for 7 days.", price: 12.0, seller: "AdSeller", delivery: "Instant", icon: FaBullhorn, category: "Others", subcategory: "Misc" },
  { id: 13, title: "Secure VPN (Nord)", desc: "1 year subscription.", price: 5.5, seller: "SafeNet", delivery: "Instant", icon: FaLock, category: "VPN & PROXYs", subcategory: "NordVPN" },
  { id: 14, title: "Shopify Store (starter)", desc: "Pre-built store + premium theme.", price: 35.0, seller: "ShopBuilders", delivery: "2 days", icon: FaShoppingCart, category: "E-commerce Platforms", subcategory: "Shopify" },
];

const hashCode = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  return h;
};

/* ----------------- CategorySelector (full implementation) ----------------- */
type SubcatState = Record<string, string[]>;

const CategorySelector: React.FC<{
  categoryMap: Record<string, string[]>;
  selectedSubcats: SubcatState;
  setSelectedSubcats: React.Dispatch<React.SetStateAction<SubcatState>>;
}> = ({ categoryMap, selectedSubcats, setSelectedSubcats }) => {
  const [openMain, setOpenMain] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpenMain({});
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpenMain({});
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
        <div className="text-sm font-semibold text-[#0A1A3A]">Account Category</div>
        <button onClick={clearAll} className="text-xs text-[#0A1A3A]">Clear</button>
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
              >
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-[#111827]">{main}</div>
                  {selectedForMain.length > 0 && (
                    <div className="text-xs rounded px-2 py-0.5 bg-[#F8F9FA] text-[#6B7280]">
                      {selectedForMain.length} selected
                    </div>
                  )}
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${openMain[main] ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 010-1.08z"
                    clipRule="evenodd"
                  />
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
                        <div className="text-sm text-[#111827]">{sub}</div>
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

/* ----------------- Marketplace component (full) ----------------- */
const Marketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcats, setSelectedSubcats] = useState<SubcatState>({});
  const [priceRange, setPriceRange] = useState(1000);
  const [showBanner, setShowBanner] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  /* NEW: pagination + cart state + processing state */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // changeable
  const [cartCount, setCartCount] = useState(0);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const drawerRef = useRef<HTMLDivElement | null>(null);

  const filteredItems = useMemo<Item[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_ITEMS.filter((item) => {
      const matchesSearch =
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        (item.desc?.toLowerCase().includes(q) ?? false);
      const matchesPrice = item.price <= priceRange;
      const mainFilters = Object.keys(selectedSubcats);
      if (mainFilters.length === 0) return matchesSearch && matchesPrice;
      if (!mainFilters.includes(item.category)) return false;
      const selectedSubs = selectedSubcats[item.category] ?? [];
      if (selectedSubs.length === 0) return matchesSearch && matchesPrice;
      return (
        matchesSearch &&
        matchesPrice &&
        !!item.subcategory &&
        selectedSubs.includes(item.subcategory)
      );
    });
  }, [searchQuery, selectedSubcats, priceRange]);

  useEffect(() => setCurrentPage(1), [searchQuery, selectedSubcats, priceRange, viewMode]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems: Item[] = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen || !!selectedItem || mobileSearchOpen ? "hidden" : "";
  }, [drawerOpen, selectedItem, mobileSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setSelectedItem(null);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getBrandHex = (icon: Item["icon"]) => {
    if (typeof icon === "string") {
      const key = icon.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      return (STRING_ICON_COLOR_MAP as any)[key];
    }
    return ICON_COLOR_MAP.get(icon as IconType);
  };

  const renderIcon = (icon: Item["icon"], size = 36) => {
    const badgeSize = Math.max(40, size + 8);
    const brandHex = getBrandHex(icon);
    const bg = brandHex
      ? gradientFromHex(brandHex)
      : vibrantGradients[Math.abs(hashCode(String(icon))) % vibrantGradients.length];

    if (typeof icon === "string") {
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
            boxShadow: "0 8px 20px rgba(10,26,58,0.10)",
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
        style={{
          width: badgeSize,
          height: badgeSize,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          boxShadow: "0 8px 20px rgba(10,26,58,0.10)",
        }}
      >
        <IconComponent size={Math.round(size * 0.65)} style={{ color: "#fff", fill: "#fff" }} />
      </div>
    );
  };

  function hashCode(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h;
  }

  /* small Stars component (demo) */
  const Stars: React.FC<{ value: number }> = ({ value }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStarIcon key={i} className={`w-3 h-3 ${i < value ? "text-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  );

  const addToCart = (item: Item | null) => {
    if (!item) return;
    setCartCount((c) => c + 1);
    // replace with real cart logic
  };

  // ---------- Updated buyNow: automatic flow with processing state ----------
  const buyNow = async (item: Item | null) => {
    if (!item) return;
    if (processingIds.includes(item.id)) return; // already processing
    setProcessingIds((p) => [...p, item.id]);

    try {
      // OPTIONAL: create order on backend if available
      let orderResult: any = null;
      try {
        const resp = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}` // add if you use auth
          },
          body: JSON.stringify({
            itemId: item.id,
            price: item.price,
            qty: 1,
          }),
        });
        if (resp.ok) {
          orderResult = await resp.json();
        } else {
          console.warn("Order API non-OK:", resp.status);
        }
      } catch (err) {
        console.warn("Order API call failed (ignored):", err);
      }

      // Send notification (your function)
      try {
        await sendNotification({
          type: "buy",
          title: `Purchase: ${item.title}`,
          message: `You bought ${item.title} for $${item.price.toFixed(2)}.`,
          data: { itemId: item.id, price: item.price, order: orderResult },
        });
      } catch (err) {
        console.warn("sendNotification failed:", err);
      }

      // IMPORTANT: Do NOT change cartCount here. buyNow should not increment cart.
      // setCartCount((c) => c + 1); // <- removed

      setSelectedItem(null); // close modal if open

      // Production: replace alert with toast
      alert("Purchase successful — notification sent!");
    } catch (err: any) {
      console.error("Buy failed", err);
      alert("Failed to process purchase: " + (err?.message || String(err)));
    } finally {
      setProcessingIds((p) => p.filter((id) => id !== item.id));
    }
  };

  const viewItem = (item: Item) => {
    setSelectedItem(item);
  };

  return (
    <>
      {showBanner && (
        <div className="px-4 py-3 flex items-center justify-between text-sm font-medium" style={{ backgroundColor: "#33ac6f", color: "#fff" }}>
          <div className="flex items-center gap-2">
            <span>Black Friday is live! All prices discounted.</span>
          </div>
          <button onClick={() => setShowBanner(false)}>×</button>
        </div>
      )}

      <div className="min-h-screen" style={{ background: "#F7F5F4" }}>
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-md lg:hidden bg-white border shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1A3A]">Marketplace</h1>
                <p className="text-xs lg:text-sm text-[#6B7280]">Verified sellers • Instant delivery</p>
              </div>
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex border rounded-lg overflow-hidden">
                <button onClick={() => setViewMode("list")} className={`px-4 py-2 ${viewMode === "list" ? "bg-[#0A1A3A] text-white" : "bg-white"}`}>List</button>
                <button onClick={() => setViewMode("grid")} className={`px-4 py-2 ${viewMode === "grid" ? "bg-[#0A1A3A] text-white" : "bg-white"}`}>Grid</button>
              </div>
              <input
                type="text"
                placeholder="Search accounts, giftcards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border rounded-lg w-64"
              />
            </div>

            {/* Mobile Search Icon + Cart */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="md:hidden p-3 bg-white border rounded-lg shadow-sm"
              >
                <FaSearchIcon className="w-5 h-5" />
              </button>

              <Link to="/cart" className="relative">
                <div className="p-3 bg-white border rounded-lg shadow-sm">
                  <FaShoppingCartIcon className="w-5 h-5" />
                </div>
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </div>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          {mobileSearchOpen && (
            <>
              <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileSearchOpen(false)} />
              <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-lg">
                <div className="flex items-center gap-3 p-4 border-b">
                  <FaSearchIcon className="w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 outline-none text-lg"
                    autoFocus
                  />
                  <button onClick={() => setMobileSearchOpen(false)}>
                    <FaTimesIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 self-start">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold mb-6">Filter</h3>
                  <CategorySelector categoryMap={CATEGORY_MAP} selectedSubcats={selectedSubcats} setSelectedSubcats={setSelectedSubcats} />
                  <div className="mt-6">
                    <div className="text-sm font-semibold text-[#0A1A3A]">Price range</div>
                    <input type="range" min={0} max={1000} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full" style={{ accentColor: "#33ac6f" }} />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$0</span>
                      <span>${priceRange}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-9">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="px-4 py-4 border-b flex items-center justify-between">
                  <div className="text-sm text-gray-600">{filteredItems.length} results</div>
                  <div className="hidden sm:flex gap-2">
                    <button onClick={() => setViewMode("list")} className={`px-3 py-1 rounded ${viewMode === "list" ? "bg-[#0A1A3A] text-white" : ""}`}>List</button>
                    <button onClick={() => setViewMode("grid")} className={`px-3 py-1 rounded ${viewMode === "grid" ? "bg-[#0A1A3A] text-white" : ""}`}>Grid</button>
                  </div>
                </div>

                {/* Mobile simple cards (compact) */}
                <div className="block sm:hidden divide-y">
                  {paginatedItems.map((item: Item) => (
                    <div key={item.id} className="w-full text-left p-3 hover:bg-gray-50 active:bg-gray-100 transition flex gap-3 items-start">
                      <div className="flex-shrink-0">{renderIcon(item.icon, 40)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-semibold text-sm text-[#0A1A3A]">{item.title}</h3>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.desc || "Premium account • Instant delivery"}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-base font-bold text-[#0A1A3A]">${item.price.toFixed(2)}</div>
                            <div className="text-[10px] text-gray-500">{item.delivery}</div>
                          </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button onClick={() => addToCart(item)} className="flex-1 py-2 text-sm border rounded-md">Add to cart</button>
                          <button onClick={() => viewItem(item)} className="py-2 px-3 text-sm border rounded-md">View</button>
                          <button
                            onClick={() => buyNow(item)}
                            className="py-2 px-3 text-sm bg-[#33ac6f] text-white rounded-md"
                            disabled={processingIds.includes(item.id)}
                          >
                            {processingIds.includes(item.id) ? "Processing..." : "Buy"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop list */}
                {viewMode === "list" && (
                  <div className="hidden sm:block divide-y">
                    {paginatedItems.map((item: Item) => (
                      <div key={item.id} className="w-full p-4 flex gap-4 hover:bg-gray-50 text-left transition items-center">
                        <div>{renderIcon(item.icon, 44)}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-[#0A1A3A]">{item.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                          <div className="text-xs text-gray-500 mt-2">{item.seller} • {item.delivery}</div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-3">
                          <div className="text-lg font-bold text-[#0A1A3A]">${item.price.toFixed(2)}</div>
                          <div className="flex gap-2">
                            <button onClick={() => addToCart(item)} className="px-3 py-1 text-sm border rounded">Add to cart</button>
                            <button onClick={() => viewItem(item)} className="px-3 py-1 text-sm border rounded">View</button>
                            <button
                              onClick={() => buyNow(item)}
                              className="px-3 py-1 text-sm bg-[#33ac6f] text-white rounded"
                              disabled={processingIds.includes(item.id)}
                            >
                              {processingIds.includes(item.id) ? "Processing..." : "Buy Now"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Desktop grid */}
                {viewMode === "grid" && (
                  <div className="hidden sm:p-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedItems.map((item: Item) => (
                      <div key={item.id} className="border rounded-lg p-4 text-center hover:shadow-lg transition bg-white flex flex-col">
                        <div className="flex justify-center">{renderIcon(item.icon, 56)}</div>
                        <h3 className="mt-3 font-medium text-sm text-[#0A1A3A]">{item.title}</h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.desc}</p>
                        <div className="mt-3 text-lg font-bold text-[#0A1A3A]">${item.price.toFixed(2)}</div>
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => addToCart(item)} className="flex-1 py-2 text-sm border rounded">Cart</button>
                          <button onClick={() => viewItem(item)} className="py-2 px-3 text-sm border rounded">View</button>
                          <button
                            onClick={() => buyNow(item)}
                            className="py-2 px-3 text-sm bg-[#33ac6f] text-white rounded"
                            disabled={processingIds.includes(item.id)}
                          >
                            {processingIds.includes(item.id) ? "Processing..." : "Buy"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination controls */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">Page {currentPage} of {totalPages}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-1 border rounded text-sm">First</button>
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="px-2 py-1 border rounded text-sm">Prev</button>

                  {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                    const start = Math.max(1, Math.min(currentPage - 2, Math.max(1, totalPages - 4)));
                    const pageNum = start + idx;
                    if (pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border rounded text-sm ${pageNum === currentPage ? "bg-[#0A1A3A] text-white" : "bg-white"}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="px-2 py-1 border rounded text-sm">Next</button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded text-sm">Last</button>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Item Detail Modal with Buyer Protection */}
        {selectedItem && (
          <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelectedItem(null)} />
            <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:w-full bg-white rounded-t-3xl sm:rounded-3xl z-50 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full" />
              <div className="sticky top-0 bg-white border-b sm:border-b-0 px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#0A1A3A]">{selectedItem.title}</h2>
                <button onClick={() => setSelectedItem(null)}>
                  <FaTimesIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-center">{renderIcon(selectedItem.icon, 72)}</div>
                <div className="mt-4 text-3xl font-bold text-[#0A1A3A]">${selectedItem.price.toFixed(2)}</div>

                <div className="mt-6 text-left space-y-4 text-sm">
                  <div>
                    <p className="font-medium">Description</p>
                    <p className="text-gray-600">{selectedItem.desc || "High-quality account with warranty."}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Seller</p>
                      <p className="font-medium">{selectedItem.seller}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivery</p>
                      <p className="font-medium text-green-600">{selectedItem.delivery}</p>
                    </div>
                  </div>

                  {selectedItem.subcategory && (
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="font-medium">{selectedItem.subcategory}</p>
                    </div>
                  )}

                  {/* Buyer Protection block */}
                  <div className="border p-3 rounded-md bg-[#FBFFFB]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Buyer Protection</div>
                        <div className="text-xs text-gray-600">Protected purchase — secure transaction & refund policy</div>
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
                      <p className="text-xs text-gray-600">Note: Check the buyer description & rating before purchase. Fraud protection available when you pay through our checkout.</p>
                    </div>
                  </div>

                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <button
                    onClick={() => buyNow(selectedItem)}
                    className="w-full py-3 bg-[#33ac6f] text-white rounded-xl font-bold text-lg"
                    disabled={processingIds.includes(selectedItem.id)}
                  >
                    {processingIds.includes(selectedItem.id) ? "Processing..." : "Buy Now"}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => addToCart(selectedItem)} className="flex-1 py-2 border rounded">Add to cart</button>
                    <button onClick={() => setSelectedItem(null)} className="flex-1 py-2 border rounded">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile Filter Drawer */}
        {drawerOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setDrawerOpen(false)} />}
        <aside
          ref={drawerRef}
          className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-6 h-full overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Filter</h3>
              <button onClick={() => setDrawerOpen(false)}>
                <FaTimesIcon className="w-5 h-5" />
              </button>
            </div>
            <CategorySelector categoryMap={CATEGORY_MAP} selectedSubcats={selectedSubcats} setSelectedSubcats={setSelectedSubcats} />
            <div className="mt-6">
              <div className="text-sm font-semibold text-[#0A1A3A]">Price range</div>
              <input type="range" min={0} max={1000} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full" style={{ accentColor: "#33ac6f" }} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>${priceRange}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Floating + Button */}
        <Link
          to="/add-product"
          className="hidden sm:flex sm:fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] hover:bg-[#c4963a] text-white rounded-full shadow-2xl items-center justify-center z-50 transition-all"
          aria-label="Add product"
        >
          <FaPlusIcon />
        </Link>
      </div>
    </>
  );
};

export default Marketplace;
