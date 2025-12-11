// src/components/Marketplace/Marketplace.tsx
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
  FaEye,
  FaLinkedinIn,
  FaYoutube,
  FaSnapchatGhost,
  FaTelegramPlane,
  FaDiscord,
  FaPinterest,
  FaRedditAlien,
  FaPaypal,
  FaShoppingBag,
} from "react-icons/fa";
import { SiNetflix, SiAmazon, SiSteam, SiGoogle, SiTiktok } from "react-icons/si";
import { Link } from "react-router-dom";
import { sendNotification } from "../Notification/Notification"; // adjust path if needed

/* small typing helper for react-icons components */
type AnyIconComponent = React.ComponentType<any>;

/* icons typing workaround for some direct usages */
const FaTimesIcon = FaTimes as unknown as AnyIconComponent;
const FaPlusIcon = FaPlus as unknown as AnyIconComponent;
const FaSearchIcon = FaSearch as unknown as AnyIconComponent;
const FaShoppingCartIcon = FaShoppingCart as unknown as AnyIconComponent;
const FaStarIcon = FaStar as unknown as AnyIconComponent;
const FaEyeIcon = FaEye as unknown as AnyIconComponent;

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
  realTime?: boolean;
  platform?: string;
}

const CATEGORY_MAP: Record<string, string[]> = {
  "Social Media": ["Instagram", "Facebook", "TikTok", "Snapchat", "Twitter / X", "YouTube", "WhatsApp", "Telegram", "Discord", "Reddit", "Pinterest", "LinkedIn"],
  "Digital Services & Boosting": ["Instagram Boost", "TikTok Boost", "YouTube Boost", "Twitter Boost", "Facebook Boost", "App Reviews"],
  "eSIM & Mobile Services": ["eSIM (US)", "eSIM (EU)", "Roaming eSIM", "Temporary SMS", "Disposable Numbers"],
  "Streaming & Entertainment": ["Netflix", "Spotify", "Apple Music", "Hulu", "Amazon Prime", "Disney+", "HBO Max"],
  "Gaming Accounts": ["PlayStation", "Xbox", "Steam", "Fortnite", "PUBG", "Roblox"],
  "Finance / Business Tools": ["PayPal", "Stripe", "CashApp", "Wise", "Business Email"],
  "Productivity & Software": ["Office 365", "Canva Pro", "Adobe CC", "Notion", "Grammarly"],
  "Dating & Chatting": ["Tinder", "Bumble", "Tantan", "WeChat", "Azar", "InternationalCupid"],
  "Giftcards & Misc": ["Amazon", "Steam", "Google Play", "VPN", "Virtual Cards", "Crypto Wallets"],
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
  [FaLinkedinIn, "#0A66C2"],
  [FaYoutube, "#FF0000"],
  [FaSnapchatGhost, "#FFFC00"],
  [SiTiktok, "#010101"],
  [FaTelegramPlane, "#2AABEE"],
  [FaDiscord, "#7289DA"],
  [FaPinterest, "#E60023"],
  [FaRedditAlien, "#FF4500"],
  [FaPaypal, "#003087"],
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
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  snapchat: "#FFFC00",
  tiktok: "#010101",
  telegram: "#2AABEE",
  discord: "#7289DA",
  pinterest: "#E60023",
  reddit: "#FF4500",
  paypal: "#003087",
  esim: "#00A3E0",
  "virtual-card": "#4B5563",
  vpn: "#0F172A",
};

/* gradients fallback */
const vibrantGradients = [
  "linear-gradient(135deg,#FF9A9E 0%,#FAD0C4 100%)",
  "linear-gradient(135deg,#A18CD1 0%,#FBC2EB 100%)",
  "linear-gradient(135deg,#FDCB6E 0%,#FF6B6B 100%)",
  "linear-gradient(135deg,#84fab0 0%,#8fd3f4 100%)",
  "linear-gradient(135deg,#FCCF31 0%,#F55555 100%)",
  "linear-gradient(135deg,#9BE15D 0%,#00E3AE 100%)",
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
  const hex2 = (n: number) => n.toString(16).padStart(2, "0");
  return `linear-gradient(135deg, ${hex} 0%, #${hex2(r2)}${hex2(g2)}${hex2(b2)} 100%)`;
};

const hashCode = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  return h;
};

/* ----------------- Sample items ----------------- */
const ALL_ITEMS: Item[] = [
  { id: 101, title: "Instagram 10K Active", desc: "10K followers — high engagement, niche accounts available.", price: 12.0, seller: "InstaPro", delivery: "Instant", icon: FaInstagram, category: "Social Media", subcategory: "Instagram", platform: "instagram", realTime: true },
  { id: 102, title: "Facebook Page Admin", desc: "Full admin access + BM when available.", price: 18.0, seller: "FBDeals", delivery: "Instant", icon: FaFacebookF, category: "Social Media", subcategory: "Facebook", platform: "facebook" },
  { id: 103, title: "TikTok 5K Followers", desc: "Organic-seeming followers + engagement service.", price: 9.0, seller: "TokBoost", delivery: "Instant", icon: SiTiktok, category: "Social Media", subcategory: "TikTok", platform: "tiktok" },
  { id: 104, title: "YouTube Channel Starter", desc: "100 subscribers + basic branding", price: 15.0, seller: "StreamZone", delivery: "Instant", icon: FaYoutube, category: "Social Media", subcategory: "YouTube", platform: "youtube" },
  { id: 105, title: "Snapchat Account (aged)", desc: "Aged & active Snapchat account.", price: 6.0, seller: "SnapDeals", delivery: "Instant", icon: FaSnapchatGhost, category: "Social Media", subcategory: "Snapchat", platform: "snapchat" },
  { id: 106, title: "WhatsApp Business Number (US)", desc: "Number ready for WhatsApp + API set up guidance.", price: 7.5, seller: "AS Digitals", delivery: "5 mins", icon: FaWhatsapp, category: "Social Media", subcategory: "WhatsApp", platform: "whatsapp" },
  { id: 107, title: "Telegram Bulk Accounts", desc: "Multiple verified Telegram accounts", price: 4.0, seller: "TeleSellers", delivery: "Instant", icon: FaTelegramPlane, category: "Social Media", subcategory: "Telegram", platform: "telegram" },
  { id: 108, title: "Discord Server + Mods", desc: "Active server with 1K members + moderation", price: 20.0, seller: "DiscordPro", delivery: "2 days", icon: FaDiscord, category: "Social Media", subcategory: "Discord", platform: "discord" },
  { id: 109, title: "Reddit Aged Account", desc: "Account with karma & history", price: 5.0, seller: "RedditWorks", delivery: "Instant", icon: FaRedditAlien, category: "Social Media", subcategory: "Reddit", platform: "reddit" },
  { id: 110, title: "Pinterest Business Account", desc: "Business verified account", price: 6.5, seller: "PinPro", delivery: "Instant", icon: FaPinterest, category: "Social Media", subcategory: "Pinterest", platform: "pinterest" },
  { id: 111, title: "LinkedIn Premium Profile", desc: "Premium+ connections", price: 12.0, seller: "LinkPros", delivery: "Instant", icon: FaLinkedinIn, category: "Social Media", subcategory: "LinkedIn", platform: "linkedin" },
  { id: 201, title: "Netflix Account (Family)", desc: "4-screen family plan, working", price: 8.0, seller: "StreamDeals", delivery: "Instant", icon: SiNetflix, category: "Streaming & Entertainment", subcategory: "Netflix", platform: "netflix" },
  { id: 202, title: "Amazon Giftcard $50", desc: "Redeemable in US store", price: 42.0, seller: "GiftCardsRUs", delivery: "Instant", icon: SiAmazon, category: "Giftcards & Misc", subcategory: "Amazon", platform: "amazon" },
  { id: 203, title: "Steam Wallet $20", desc: "Region-free wallet code", price: 18.0, seller: "SteamCodes", delivery: "Instant", icon: SiSteam, category: "Giftcards & Misc", subcategory: "Steam", platform: "steam" },
  { id: 301, title: "PayPal Verified (age)", desc: "Verified PayPal account with email", price: 25.0, seller: "PayPros", delivery: "Instant", icon: FaPaypal, category: "Finance / Business Tools", subcategory: "PayPal", platform: "paypal" },
  { id: 401, title: "USA GMAIL NUMBER", desc: "Valid +1 US number attached Gmail with full access & recovery email.", price: 2.5, seller: "Senior man", delivery: "2 mins", icon: FaEnvelope, category: "Social Media", subcategory: "Gmail" },
  { id: 402, title: "Shopify Store (starter)", desc: "Pre-built store + premium theme.", price: 35.0, seller: "ShopBuilders", delivery: "2 days", icon: FaShoppingCart, category: "E-commerce Platforms", subcategory: "Shopify" },
];

