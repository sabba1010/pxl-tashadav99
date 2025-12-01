// src/pages/Mysells.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit2,
  X,
  TrendingUp,
  Instagram,
  Mail,
  Tv,
  Music,
  MessageCircle,
  Gift,
  Shield,
  Globe,
  Twitter,
  
} from "lucide-react";

interface Sale {
  id: string;
  title: string;
  desc: string;
  price: number;
  delivery: string;
  Icon: React.FC<any>;
  color: string;
  category: string;
  status: "Pending" | "Delivery in Progress" | "Delivered";
}

const Mysells = () => {
  const [sales, setSales] = useState<Sale[]>([
    {
      id: "1",
      title: "9 Years Strong U.S Instagram 200K+ Followers",
      desc: "High-quality aged Instagram account with 200K+ real followers. Full access, no restrictions. Includes original email.",
      price: 83.0,
      delivery: "Delivers Instantly",
      Icon: Instagram,
      color: "text-pink-500",
      category: "Social Media",
      status: "Pending",
    },
    {
      id: "2",
      title: "Aged Gmail PVA 2020 | Full Access",
      desc: "Gmail account created in 2020. Phone verified, recovery added. Perfect for marketing.",
      price: 4.99,
      delivery: "Delivers in: 3 mins",
      Icon: Mail,
      color: "text-red-500",
      category: "Emails & Messaging Service",
      status: "Pending",
    },
    {
      id: "3",
      title: "Netflix Premium 4K UHD (1 Year)",
      desc: "Private Netflix profile with 4K UHD support. Works on all devices. Warranty included.",
      price: 12.5,
      delivery: "Delivers Instantly",
      Icon: Tv,
      color: "text-red-600",
      category: "Accounts & Subscriptions",
      status: "Pending",
    },
    {
      id: "4",
      title: "TikTok Account 500K+ Followers | Verified",
      desc: "Aged TikTok with 500K+ real followers. Verified badge. Full email access. High engagement.",
      price: 189.0,
      delivery: "Delivers in: 10 mins",
      Icon: Music,
      color: "text-black",
      category: "Social Media",
      status: "Pending",
    },
    {
      id: "5",
      title: "USA WhatsApp Number +1 (Real SIM)",
      desc: "Real US number registered on physical SIM. Perfect for verification. Code sent instantly.",
      price: 7.99,
      delivery: "Delivers Instantly",
      Icon: MessageCircle,
      color: "text-green-500",
      category: "Social Media",
      status: "Pending",
    },
    {
      id: "6",
      title: "$100 Amazon Gift Card (US) - Instant Code",
      desc: "100% legitimate Amazon gift card. Code delivered instantly after payment.",
      price: 92.0,
      delivery: "Delivers Instantly",
      Icon: Gift,
      color: "text-yellow-600",
      category: "Giftcards",
      status: "Pending",
    },
    {
      id: "7",
      title: "PIA VPN 2 Years | Private Internet Access",
      desc: "2-year subscription. Works on 10 devices. No logs. Instant activation.",
      price: 19.99,
      delivery: "Delivers Instantly",
      Icon: Shield,
      color: "text-purple-600",
      category: "VPN & PROXYs",
      status: "Pending",
    },
    {
      id: "8",
      title: "Facebook Aged Account 2015 | Marketplace Enabled",
      desc: "Old Facebook account with Marketplace & Ads access. No restrictions. Clean history.",
      price: 45.0,
      delivery: "Delivers in: 5 mins",
      Icon: Globe,
      color: "text-blue-600",
      category: "Social Media",
      status: "Pending",
    },
    {
      id: "9",
      title: "Spotify Premium Lifetime (Family Owner)",
      desc: "Family plan owner slot. Lifetime access. Invite sent instantly.",
      price: 29.99,
      delivery: "Delivers Instantly",
      Icon: Music,
      color: "text-green-500",
      category: "Accounts & Subscriptions",
      status: "Pending",
    },
    {
      id: "10",
      title: "Twitter/X Blue Verified Account 2018",
      desc: "Old Twitter account with blue checkmark. Full access. No phone linked.",
      price: 149.0,
      delivery: "Delivers in: 15 mins",
      Icon: Twitter,
      color: "text-black",
      category: "Social Media",
      status: "Pending",
    },
  ]);

  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const totalPending = sales.reduce((sum, s) => sum + s.price, 0);

  const openEditModal = (sale: Sale) => {
    setEditingSale(sale);
  };

  // (saveChanges & editedData removed - not needed anymore)

  return (
    <>
      <div className="min-h-screen bg-gray-100">
    

        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Sales</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and edit your pending sales</p>
            </div>
            <Link
              to="/add-product"
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-600 transition shadow-lg"
            >
              Sell New Product
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Pending Earnings</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">${totalPending.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 text-sm">Pending Sales</p>
              <p className="text-3xl font-bold mt-2">{sales.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600 text-sm">Status</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">All Pending</p>
            </div>
          </div>

          {/* Sales List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="divide-y">
              {sales.map((sale) => (
                <div
                  key={sale.id}
                  className="p-6 flex flex-col sm:flex-row items-start gap-6 hover:bg-gray-50 transition group"
                >
                  {/* icon */}
                  <div className={`text-3xl ${sale.color} flex-none` }>
                    <sale.Icon className="w-10 h-10 sm:w-8 sm:h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{sale.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{sale.desc}</p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        You
                      </span>
                      <span>•</span>
                      <span className="text-green-600 font-medium">{sale.delivery}</span>
                      <span>•</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sale.status === "Pending"
                            ? "bg-orange-100 text-orange-700"
                            : sale.status === "Delivery in Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {sale.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto flex items-center sm:flex-col sm:items-end justify-between mt-3 sm:mt-0">
                    <div className="text-2xl font-bold text-gray-900">${sale.price.toFixed(2)}</div>
                    <button
                      onClick={() => openEditModal(sale)}
                      className="mt-4 inline-flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <Edit2 className="w-4 h-4" />
                      Delivery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Sale</h2>
              <button onClick={() => setEditingSale(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Product preview */}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-gray-100 flex items-center justify-center ${editingSale.color}`}>
                  <editingSale.Icon className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{editingSale.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{editingSale.desc}</p>
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <div className="text-2xl font-bold text-gray-900">${editingSale.price.toFixed(2)}</div>
                    <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">{editingSale.category}</div>
                    <div className="px-3 py-1 rounded-full text-xs font-medium border text-gray-600">{editingSale.status}</div>
                  </div>
                </div>
              </div>

              {/* Delivery action + message (two-step) */}
              <div className="flex items-center gap-4">
                {editingSale.status === "Pending" && (
                  <button
                    onClick={() => {
                      if (!editingSale) return;
                      // mark in-progress and keep modal open
                      setSales((prev) => prev.map((s) => (s.id === editingSale.id ? { ...s, status: "Delivery in Progress" } : s)));
                      setEditingSale((prev) => (prev ? { ...prev, status: "Delivery in Progress" } : prev));
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Send Delivery
                  </button>
                )}

                {editingSale.status === "Delivery in Progress" && (
                  <>
                    <button
                      onClick={() => {
                        if (!editingSale) return;
                        // mark delivered and close modal
                        setSales((prev) => prev.map((s) => (s.id === editingSale.id ? { ...s, status: "Delivered" } : s)));
                        setEditingSale(null);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold"
                    >
                      Deliver
                    </button>
                    <div className="text-sm text-blue-700 font-medium">Delivery is progressing...</div>
                  </>
                )}

                {editingSale.status === "Delivered" && (
                  <div className="text-sm text-green-700 font-medium">Delivery completed</div>
                )}
              </div>

              {/* removed the edit form and save/cancel actions - Delivery updates status and closes modal */}
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Link
        to="/add-product"
        className="fixed bottom-6 right-6 bg-orange-500 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-3xl hover:bg-orange-600 transition hover:scale-110 z-40 lg:hidden"
      >
        +
      </Link>
    </>
  );
};

export default Mysells;