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
        "https://vps-backend-server-beta.vercel.app/api/user/getall"
      );

      const users = res.data;
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
        "https://vps-backend-server-beta.vercel.app/api/user/admin/update-referral-status",
        { userId, status }
      );
      toast.success(`Referral ${status}`);
      fetchData();
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
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Admin Referral Control ({filtered.length})
          </h1>
          <p className="text-xs text-gray-500">
            Only pending referrals can be approved or rejected
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={fetchData}
            className="p-2 bg-green-500 text-white rounded-lg"
          >
            <RotateCcw size={18} />
          </button>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              placeholder="Search email or code"
              className="pl-9 pr-3 py-2 border rounded-lg"
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Referrer</th>
              <th className="px-6 py-4">New User</th>
              <th className="px-6 py-4">Bonus</th>
              <th className="px-6 py-4 text-center">Admin Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gray-400">
                  No referral found
                </td>
              </tr>
            ) : (
              filtered.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  {/* STATUS */}
                  <td className="px-6 py-4">
                    {statusBadge(user.referralStatus)}
                  </td>

                  {/* REFERRER */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm">
                      {getReferrerEmail(user.referredBy)}
                    </p>
                    <p className="text-xs text-gray-400">
                      CODE: {user.referredBy}
                    </p>
                  </td>

                  {/* NEW USER */}
                  <td className="px-6 py-4 font-bold text-sm">
                    {user.email}
                  </td>

                  {/* BONUS */}
                  <td className="px-6 py-4 font-bold">$5</td>

                  {/* ACTION */}
                  <td className="px-6 py-4 text-center">
                    <select
                      disabled={
                        updatingId === user._id ||
                        user.referralStatus !== "pending" // 🔒 lock if not pending
                      }
                      value={user.referralStatus || "pending"}
                      onChange={e => {
                        const newStatus = e.target.value as ReferralStatus;
                        if (newStatus === user.referralStatus) return;
                        updateStatus(user._id, newStatus);
                      }}
                      className="border px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="pending">🟡 Pending</option>
                      <option value="approved">🟢 Approved</option>
                      <option value="rejected">🔴 Rejected</option>
                    </select>

                    {user.referralStatus !== "pending" && (
                      <p className="text-[10px] text-gray-400 mt-1">
                       
                      </p>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefDetails;
