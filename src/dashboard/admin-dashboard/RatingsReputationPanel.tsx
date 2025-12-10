import React, { useState } from "react";
import { Star, TrendingUp, Shield, AlertCircle, CheckCircle, XCircle, Search, Filter, X, ThumbsUp, ThumbsDown, Clock } from "lucide-react";

interface Review {
  id: string;
  buyer: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  disputed?: boolean;
}

interface Seller {
  id: string;
  name: string;
  username: string;
  totalSales: number;
  rating: number;
  reviews: number;
  disputed: number;
  status: "verified" | "warning" | "normal";
  joinDate: string;
  bio: string;
  recentReviews: Review[];
}

const mockSellers: Seller[] = [
  {
    id: "1",
    name: "Afsar Khan",
    username: "@afsarpro",
    totalSales: 2847,
    rating: 4.98,
    reviews: 1823,
    disputed: 0,
    status: "verified",
    joinDate: "Jan 2023",
    bio: "Premium gaming & streaming accounts • Fast delivery • 24/7 support",
    recentReviews: [
      { id: "r1", buyer: "GamerX", rating: 5, comment: "Instant delivery! Best seller on platform", date: "2 days ago", helpful: 42 },
      { id: "r2", buyer: "ProPlayer99", rating: 5, comment: "Account works perfectly. Will buy again!", date: "1 week ago", helpful: 28 },
      { id: "r3", buyer: "NinjaStream", rating: 4, comment: "Good but took 20 mins", date: "2 weeks ago", helpful: 12 },
    ]
  },
  // ... other sellers (same as before)
  {
    id: "3",
    name: "Rahman Seller",
    username: "@rahman_x",
    totalSales: 875,
    rating: 4.67,
    reviews: 543,
    disputed: 12,
    status: "warning",
    joinDate: "Jul 2024",
    bio: "Budget accounts • High volume seller",
    recentReviews: [
      { id: "r4", buyer: "User123", rating: 1, comment: "Account banned after 2 days. Want refund!", date: "3 days ago", helpful: 67, disputed: true },
      { id: "r5", buyer: "AnonBuyer", rating: 3, comment: "Worked at first but got locked", date: "1 week ago", helpful: 31, disputed: true },
    ]
  },
  // Add more as needed...
];

const RatingsReputationPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "disputed" | "top">("all");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const filteredSellers = mockSellers.filter(seller => {
    const matchesSearch = seller.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "disputed") return matchesSearch && seller.disputed > 0;
    if (filter === "top") return matchesSearch && seller.rating >= 4.9 && seller.reviews >= 500;
    return matchesSearch;
  });

  const closeModal = () => setSelectedSeller(null);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1,2,3,4,5].map((i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i <= rating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#00183b] text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header & Stats same as before */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-[#e6c06c] mb-3">
              Ratings & Reputation Management
            </h1>
            <p className="text-gray-400">Monitor • Review • Resolve Disputes • Boost Top Sellers</p>
          </div>

          {/* Stats Cards & Filters (same as before) */}
          {/* ... (keep your existing code here) ... */}

          {/* Sellers Table */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 font-medium text-gray-400">Seller</th>
                    <th className="text-left p-6 font-medium text-gray-400">Rating</th>
                    <th className="text-left p-6 font-medium text-gray-400">Sales</th>
                    <th className="text-left p-6 font-medium text-gray-400">Disputed</th>
                    <th className="text-left p-6 font-medium text-gray-400">Status</th>
                    <th className="text-left p-6 font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map((seller) => (
                    <tr key={seller.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="p-6">
                        <div>
                          <p className="font-semibold text-white">{seller.name}</p>
                          <p className="text-sm text-gray-400">{seller.username} • {seller.joinDate}</p>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          {renderStars(Math.round(seller.rating))}
                          <span className="font-bold">{seller.rating}</span>
                          <span className="text-gray-500">({seller.reviews})</span>
                        </div>
                      </td>
                      <td className="p-6 text-gray-300">{seller.totalSales.toLocaleString()}</td>
                      <td className="p-6">
                        {seller.disputed > 0 ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50">
                            <AlertCircle className="w-4 h-4" />
                            {seller.disputed}
                          </span>
                        ) : (
                          <span className="text-green-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Clean
                          </span>
                        )}
                      </td>
                      <td className="p-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                          seller.status === "verified" ? "bg-teal-500/20 text-teal-300 border-teal-500/50" :
                          seller.status === "warning" ? "bg-amber-500/20 text-amber-300 border-amber-500/50" :
                          "bg-gray-500/20 text-gray-300 border-gray-500/50"
                        }`}>
                          {seller.status === "verified" ? "Verified" : seller.status === "warning" ? "Warning" : "Standard"}
                        </span>
                      </td>
                      <td className="p-6">
                        <button
                          onClick={() => setSelectedSeller(seller)}
                          className="px-5 py-2.5 bg-teal-500/20 hover:bg-teal-500/40 border border-teal-500/50 rounded-lg text-teal-300 font-medium transition"
                        >
                          View Reviews
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#00183b] to-[#002a5c] border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#e6c06c]">{selectedSeller.name}</h2>
                  <p className="text-xl text-teal-300">{selectedSeller.username}</p>
                  <p className="text-gray-400 mt-2">{selectedSeller.bio}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-white transition"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <p className="text-gray-400 text-sm">Overall Rating</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {renderStars(Math.round(selectedSeller.rating))}
                    <span className="text-2xl font-bold">{selectedSeller.rating}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{selectedSeller.reviews} reviews</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <p className="text-gray-400 text-sm">Total Sales</p>
                  <p className="text-3xl font-bold text-teal-300 mt-2">{selectedSeller.totalSales.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <p className="text-gray-400 text-sm">Disputed Reviews</p>
                  <p className="text-3xl font-bold text-amber-300 mt-2">{selectedSeller.disputed}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-xl font-bold text-gray-300 mt-2">{selectedSeller.joinDate}</p>
                </div>
              </div>

              {/* Recent Reviews */}
              <h3 className="text-2xl font-bold text-white mb-5">Recent Reviews</h3>
              <div className="space-y-4">
                {selectedSeller.recentReviews.map((review) => (
                  <div key={review.id} className={`p-5 rounded-xl border ${review.disputed ? "bg-amber-500/10 border-amber-500/50" : "bg-white/5 border-white/10"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-white">{review.buyer}</span>
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {review.date}
                          </span>
                        </div>
                        <p className="text-gray-300">{review.comment}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition">
                            <ThumbsUp className="w-4 h-4" /> Helpful ({review.helpful})
                          </button>
                          <button className="text-sm text-gray-400 hover:text-red-400 transition">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {review.disputed && (
                        <span className="ml-4 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold">
                          DISPUTED
                        </span>
                      )}
                    </div>
                    {review.disputed && (
                      <div className="mt-4 flex gap-3">
                        <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded-lg text-red-300 text-sm">
                          Remove Rating
                        </button>
                        <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/40 border border-green-500/50 rounded-lg text-green-300 text-sm">
                          Keep Rating
                        </button>
                        <button className="px-4 py-2 bg-teal-500/20 hover:bg-teal-500/40 border border-teal-500/50 rounded-lg text-teal-300 text-sm">
                          Contact Buyer
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Admin Actions */}
              <div className="mt-8 flex justify-center gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl font-bold hover:scale-105 transition">
                  Boost This Seller
                </button>
                <button className="px-6 py-3 bg-amber-500/20 border border-amber-500/50 rounded-xl font-bold text-amber-300 hover:bg-amber-500/30 transition">
                  Warning / Suspend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RatingsReputationPanel;