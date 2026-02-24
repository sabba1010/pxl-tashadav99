import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthHook } from '../../hook/useAuthHook';
import Swal from 'sweetalert2';
import {
  ArrowRight,
  LucideIcon,
  Star,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Users,
  BarChart3,
  Calendar,
  AlertTriangle,
  Share2,
  Gift,
  Copy,
  Bell,
  Award,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { getAllNotifications } from '../../components/Notification/Notification';

// ─── Stat Card Component ────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, Icon, color, trend }) => (
  <div className="relative group bg-white p-4 sm:p-6 rounded-xl sm:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-125 duration-700 ${color}`} />
    <div className="relative flex flex-col gap-3 sm:gap-4">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${color.replace('bg-', 'bg-opacity-10 ')} ${color.replace('bg-', 'text-')}`}>
        <Icon size={20} className="sm:size-6" />
      </div>
      <div>
        <p className="text-gray-500 text-xs sm:text-sm font-extrabold uppercase tracking-wide">{title}</p>
        <div className="flex items-end gap-1.5 mt-1">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{value}</h2>
          {trend && (
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight size={14} className="mb-0.5" /> {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Dashboard Component ───────────────────────────────────────────
const DashboardSeller: React.FC = () => {
  const { user } = useAuth();
  const { data: userData } = useAuthHook();
  const navigate = useNavigate();

  const [listedAccounts, setListedAccounts] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingsPage, setRatingsPage] = useState(1);
  const [showReports, setShowReports] = useState(false);
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [referralData, setReferralData] = useState({
    referralCode: '',
    referralLink: '',
    referredBuyers: 0,
    referredSellers: 0,
    referralEarnings: 0
  });

  const [analytics, setAnalytics] = useState({
    totalEarned: 0,
    soldCount: 0,
    pendingClearance: 0,
    successRate: 0,
    avgRating: 0,
    totalReviews: 0,
    totalListedProducts: 0,
    totalRefunds: 0,
    reputationScore: 0
  });

  const itemsPerPage = 40;
  const ratingsPerPage = 5;

  // ─── Data Fetching ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, purchaseRes, ratingsRes, referralRes] = await Promise.all([
          axios.get<any[]>("http://localhost:3200/product/all-sells"),
          axios.get<any[]>("http://localhost:3200/purchase/getall", { params: { email: user.email, role: 'seller' } }),
          axios.get<any>(`http://localhost:3200/rating/seller/${user.email}`),
          axios.get<any>("http://localhost:3200/referral/stats", { params: { email: user.email } }),
        ]);

        const myProducts = (prodRes.data || []).filter((p: any) => p.userEmail === user.email);
        const sales = purchaseRes.data || [];
        const ratingsData = ratingsRes.data || {};

        const earned = sales
          .filter(p => p.status === 'completed' || p.status === 'confirmed')
          .reduce((sum, p) => sum + (Number(p.price) || 0), 0);

        const pending = sales
          .filter(p => p.status === 'ongoing' || p.status === 'pending')
          .reduce((sum, p) => sum + (Number(p.price) || 0), 0);

        const successfulTransactions = sales.filter(p =>
          p.status === 'completed' || p.status === 'confirmed' || p.status === 'ongoing'
        ).length;

        const failedTransactions = sales.filter(p =>
          p.status === 'rejected' || p.status === 'cancelled' || p.status === 'failed'
        ).length;

        const refundCount = sales.filter(p => p.status === 'refunded').length;

        const totalTransactions = successfulTransactions + failedTransactions;
        const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

        // Calculate Reputation Score (0-100)
        // Based on: avg rating (60%), success rate (30%), review count (10%)
        const avgRatingScore = (ratingsData.averageRating || 0) / 5 * 60;
        const successRateScore = successRate * 0.3;
        const reviewCountScore = Math.min((ratingsData.totalReviews || 0) / 50 * 10, 10);
        const reputationScore = Math.min(100, Math.round(avgRatingScore + successRateScore + reviewCountScore));

        setAnalytics(prev => ({
          ...prev,
          totalEarned: earned,
          soldCount: sales.filter(p => p.status === 'completed' || p.status === 'confirmed').length,
          pendingClearance: pending,
          successRate: Math.round(successRate * 10) / 10,
          avgRating: parseFloat(ratingsData.averageRating) || 0,
          totalReviews: ratingsData.totalReviews || 0,
          totalListedProducts: myProducts.length,
          totalRefunds: refundCount,
          reputationScore: reputationScore
        }));

        setListedAccounts(myProducts);
        setRatings(ratingsData.ratings || []);

        if (referralRes.data?.success && referralRes.data?.data) {
          const refData = referralRes.data.data;
          setReferralData({
            referralCode: refData.referralCode || '',
            referralLink: refData.referralLink || '',
            referredBuyers: refData.referredBuyers || 0,
            referredSellers: refData.referredSellers || 0,
            referralEarnings: refData.referralEarnings || 0
          });
        }

        const completedSales = sales.filter(p => {
          const status = p.status?.toLowerCase();
          return status === 'completed' || status === 'confirmed' || status === 'sold';
        });

        const topProducts = completedSales
          .map((sale: any) => ({
            name: sale.productName || 'Uncategorized Product',
            sales: 1,
            revenue: Number(sale.price) || 0,
            createdAt: sale.createdAt
          }))
          .sort((a: any, b: any) => b.revenue - a.revenue)
          .slice(0, 5);

        setBestSellingProducts(topProducts);

        const activities = [
          ...sales.map(s => ({ Icon: Zap, color: 'text-blue-500', title: 'Payment Received', desc: `Sold ${s.productName || 'Uncategorized Product'} - $${s.price}`, time: s.createdAt })),
          ...myProducts.filter(a => a.status === 'approved' || a.status === 'active').map(a => ({ Icon: ShieldCheck, color: 'text-emerald-500', title: 'Listing Live', desc: a.name, time: a.createdAt }))
        ]
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 5);

        setRecentActivities(activities);
      } catch (err) {
        console.error("Dashboard sync error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email]);

  // ─── Notifications ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getAllNotifications();
        const userRole = userData?.role;

        const myNotifs = Array.isArray(res)
          ? res.filter((n: any) => {
            const isDirect = n.userEmail === user?.email;
            const isAll = n.target === "all";
            const isRoleMatch = userRole && n.target === `${userRole}s`;
            return isDirect || isAll || isRoleMatch;
          })
          : [];

        const sortedNotifs = myNotifs.sort(
          (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );

        setNotifications(sortedNotifs);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    if (user?.email) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 8000);
      return () => clearInterval(interval);
    }
  }, [user?.email, userData?.role]);

  // ─── Reports ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:3200/purchase/report/getall");
        if (res.data && Array.isArray(res.data)) {
          const userReports = res.data.filter((report: any) =>
            report.sellerEmail === user?.email || report.reportedToEmail === user?.email
          );
          setReports(userReports);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };

    if (user?.email) fetchReports();
  }, [user?.email]);

  const totalPages = Math.max(1, Math.ceil(listedAccounts.length / itemsPerPage));
  const totalRatingsPages = Math.max(1, Math.ceil(ratings.length / ratingsPerPage));

  const paginatedAccounts = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return listedAccounts.slice(start, start + itemsPerPage);
  }, [listedAccounts, currentPage]);

  const paginatedRatings = React.useMemo(() => {
    const start = (ratingsPage - 1) * ratingsPerPage;
    return ratings.slice(start, start + ratingsPerPage);
  }, [ratings, ratingsPage]);

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | string)[] = [1];
    if (currentPage <= 4) {
      pages.push(2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#d4a643]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 sm:pb-20">
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* ─── Top Stats ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 mb-8 sm:mb-10">
          <StatCard title="Total Listed" value={analytics.totalListedProducts} Icon={LayoutGrid} color="bg-blue-500" />
          <StatCard title="Sold Items" value={analytics.soldCount} Icon={Zap} color="bg-emerald-500" />
          <StatCard title="Total Refunds" value={analytics.totalRefunds} Icon={AlertTriangle} color="bg-orange-500" />
          <StatCard title="Reputation" value={`${analytics.reputationScore}/100`} Icon={Award} color="bg-indigo-600" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 mb-8 sm:mb-10">
          <StatCard title="Total Earned" value={`$${analytics.totalEarned.toFixed(2)}`} Icon={TrendingUp} color="bg-emerald-600" trend="Real-time" />
          <StatCard title="Total Reviews" value={analytics.totalReviews} Icon={Users} color="bg-blue-600" />
          <StatCard title="Avg Rating" value={`${analytics.avgRating}/5`} Icon={Star} color="bg-amber-500" />
          <StatCard title="Net Balance" value={`$${(userData?.balance || 0).toFixed(2)}`} Icon={Wallet} color="bg-[#d4a643]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* ─── Main Content ───────────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            {/* Client Ratings & Reviews */}
            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <h3 className="font-black text-lg sm:text-xl text-gray-900 uppercase italic tracking-tight">Client Ratings & Reputation</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="text-amber-400 fill-current" size={24} />
                    <span className="text-3xl font-black text-gray-900">{analytics.avgRating}</span>
                    <span className="text-sm font-bold text-gray-400">/5</span>
                  </div>
                  <div className="h-12 w-px bg-gray-200"></div>
                  <div className="flex items-center gap-2">
                    <Award className="text-indigo-600" size={24} />
                    <span className="text-3xl font-black text-indigo-600">{analytics.reputationScore}</span>
                    <span className="text-sm font-bold text-gray-400">Rep</span>
                  </div>
                </div>
              </div>

              {ratings.length > 0 ? (
                <div className="space-y-6">
                  {/* Reputation Score Bar */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Award size={18} className="text-indigo-600" />
                        Reputation Score
                      </p>
                      <span className="text-lg font-black text-indigo-600">{analytics.reputationScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          analytics.reputationScore >= 80
                            ? 'bg-emerald-500'
                            : analytics.reputationScore >= 60
                            ? 'bg-blue-500'
                            : analytics.reputationScore >= 40
                            ? 'bg-amber-500'
                            : 'bg-orange-500'
                        }`}
                        style={{ width: `${analytics.reputationScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      {analytics.reputationScore >= 80
                        ? '✓ Excellent - Keep up the great work!'
                        : analytics.reputationScore >= 60
                        ? '✓ Good - Work on improving ratings'
                        : analytics.reputationScore >= 40
                        ? '⚠ Fair - Address customer concerns'
                        : '⚠ Low - Urgent improvement needed'}
                    </p>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {paginatedRatings.map((review, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-amber-200 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-sm sm:text-base text-gray-900">{review.buyerEmail?.split('@')[0]}</p>
                            <p className="text-xs font-mono text-gray-500">{review.buyerEmail}</p>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                size={18}
                                className={`${star <= review.rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 mb-2">{review.message}</p>
                        <p className="text-xs font-bold text-gray-400">
                          {review.productName && `Product: ${review.productName} • `}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalRatingsPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-4 border-t border-gray-100">
                      <button
                        disabled={ratingsPage === 1}
                        onClick={() => setRatingsPage(p => p - 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-md border bg-white disabled:opacity-40 hover:bg-gray-50 transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </button>
                      {Array.from({ length: totalRatingsPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setRatingsPage(page)}
                          className={`w-10 h-10 rounded-md text-sm font-semibold border transition-all ${ratingsPage === page
                              ? 'bg-[#d4a643] border-[#d4a643] text-white shadow-md'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        disabled={ratingsPage === totalRatingsPages}
                        onClick={() => setRatingsPage(p => p + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-md border bg-white disabled:opacity-40 hover:bg-gray-50 transition"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold">No reviews yet</p>
                  <p className="text-sm text-gray-300 mt-2">Start selling to receive customer reviews</p>
                </div>
              )}
            </div>

            {/* Sales Analytics & Reports */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 gap-4">
                <h3 className="font-black text-lg sm:text-xl text-gray-900 uppercase italic flex items-center gap-2">
                  <BarChart3 size={24} className="text-blue-500" /> Sales Analytics
                </h3>
                <button
                  onClick={() => setShowReports(!showReports)}
                  className="text-xs font-black text-[#d4a643] uppercase tracking-widest flex items-center gap-2 hover:bg-amber-50 px-4 py-2 rounded-full transition-all"
                >
                  {showReports ? 'Hide Report' : 'View Report'} <BarChart3 size={16} />
                </button>
              </div>

              {showReports && (
                <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                  {/* Report Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex gap-2 flex-wrap">
                      {(['daily', 'weekly', 'monthly'] as const).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => {
                            // Filter toggle - update if needed
                          }}
                          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${filter === 'monthly' ? 'bg-[#d4a643] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3 items-center sm:ml-auto">
                      <Calendar size={18} className="text-gray-400" />
                      <input
                        type="date"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="date"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Total Sales</p>
                      <p className="text-3xl font-black text-blue-900">{analytics.soldCount}</p>
                      <p className="text-sm text-blue-600 mt-2">transactions completed</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Total Revenue</p>
                      <p className="text-3xl font-black text-emerald-900">${analytics.totalEarned.toFixed(2)}</p>
                      <p className="text-sm text-emerald-600 mt-2">all-time earnings</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
                      <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Avg per Sale</p>
                      <p className="text-3xl font-black text-amber-900">
                        ${analytics.soldCount > 0 ? (analytics.totalEarned / analytics.soldCount).toFixed(2) : '0'}
                      </p>
                      <p className="text-sm text-amber-600 mt-2">average transaction</p>
                    </div>
                  </div>

                  {/* Best Selling Products */}
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                      Top Selling Products
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-black uppercase tracking-widest">Completed</span>
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">Products ranked by completed sales & revenue</p>
                    <div className="space-y-3">
                      {bestSellingProducts.length > 0 ? (
                        bestSellingProducts.map((product, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#d4a643] transition-all gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#d4a643] flex items-center justify-center text-white font-black text-sm">
                                {idx + 1}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.sales} sales</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-gray-900">${product.revenue.toFixed(2)}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                                <TrendingUp size={14} className="text-emerald-500" /> {((product.revenue / analytics.totalEarned) * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <p>No sales data available yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Inventory Pulse */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 gap-4">
                <h3 className="font-black text-lg sm:text-xl text-gray-900 uppercase italic">Inventory Pulse</h3>
                <button onClick={() => navigate('/myproducts')} className="text-xs font-black text-[#d4a643] uppercase tracking-widest flex items-center gap-2 hover:bg-amber-50 px-4 py-2 rounded-full transition-all">
                  View Listings <ArrowRight size={16} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-gray-50 text-xs sm:text-sm font-extrabold text-gray-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-4 sm:px-8 py-4">Product Name</th>
                      <th className="px-4 sm:px-8 py-4 text-center">Value</th>
                      <th className="px-4 sm:px-8 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedAccounts.map((acc) => {
                      const getStatusColor = (status: string) => {
                        switch (status?.toLowerCase()) {
                          case 'active':
                          case 'approved': return 'bg-emerald-50 text-emerald-600';
                          case 'sold': return 'bg-blue-50 text-blue-600';
                          case 'pending': return 'bg-yellow-50 text-yellow-600';
                          case 'cancelled':
                          case 'cancel': return 'bg-orange-50 text-orange-600';
                          case 'rejected':
                          case 'reject': return 'bg-red-50 text-red-600';
                          default: return 'bg-gray-50 text-gray-600';
                        }
                      };

                      return (
                        <tr key={acc._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-8 py-4">
                            <p className="font-bold text-sm sm:text-base text-gray-900">{acc.name || acc.category}</p>
                            <p className="text-xs font-mono text-gray-500">ID: {acc._id.slice(-6).toUpperCase()}</p>
                          </td>
                          <td className="px-4 sm:px-8 py-4 text-center font-black text-sm sm:text-base text-gray-900">${acc.price}</td>
                          <td className="px-4 sm:px-8 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest ${getStatusColor(acc.status)}`}>
                              {acc.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 p-6 border-t border-gray-100">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-md border bg-white disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>

                  {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span key={`dots-${idx}`} className="px-3 text-gray-400 text-sm font-semibold">...</span>
                    ) : (
                      <button
                        key={`page-${page}`}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-10 h-10 rounded-md text-sm font-semibold border transition-all ${currentPage === page
                            ? "bg-[#d4a643] border-[#d4a643] text-white shadow-md"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-md border bg-white disabled:opacity-40 hover:bg-gray-50 transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-8">
            {/* Lifetime Payout */}
            <div className="bg-[#0A1A3A] p-6 sm:p-8 rounded-2xl sm:rounded-3xl text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-700" />
              <div className="relative">
                <p className="text-sm font-bold text-white/50 uppercase tracking-widest">Lifetime Payout</p>
                <h3 className="text-4xl sm:text-5xl font-black my-6 sm:my-10 italic">
                  ${analytics.totalEarned.toFixed(2)}
                </h3>
                <button
                  onClick={() => navigate('/withdraw')}
                  className="w-full bg-[#d4a643] hover:bg-white hover:text-black py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <Wallet size={18} /> Withdraw Earnings
                </button>
              </div>
            </div>

            {/* Referral Dashboard */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-purple-200 shadow-sm">
              <h3 className="font-black text-base sm:text-lg md:text-xl text-gray-900 mb-4 sm:mb-6 uppercase tracking-tight flex items-center gap-2">
                <Share2 size={18} className="sm:w-5 sm:h-5 text-purple-600" /> Referral Dashboard
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-purple-100">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Gift size={16} /> Your Referral Link
                  </p>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={referralData.referralLink}
                      readOnly
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-600 font-mono truncate"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(referralData.referralLink);
                        Swal.fire({
                          icon: 'success',
                          title: 'Copied!',
                          toast: true,
                          position: 'top-end',
                          showConfirmButton: false,
                          timer: 3000,
                          timerProgressBar: true
                        });
                      }}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs sm:text-sm font-bold uppercase transition-all flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap flex-shrink-0"
                    >
                      <Copy size={14} className="sm:w-4 sm:h-4" /> Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Share to earn commissions</p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-100 text-center">
                    <p className="text-lg sm:text-2xl font-black text-purple-600">{referralData.referredBuyers}</p>
                    <p className="text-xs text-gray-600 font-bold uppercase mt-1">Buyers</p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100 text-center">
                    <p className="text-lg sm:text-2xl font-black text-blue-600">{referralData.referredSellers}</p>
                    <p className="text-xs text-gray-600 font-bold uppercase mt-1">Sellers</p>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-100 text-center">
                    <p className="text-lg sm:text-2xl font-black text-green-600">${referralData.referralEarnings.toFixed(2)}</p>
                    <p className="text-xs text-gray-600 font-bold uppercase mt-1">Earnings</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/referral')}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <Share2 size={16} className="sm:w-5 sm:h-5" /> Full Referral Dashboard
                </button>
              </div>
            </div>

            {/* Activity Stream */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-lg sm:text-xl text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                <Zap size={20} className="text-blue-500 fill-current" /> Activity Stream
              </h3>
              <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex gap-4 relative group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 shadow-sm transition-all group-hover:scale-110 border-4 border-white ${act.color.replace('text-', 'bg-').replace('500', '100')} ${act.color}`}>
                      <act.Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                        <p className="text-sm font-black text-gray-900 uppercase">{act.title}</p>
                        <span className="text-xs font-bold text-gray-400">
                          {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-lg sm:text-xl text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                <AlertTriangle size={20} className="text-orange-500" /> Reports
              </h3>
              <div className="space-y-4">
                {reports.length > 0 ? (
                  <>
                    {reports.slice(0, 3).map((report: any, idx: number) => {
                      const getStatusColor = (status: string) => {
                        const lower = status?.toLowerCase();
                        switch (lower) {
                          case 'pending':
                          case 'open': return { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' };
                          case 'resolved': return { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' };
                          case 'refunded': return { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' };
                          default: return { bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-700' };
                        }
                      };

                      const statusColor = getStatusColor(report.status);
                      const reporter = (report.reportedByEmail || report.buyerEmail || 'Unknown').split('@')[0];

                      return (
                        <div key={idx} className={`p-4 rounded-xl border ${statusColor.border} ${statusColor.bg} hover:shadow-md transition-all`}>
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-bold text-sm text-gray-900">Report from {reporter}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor.badge}`}>
                              {report.status || 'Unknown'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{(report.description || report.message || '').substring(0, 100)}...</p>
                          <div className="text-xs text-gray-500 flex flex-wrap gap-3">
                            <span>Order: #{report.orderId || report._id?.slice(-8).toUpperCase() || 'N/A'}</span>
                            <span>Role: {report.role || 'buyer'}</span>
                            <span>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      onClick={() => navigate('/reports')}
                      className="w-full mt-4 py-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-sm font-black text-orange-600 uppercase tracking-widest transition-all"
                    >
                      View All {reports.length} Reports →
                    </button>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <AlertTriangle size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold">No reports yet</p>
                    <p className="text-sm text-gray-300 mt-2">No disputes at this time.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Compliance & Notices */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-black text-lg sm:text-xl text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                <Bell size={20} className="text-blue-600" /> Compliance & Notices
              </h3>
              {notifications.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {notifications.map((n, idx) => (
                    <div
                      key={n._id || idx}
                      className={`p-4 rounded-xl border-l-4 ${n.read ? 'bg-gray-50 border-l-gray-300' : 'bg-blue-50 border-l-blue-600'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-900 uppercase">{n.title}</p>
                          <p className="text-sm text-gray-700 mt-1">{n.message || n.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                        {n.type && (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                            style={{
                              backgroundColor: n.type === 'warning' ? '#FEF3C7' : n.type === 'alert' ? '#FEE2E2' : '#DBEAFE',
                              color: n.type === 'warning' ? '#92400E' : n.type === 'alert' ? '#991B1B' : '#1E40AF'
                            }}
                          >
                            {n.type}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold">No notices</p>
                  <p className="text-sm text-gray-300 mt-2">You're all set!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardSeller;