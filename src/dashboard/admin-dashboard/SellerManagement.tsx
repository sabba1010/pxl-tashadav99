import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  balance: number;
  status?: 'active' | 'blocked';
}

const SellerManagement = () => {
  const [sellers, setSellers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://vps-backend-server-beta.vercel.app";

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<User[]>(`${API_BASE_URL}/api/user/getall`);
      // ডাটাবেজ থেকে শুধুমাত্র সেলারদের ফিল্টার করা
      const sellerList = response.data.filter((user) => user.role === 'seller');
      setSellers(sellerList);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load sellers!");
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const tid = toast.loading("Updating status...");
    try {
      await axios.patch(`${API_BASE_URL}/api/user/update-status/${id}`, { status: newStatus });
      
      // লোকাল স্টেট আপডেট
      setSellers(prev => prev.map(s => s._id === id ? { ...s, status: newStatus as 'active' | 'blocked' } : s));
      
      toast.success(`Seller is now ${newStatus.toUpperCase()}`, { id: tid });
    } catch (err) {
      toast.error("Failed to update status", { id: tid });
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Sellers Data...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Toast Notification Container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="mb-6 bg-white p-5 rounded-lg shadow-sm flex justify-between items-center border-l-4 border-blue-600">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Seller Management</h2>
          <p className="text-sm text-gray-500 font-medium">Manage and monitor platform sellers</p>
        </div>
        <button 
          onClick={fetchSellers} 
          className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-all shadow-md font-semibold text-sm"
        >
          Refresh Data
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-2xl rounded-2xl border border-gray-100">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
              <th className="px-6 py-4 text-left font-bold">Seller Information</th>
              <th className="px-6 py-4 text-left font-bold">Balance</th>
              <th className="px-6 py-4 text-center font-bold">Account Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sellers.map((seller) => (
              <tr key={seller._id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="font-extrabold text-gray-900 text-lg">{seller.name || "N/A"}</div>
                  <div className="text-sm text-blue-600 font-medium">{seller.email}</div>
                  <div className="text-xs text-green-600 font-bold mt-1">WhatsApp: {seller.phone}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    <span className="text-xl font-black text-gray-800">${seller.balance.toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <select
                    value={seller.status || 'active'}
                    onChange={(e) => handleStatusChange(seller._id, e.target.value)}
                    className={`px-4 py-2 rounded-xl border-2 font-black text-xs cursor-pointer focus:outline-none shadow-sm transition-all ${
                      seller.status === 'blocked' 
                        ? 'border-red-500 bg-red-50 text-red-600' 
                        : 'border-green-500 bg-green-50 text-green-600'
                    }`}
                  >
                    <option value="active">🟢 ACTIVE ACCOUNT</option>
                    <option value="blocked">🔴 BLOCK ACCOUNT</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sellers.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
            <p className="text-gray-400 text-lg font-medium">No sellers found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerManagement;