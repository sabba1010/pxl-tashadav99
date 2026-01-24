// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { useAuthHook } from '../../hook/useAuthHook';
// import Swal from 'sweetalert2';
// import {
//   ArrowRight,
//   LucideIcon,
//   Star,
//   TrendingUp,
//   Wallet,
//   ArrowUpRight,
//   ShieldCheck,
//   Zap,
//   LayoutGrid,
//   Users,
//   BarChart3,
//   Calendar,
//   AlertTriangle,
//   Clock,
//   CheckCircle2,
//   Share2,
//   Gift,
//   Copy,
//   Bell
// } from 'lucide-react';
// import { getAllNotifications } from '../../components/Notification/Notification';

// // --- Stat Card Component ---
// interface StatCardProps {
//   title: string;
//   value: string | number;
//   Icon: LucideIcon;
//   color: string;
//   trend?: string;
// }

// const StatCard: React.FC<StatCardProps> = ({ title, value, Icon, color, trend }) => (
//   <div className="relative group bg-white p-3 sm:p-6 rounded-lg sm:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
//     <div className={`absolute -right-4 -top-4 w-20 sm:w-24 h-20 sm:h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-700 ${color}`} />
//     <div className="relative flex flex-col gap-2 sm:gap-4">
//       <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-2xl flex items-center justify-center ${color.replace('bg-', 'bg-opacity-20 ')} ${color.replace('bg-', 'text-')}`}>
//         <Icon size={18} className="sm:w-6 sm:h-6" />
//       </div>
//       <div>
//         <p className="text-gray-400 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em]">{title}</p>
//         <div className="flex items-end gap-1 sm:gap-2">
//           <h2 className="text-xl sm:text-3xl font-black text-gray-900 mt-1">{value}</h2>
//           {trend && <span className="text-[8px] sm:text-[10px] font-bold text-emerald-500 mb-1 flex items-center"><ArrowUpRight size={10} />{trend}</span>}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const DashboardSeller: React.FC = () => {
//   const { user } = useAuth();
//   const { data: userData } = useAuthHook();
//   const navigate = useNavigate();

//   const [listedAccounts, setListedAccounts] = useState<any[]>([]);
//   const [recentActivities, setRecentActivities] = useState<any[]>([]);
//   const [ratings, setRatings] = useState<any[]>([]);
//   const [reports, setReports] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [ratingsPage, setRatingsPage] = useState(1);
//   const [showReports, setShowReports] = useState(false);
//   const [reportFilter, setReportFilter] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const itemsPerPage = 10;
//   const ratingsPerPage = 5;
//   const [analytics, setAnalytics] = useState({
//     totalEarned: 0,
//     soldCount: 0,
//     pendingClearance: 0,
//     successRate: 0,
//     avgRating: 0,
//     totalReviews: 0
//   });

//   const [referralData, setReferralData] = useState({
//     referralCode: '',
//     referralLink: '',
//     referredBuyers: 0,
//     referredSellers: 0,
//     referralEarnings: 0
//   });

//   useEffect(() => {
//     if (!user?.email) return;

//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [prodRes, purchaseRes, ratingsRes, referralRes] = await Promise.all([
//           axios.get<any[]>("http://localhost:3200/product/all-sells"),
//           axios.get<any[]>("http://localhost:3200/purchase/getall", { params: { email: user.email, role: 'seller' } }),
//           axios.get<any>(`http://localhost:3200/rating/seller/${user.email}`),
//           axios.get<any>("http://localhost:3200/referral/stats", { params: { email: user.email } }),
//         ]);

//         const myProducts = (prodRes.data || []).filter((p: any) => p.userEmail === user.email);
//         const sales = purchaseRes.data || [];
//         const ratingsData = ratingsRes.data || {};

//         // REAL EARNINGS: Sum of completed/confirmed purchases
//         const earned = sales
//           .filter(p => p.status === 'completed' || p.status === 'confirmed')
//           .reduce((sum, p) => sum + (Number(p.price) || 0), 0);

//         const pending = sales
//           .filter(p => p.status === 'ongoing' || p.status === 'pending')
//           .reduce((sum, p) => sum + (Number(p.price) || 0), 0);

//         // SUCCESS RATE: Based on successful vs failed transactions
//         // Successful = completed, confirmed, ongoing
//         // Failed = rejected, cancelled, failed
//         const successfulTransactions = sales.filter(p =>
//           p.status === 'completed' || p.status === 'confirmed' || p.status === 'ongoing'
//         ).length;

//         const failedTransactions = sales.filter(p =>
//           p.status === 'rejected' || p.status === 'cancelled' || p.status === 'failed'
//         ).length;

//         const totalTransactions = successfulTransactions + failedTransactions;
//         const successRate = totalTransactions > 0
//           ? (successfulTransactions / totalTransactions) * 100
//           : 0;

//         setAnalytics(prev => ({
//           ...prev,
//           totalEarned: earned,
//           soldCount: sales.filter(p => p.status === 'completed' || p.status === 'confirmed').length,
//           pendingClearance: pending,
//           successRate: Math.round(successRate * 10) / 10, // Round to 1 decimal place
//           avgRating: parseFloat(ratingsData.averageRating) || 0,
//           totalReviews: ratingsData.totalReviews || 0
//         }));

//         setListedAccounts(myProducts);
//         setRatings(ratingsData.ratings || []);

