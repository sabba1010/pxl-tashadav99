import React, { useEffect, useState } from 'react';
import { Search, RotateCcw, Filter, ChevronLeft, ChevronRight, Info, X, User, Calendar, DollarSign, Fingerprint } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const RefDetails = () => {
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [referralData, setReferralData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null); // For View Details Modal

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3200/api/user/getall`);
            const users = (response.data as any[]) || [];
            setAllUsers(users);
            const refs = users.filter((u: any) => u.referredBy);
            setReferralData(refs);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to fetch referral data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const getReferrerEmail = (code: string) => {
        const referrer = allUsers.find(u => u.referralCode === code);
        return referrer ? referrer.email : "N/A";
    };

    const filteredData = referralData.filter(item => 
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.referredBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-[#f8fafc] min-h-screen text-[#1e293b] font-sans relative">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Referral Tracking ({filteredData.length})
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor • Review • Resolve Disputes • Manage Referrals</p>
                </div>
                <div className="flex gap-3 items-center">
                    <button onClick={fetchData} className="p-2 bg-[#22c55e] text-white rounded-lg hover:bg-green-600 transition shadow-sm">
                        <RotateCcw size={20} />
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search email or code..." 
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                        <Filter size={16} /> All Referrals
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#f8fafc] border-b border-gray-100">
                        <tr className="text-[11px] uppercase text-gray-400 font-bold tracking-wider">
                            <th className="px-6 py-4">Referrer</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Referee</th>
                            <th className="px-6 py-4">Bonus</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-20 text-center text-gray-400 animate-pulse font-medium">Loading tracking data...</td></tr>
                        ) : filteredData.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-20 text-center text-gray-400 font-medium">No referral records found.</td></tr>
                        ) : filteredData.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-[#1e293b]">{getReferrerEmail(item.referredBy)}</span>
                                        <span className="text-[11px] text-gray-400 font-mono">CODE: {item.referredBy}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-50 text-[#22c55e] px-3 py-1 rounded-full text-[10px] font-bold border border-green-100 uppercase tracking-tighter">
                                        Verified
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-[#1e293b]">{item.email}</span>
                                        <span className="text-[11px] text-gray-400 italic capitalize">{item.role || 'Buyer'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-bold text-sm text-gray-700">$5.00</span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                                    {item.accountCreationDate ? new Date(item.accountCreationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Jan 2026'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => setSelectedUser(item)}
                                        className="bg-[#22c55e] text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition-all flex items-center gap-1 mx-auto shadow-sm active:scale-95"
                                    >
                                        <Info size={14} /> View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-50 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                        <button className="p-2 border border-gray-100 rounded-lg text-gray-300 cursor-not-allowed"><ChevronLeft size={16} /></button>
                        <button className="w-8 h-8 bg-[#22c55e] text-white rounded-lg text-sm font-bold shadow-md">1</button>
                        <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50 transition"><ChevronRight size={16} /></button>
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">Page 1 of 1 • {filteredData.length} total results</p>
                </div>
            </div>

            {/* VIEW DETAILS MODAL (Working Condition) */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-[#22c55e] p-6 text-white flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <User size={22} /> User Profile
                            </h2>
                            <button onClick={() => setSelectedUser(null)} className="hover:bg-white/20 p-1 rounded-full transition">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-12 h-12 bg-green-100 text-[#22c55e] rounded-full flex items-center justify-center font-bold text-lg">
                                    {selectedUser.email[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1e293b]">{selectedUser.email}</p>
                                    <p className="text-xs text-gray-400">Database ID: {selectedUser._id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 border border-gray-100 rounded-xl">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1"><Fingerprint size={10} /> Referral Code</p>
                                    <p className="text-sm font-bold mt-1 text-green-600">{selectedUser.referralCode || 'N/A'}</p>
                                </div>
                                <div className="p-3 border border-gray-100 rounded-xl">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1"><DollarSign size={10} /> Wallet Balance</p>
                                    <p className="text-sm font-bold mt-1">${selectedUser.balance || 0}</p>
                                </div>
                                <div className="p-3 border border-gray-100 rounded-xl">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1"><Calendar size={10} /> Join Date</p>
                                    <p className="text-sm font-bold mt-1 text-gray-600">
                                        {selectedUser.accountCreationDate ? new Date(selectedUser.accountCreationDate).toLocaleDateString() : 'New User'}
                                    </p>
                                </div>
                                <div className="p-3 border border-gray-100 rounded-xl">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1"><User size={10} /> Referred By</p>
                                    <p className="text-sm font-bold mt-1 text-orange-500">{selectedUser.referredBy}</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setSelectedUser(null)}
                                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition mt-4"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RefDetails;