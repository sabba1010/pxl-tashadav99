import React from 'react';
import { 
  DollarSign, 
  Users, 
  UserCheck, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownLeft,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  LucideIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

// Mock sales data (2025)
const salesData = [
  { month: 'Jan', sales: 300 },
  { month: 'Feb', sales: 450 },
  { month: 'Mar', sales: 620 },
  { month: 'Apr', sales: 780 },
  { month: 'May', sales: 920 },
  { month: 'Jun', sales: 50 },
  { month: 'Jul', sales: 350 },
  { month: 'Aug', sales: 650 },
  { month: 'Sep', sales: 1150 },
  { month: 'Oct', sales: 620 },
  { month: 'Nov', sales: 710 },
  { month: 'Dec', sales: 480 },
];

// Mock listed accounts
const listedAccounts = [
  { id: 'ACC001', platform: 'Instagram', followers: '15.2K', price: 450, status: 'approved', date: '2025-12-20' },
  { id: 'ACC002', platform: 'TikTok', followers: '42.1K', price: 890, status: 'sold', date: '2025-12-15' },
  { id: 'ACC003', platform: 'YouTube', followers: '8.7K', price: 320, status: 'pending', date: '2026-01-05' },
  { id: 'ACC004', platform: 'Facebook', followers: '25K', price: 600, status: 'approved', date: '2025-11-28' },
  { id: 'ACC005', platform: 'Twitter', followers: '18.9K', price: 510, status: 'approved', date: '2025-12-10' },
];

// Recent activity
const activities = [
  { Icon: ShoppingBag, color: 'text-emerald-600', title: 'Account Sold', desc: 'ACC002 (TikTok 42.1K) sold for $890', time: '2 hours ago' },
  { Icon: CheckCircle, color: 'text-[#d4a643]', title: 'Account Approved', desc: 'ACC001 (Instagram 15.2K) approved', time: '5 hours ago' },
  { Icon: ArrowUpRight, color: 'text-[#d4a643]', title: 'Withdrawal Requested', desc: '$500 requested to PayPal', time: 'Yesterday' },
  { Icon: AlertCircle, color: 'text-orange-600', title: 'Review Needed', desc: 'ACC003 pending moderation', time: '2 days ago' },
];

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My Seller Dashboard</h1>
          <p className="text-gray-600 mt-2 text-lg">Manage your accounts, track earnings, and grow your business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <StatCard title="Account Balance" value="$67.13" Icon={DollarSign} gradient="from-[#d4a643] to-[#b5892c]" />
          <StatCard title="Total Accounts" value="1,791" Icon={Users} gradient="from-blue-500 to-blue-600" />
          <StatCard title="Accounts Sold" value="511" Icon={ShoppingBag} gradient="from-emerald-500 to-emerald-600" />
          <StatCard title="Approved Accounts" value="1,684" Icon={UserCheck} gradient="from-purple-500 to-purple-600" />
        </div>

        {/* Payments & Sales Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Payments Overview */}
          <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Payments Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#d4a643]/10 to-[#d4a643]/5 rounded-2xl p-8 border border-[#d4a643]/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Total Withdrawals</span>
                  <ArrowUpRight className="w-5 h-5 text-[#d4a643]" />
                </div>
                <p className="text-4xl font-bold text-gray-900">$2,691</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-2xl p-8 border border-emerald-200/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Total Deposits</span>
                  <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-4xl font-bold text-gray-900">$12</p>
              </div>
            </div>
          </div>

          {/* Sales Growth Chart */}
          <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Sales Growth (2025)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a643" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#d4a643" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748b' }} />
                <YAxis tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.95)', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                  }}
                />
                <Bar dataKey="sales" radius={[12, 12, 0, 0]} barSize={28} fill="url(#goldGradient)" />
              </BarChart>
            </ResponsiveContainer>
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
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listedAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{acc.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{acc.platform}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{acc.followers}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">${acc.price}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          acc.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          acc.status === 'sold' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {acc.status.charAt(0).toUpperCase() + acc.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-3">
                          <button className="text-blue-600 hover:text-blue-800"><Eye className="w-4 h-4" /></button>
                          <button className="text-[#d4a643] hover:text-[#b5892c]"><Edit className="w-4 h-4" /></button>
                          <button className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
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
              {activities.map((activity, i) => (
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