//         // Set referral data from backend
//         if (referralRes.data?.success && referralRes.data?.data) {
//           const refData = referralRes.data.data;
//           setReferralData({
//             referralCode: refData.referralCode || '',
//             referralLink: refData.referralLink || '',
//             referredBuyers: refData.referredBuyers || 0,
//             referredSellers: refData.referredSellers || 0,
//             referralEarnings: refData.referralEarnings || 0
//           });
//         }

//         // Get top selling products - show individual products without grouping
//         const completedSales = sales.filter(p => {
//           const status = p.status?.toLowerCase();
//           return status === 'completed' || status === 'confirmed' || status === 'sold';
//         });

//         const topProducts = completedSales
//           .map((sale: any) => ({
//             name: sale.productName || 'Unknown',
//             sales: 1,
//             revenue: Number(sale.price) || 0,
//             createdAt: sale.createdAt
//           }))
//           .sort((a: any, b: any) => b.revenue - a.revenue)
//           .slice(0, 5);

//         setBestSellingProducts(topProducts);

//         // Calculate daily earnings
//         const dailyData: any = {};
//         sales
//           .filter(p => p.status === 'completed' || p.status === 'confirmed' || p.status === 'sold')
//           .forEach((sale: any) => {
//             const date = new Date(sale.createdAt).toLocaleDateString();
//             if (!dailyData[date]) {
//               dailyData[date] = 0;
//             }
//             dailyData[date] += Number(sale.price) || 0;
//           });

//         // Daily earnings data (can be used for charts if needed)
//         // Object.entries(dailyData)
//         //   .sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
//         //   .slice(-30)
//         //   .map(([date, amount]: any) => ({ date, amount }));

//         const activities = [
//           ...sales.map(s => ({ Icon: Zap, color: 'text-blue-500', title: 'Payment Received', desc: `Sold ${s.productName || 'Account'} - $${s.price}`, time: s.createdAt })),
//           ...myProducts.filter(a => a.status === 'approved' || a.status === 'active').map(a => ({ Icon: ShieldCheck, color: 'text-emerald-500', title: 'Listing Live', desc: a.name, time: a.createdAt }))
//         ]
//           .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
//           .slice(0, 5);

//         setRecentActivities(activities);
//       } catch (err) {
//         console.error("Dashboard sync error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user?.email]);

//   // Fetch notifications for Compliance & Account Notices section
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await getAllNotifications();
//         const userRole = userData?.role;

//         const myNotifs = Array.isArray(res)
//           ? res.filter((n: any) => {
//               const isDirect = n.userEmail === user?.email;
//               const isAll = n.target === "all";
//               const isRoleMatch = userRole && n.target === `${userRole}s`;
//               return isDirect || isAll || isRoleMatch;
//             })
//           : [];

//         const sortedNotifs = myNotifs.sort(
//           (a: any, b: any) =>
//             new Date(b.createdAt || 0).getTime() -
//             new Date(a.createdAt || 0).getTime()
//         );

//         setNotifications(sortedNotifs);
//       } catch (err) {
//         console.error("Failed to fetch notifications:", err);
//       }
//     };

//     if (user?.email) {
//       fetchNotifications();
//       const interval = setInterval(fetchNotifications, 8000);
//       return () => clearInterval(interval);
//     }
//   }, [user?.email, userData?.role]);

//   // Fetch Reports data
//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const res = await axios.get("http://localhost:3200/purchase/report/getall");
        
//         if (res.data && Array.isArray(res.data)) {
//           // Filter reports for this user if needed (by email or role as seller)
//           const userReports = res.data.filter((report: any) => 
//             report.sellerEmail === user?.email || report.reportedToEmail === user?.email
//           );
//           setReports(userReports);
//         }
//       } catch (err) {
//         console.error("Failed to fetch reports:", err);
//       }
//     };

//     if (user?.email) {
//       fetchReports();
//     }
//   }, [user?.email]);

//   const totalPages = Math.max(1, Math.ceil(listedAccounts.length / itemsPerPage));
//   const totalRatingsPages = Math.max(1, Math.ceil(ratings.length / ratingsPerPage));

//   const paginatedAccounts = React.useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return listedAccounts.slice(start, start + itemsPerPage);
//   }, [listedAccounts, currentPage]);

//   const paginatedRatings = React.useMemo(() => {
//     const start = (ratingsPage - 1) * ratingsPerPage;
//     return ratings.slice(start, start + ratingsPerPage);
//   }, [ratings, ratingsPage]);

//   const getPageNumbers = () => {
//     if (totalPages <= 7) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }

//     const pages: (number | string)[] = [];
//     pages.push(1);

//     if (currentPage <= 4) {
//       pages.push(2, 3, 4, 5);
//       pages.push("...");
//       pages.push(totalPages);
//     } else if (currentPage >= totalPages - 3) {
//       pages.push("...");
//       for (let i = totalPages - 4; i < totalPages; i++) {
//         pages.push(i);
//       }
//       pages.push(totalPages);
//     } else {
//       pages.push("...");
//       pages.push(currentPage - 1, currentPage, currentPage + 1);
//       pages.push("...");
//       pages.push(totalPages);
//     }

