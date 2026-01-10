import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useAuthHook } from '../../hook/useAuthHook';
import { useDepositByUser } from '../../hook/useDepositByUser';
import {
  DollarSign,
  Users,
  UserCheck,
  ShoppingBag,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  LucideIcon
} from 'lucide-react';


// Mock sales data (2025)

// dynamic data comes from backend

// Typed StatCard Props
interface StatCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, Icon, gradient }) => (
  <div className="group relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-400 p-6">
    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium tracking-wide">{title}</p>
        <h2 className="text-3xl font-bold mt-3 text-gray-900">{value}</h2>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const DashboardSeller: React.FC = () => {
  const { user } = useAuth();
  const { data: userData } = useAuthHook();
  const { payments } = useDepositByUser();

  const [listedAccounts, setListedAccounts] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, purchaseRes] = await Promise.all([
          axios.get<any[]>("http://localhost:3200/product/all-sells"),
          axios.get<any[]>("http://localhost:3200/purchase/getall", { params: { email: user.email, role: 'seller' } }),
        ]);

        const myAds = (prodRes.data || []).filter((p: any) => p.userEmail === user.email);
        setListedAccounts(myAds || []);

        const purchases: any[] = purchaseRes.data || [];

        // Build recent activities: include recent completed purchases (sold) and recent approved ads
        const soldActivities = purchases
          .filter(p => p.status === 'completed' || p.status === 'ongoing' || p.status === 'confirmed')
          .slice(0, 6)
          .map(p => ({
            Icon: ShoppingBag,
            color: 'text-emerald-600',
            title: 'Account Sold',
            desc: `${p.productName || p.name || 'Account'} sold for $${p.price}`,
            time: new Date(p.purchaseDate || p.createdAt || Date.now()).toLocaleString(),
          }));

        const approvedActivities = (myAds || [])
          .filter((a: any) => a.status === 'approved' || a.status === 'active')
          .slice(0, 6)
          .map((a: any) => ({
            Icon: CheckCircle,
            color: 'text-[#d4a643]',
            title: 'Account Approved',
            desc: `${a.name || a.category} approved`,
            time: new Date(a.createdAt || a.date || Date.now()).toLocaleString(),
          }));

        setRecentActivities([...soldActivities, ...approvedActivities].slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.email]);

  const totalDeposits = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);

  const counts = {
    total: listedAccounts.length,
    sold: listedAccounts.filter(a => a.status === 'sold').length,
    approved: listedAccounts.filter(a => a.status === 'approved' || a.status === 'active').length,
    pending: listedAccounts.filter(a => a.status === 'pending').length,
    cancelled: listedAccounts.filter(a => ['reject', 'denied', 'cancelled'].includes(String(a.status).toLowerCase())).length,
  } as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/20 to-white">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Seller Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage your accounts, track earnings, and grow your business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <StatCard title="Account Balance" value={`$${(userData?.balance || 0).toFixed(2)}`} Icon={DollarSign} gradient="from-[#d4a643] to-[#b5892c]" />
          <StatCard title="Total Accounts" value={counts.total} Icon={Users} gradient="from-blue-500 to-blue-600" />
          <StatCard title="Accounts Sold" value={counts.sold} Icon={ShoppingBag} gradient="from-emerald-500 to-emerald-600" />
          <StatCard title="Approved Accounts" value={counts.approved} Icon={UserCheck} gradient="from-purple-500 to-purple-600" />
        </div>

        {/* Payments & Sales Chart Row */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 mb-10 gap-8">
         
          <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8 ">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 ">Payments Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-8 border border-emerald-200/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Total Deposits</span>
                  <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900">${totalDeposits.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-8 border border-emerald-200/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Available Balance</span>
                  <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900">${totalDeposits.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div> */}

        <div className="mb-10">
          <div className="bg-white/80 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-7 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-7">Payments Overview</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {/* Total Deposits */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/70 rounded-xl p-7 border border-emerald-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 font-medium">Total Deposits</span>
                  <div className="p-2 rounded-lg bg-emerald-100/80">
                    <ArrowDownLeft className="w-6 h-6 text-emerald-600" strokeWidth={2.5} />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  ${totalDeposits.toFixed(2)}
                </p>
              </div>

              {/* Available Balance */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/70 rounded-xl p-7 border border-amber-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 font-medium">Available Balance</span>
                  <div className="p-2 rounded-lg bg-amber-100/80">
                    <DollarSign className="w-6 h-6 text-amber-600" strokeWidth={2.5} />
                  </div>
                </div>
                <p className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  {/* ${(userData?.balance || 0).toFixed(2)} */}
                  ${totalDeposits.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* My Listed Accounts & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listed Accounts Table */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900">My Listed Accounts</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Followers</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listedAccounts.map((acc: any) => (
                    <tr key={acc._id || acc.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{acc._id || acc.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{acc.category || acc.platform || acc.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{acc.followers || acc.stats || '-'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">${acc.price}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${acc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            acc.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {(String(acc.status || '').charAt(0).toUpperCase() + String(acc.status || '').slice(1)) || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{new Date(acc.createdAt || acc.date || Date.now()).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="p-3 rounded-xl bg-gray-100">
                    <activity.Icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.desc}</p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSeller;