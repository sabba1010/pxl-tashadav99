// src/pages/Marketplace.tsx
import React, { useState, useMemo, useEffect, useRef } from "react";

interface Item {
  id: number;
  title: string;
  desc?: string;
  price: number;
  seller: string;
  delivery: string;
  icon: string;
  category: string;
}

const Marketplace: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(1000);
  const [showBanner, setShowBanner] = useState(true);

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  const allItems: Item[] = [
    { id: 1, title: "USA WhatsApp number", desc: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase", price: 4.49, seller: "AS Digitals", delivery: "Delivers in: 5 mins", icon: "📱", category: "Social Media" },
    { id: 2, title: "USA WhatsApp number", desc: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase", price: 4.49, seller: "AS Digitals", delivery: "Delivers in: 5 mins", icon: "📱", category: "Social Media" },
    { id: 3, title: "USA WhatsApp number", desc: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase", price: 4.49, seller: "AS Digitals", delivery: "Delivers in: 5 mins", icon: "📱", category: "Social Media" },
    { id: 4, title: "1 year Active Pia VPN", desc: "1 year pia vpn works with either ios/android, just 1 device.", price: 2.98, seller: "lavidamide Logs", delivery: "Delivers Instantly", icon: "🔒", category: "VPN & PROXYs" },
    { id: 5, title: "Gmail PVA Aged 2020", price: 1.99, seller: "MailKing", delivery: "Delivers in: 3 mins", icon: "✉️", category: "Emails & Messaging Service" },
    { id: 6, title: "Netflix Premium 4K", price: 7.99, seller: "StreamZone", delivery: "Delivers Instantly", icon: "🎬", category: "Accounts & Subscriptions" },
    { id: 7, title: "$50 Amazon Gift Card US", price: 46.50, seller: "GiftPro", delivery: "Delivers in: 1 min", icon: "🎁", category: "Giftcards" },
    { id: 8, title: "Instagram 100K+ Followers", price: 95.00, seller: "InstaBoost", delivery: "Delivers in: 2 hours", icon: "📸", category: "Social Media" },
  ];

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        (item.desc?.toLowerCase().includes(q) ?? false);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const matchesPrice = item.price <= priceRange;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [searchQuery, selectedCategories, priceRange]);

  const categories = [
    "Social Media",
    "Emails & Messaging Service",
    "Giftcards",
    "VPN & PROXYs",
    "Websites",
    "E-commerce Platforms",
    "Gaming",
    "Accounts & Subscriptions",
    "Others",
  ];

  // Close drawer on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [drawerOpen]);

  // Close drawer when clicking outside (for safety, but click on backdrop already closes)
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!drawerOpen) return;
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [drawerOpen]);

  return (
    <>
      {/* Brand Banner – Closeable */}
      {showBanner && (
        <div className="px-4 py-3 flex items-center justify-between text-sm font-medium"
             style={{ backgroundColor: "#D4A643", borderLeft: "4px solid #0A1A3A", color: "#111111" }}>
          <div className="flex items-center gap-2">
            <span className="font-bold">🔥</span>
            <span>
              Black Friday is live on AcctBazaar! Every price you’re seeing right now is a special Black Friday
              discount.
            </span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-2xl font-bold leading-none"
            aria-label="Close banner"
            style={{ color: "#111111" }}
          >
            ×
          </button>
        </div>
      )}

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-screen-2xl mx-auto px-4 py-6">

          {/* Header - mobile shows hamburger + search */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile: Drawer toggle */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 rounded-md lg:hidden bg-white border border-gray-200"
                aria-label="Open filters"
                aria-haspopup="true"
                aria-expanded={drawerOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#0A1A3A" }}>Marketplace</h1>
            </div>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 ${viewMode === "list" ? "text-white" : "bg-white"} transition`}
                  style={viewMode === "list" ? { backgroundColor: "#0A1A3A" } : undefined}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 ${viewMode === "grid" ? "text-white" : "bg-white"} transition`}
                  style={viewMode === "grid" ? { backgroundColor: "#0A1A3A" } : undefined}
                >
                  Grid
                </button>
              </div>

              <input
                type="text"
                placeholder="Search by name or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none"
                style={{ boxShadow: "none" }}
                // custom focus ring using inline style fallback for consistent brand color
                onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,26,58,0.12)")}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
              />
            </div>

            {/* Mobile: small search icon that focuses input in drawer (we keep search visible as icon) */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => {
                  // open drawer which contains search & filters
                  setDrawerOpen(true);
                }}
                className="p-2 rounded-md bg-white border border-gray-200"
                aria-label="Open filters and search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT SIDEBAR – Desktop only */}
            <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-6">Filter</h3>

                <div className="text-sm font-medium" style={{ color: "#0A1A3A" }}>Account Category</div>
                <div className="space-y-3 mb-8">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => {
                          setSelectedCategories((prev) =>
                            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                          );
                        }}
                        className="w-4 h-4 rounded focus:ring"
                        // accent color style (Royal Gold)
                        style={{ accentColor: "#D4A643" }}
                      />
                      <span className="text-sm" style={{ color: "#111111" }}>{cat}</span>
                    </label>
                  ))}
                </div>

                <div className="text-sm font-medium" style={{ color: "#0A1A3A" }}>Price range</div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 rounded-lg"
                  style={{ backgroundColor: "#EDE7DA", accentColor: "#D4A643" }}
                />
                <div className="flex justify-between text-xs" style={{ color: "#6B7280", marginTop: 8 }}>
                  <span>$0</span>
                  <span>${priceRange}</span>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="lg:col-span-9">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Top toolbar for mobile & small screens */}
                <div className="px-4 py-4 border-b flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-3">
                      <div className="text-sm" style={{ color: "#6B7280" }}>View:</div>
                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setViewMode("list")}
                          className={`px-3 py-1 ${viewMode === "list" ? "text-white" : "bg-white"} transition`}
                          style={viewMode === "list" ? { backgroundColor: "#0A1A3A" } : undefined}
                        >
                          List
                        </button>
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`px-3 py-1 ${viewMode === "grid" ? "text-white" : "bg-white"} transition`}
                          style={viewMode === "grid" ? { backgroundColor: "#0A1A3A" } : undefined}
                        >
                          Grid
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile search shown on toolbar */}
                  <div className="flex-1 px-4 sm:px-0">
                    <div className="sm:hidden">
                      <input
                        type="text"
                        placeholder="Search marketplace..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        style={{ boxShadow: "none" }}
                        onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,26,58,0.12)")}
                        onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
                      />
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
                      <div key={item.id} className="p-6 flex items-start gap-6 hover:bg-gray-50 transition">
                        <div className="text-4xl">{item.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg" style={{ color: "#0A1A3A" }}>{item.title}</h3>
                          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                            {item.desc || "High-quality account • Instant delivery • Full warranty"}
                          </p>
                          <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: "#6B7280" }}>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                              {item.seller}
                            </span>
                            <span>•</span>
                            <span className="font-medium" style={{ color: "#1BC47D" }}>{item.delivery}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: "#0A1A3A" }}>${item.price.toFixed(2)}</div>
                          <div className="mt-4 flex gap-4">
                            <button className="font-medium" style={{ color: "#D4A643" }}>Add to cart</button>
                            <button className="text-gray-500">View</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredItems.length === 0 && <div className="p-6 text-center" style={{ color: "#6B7280" }}>No items found.</div>}
                  </div>
                )}

                {/* GRID VIEW */}
                {viewMode === "grid" && (
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
                        <div className="text-6xl text-center mb-5">{item.icon}</div>
                        <h3 className="font-bold text-lg" style={{ color: "#0A1A3A" }}>{item.title}</h3>
                        <p className="text-sm mt-2 line-clamp-3" style={{ color: "#6B7280" }}>
                          {item.desc || "Premium account • Instant delivery"}
                        </p>
                        <div className="mt-5 text-sm" style={{ color: "#6B7280" }}>
                          <div>{item.seller}</div>
                          <div style={{ color: "#1BC47D" }}>{item.delivery}</div>
                        </div>
                        <div className="mt-5 flex items-center justify-between">
                          <div className="text-2xl font-bold" style={{ color: "#0A1A3A" }}>${item.price.toFixed(2)}</div>
                          <button
                            className="px-4 py-2 rounded-lg transition font-medium"
                            style={{ backgroundColor: "#D4A643", color: "#111111" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#1BC47D")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#D4A643")}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredItems.length === 0 && <div className="col-span-full p-6 text-center" style={{ color: "#6B7280" }}>No items found.</div>}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER / SLIDING FILTER */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${drawerOpen ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        className={`fixed top-0 left-0 z-50 h-full w-80 max-w-full bg-white shadow-xl transform transition-transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-bold" style={{ color: "#0A1A3A" }}>Filters & Search</h3>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-md"
            aria-label="Close filters"
            style={{ color: "#6B7280" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-auto h-full">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(10,26,58,0.12)")}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />
          </div>

          {/* Categories */}
          <div className="mb-4">
            <div className="text-sm font-medium" style={{ color: "#0A1A3A" }}>Account Category</div>
            <div className="space-y-3">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => {
                      setSelectedCategories((prev) =>
                        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                      );
                    }}
                    className="w-4 h-4 rounded focus:ring"
                    style={{ accentColor: "#D4A643" }}
                  />
                  <span className="text-sm" style={{ color: "#111111" }}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="mb-6">
            <div className="text-sm font-medium" style={{ color: "#0A1A3A" }}>Price range</div>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-2 rounded-lg"
              style={{ backgroundColor: "#EDE7DA", accentColor: "#D4A643" }}
            />
            <div className="flex justify-between text-xs" style={{ color: "#6B7280", marginTop: 8 }}>
              <span>$0</span>
              <span>${priceRange}</span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                // apply & close
                setDrawerOpen(false);
              }}
              className="flex-1 px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: "#D4A643", color: "#111111" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1BC47D")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#D4A643")}
            >
              Apply
            </button>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setPriceRange(1000);
                setSearchQuery("");
              }}
              className="flex-1 border px-4 py-2 rounded-lg"
              style={{ borderColor: "#E5E7EB", color: "#111111" }}
            >
              Reset
            </button>
          </div>

          {/* spacing bottom so content can scroll above sticky footer on small screens */}
          <div className="h-24" />
        </div>
      </aside>
    </>
  );
};

export default Marketplace;