//     return pages;
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen bg-white">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4a643]"></div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#FBFBFB] pb-20">
//       {/* --- Modern Header --- */}
//       <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
//         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
//           <div className="flex items-center gap-2 sm:gap-3">
//             <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
//               <LayoutGrid className="text-[#d4a643] w-4 sm:w-5 h-4 sm:h-5" size={16} />
//             </div>
//             <h1 className="text-sm sm:text-xl font-black tracking-tighter uppercase italic">Seller<span className="text-[#d4a643]">Vault</span></h1>
//           </div>
//           <div className="flex items-center gap-3 sm:gap-6">
//             <div className="hidden md:flex flex-col items-end border-r pr-3 sm:pr-6 border-gray-100">
//               <div className="flex items-center gap-1 text-amber-500">
//                 <Star size={12} className="sm:w-4 sm:h-4 fill-current" /> <span className="font-black text-xs sm:text-sm text-black">{analytics.avgRating}</span>
//               </div>
//               <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">Global Rep</p>
//             </div>
//             <div className="flex items-center gap-2 sm:gap-3">
//               <div className="text-right hidden xs:block">
//                 <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tight">Verified Seller</p>
//                 <p className="text-[10px] sm:text-xs font-bold text-gray-900">{user?.email?.split('@')[0]}</p>
//               </div>
//               <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-tr from-[#d4a643] to-amber-200 border-2 border-white shadow-md" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
//         {/* --- Top Metrics Grid --- */}
//         <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
//           <StatCard title="Total Earned" value={`$${analytics.totalEarned.toFixed(2)}`} Icon={TrendingUp} color="bg-emerald-500" trend="Real-time" />
//           <StatCard title="Total Reviews" value={analytics.totalReviews} Icon={Users} color="bg-blue-600" />
//           <StatCard title="Success Rate" value={`${analytics.successRate.toFixed(1)}%`} Icon={ShieldCheck} color="bg-indigo-600" />
//           <StatCard title="Net Balance" value={`$${(userData?.balance || 0).toFixed(2)}`} Icon={Wallet} color="bg-[#d4a643]" />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
//           {/* --- Main Section --- */}
//           <div className="lg:col-span-8 space-y-6 sm:space-y-8">
//             {/* Rating Breakdown Card */}
//             <div className="bg-white p-4 sm:p-8 rounded-lg sm:rounded-[2.5rem] border border-gray-100 shadow-sm">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
//                 <h3 className="font-black text-lg sm:text-xl text-gray-900 tracking-tight uppercase italic">Client Ratings & Reviews</h3>
//                 <div className="flex items-center gap-2">
//                   <Star className="text-amber-400 fill-current" size={20} />
//                   <span className="text-2xl font-black text-gray-900">{analytics.avgRating}</span>
//                   <span className="text-sm font-bold text-gray-400">/5</span>
//                 </div>
//               </div>

//               {ratings.length > 0 ? (
//                 <div className="space-y-6">
//                   {/* Rating Summary */}
//                   <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 pb-4 sm:pb-6 border-b border-gray-100">
//                     <div className="text-center">
//                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Reviews</p>
//                       <p className="text-2xl font-black text-gray-900 mt-2">{analytics.totalReviews}</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg Rating</p>
//                       <p className="text-2xl font-black text-amber-500 mt-2">{analytics.avgRating}</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">5 Star</p>
//                       <p className="text-2xl font-black text-emerald-500 mt-2">{ratings.filter(r => r.rating === 5).length}</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">4 Star</p>
//                       <p className="text-2xl font-black text-blue-500 mt-2">{ratings.filter(r => r.rating === 4).length}</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Below 4</p>
//                       <p className="text-2xl font-black text-orange-500 mt-2">{ratings.filter(r => r.rating < 4).length}</p>
//                     </div>
//                   </div>

//                   {/* Individual Reviews */}
//                   <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
//                     {paginatedRatings.map((review, idx) => (
//                       <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all">
//                         <div className="flex items-start justify-between mb-3">
//                           <div>
//                             <p className="font-bold text-sm text-gray-900">{review.buyerEmail?.split('@')[0]}</p>
//                             <p className="text-[9px] font-mono text-gray-400">{review.buyerEmail}</p>
//                           </div>
//                           <div className="flex gap-1">
//                             {[1, 2, 3, 4, 5].map(star => (
//                               <Star
//                                 key={star}
//                                 size={14}
//                                 className={`${star <= review.rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`}
//                               />
//                             ))}
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-700 mb-2">{review.message}</p>
//                         <p className="text-[9px] font-bold text-gray-400">
//                           {review.productName && `Product: ${review.productName} • `}
//                           {new Date(review.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Pagination */}
//                   {totalRatingsPages > 1 && (
//                     <div className="flex justify-center items-center gap-2 pt-4 border-t border-gray-100">
//                       <button
//                         disabled={ratingsPage === 1}
//                         onClick={() => setRatingsPage((p) => p - 1)}
//                         className="w-8 h-8 flex items-center justify-center rounded-md border bg-white disabled:opacity-30 hover:bg-gray-50 transition shadow-sm"
//                       >
//                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="m15 18-6-6 6-6" />
//                         </svg>
//                       </button>
//                       {Array.from({ length: totalRatingsPages }, (_, i) => i + 1).map(page => (
//                         <button
//                           key={page}
//                           onClick={() => setRatingsPage(page)}
//                           className={`w-8 h-8 rounded-md text-xs font-semibold border transition-all duration-200 shadow-sm ${ratingsPage === page
//                               ? 'bg-[#d4a643] border-[#d4a643] text-white scale-105 shadow-md'
//                               : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
//                             }`}
//                         >
//                           {page}
//                         </button>
//                       ))}
//                       <button
//                         disabled={ratingsPage === totalRatingsPages}
//                         onClick={() => setRatingsPage((p) => p + 1)}
//                         className="w-8 h-8 flex items-center justify-center rounded-md border bg-white disabled:opacity-30 hover:bg-gray-50 transition shadow-sm"
//                       >
//                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <path d="m9 18 6-6-6-6" />
//                         </svg>
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <Star size={48} className="mx-auto text-gray-200 mb-4" />
//                   <p className="text-gray-400 font-bold">No reviews yet</p>
//                   <p className="text-xs text-gray-300 mt-2">Start selling to receive customer reviews</p>
//                 </div>
//               )}
//             </div>

