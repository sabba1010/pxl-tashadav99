import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAuthHook } from '../../hook/useAuthHook';
import { useDepositByUser } from '../../hook/useDepositByUser';
import {
  DollarSign,
  ShoppingBag,
  ArrowRight,
  Clock,
  LucideIcon,
  Star,
  TrendingUp,
  BarChart3,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  LayoutGrid,
  Award,
  Users
} from 'lucide-react';

// --- Stat Card Component ---
interface StatCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, Icon, color, trend }) => (
  <div className="relative group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-700 ${color}`} />
    <div className="relative flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color.replace('bg-', 'bg-opacity-20 ')} ${color.replace('bg-', 'text-')}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em]">{title}</p>
        <div className="flex items-end gap-2">
          <h2 className="text-3xl font-black text-gray-900 mt-1">{value}</h2>
          {trend && <span className="text-[10px] font-bold text-emerald-500 mb-1 flex items-center"><ArrowUpRight size={12}/>{trend}</span>}
        </div>
      </div>
    </div>
  </div>
);

const DashboardSeller: React.FC = () => {
  const { user } = useAuth();
  const { data: userData } = useAuthHook();
  const { payments } = useDepositByUser();
  const navigate = useNavigate();

  const [listedAccounts, setListedAccounts] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalEarned: 0,
    soldCount: 0,
    pendingClearance: 0,
    successRate: 0,
    avgRating: 4.8,
    totalReviews: 124
  });

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, purchaseRes] = await Promise.all([
          axios.get<any[]>("http://localhost:3200/product/all-sells"),
          axios.get<any[]>("http://localhost:3200/purchase/getall", { params: { email: user.email, role: 'seller' } }),
        ]);

        const myProducts = (prodRes.data || []).filter((p: any) => p.userEmail === user.email);
        const sales = purchaseRes.data || [];
        
        // REAL EARNINGS: Sum of completed/confirmed purchases
        const earned = sales
          .filter(p => p.status === 'completed' || p.status === 'confirmed')
          .reduce((sum, p) => sum + (Number(p.price) || 0), 0);

        const pending = sales
          .filter(p => p.status === 'ongoing' || p.status === 'pending')
          .reduce((sum, p) => sum + (Number(p.price) || 0), 0);

        setAnalytics(prev => ({
          ...prev,
          totalEarned: earned,
          soldCount: sales.filter(p => p.status === 'completed' || p.status === 'confirmed').length,
          pendingClearance: pending,
          successRate: myProducts.length > 0 ? (sales.length / myProducts.length) * 100 : 0
        }));

        setListedAccounts(myProducts);

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

  const totalDeposits = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4a643]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFBFB] pb-20">
      {/* --- Modern Header --- */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <LayoutGrid className="text-[#d4a643]" size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Seller<span className="text-[#d4a643]">Vault</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end border-r pr-6 border-gray-100">
                <div className="flex items-center gap-1 text-amber-500">
                    <Star size={14} className="fill-current"/> <span className="font-black text-sm text-black">{analytics.avgRating}</span>
                </div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Global Rep</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Verified Seller</p>
                    <p className="text-xs font-bold text-gray-900">{user?.email?.split('@')[0]}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d4a643] to-amber-200 border-2 border-white shadow-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 pt-10">
        {/* --- Top Metrics Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Earned" value={`$${analytics.totalEarned.toFixed(2)}`} Icon={TrendingUp} color="bg-emerald-500" trend="Real-time" />
          <StatCard title="Total Reviews" value={analytics.totalReviews} Icon={Users} color="bg-blue-600" />
          <StatCard title="Success Rate" value={`${analytics.successRate.toFixed(1)}%`} Icon={ShieldCheck} color="bg-indigo-600" />
          <StatCard title="Net Balance" value={`$${(userData?.balance || 0).toFixed(2)}`} Icon={Wallet} color="bg-[#d4a643]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- Main Section --- */}
          <div className="lg:col-span-8 space-y-8">
            {/* Rating Breakdown Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-10 items-center">
                <div className="text-center md:text-left">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Customer Feedback</p>
                    <div className="flex items-end gap-2 justify-center md:justify-start">
                        <h3 className="text-6xl font-black text-gray-900">{analytics.avgRating}</h3>
                        <span className="text-2xl font-bold text-gray-300 mb-2">/5</span>
                    </div>
                    <div className="flex gap-1 mt-3 justify-center md:justify-start">
                        {[1,2,3,4,5].map(s => <Star key={s} size={18} className={`${s <= 4 ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />)}
                    </div>
                    <p className="text-[10px] font-bold text-emerald-500 mt-4 uppercase">98% Positive Satisfaction</p>
                </div>
                <div className="flex-1 w-full space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-gray-400 w-4">{star}★</span>
                            <div className="flex-1 h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '5%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-8 flex justify-between items-center border-b border-gray-50">
                  <h3 className="font-black text-xl text-gray-900 tracking-tight uppercase italic">Inventory Pulse</h3>
                  <button onClick={() => navigate('/myproducts')} className="text-[11px] font-black text-[#d4a643] uppercase tracking-widest flex items-center gap-2 hover:bg-amber-50 px-4 py-2 rounded-full transition-all">
                    View Listings <ArrowRight size={14}/>
                  </button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-[#FAFAFA] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                     <tr>
                       <th className="px-8 py-5">Product Name</th>
                       <th className="px-8 py-5 text-center">Value</th>
                       <th className="px-8 py-5 text-center">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                     {listedAccounts.slice(0, 5).map((acc) => (
                       <tr key={acc._id} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-8 py-6">
                           <p className="text-sm font-bold text-gray-900">{acc.name || acc.category}</p>
                           <p className="text-[9px] font-mono text-gray-400">ID: {acc._id.slice(-6).toUpperCase()}</p>
                         </td>
                         <td className="px-8 py-6 text-center font-black text-gray-900 text-sm">${acc.price}</td>
                         <td className="px-8 py-6 text-center">
                           <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${acc.status === 'sold' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                             {acc.status}
                           </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>

          {/* --- Sidebar Section --- */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#0A1A3A] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
               <div className="relative">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="text-amber-400" size={20}/>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Tier 1 Elite</span>
                  </div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Lifetime Payout</p>
                  <h3 className="text-5xl font-black mb-10 text-white italic">${analytics.totalEarned.toFixed(2)}</h3>
                  <button onClick={() => navigate('/withdraw')} className="w-full bg-[#d4a643] hover:bg-white hover:text-black py-4 rounded-2xl text-xs font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2">
                    <Wallet size={16}/> Withdraw Earnings
                  </button>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
               <h3 className="font-black text-lg text-gray-900 mb-8 uppercase tracking-tighter flex items-center gap-2">
                 <Zap size={18} className="text-blue-500 fill-current"/> Activity Stream
               </h3>
               <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                 {recentActivities.map((act, i) => (
                   <div key={i} className="flex gap-4 relative group">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 shadow-sm transition-all group-hover:scale-110 border-4 border-white ${act.color.replace('text-', 'bg-').replace('500', '100')} ${act.color}`}>
                       <act.Icon size={16} />
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-black text-gray-900 uppercase">{act.title}</p>
                          <span className="text-[9px] font-bold text-gray-400">{new Date(act.time).getHours()}:{new Date(act.time).getMinutes()}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{act.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSeller;