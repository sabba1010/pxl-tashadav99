import React, { useState, useMemo } from "react";

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

  const allItems: Item[] = [
    { id: 1, title: "USA WhatsApp number", desc: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase", price: 4.49, seller: "AS Digitals", delivery: "Delivers in: 5 mins", icon: "WhatsApp", category: "Social Media" },
    { id: 2, title: "USA WhatsApp number", desc: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase", price: 4.49, seller: "AS Digitals", delivery: "Delivers in: 5 mins", icon: "WhatsApp", category: "Social Media" },
    { id: 3, title: "USA WhatsApp number", desc: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase", price: 4.49, seller: "AS Digitals", delivery: "Delivers in: 5 mins", icon: "WhatsApp", category: "Social Media" },
    { id: 4, title: "1 year Active Pia VPN", desc: "1 year pia vpn works with either ios/android, just 1 device.", price: 2.98, seller: "lavidamide Logs", delivery: "Delivers Instantly", icon: "VPN", category: "VPN & PROXYs" },
    { id: 5, title: "Gmail PVA Aged 2020", price: 1.99, seller: "MailKing", delivery: "Delivers in: 3 mins", icon: "Gmail", category: "Emails & Messaging Service" },
    { id: 6, title: "Netflix Premium 4K", price: 7.99, seller: "StreamZone", delivery: "Delivers Instantly", icon: "Netflix", category: "Accounts & Subscriptions" },
    { id: 7, title: "$50 Amazon Gift Card US", price: 46.50, seller: "GiftPro", delivery: "Delivers in: 1 min", icon: "Amazon", category: "Giftcards" },
    { id: 8, title: "Instagram 100K+ Followers", price: 95.00, seller: "InstaBoost", delivery: "Delivers in: 2 hours", icon: "Instagram", category: "Social Media" },
    // Add more items if you want
  ];

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
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

  return (
    <>
      {/* Black Friday Banner – Closeable */}
      {showBanner && (
        <div className="bg-orange-50 border-l-4 border-orange-500 text-orange-900 px-6 py-3 flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <span>Fire</span>
            Black Friday is live on AcctBazaar! Every price you’re seeing right now is a special Black Friday discount, all from verified sellers with fast delivery and safe escrow.
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-orange-900 hover:text-orange-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
      )}

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-screen-2xl mx-auto px-4 py-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>

            <div className="flex items-center gap-4">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-6 py-3 ${viewMode === "list" ? "bg-orange-500 text-white" : "bg-white"} transition`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-6 py-3 ${viewMode === "grid" ? "bg-orange-500 text-white" : "bg-white"} transition`}
                >
                  Grid
                </button>
              </div>

              <input
                type="text"
                placeholder="Search by name or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-5 py-3 border border-gray-300 rounded-lg w-96 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT SIDEBAR – WIDER & CLEAN */}
            <aside className="lg:col-span-3 lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold mb-6">Filter</h3>

                <div className="text-sm font-medium text-gray-700 mb-3">Account Category</div>
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
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-600">{cat}</span>
                    </label>
                  ))}
                </div>

                <div className="text-sm font-medium text-gray-700 mb-3">Price range</div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$0</span>
                  <span>${priceRange}</span>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="lg:col-span-9">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-xl font-bold">Latest account</h2>
                </div>

                {/* LIST VIEW */}
                {viewMode === "list" && (
                  <div className="divide-y">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="p-6 flex items-start gap-6 hover:bg-gray-50 transition">
                        <div className="text-4xl">{item.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.desc || "High-quality account • Instant delivery • Full warranty"}
                          </p>
                          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                              {item.seller}
                            </span>
                            <span>•</span>
                            <span className="text-green-600 font-medium">{item.delivery}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">${item.price.toFixed(2)}</div>
                          <div className="mt-4 flex gap-4">
                            <button className="text-orange-600 font-medium">Add to cart</button>
                            <button className="text-gray-500">View</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* GRID VIEW – Perfect Size */}
                {viewMode === "grid" && (
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                    {filteredItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
                        <div className="text-6xl text-center mb-5">{item.icon}</div>
                        <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                          {item.desc || "Premium account • Instant delivery"}
                        </p>
                        <div className="mt-5 text-sm text-gray-500">
                          <div>{item.seller}</div>
                          <div className="text-green-600">{item.delivery}</div>
                        </div>
                        <div className="mt-5 flex items-center justify-between">
                          <div className="text-2xl font-bold">${item.price.toFixed(2)}</div>
                          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-medium">
                            Buy Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Marketplace;