//             {/* Sales Analytics & Reports Section */}
//             <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
//               <div className="p-8 flex justify-between items-center border-b border-gray-50">
//                 <h3 className="font-black text-xl text-gray-900 tracking-tight uppercase italic flex items-center gap-2">
//                   <BarChart3 size={24} className="text-blue-500" />Sales Analytics
//                 </h3>
//                 <button
//                   onClick={() => setShowReports(!showReports)}
//                   className="text-[11px] font-black text-[#d4a643] uppercase tracking-widest flex items-center gap-2 hover:bg-amber-50 px-4 py-2 rounded-full transition-all"
//                 >
//                   {showReports ? 'Hide Report' : 'View Report'} <BarChart3 size={14} />
//                 </button>
//               </div>

//               {showReports && (
//                 <div className="p-8 space-y-8">
//                   {/* Report Controls */}
//                   <div className="flex flex-col sm:flex-row gap-4 items-center">
//                     <div className="flex gap-2">
//                       {(['daily', 'weekly', 'monthly'] as const).map((filter) => (
//                         <button
//                           key={filter}
//                           onClick={() => setReportFilter(filter)}
//                           className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${reportFilter === filter
//                               ? 'bg-[#d4a643] text-white'
//                               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                             }`}
//                         >
//                           {filter}
//                         </button>
//                       ))}
//                     </div>
//                     <div className="flex gap-3 items-center ml-auto">
//                       <Calendar size={16} className="text-gray-400" />
//                       <input
//                         type="date"
//                         className="px-3 py-2 border border-gray-300 rounded-lg text-xs"
//                         onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
//                       />
//                       <span className="text-gray-400">to</span>
//                       <input
//                         type="date"
//                         className="px-3 py-2 border border-gray-300 rounded-lg text-xs"
//                         onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
//                       />
//                     </div>
//                   </div>

//                   {/* Sales Summary Cards */}
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
//                       <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Total Sales</p>
//                       <p className="text-3xl font-black text-blue-900">{analytics.soldCount}</p>
//                       <p className="text-[10px] text-blue-600 mt-2">transactions completed</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
//                       <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">Total Revenue</p>
//                       <p className="text-3xl font-black text-emerald-900">${analytics.totalEarned.toFixed(2)}</p>
//                       <p className="text-[10px] text-emerald-600 mt-2">all-time earnings</p>
//                     </div>
//                     <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
//                       <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Avg per Sale</p>
//                       <p className="text-3xl font-black text-amber-900">${analytics.soldCount > 0 ? (analytics.totalEarned / analytics.soldCount).toFixed(2) : '0'}</p>
//                       <p className="text-[10px] text-amber-600 mt-2">average transaction</p>
//                     </div>
//                   </div>

//                   {/* Best Selling Products - Completed Only */}
//                   <div>
//                     <h4 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
//                       Top Selling Products
//                       <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-black uppercase tracking-widest">Completed</span>
//                     </h4>
//                     <p className="text-xs text-gray-500 mb-4">Products ranked by completed sales & revenue</p>
//                     <div className="space-y-3">
//                       {bestSellingProducts.length > 0 ? (
//                         bestSellingProducts.map((product, idx) => (
//                           <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#d4a643] transition-all">
//                             <div className="flex-1">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 rounded-full bg-[#d4a643] flex items-center justify-center text-white font-black text-xs">
//                                   {idx + 1}
//                                 </div>
//                                 <div>
//                                   <p className="font-bold text-gray-900">{product.name}</p>
//                                   <p className="text-[10px] text-gray-500">{product.sales} sales</p>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <p className="font-black text-gray-900">${product.revenue.toFixed(2)}</p>
//                               <p className="text-[10px] text-gray-500 flex items-center gap-1 justify-end">
//                                 <TrendingUp size={12} className="text-emerald-500" /> {((product.revenue / analytics.totalEarned) * 100).toFixed(1)}%
//                               </p>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-center py-8 text-gray-400">
//                           <p>No sales data available yet</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Earnings Trend Chart (Simple Bar Representation) */}
//                  {/* 
                 