/* ----------------- Small helper components ----------------- */
const Stars: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStarIcon key={i} className={`w-3 h-3 ${i < value ? "text-yellow-400" : "text-gray-300"}`} />
    ))}
  </div>
);

/* ----------------- CategorySelector (TS-safe, real icons) ----------------- */

type SubcatState = Record<string, string[]>;

const SUBICON_MAP: Record<string, IconType | string> = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  "Twitter / X": FaTwitter,
  TikTok: SiTiktok,
  Snapchat: FaSnapchatGhost,
  LinkedIn: FaLinkedinIn,
  Pinterest: FaPinterest,
  YouTube: FaYoutube,
  WhatsApp: FaWhatsapp,
  Telegram: FaTelegramPlane,
  Discord: FaDiscord,
  Reddit: FaRedditAlien,
  Gmail: FaEnvelope,
  Tinder: "T",
  "eSIM (US)": "eSIM",
  "Disposable Numbers": "☎",
  Netflix: SiNetflix,
  Amazon: SiAmazon,
  Steam: SiSteam,
  PayPal: FaPaypal,
  VPN: "VPN",
  Shopify: FaShoppingCart,
  Others: FaBullhorn,
};

const useInjectScrollbarStyles = () => {
  useEffect(() => {
    const id = "marketplace-filter-scrollbar-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
      .mp-filter-scroll::-webkit-scrollbar { width: 8px; }
      .mp-filter-scroll::-webkit-scrollbar-track { background: #F3F4F6; border-radius: 8px; }
      .mp-filter-scroll::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#FF8A50,#FF5C2A); border-radius: 8px; }
      .mp-filter-scroll { scrollbar-width: thin; scrollbar-color: #FF5C2A #F3F4F6; }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);
};

const renderSubIcon = (sub: string) => {
  const Icon = SUBICON_MAP[sub];
  const size = 18;

  if (!Icon) {
    return (
      <div className="flex items-center justify-center rounded-full w-7 h-7 text-xs font-semibold bg-gray-100 text-gray-600">
        {sub.charAt(0)}
      </div>
    );
  }

  if (typeof Icon === "string") {
    return (
      <div className="flex items-center justify-center rounded-full w-7 h-7 text-xs font-semibold bg-gray-100 text-gray-700">
        {Icon}
      </div>
    );
  }

  const brandHex = ICON_COLOR_MAP.get(Icon as IconType) || (() => {
    try {
      const name = (Icon as any).displayName || (Icon as any).name || "";
      const key = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      return (STRING_ICON_COLOR_MAP as any)[key];
    } catch {
      return undefined;
    }
  })();

  const iconColor = brandHex ?? "#111827";
  const bgColor = "#ffffff";

  return (
    <div
      className="rounded-full w-7 h-7 flex items-center justify-center shadow-sm"
      style={{ background: bgColor }}
      title={sub}
    >
      {React.createElement(Icon as AnyIconComponent, {
        size,
        style: { color: iconColor },
      })}
    </div>
  );
};

const CategorySelector: React.FC<{
  categoryMap: Record<string, string[]>;
  selectedSubcats: SubcatState;
  setSelectedSubcats: React.Dispatch<React.SetStateAction<SubcatState>>;
}> = ({ categoryMap, selectedSubcats, setSelectedSubcats }) => {
  const [openMain, setOpenMain] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement | null>(null);
  useInjectScrollbarStyles();

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

  const toggleMain = (main: string) =>
    setOpenMain((p) => ({ ...p, [main]: !p[main] }));

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

      <div className="bg-white rounded-lg p-2 border" style={{ borderColor: "#E5E7EB" }}>
        {Object.keys(categoryMap).map((main) => {
          const selectedForMain = selectedSubcats[main] ?? [];

          return (
            <div
              key={main}
              className="border-b last:border-b-0"
              style={{ borderColor: "#F3F4F6" }}
            >
              {/* Main category button */}
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
                  className={`w-4 h-4 transition-transform ${
                    openMain[main] ? "rotate-180" : ""
                  }`}
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

              {/* Subcategory list — now auto height, NO max-height */}
              {openMain[main] && (
                <div className="px-3 pb-3 pt-1">
                  <div className="space-y-2 pr-2">
                    {categoryMap[main].map((sub) => {
                      const checked =
                        (selectedSubcats[main] ?? []).includes(sub);

                      return (
                        <label
                          key={sub}
                          className="flex items-center gap-3 cursor-pointer justify-between py-1"
                          title={sub}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSubcat(main, sub)}
                              className="w-4 h-4 rounded focus:ring"
                              style={{ accentColor: "#D4A643" }}
                            />

                            <div className="flex items-center">
                              {renderSubIcon(sub)}
                            </div>

                            <div className="text-sm text-[#111827]">{sub}</div>
                          </div>

                          <div className="w-6 text-right">
                            {checked && (
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M20 6L9 17l-5-5"
                                  stroke="#D4A643"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </label>
                      );
                    })}
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

/* ----------------- Marketplace component ----------------- */
const Marketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcats, setSelectedSubcats] = useState<SubcatState>({});
  const [priceRange, setPriceRange] = useState(1000);
  const [showBanner, setShowBanner] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [cartCount, setCartCount] = useState(0);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [protectionAccepted, setProtectionAccepted] = useState(false);

  const drawerRef = useRef<HTMLDivElement | null>(null);

  const filteredItems = useMemo<Item[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_ITEMS.filter((item) => {
      const matchesSearch =
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        (item.desc?.toLowerCase().includes(q) ?? false) ||
        (item.platform?.toLowerCase().includes(q) ?? false);
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

  useEffect(() => {
    setProtectionAccepted(false);
  }, [selectedItem]);

  const getBrandHex = (icon: Item["icon"]) => {
    if (typeof icon === "string") {
      const key = icon.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      return (STRING_ICON_COLOR_MAP as any)[key];
    }
    return ICON_COLOR_MAP.get(icon as IconType);
  };

  const renderIcon = (icon: Item["icon"], size = 36, realTime = false) => {
    const badgeSize = Math.max(40, size + 8);
    const brandHex = getBrandHex(icon);
    const bg = brandHex
      ? gradientFromHex(brandHex)
      : vibrantGradients[Math.abs(hashCode(String(icon))) % vibrantGradients.length];

    const iconContent = typeof icon === "string" ? (
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
    ) : (
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
        {React.createElement(icon as AnyIconComponent, { size: Math.round(size * 0.65), style: { color: "#fff", fill: "#fff" } })}
      </div>
    );

    return (
      <div style={{ position: "relative", width: badgeSize, height: badgeSize }}>
        {iconContent}
        {realTime && (
          <span
            style={{
              position: "absolute",
              right: -2,
              bottom: -2,
              width: Math.max(10, Math.round(badgeSize * 0.25)),
              height: Math.max(10, Math.round(badgeSize * 0.25)),
              borderRadius: 99,
              background: "#16a34a",
              boxShadow: "0 0 0 3px rgba(16,185,129,0.12)",
              border: "2px solid #fff",
            }}
            title="Real-time service / online"
          />
        )}
      </div>
    );
  };

  const addToCart = (item: Item | null) => {
    if (!item) return;
    setCartCount((c) => c + 1);
  };

  const buyNow = async (item: Item | null) => {
    if (!item) return;
    if (processingIds.includes(item.id)) return;

    if (selectedItem && !protectionAccepted) {
      alert("Please confirm you've checked the description and rating before purchase.");
      return;
    }

    setProcessingIds((p) => [...p, item.id]);

    try {
      let orderResult: any = null;
      try {
        const resp = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemId: item.id, price: item.price, qty: 1 }),
        });
        if (resp.ok) orderResult = await resp.json();
      } catch (err) {
        console.warn("Order API call failed (ignored):", err);
      }

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

      setSelectedItem(null);
      alert("Purchase successful — notification sent!");
    } catch (err: any) {
      console.error("Buy failed", err);
      alert("Failed to process purchase: " + (err?.message || String(err)));
    } finally {
      setProcessingIds((p) => p.filter((id) => id !== item.id));
    }
  };

  const viewItem = (item: Item) => setSelectedItem(item);

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
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-md lg:hidden bg-white border shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#0A1A3A]">Marketplace</h1>
                <p className="text-xs lg:text-sm text-[#6B7280]">Verified sellers • Instant delivery</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex border rounded-lg overflow-hidden">
                <button onClick={() => setViewMode("list")} className={`px-4 py-2 ${viewMode === "list" ? "bg-[#0A1A3A] text-white" : "bg-white"}`}>List</button>
                <button onClick={() => setViewMode("grid")} className={`px-4 py-2 ${viewMode === "grid" ? "bg-[#0A1A3A] text-white" : "bg-white"}`}>Grid</button>
              </div>
              <input type="text" placeholder="Search accounts, giftcards..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="px-4 py-2 border rounded-lg w-64" />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setMobileSearchOpen(true)} className="md:hidden p-3 bg-white border rounded-lg shadow-sm">
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

          {mobileSearchOpen && (
            <>
              <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMobileSearchOpen(false)} />
              <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-lg">
                <div className="flex items-center gap-3 p-4 border-b">
                  <FaSearchIcon className="w-5 h-5 text-gray-500" />
                  <input type="text" placeholder="Search anything..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 outline-none text-lg" autoFocus />
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

                {/* Mobile list */}
                <div className="block sm:hidden divide-y">
                  {paginatedItems.map((item: Item) => (
                    <div key={item.id} className="w-full text-left p-3 hover:bg-gray-50 active:bg-gray-100 transition flex gap-3 items-start">
                      <div className="flex-shrink-0">{renderIcon(item.icon, 40, !!item.realTime)}</div>
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

                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={() => addToCart(item)} title="Add to cart" className="p-2 border rounded-md text-sm flex items-center justify-center">
                            <FaShoppingCartIcon className="w-4 h-4" />
                          </button>

                          <button onClick={() => viewItem(item)} title="Details" className="p-2 border rounded-md text-sm flex items-center justify-center">
                            <FaEyeIcon className="w-4 h-4" />
                          </button>

                          <button onClick={() => buyNow(item)} title="Purchase" className="ml-auto p-2 rounded-md text-sm bg-[#33ac6f] text-white flex items-center justify-center font-medium" disabled={processingIds.includes(item.id)}>
                            <span className="sr-only">Purchase</span>
                            <div className="text-xs">{processingIds.includes(item.id) ? "..." : "$" + item.price.toFixed(0)}</div>
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
                        <div>{renderIcon(item.icon, 44, !!item.realTime)}</div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-[#0A1A3A]">{item.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{item.desc}</p>
                          <div className="text-xs text-gray-500 mt-2">{item.seller} • {item.delivery}</div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-3">
                          <div className="text-lg font-bold text-[#0A1A3A]">${item.price.toFixed(2)}</div>
                          <div className="flex gap-2 items-center">
                            <button onClick={() => addToCart(item)} className="p-2 border rounded text-sm" title="Add to cart">
                              <FaShoppingCartIcon className="w-4 h-4" />
                            </button>

                            <button onClick={() => viewItem(item)} className="p-2 border rounded text-sm flex items-center gap-2" title="View">
                              <FaEyeIcon className="w-4 h-4" />
                            </button>

                            <button onClick={() => buyNow(item)} className="px-3 py-1 text-sm bg-[#33ac6f] text-white rounded" disabled={processingIds.includes(item.id)} title="Purchase">
                              {processingIds.includes(item.id) ? "..." : "Purchase"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grid */}
                {viewMode === "grid" && (
                  <div className="hidden sm:p-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedItems.map((item: Item) => (
                      <div key={item.id} className="border rounded-lg p-4 text-center hover:shadow-lg transition bg-white flex flex-col">
                        <div className="flex justify-center">{renderIcon(item.icon, 56, !!item.realTime)}</div>
                        <h3 className="mt-3 font-medium text-sm text-[#0A1A3A]">{item.title}</h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.desc}</p>
                        <div className="mt-3 text-lg font-bold text-[#0A1A3A]">${item.price.toFixed(2)}</div>
                        <div className="mt-4 flex gap-2">
                          <button onClick={() => addToCart(item)} className="flex-1 py-2 text-sm border rounded">Cart</button>
                          <button onClick={() => viewItem(item)} className="py-2 px-3 text-sm border rounded flex items-center gap-2">
                            <FaEyeIcon className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          <button onClick={() => buyNow(item)} className="py-2 px-3 text-sm bg-[#33ac6f] text-white rounded" disabled={processingIds.includes(item.id)}>
                            {processingIds.includes(item.id) ? "Processing..." : "Buy"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
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
                      <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`px-3 py-1 border rounded text-sm ${pageNum === currentPage ? "bg-[#0A1A3A] text-white" : "bg-white"}`}>
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

        {/* Item Modal */}
        {selectedItem && (
          <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelectedItem(null)} />
            <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:w-full bg-white rounded-t-3xl sm:rounded-3xl z-50 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full" />
              <div className="sticky top-0 bg-white border-b sm:border-b-0 px-6 py-4 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#0A1A3A]">{selectedItem.title}</h2>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedItem(null)}>
                    <FaTimesIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-center">{renderIcon(selectedItem.icon, 72, !!selectedItem.realTime)}</div>
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

                <div className="mt-4 flex items-center gap-3">
                  <input id="protectionCheck" type="checkbox" checked={protectionAccepted} onChange={(e) => setProtectionAccepted(e.target.checked)} className="w-4 h-4" />
                  <label htmlFor="protectionCheck" className="text-xs text-gray-700">I have read the description and checked the seller rating</label>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <button onClick={() => buyNow(selectedItem)} className={`w-full py-3 ${protectionAccepted ? "bg-[#33ac6f] text-white" : "bg-gray-200 text-gray-600"} rounded-xl font-bold text-lg`} disabled={processingIds.includes(selectedItem.id) || !protectionAccepted}>
                    {processingIds.includes(selectedItem.id) ? "Processing..." : "Purchase"}
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

        {/* Mobile Drawer */}
        {drawerOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setDrawerOpen(false)} />}
        <aside ref={drawerRef} className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
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

        <Link to="/add-product" className="hidden sm:flex sm:fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] hover:bg-[#c4963a] text-white rounded-full shadow-2xl items-center justify-center z-50 transition-all" aria-label="Add product">
          <FaPlusIcon />
        </Link>
      </div>
    </>
  );
};

export default Marketplace;
