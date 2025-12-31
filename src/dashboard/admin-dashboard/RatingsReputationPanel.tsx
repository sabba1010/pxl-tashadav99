import React, { useState } from "react";
import {
  Star,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  X,
  ThumbsUp,
  Clock,
} from "lucide-react";

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
      { id: "r1", buyer: "GamerX", rating: 5, comment: "Instant delivery! Best seller", date: "2 days ago", helpful: 42 },
      { id: "r2", buyer: "ProPlayer99", rating: 5, comment: "Perfect account, thanks!", date: "1 week ago", helpful: 28 },
      { id: "r3", buyer: "NinjaStream", rating: 4, comment: "Good but took 20 mins", date: "2 weeks ago", helpful: 12 },
    ],
  },
  {
    id: "2",
    name: "Sara Johnson",
    username: "@saraj",
    totalSales: 1562,
    rating: 4.85,
    reviews: 912,
    disputed: 3,
    status: "warning",
    joinDate: "May 2024",
    bio: "High-quality digital art • Custom commissions",
    recentReviews: [
      { id: "r6", buyer: "ArtLover22", rating: 5, comment: "Stunning work!", date: "1 day ago", helpful: 15 },
      { id: "r7", buyer: "CreativeSoul", rating: 2, comment: "Colors were off", date: "5 days ago", helpful: 8, disputed: true },
    ],
  },
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
      { id: "r4", buyer: "User123", rating: 1, comment: "Account banned in 2 days!", date: "3 days ago", helpful: 67, disputed: true },
      { id: "r5", buyer: "AnonBuyer", rating: 3, comment: "Got locked soon", date: "1 week ago", helpful: 31, disputed: true },
    ],
  },
  {
    id: "4",
    name: "EliteTech",
    username: "@elite_tech",
    totalSales: 3205,
    rating: 4.92,
    reviews: 2104,
    disputed: 1,
    status: "verified",
    joinDate: "Mar 2022",
    bio: "Tech gadgets • Authentic • Free shipping",
    recentReviews: [
      { id: "r8", buyer: "TechFanatic", rating: 5, comment: "Fast shipping", date: "4 days ago", helpful: 35 },
      { id: "r9", buyer: "GadgetGuy", rating: 5, comment: "Excellent quality", date: "10 days ago", helpful: 22 },
    ],
  },
];

const RatingsReputationPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "disputed" | "top">("all");
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const filteredSellers = mockSellers.filter((seller) => {
    const matchesSearch =
      seller.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "disputed") return matchesSearch && seller.disputed > 0;
    if (filter === "top") return matchesSearch && seller.rating >= 4.9 && seller.reviews >= 500;
    return matchesSearch;
  });

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Main Content - Full width but respects sidebar */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-full mx-auto px-4 py-6 md:px-8 lg:px-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Ratings & Reputation Management
            </h1>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              Monitor • Review • Resolve Disputes • Boost Top Sellers
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Sellers</option>
                  <option value="disputed">Disputed Only</option>
                  <option value="top">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table - NO HORIZONTAL SCROLL */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full table-auto">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Seller</th>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Rating</th>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Sales</th>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Disputed</th>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-5">
                        <div>
                          <p className="font-semibold text-gray-900">{seller.name}</p>
                          <p className="text-sm text-gray-500">{seller.username} • {seller.joinDate}</p>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2">
                          {renderStars(Math.round(seller.rating))}
                          <span className="font-bold text-gray-900">{seller.rating}</span>
                          <span className="text-gray-500 text-sm">({seller.reviews})</span>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-gray-700 font-medium">
                        {seller.totalSales.toLocaleString()}
                      </td>
                      <td className="px-4 py-5">
                        {seller.disputed > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {seller.disputed}
                          </span>
                        ) : (
                          <span className="text-green-600 text-sm flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Clean
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-5">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                            seller.status === "verified"
                              ? "bg-emerald-100 text-emerald-700"
                              : seller.status === "warning"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {seller.status === "verified" ? "Verified" : seller.status === "warning" ? "Warning" : "Standard"}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <button
                          onClick={() => setSelectedSeller(seller)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
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

      {/* Modal - Same as before, unchanged */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start border-b pb-6 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">{selectedSeller.name}</h2>
                  <p className="text-purple-600 text-lg">{selectedSeller.username}</p>
                  <p className="text-gray-600 mt-2">{selectedSeller.bio}</p>
                </div>
                <button onClick={() => setSelectedSeller(null)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {["Overall Rating", "Total Sales", "Disputed", "Member Since"].map((label, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 text-center border">
                    <p className="text-xs text-gray-600">{label}</p>
                    {label === "Overall Rating" && (
                      <>
                        <div className="flex justify-center items-center gap-2 mt-2">
                          {renderStars(Math.round(selectedSeller.rating))}
                          <span className="text-2xl font-bold">{selectedSeller.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{selectedSeller.reviews} reviews</p>
                      </>
                    )}
                    {label === "Total Sales" && <p className="text-3xl font-bold text-purple-600 mt-2">{selectedSeller.totalSales.toLocaleString()}</p>}
                    {label === "Disputed" && <p className="text-3xl font-bold text-orange-600 mt-2">{selectedSeller.disputed}</p>}
                    {label === "Member Since" && <p className="text-xl font-bold mt-2">{selectedSeller.joinDate}</p>}
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-4">Recent Reviews</h3>
              <div className="space-y-4">
                {selectedSeller.recentReviews.map((review) => (
                  <div key={review.id} className={`p-5 rounded-xl border ${review.disputed ? "bg-orange-50 border-orange-300" : "bg-gray-50 border-gray-200"}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold">{review.buyer}</span>
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {review.date}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <div className="flex gap-4 mt-3">
                          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600">
                            <ThumbsUp className="w-4 h-4" /> Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                      {review.disputed && <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-bold">DISPUTED</span>}
                    </div>
                    {review.disputed && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">Remove Rating</button>
                        <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200">Keep Rating</button>
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200">Contact Buyer</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex gap-4 justify-center">
                <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold">Boost This Seller</button>
                <button className="px-8 py-3 bg-orange-100 text-orange-700 border border-orange-300 rounded-lg font-bold hover:bg-orange-200">Warning / Suspend</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RatingsReputationPanel;