//  <div>
//                     <h4 className="font-bold text-lg text-gray-900 mb-4">Earnings Trend (Last 30 Days)</h4>
//                     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 min-h-64">
//                       {dailyEarnings.length > 0 ? (
//                         <div className="space-y-4">
//                           {/* Chart Container */}
//                           {/* <div className="flex items-end justify-center gap-1 h-48 bg-white rounded-lg p-4 relative">
//                             {dailyEarnings.map((item, idx) => {
//                               const maxAmount = Math.max(...dailyEarnings.map((d: any) => d.amount), 1);
//                               const heightPercent = (item.amount / maxAmount) * 100;
//                               return (
//                                 <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative">
//                                   <div className="w-full bg-gradient-to-t from-[#d4a643] to-amber-300 rounded-t hover:opacity-80 transition-all"
//                                     style={{ height: `${heightPercent}%`, minHeight: '4px' }}>
//                                   </div>
//                                   <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[8px] rounded px-2 py-1 whitespace-nowrap absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
//                                     ${item.amount.toFixed(2)}
//                                   </div>
//                                   <span className="text-[8px] text-gray-600 text-center truncate">{item.date.split('/')[1]}</span>
//                                 </div>
//                               );
//                             })}
//                           </div> */}
//                           {/* Stats */}
//                           {/* <div className="grid grid-cols-3 gap-4 text-center text-xs">
//                             <div>
//                               <p className="text-gray-500">Highest Day</p>
//                               <p className="font-bold text-gray-900">${Math.max(...dailyEarnings.map((d: any) => d.amount)).toFixed(2)}</p>
//                             </div>
//                             <div>
//                               <p className="text-gray-500">Avg per Day</p>
//                               <p className="font-bold text-gray-900">${(dailyEarnings.reduce((sum: number, d: any) => sum + d.amount, 0) / dailyEarnings.length).toFixed(2)}</p>
//                             </div>
//                             <div>
//                               <p className="text-gray-500">Days Active</p>
//                               <p className="font-bold text-gray-900">{dailyEarnings.length}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-center h-48 text-gray-400">
//                           <p>No earnings data available yet</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//  */}

         

//                 </div>
//               )}
//             </div>

//             {/* Inventory Table */}
//             <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
//               <div className="p-8 flex justify-between items-center border-b border-gray-50">
//                 <h3 className="font-black text-xl text-gray-900 tracking-tight uppercase italic">Inventory Pulse</h3>
//                 <button onClick={() => navigate('/myproducts')} className="text-[11px] font-black text-[#d4a643] uppercase tracking-widest flex items-center gap-2 hover:bg-amber-50 px-4 py-2 rounded-full transition-all">
//                   View Listings <ArrowRight size={14} />
//                 </button>
//               </div>
//               <div className="overflow-x-auto -mx-4 sm:mx-0">
//                 <table className="w-full text-left text-sm">
//                   <thead className="bg-[#FAFAFA] text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
//                     <tr>
//                       <th className="px-3 sm:px-8 py-3 sm:py-5">Product Name</th>
//                       <th className="px-3 sm:px-8 py-3 sm:py-5 text-center">Value</th>
//                       <th className="px-3 sm:px-8 py-3 sm:py-5 text-center">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {paginatedAccounts.map((acc) => {
//                       const getStatusColor = (status: string) => {
//                         switch (status?.toLowerCase()) {
//                           case 'active':
//                           case 'approved':
//                             return 'bg-emerald-50 text-emerald-600';
//                           case 'sold':
//                             return 'bg-blue-50 text-blue-600';
//                           case 'pending':
//                             return 'bg-yellow-50 text-yellow-600';
//                           case 'cancelled':
//                           case 'cancel':
//                             return 'bg-orange-50 text-orange-600';
//                           case 'rejected':
//                           case 'reject':
//                             return 'bg-red-50 text-red-600';
//                           default:
//                             return 'bg-gray-50 text-gray-600';
//                         }
//                       };
//                       return (
//                         <tr key={acc._id} className="hover:bg-gray-50/50 transition-colors">
//                           <td className="px-3 sm:px-8 py-3 sm:py-6">
//                             <p className="text-xs sm:text-sm font-bold text-gray-900">{acc.name || acc.category}</p>
//                             <p className="text-[8px] sm:text-[9px] font-mono text-gray-400">ID: {acc._id.slice(-6).toUpperCase()}</p>
//                           </td>
//                           <td className="px-3 sm:px-8 py-3 sm:py-6 text-center font-black text-gray-900 text-xs sm:text-sm">${acc.price}</td>
//                           <td className="px-3 sm:px-8 py-3 sm:py-6 text-center">
//                             <span className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${getStatusColor(acc.status)}`}>
//                               {acc.status}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination View */}
//               {totalPages > 1 && (
//                 <div className="flex justify-center items-center gap-2 p-8 border-t border-gray-50">
//                   {/* Prev Button */}
//                   <button
//                     disabled={currentPage === 1}
//                     onClick={() => setCurrentPage((p) => p - 1)}
//                     className="w-8 h-8 flex items-center justify-center rounded-md border bg-white disabled:opacity-30 hover:bg-gray-50 transition shadow-sm"
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="m15 18-6-6 6-6" />
//                     </svg>
//                   </button>

//                   {/* Page Numbers */}
//                   {getPageNumbers().map((page, idx) =>
//                     page === "..." ? (
//                       <span
//                         key={`dots-${idx}`}
//                         className="px-2 text-gray-400 text-xs font-semibold"
//                       >
//                         ...
//                       </span>
//                     ) : (
//                       <button
//                         key={`page-${page}`}
//                         onClick={() => setCurrentPage(page as number)}
//                         className={`w-8 h-8 rounded-md text-xs font-semibold border transition-all duration-200 shadow-sm ${currentPage === page
//                           ? "bg-[#d4a643] border-[#d4a643] text-white scale-105 shadow-md"
//                           : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
//                           }`}
//                       >
//                         {page}
//                       </button>
//                     )
//                   )}

