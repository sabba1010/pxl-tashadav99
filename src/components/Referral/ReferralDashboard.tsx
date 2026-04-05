import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "sonner";
import { API_BASE_URL } from "../../config";
import { useAuthHook } from '../../hook/useAuthHook';
import { 
  Share2, 
  Gift, 
  Copy, 
  Users, 
  TrendingUp, 
  Wallet, 
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info
} from 'lucide-react';
import Swal from 'sweetalert2';

const ReferralDashboard: React.FC = () => {
  const { data: userData } = useAuthHook();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    referralCode: '',
    referralLink: '',
    referredBuyers: 0,
    referredSellers: 0,
    totalReferrals: 0,
    referralEarnings: 0,
    referralList: [] as any[]
  });

  useEffect(() => {
    if (!userData?.email) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get<{ success: boolean; data: any }>(`${API_BASE_URL}/referral/stats`, { 
          params: { email: userData.email } 
        });
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch referral stats:", err);
        toast.error("Failed to load referral statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userData?.email]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: `${label} Copied!`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#d4a643]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-[#0A1A3A] uppercase italic tracking-tight flex items-center justify-center sm:justify-start gap-3">
            <Share2 className="text-[#d4a643]" size={36} /> Referral Dashboard
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Invite your friends and earn $5 for every successful referral!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Referrals</p>
                <h2 className="text-2xl font-black text-gray-900">{stats.totalReferrals}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rewards Earned</p>
                <h2 className="text-2xl font-black text-gray-900">${stats.referralEarnings.toFixed(2)}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Buyers Referred</p>
                <h2 className="text-2xl font-black text-gray-900">{stats.referredBuyers}</h2>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Award size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sellers Referred</p>
                <h2 className="text-2xl font-black text-gray-900">{stats.referredSellers}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Invitation Side */}
          <div className="lg:col-span-12">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-5 sm:p-12 bg-[#0A1A3A] text-white relative overflow-hidden">
                 <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full" />
                 <div className="relative z-10">
                   <h2 className="text-2xl sm:text-4xl font-black italic mb-4">Start Sharing Now!</h2>
                   <p className="text-white/70 max-w-2xl text-lg mb-10">Copy your unique referral link below and share it with your network. When they join and start trading, you both get rewarded!</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Link Box */}
                     <div className="space-y-3">
                       <label className="text-xs font-black uppercase tracking-widest text-[#d4a643]">Your Referral Link</label>
                       <div className="flex items-center gap-2 p-1 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                         <input 
                           type="text" 
                           value={stats.referralLink} 
                           readOnly 
                           className="flex-1 bg-transparent px-2 py-3 sm:px-4 text-xs sm:text-sm font-mono truncate outline-none"
                         />
                         <button 
                           onClick={() => copyToClipboard(stats.referralLink, 'Link')}
                           className="bg-[#d4a643] hover:bg-white hover:text-black text-black px-4 py-3 sm:px-6 rounded-xl font-black uppercase text-[10px] sm:text-xs transition-all flex items-center gap-2 flex-shrink-0"
                         >
                           <Copy size={14} /> Copy
                         </button>
                       </div>
                     </div>

                     {/* Code Box */}
                     <div className="space-y-3">
                       <label className="text-xs font-black uppercase tracking-widest text-[#d4a643]">Referral Code</label>
                       <div className="flex items-center gap-2 p-1 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                         <input 
                           type="text" 
                           value={stats.referralCode} 
                           readOnly 
                           className="flex-1 bg-transparent px-2 py-3 sm:px-4 text-lg sm:text-2xl font-black tracking-normal sm:tracking-widest text-center truncate outline-none"
                         />
                         <button 
                           onClick={() => copyToClipboard(stats.referralCode, 'Code')}
                           className="bg-[#d4a643] hover:bg-white hover:text-black text-black px-4 py-3 sm:px-6 rounded-xl font-black uppercase text-[10px] sm:text-xs transition-all flex items-center gap-2 flex-shrink-0"
                         >
                           <Copy size={14} /> Copy
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* History Section */}
               <div className="p-5 sm:p-10">
                 <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg sm:text-xl font-black text-[#0A1A3A] uppercase italic">Referral History</h3>
                   <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{stats.referralList.length} Referrals Found</span>
                 </div>

                 {stats.referralList.length > 0 ? (
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                       <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                         <tr>
                           <th className="px-6 py-4">User</th>
                           <th className="px-6 py-4">Role</th>
                           <th className="px-6 py-4">Joined Date</th>
                           <th className="px-6 py-4">Status</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                         {stats.referralList.map((ref: any, idx: number) => (
                           <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                             <td className="px-6 py-5">
                               <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs">
                                   {ref.name?.[0]?.toUpperCase() || 'U'}
                                 </div>
                                 <div className="flex flex-col">
                                   <span className="font-bold text-gray-900">{ref.name || 'User'}</span>
                                   <span className="text-xs text-gray-400">{ref.email}</span>
                                 </div>
                               </div>
                             </td>
                             <td className="px-6 py-5">
                               <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                 ref.role === 'seller' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                               }`}>
                                 {ref.role || 'buyer'}
                               </span>
                             </td>
                             <td className="px-6 py-5 text-sm text-gray-500 font-medium">
                               {ref.joinedAt !== "N/A" ? new Date(ref.joinedAt).toLocaleDateString() : 'Pending'}
                             </td>
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-tight">
                                  <CheckCircle2 size={14} /> Successful
                                </div>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 ) : (
                   <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                       <Gift className="text-gray-200" size={32} />
                     </div>
                     <h4 className="text-gray-900 font-bold mb-2">No referrals yet</h4>
                     <p className="text-gray-400 text-sm max-w-xs mx-auto">Share your referral link with friends to start earning rewards today!</p>
                   </div>
                 )}
               </div>
            </div>

            {/* Program Details */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Info size={20} />
                </div>
                <h5 className="font-bold text-gray-900 mb-2">How it works?</h5>
                <p className="text-sm text-gray-500 leading-relaxed">Share your link. When a friend signs up and completes a trade, you both receive $5 credit.</p>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle2 size={20} />
                </div>
                <h5 className="font-bold text-gray-900 mb-2">Eligibility</h5>
                <p className="text-sm text-gray-500 leading-relaxed">Valid for verified users and new account registrations. Self-referrals are strictly prohibited.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp size={20} />
                </div>
                <h5 className="font-bold text-gray-900 mb-2">Payouts</h5>
                <p className="text-sm text-gray-500 leading-relaxed">Earnings are instantly credited to your wallet balance after the successful referral check.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
