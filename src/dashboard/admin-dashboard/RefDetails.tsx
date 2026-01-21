import React, { useEffect, useState } from "react";
import {
  Search,
  RotateCcw,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

/* ================= TYPES ================= */
type ReferralStatus = "pending" | "approved" | "rejected";

type UserType = {
  _id: string;
  email: string;
  referralCode?: string;
  referredBy?: string;
  referralStatus?: ReferralStatus;
  balance?: number;
};

/* ================= COMPONENT ================= */
const RefDetails = () => {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [referralUsers, setReferralUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get<UserType[]>(
        "http://localhost:3200/api/user/getall"
      );

      // .reverse() add kora hoyeche jate notun data top-e thake
      const users = [...res.data].reverse(); 
      
      setAllUsers(users);
      setReferralUsers(users.filter(u => u.referredBy));
    } catch {
      toast.error("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= HELPERS ================= */
  const getReferrerEmail = (code?: string) => {
    const ref = allUsers.find(u => u.referralCode === code);
    return ref?.email || "N/A";
  };

  const statusBadge = (status?: ReferralStatus) => {
    if (status === "approved")
      return (
        <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
          <CheckCircle size={14} /> Approved
        </span>
      );

    if (status === "rejected")
      return (
        <span className="flex items-center gap-1 text-red-600 text-xs font-bold">
          <XCircle size={14} /> Rejected
        </span>
      );

    return (
      <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold">
        <Clock size={14} /> Pending
      </span>
    );
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (userId: string, status: ReferralStatus) => {
    setUpdatingId(userId);
    try {
      await axios.patch(
        "http://localhost:3200/api/user/admin/update-referral-status",
        { userId, status }
      );
      toast.success(`Referral ${status}`);
      fetchData(); // Refresh data to show updated status
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Status update failed"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= FILTER ================= */
  const filtered = referralUsers.filter(
    u =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.referredBy || "").toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Referral Control ({filtered.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Newest referrals are shown at the top.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RotateCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search email or code"
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-sm"
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Referrer (Who Invited)</th>
                <th className="px-6 py-4">New User (Invited Person)</th>
                <th className="px-6 py-4">Bonus</th>
                <th className="px-6 py-4 text-center">Admin Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading && referralUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <RotateCcw size={24} className="animate-spin text-green-500" />
                      <span>Loading data...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400">
                    No referral records found.
                  </td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr key={user._id} className="hover:bg-blue-50/30 transition-colors">
                    {/* STATUS */}
                    <td className="px-6 py-4">
                      {statusBadge(user.referralStatus)}
                    </td>

                    {/* REFERRER */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm text-gray-700">
                        {getReferrerEmail(user.referredBy)}
                      </p>
                      <p className="text-[10px] bg-gray-100 inline-block px-1.5 py-0.5 rounded mt-1 text-gray-500 font-mono">
                        ID: {user.referredBy}
                      </p>
                    </td>

                    {/* NEW USER */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-sm text-blue-600">
                         {user.email}
                      </span>
                    </td>

                    {/* BONUS */}
                    <td className="px-6 py-4 font-bold text-gray-700">$5</td>

                    {/* ACTION */}
                    <td className="px-6 py-4 text-center">
                      <select
                        disabled={
                          updatingId === user._id ||
                          user.referralStatus !== "pending"
                        }
                        value={user.referralStatus || "pending"}
                        onChange={e => {
                          const newStatus = e.target.value as ReferralStatus;
                          if (newStatus === user.referralStatus) return;
                          updateStatus(user._id, newStatus);
                        }}
                        className="border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer bg-white hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="pending">🟡 Pending</option>
                        <option value="approved">🟢 Approved</option>
                        <option value="rejected">🔴 Rejected</option>
                      </select>
                      
                      {user.referralStatus !== "pending" && (
                         <p className="text-[9px] text-gray-400 mt-1 italic">Action Locked</p>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RefDetails;