//                   {/* Next Button */}
//                   <button
//                     disabled={currentPage === totalPages}
//                     onClick={() => setCurrentPage((p) => p + 1)}
//                     className="w-8 h-8 flex items-center justify-center rounded-md border bg-white disabled:opacity-30 hover:bg-gray-50 transition shadow-sm"
//                   >
//                     <svg
//                       width="14"
//                       height="14"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="m9 18 6-6-6-6" />
//                     </svg>
//                   </button>
//                 </div>
//               )}
//             </div>


//           </div>

//           {/* --- Sidebar Section --- */}
//           <div className="lg:col-span-4 space-y-6 sm:space-y-8">
//             <div className="bg-[#0A1A3A] p-4 sm:p-8 rounded-lg sm:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
//               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
//               <div className="relative">
//                 {/* <div className="flex items-center gap-2 mb-6">
//                     <Award className="text-amber-400" size={20}/>
//                     <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Tier 1 Elite</span>
//                   </div> */}
//                 <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Lifetime Payout</p>
//                 <h3 className="text-5xl font-black mb-10 text-white italic">${analytics.totalEarned.toFixed(2)}</h3>
//                 <button onClick={() => navigate('/withdraw')} className="w-full bg-[#d4a643] hover:bg-white hover:text-black py-4 rounded-2xl text-xs font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2">
//                   <Wallet size={16} /> Withdraw Earnings
//                 </button>
//               </div>
//             </div>

//             {/* Referral Dashboard Section */}
//             <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-8 rounded-lg sm:rounded-[2.5rem] border border-purple-200 shadow-sm">
//               <h3 className="font-black text-lg text-gray-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
//                 <Share2 size={18} className="text-purple-600" /> Referral Dashboard
//               </h3>
//               <div className="space-y-4">
//                 {/* Referral Link Card */}
//                 <div className="bg-white p-5 rounded-xl border border-purple-100 hover:shadow-md transition-all">
//                   <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2 flex items-center gap-2">
//                     <Gift size={14} /> Your Personal Referral Link
//                   </p>
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="text"
//                       value={referralData.referralLink}
//                       readOnly
//                       className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-600 font-mono"
//                     />
//                     <button 
//                       onClick={() => {
//                         navigator.clipboard.writeText(referralData.referralLink);
//                         Swal.fire({
//                           icon: 'success',
//                           title: 'Copied!',
//                           text: 'Referral link copied to clipboard',
//                           toast: true,
//                           position: 'top-end',
//                           showConfirmButton: false,
//                           timer: 3000,
//                           timerProgressBar: true,
//                           didOpen: (toast) => {
//                             toast.addEventListener('mouseenter', Swal.stopTimer)
//                             toast.addEventListener('mouseleave', Swal.resumeTimer)
//                           }
//                         });
//                       }}
//                       className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2"
//                     >
//                       <Copy size={12} /> Copy
//                     </button>
//                   </div>
//                   <p className="text-[9px] text-gray-500 mt-2">Share this link to earn commissions on referrals</p>
//                 </div>

//                 {/* Referral Stats Grid */}
//                 <div className="grid grid-cols-3 gap-2 sm:gap-3">
//                   <div className="bg-white p-4 rounded-xl border border-purple-100 text-center hover:shadow-md transition-all">
//                     <p className="text-2xl font-black text-purple-600">{referralData.referredBuyers}</p>
//                     <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">Referred Buyers</p>
//                   </div>
//                   <div className="bg-white p-4 rounded-xl border border-blue-100 text-center hover:shadow-md transition-all">
//                     <p className="text-2xl font-black text-blue-600">{referralData.referredSellers}</p>
//                     <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">Referred Sellers</p>
//                   </div>
//                   <div className="bg-white p-4 rounded-xl border border-green-100 text-center hover:shadow-md transition-all">
//                     <p className="text-2xl font-black text-green-600">${referralData.referralEarnings.toFixed(2)}</p>
//                     <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">Referral Earnings</p>
//                   </div>
//                 </div>

//                 {/* Referral Button */}
//                 <button 
//                   onClick={() => navigate('/referral')}
//                   className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
//                 >
//                   <Share2 size={14} /> View Full Referral Dashboard
//                 </button>
//               </div>
//             </div>

//             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
//               <h3 className="font-black text-lg text-gray-900 mb-8 uppercase tracking-tighter flex items-center gap-2">
//                 <Zap size={18} className="text-blue-500 fill-current" /> Activity Stream
//               </h3>
//               <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
//                 {recentActivities.map((act, i) => (
//                   <div key={i} className="flex gap-4 relative group">
//                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 shadow-sm transition-all group-hover:scale-110 border-4 border-white ${act.color.replace('text-', 'bg-').replace('500', '100')} ${act.color}`}>
//                       <act.Icon size={16} />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex justify-between items-center">
//                         <p className="text-xs font-black text-gray-900 uppercase">{act.title}</p>
//                         <span className="text-[9px] font-bold text-gray-400">{new Date(act.time).getHours()}:{new Date(act.time).getMinutes()}</span>
//                       </div>
//                       <p className="text-[10px] text-gray-500 font-medium mt-0.5">{act.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Buyer Reports Section */}
//             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
//               <h3 className="font-black text-lg text-gray-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
//                 <AlertTriangle size={18} className="text-orange-500" />Reports
//               </h3>
//               <div className="space-y-3">
//                 {reports.length > 0 ? (
//                   <>
//                     {reports.slice(0, 3).map((report: any, idx: number) => {
//                       const getStatusColor = (status: string) => {
//                         const lowerStatus = status?.toLowerCase();
//                         switch (lowerStatus) {
//                           case 'pending':
//                           case 'open':
//                             return {
//                               border: 'border-yellow-200',
//                               bg: 'bg-yellow-50',
//                               badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
//                               icon: Clock
//                             };
//                           case 'resolved':
//                             return {
//                               border: 'border-emerald-200',
//                               bg: 'bg-emerald-50',
//                               badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
//                               icon: CheckCircle2
//                             };
//                           case 'refunded':
//                             return {
//                               border: 'border-blue-200',
//                               bg: 'bg-blue-50',
//                               badge: 'bg-blue-100 text-blue-700 border-blue-200',
//                               icon: CheckCircle2
//                             };
//                           default:
//                             return {
//                               border: 'border-gray-200',
//                               bg: 'bg-gray-50',
//                               badge: 'bg-gray-100 text-gray-700 border-gray-200',
//                               icon: AlertTriangle
//                             };
//                         }
//                       };

//                       const statusColor = getStatusColor(report.status);
//                       const StatusIcon = statusColor.icon;
//                       const reporterEmail = report.reportedByEmail || report.buyerEmail || 'Unknown';
//                       const reporterName = reporterEmail.split('@')[0];

//                       return (
//                         <div key={idx} className={`p-4 rounded-xl border-2 ${statusColor.border} ${statusColor.bg} hover:shadow-md transition-all group cursor-pointer`}>
//                           <div className="flex items-start justify-between mb-3">
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <p className="text-xs font-black text-gray-900 uppercase">Report from {reporterName}</p>
//                               </div>
//                               <p className="text-[10px] text-gray-600 font-semibold">{report.reason || report.type || 'Report'}</p>
//                               <p className="text-[9px] text-gray-500 mt-2">{(report.description || report.message || 'No description provided').substring(0, 80)}...</p>
//                             </div>
//                             <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${statusColor.badge} border`}>
//                               <StatusIcon size={12} />
//                               <span>{report.status || 'Unknown'}</span>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-4 text-[9px] text-gray-500">
//                             <span>📋 Order: #{report.orderId || report._id?.slice(-8).toUpperCase() || 'N/A'}</span>
//                             <span>👤 Role: {report.role || 'buyer'}</span>
//                             <span>📅 {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}</span>
//                           </div>
//                         </div>
//                       );
//                     })}

//                     {/* View All Button */}
//                     <button 
//                       onClick={() => navigate('/reports')}
//                       className="w-full mt-4 text-center py-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-[11px] font-black text-orange-600 uppercase tracking-widest transition-all">
//                       View All {reports.length} Reports →
//                     </button>
//                   </>
//                 ) : (
//                   <div className="text-center py-8">
//                     <AlertTriangle size={40} className="mx-auto text-gray-200 mb-3" />
//                     <p className="text-gray-400 font-bold">No reports yet</p>
//                     <p className="text-xs text-gray-300 mt-2">You have no customer reports or disputes at this time.</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Compliance & Account Notices Section */}
//             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
//               <h3 className="font-black text-lg text-gray-900 mb-6 uppercase tracking-tighter flex items-center gap-2">
//                 <Bell size={18} className="text-blue-600" />Compliance & Account Notices
//               </h3>
              
