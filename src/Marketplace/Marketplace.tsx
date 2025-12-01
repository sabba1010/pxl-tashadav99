import React, { useState } from "react";
import { Search, List, Grid3X3, Filter } from "lucide-react";

const Marketplace = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data matching your screenshot
  const items = [
    {
      id: 1,
      title: "USA WhatsApp number",
      description: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase",
      price: "$4.49",
      seller: "AS Digitals",
      delivery: "Delivers in: 5 mins",
      icon: "📱",
    },
    {
      id: 2,
      title: "USA WhatsApp number",
      description: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase",
      price: "$4.49",
      seller: "AS Digitals",
      delivery: "Delivers in: 5 mins",
      icon: "📱",
    },
    {
      id: 3,
      title: "USA WhatsApp number",
      description: "USA WhatsApp number for sale, it's a one time verification number. Code will be available after purchase",
      price: "$4.49",
      seller: "AS Digitals",
      delivery: "Delivers in: 5 mins",
      icon: "📱",
    },
    {
      id: 4,
      title: "1 year Active Pia VPN",
      description: "1 year pia vpn works with either ios/android, just 1 device.",
      price: "$2.98",
      seller: "lavidamide Logs",
      delivery: "Delivers Instantly",
      icon: "🔒",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Black Friday Banner */}
      <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-900 px-6 py-3 flex items-center justify-between text-sm font-medium">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          Black Friday is live on AcctBazaar! Every price you’re seeing right now is a special Black Friday discount, all from verified sellers with fast delivery and safe escrow.
        </div>
        <button className="text-orange-700 hover:text-orange-900">×</button>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List size={18} />
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid3X3 size={18} />
                Grid
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Fixed Sidebar */}
          <aside className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Filter size={20} />
                Filter
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Account Category</p>
                  <div className="space-y-2">
                    {["Social Media", "Emails & Messaging Service", "Giftcards", "VPN & PROXYs", "Websites", "E-commerce Platforms", "Gaming", "Accounts & Subscriptions", "Others"].map((cat) => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500" />
                        <span className="text-sm text-gray-600">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-4">Price range</p>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between mt-3 text-sm text-gray-500">
                      <span>Minimum $0</span>
                      <span>Maximum $1000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Latest account</h2>

              {/* LIST VIEW */}
              {viewMode === "list" && (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-5 p-5 border border-gray-200 border rounded-xl hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="text-4xl">{item.icon}</div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            {item.seller}
                          </span>
                          <span>•</span>
                          <span className="text-green-600 font-medium">{item.delivery}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{item.price}</div>
                        <div className="mt-4 flex flex-col gap-2">
                          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                            Add to cart
                          </button>
                          <button className="text-sm text-gray-500 hover:text-gray-700">
                            👁 View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* GRID VIEW */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="text-6xl text-center mb-4">{item.icon}</div>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {item.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500">{item.seller}</div>
                          <div className="text-lg font-bold text-gray-900 mt-1">{item.price}</div>
                        </div>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
                          Buy
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
  );
};

export default Marketplace;