import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // টোস্ট ইমপোর্ট করা হয়েছে

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

  const API_BASE_URL = "http://localhost:3200";

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<User[]>(`${API_BASE_URL}/api/user/getall`);
      const sellerList = response.data.filter((user) => user.role === 'seller');
      setSellers(sellerList);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load sellers data!");
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      await axios.patch(`${API_BASE_URL}/api/user/update-status/${id}`, { status: newStatus });
      
      // স্টেট আপডেট
      setSellers(prev => prev.map(s => s._id === id ? { ...s, status: newStatus as 'active' | 'blocked' } : s));
      
      toast.success(`Seller is now ${newStatus.toUpperCase()}`, { id: loadingToast });
    } catch (err) {
      toast.error("Failed to update status", { id: loadingToast });
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Sellers...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* টোস্ট কন্টেইনার */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Seller Management</h2>
          <p className="text-sm text-gray-500">Quickly toggle between Active and Blocked status</p>
        </div>
        <button onClick={fetchSellers} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition">
          Refresh List
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-xl rounded-xl border border-gray-200">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="px-6 py-4 text-left font-bold uppercase">Seller Information</th>
              <th className="px-6 py-4 text-left font-bold uppercase">Account Balance</th>
              <th className="px-6 py-4 text-center font-bold uppercase">Current Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sellers.map((seller) => (
              <tr key={seller._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800 text-base">{seller.name || "Unknown"}</div>
                  <div className="text-sm text-blue-500 italic">{seller.email}</div>
                  <div className="text-xs text-gray-500 font-medium">WhatsApp: {seller.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700 font-mono font-bold bg-gray-100 px-2 py-1 rounded">
                    ${seller.balance.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <select
                    value={seller.status || 'active'}
                    onChange={(e) => handleStatusChange(seller._id, e.target.value)}
                    className={`px-4 py-2 rounded-lg border-2 font-black text-xs cursor-pointer focus:outline-none transition-all ${
                      seller.status === 'blocked' 
                        ? 'border-red-200 bg-red-50 text-red-600' 
                        : 'border-green-200 bg-green-50 text-green-600'
                    }`}
                  >
                    <option value="active">🟢 ACTIVE</option>
                    <option value="blocked">🔴 BLOCKED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sellers.length === 0 && <div className="p-10 text-center text-gray-400">No sellers available.</div>}
      </div>
    </div>
  );
};

export default SellerManagement;