//               {notifications.length > 0 ? (
//                 <div className="space-y-3 max-h-96 overflow-y-auto pr-3">
//                   {notifications.map((notification, idx) => (
//                     <div 
//                       key={notification._id || idx} 
//                       className={`p-4 rounded-xl border-l-4 hover:shadow-md transition-all ${
//                         notification.read 
//                           ? 'bg-gray-50 border-l-gray-300' 
//                           : 'bg-blue-50 border-l-blue-600'
//                       }`}
//                     >
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-2">
//                             <p className="text-xs font-black text-gray-900 uppercase">{notification.title}</p>
//                             {!notification.read && (
//                               <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
//                             )}
//                           </div>
//                           <p className="text-sm text-gray-700 mb-2 leading-relaxed">
//                             {notification.message || notification.description || 'No description'}
//                           </p>
//                           <p className="text-[9px] text-gray-500 font-semibold">
//                             {notification.createdAt 
//                               ? new Date(notification.createdAt).toLocaleString() 
//                               : 'Date not available'}
//                           </p>
//                         </div>
//                         {notification.type && (
//                           <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap"
//                             style={{
//                               backgroundColor: notification.type === 'warning' ? '#FEF3C7' : 
//                                              notification.type === 'alert' ? '#FEE2E2' : '#DBEAFE',
//                               color: notification.type === 'warning' ? '#92400E' : 
//                                     notification.type === 'alert' ? '#991B1B' : '#1E40AF'
//                             }}
//                           >
//                             {notification.type}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <Bell size={48} className="mx-auto text-gray-200 mb-4" />
//                   <p className="text-gray-400 font-bold">No notices at this time</p>
//                   <p className="text-xs text-gray-300 mt-2">You're all set! No compliance issues or account notices.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardSeller;

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
  Bell
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
    totalReviews: 0
  });

  const itemsPerPage = 10;
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

        const totalTransactions = successfulTransactions + failedTransactions;
        const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

        setAnalytics(prev => ({
          ...prev,
          totalEarned: earned,
          soldCount: sales.filter(p => p.status === 'completed' || p.status === 'confirmed').length,
          pendingClearance: pending,
          successRate: Math.round(successRate * 10) / 10,
          avgRating: parseFloat(ratingsData.averageRating) || 0,
          totalReviews: ratingsData.totalReviews || 0
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
            name: sale.productName || 'Unknown',
            sales: 1,
            revenue: Number(sale.price) || 0,
            createdAt: sale.createdAt
          }))
          .sort((a: any, b: any) => b.revenue - a.revenue)
          .slice(0, 5);

        setBestSellingProducts(topProducts);

        const activities = [
          ...sales.map(s => ({ Icon: Zap, color: 'text-blue-500', title: 'Payment Received', desc: `Sold ${s.productName || 'Account'} - $${s.price}`, time: s.createdAt })),
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
      {/* ─── Sticky Header ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black rounded-xl flex items-center justify-center shadow-md">
              <LayoutGrid className="text-[#d4a643] size-5 sm:size-6" />
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tighter uppercase italic">
              Seller<span className="text-[#d4a643]">Vault</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex flex-col items-end pr-4 sm:pr-6 border-r border-gray-100">
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star size={14} className="fill-current" />
                <span className="font-black text-sm">{analytics.avgRating.toFixed(1)}</span>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reputation</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden xs:block text-right">
                <p className="text-xs font-bold text-gray-500 uppercase">Verified Seller</p>
                <p className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">
                  {user?.email?.split('@')[0]}
                </p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#d4a643] to-amber-200 border-2 border-white shadow-md" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* ─── Top Stats ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 mb-8 sm:mb-10">
          <StatCard title="Total Earned" value={`$${analytics.totalEarned.toFixed(2)}`} Icon={TrendingUp} color="bg-emerald-500" trend="Real-time" />
          <StatCard title="Total Reviews" value={analytics.totalReviews} Icon={Users} color="bg-blue-600" />
          <StatCard title="Success Rate" value={`${analytics.successRate.toFixed(1)}%`} Icon={ShieldCheck} color="bg-indigo-600" />
          <StatCard title="Net Balance" value={`$${(userData?.balance || 0).toFixed(2)}`} Icon={Wallet} color="bg-[#d4a643]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* ─── Main Content ───────────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            {/* Client Ratings & Reviews */}
            <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
                <h3 className="font-black text-lg sm:text-xl text-gray-900 uppercase italic tracking-tight">Client Ratings & Reviews</h3>
                <div className="flex items-center gap-2">
                  <Star className="text-amber-400 fill-current" size={24} />
                  <span className="text-3xl font-black text-gray-900">{analytics.avgRating}</span>
                  <span className="text-sm font-bold text-gray-400">/5</span>
                </div>
              </div>

              {ratings.length > 0 ? (
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pb-6 border-b border-gray-100">
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Reviews</p>
                      <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">{analytics.totalReviews}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg Rating</p>
                      <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-2">{analytics.avgRating}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">5 Star</p>
                      <p className="text-2xl sm:text-3xl font-black text-emerald-500 mt-2">{ratings.filter(r => r.rating === 5).length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">4 Star</p>
                      <p className="text-2xl sm:text-3xl font-black text-blue-500 mt-2">{ratings.filter(r => r.rating === 4).length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Below 4</p>
                      <p className="text-2xl sm:text-3xl font-black text-orange-500 mt-2">{ratings.filter(r => r.rating < 4).length}</p>
                    </div>
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
                          className={`w-10 h-10 rounded-md text-sm font-semibold border transition-all ${
                            ratingsPage === page
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
                          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                            filter === 'monthly' ? 'bg-[#d4a643] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                        className={`w-10 h-10 rounded-md text-sm font-semibold border transition-all ${
                          currentPage === page
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
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-200 shadow-sm">
              <h3 className="font-black text-lg sm:text-xl text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-2">
                <Share2 size={20} className="text-purple-600" /> Referral Dashboard
              </h3>
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-purple-100">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Gift size={16} /> Your Referral Link
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={referralData.referralLink}
                      readOnly
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 font-mono"
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
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold uppercase transition-all flex items-center gap-2"
                    >
                      <Copy size={16} /> Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Share to earn commissions</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-purple-100 text-center">
                    <p className="text-2xl font-black text-purple-600">{referralData.referredBuyers}</p>
                    <p className="text-xs text-gray-600 font-bold uppercase mt-1">Buyers</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-blue-100 text-center">
                    <p className="text-2xl font-black text-blue-600">{referralData.referredSellers}</p>
                    <p className="text-xs text-gray-600 font-bold uppercase mt-1">Sellers</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-green-100 text-center">
                    <p className="text-2xl font-black text-green-600">${referralData.referralEarnings.toFixed(2)}</p>
                    <p className="text-xs text-gray-600 font-bold uppercase mt-1">Earnings</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/referral')}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <Share2 size={18} /> Full Referral Dashboard
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
                      className={`p-4 rounded-xl border-l-4 ${
                        n.read ? 'bg-gray-50 border-l-gray-300' : 'bg-blue-50 border-l-blue-600'
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