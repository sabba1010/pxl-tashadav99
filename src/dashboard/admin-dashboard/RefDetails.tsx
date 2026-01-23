import React, { useEffect, useState } from "react";
import { Search, RotateCcw, CheckCircle, Clock, XCircle, Info } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2"; // SweetAlert ইম্পোর্ট করা হলো

/* ================= TYPES ================= */
type ReferralStatus = "pending" | "approved" | "rejected";

type UserType = {
  _id: string;
  email: string;
  referralCode?: string;
  referredBy?: string;
  referralStatus?: ReferralStatus;
  rejectionReason?: string;
  balance?: number;
};

const RefDetails = () => {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [referralUsers, setReferralUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get<UserType[]>("http://localhost:3200/api/user/getall");
      const users = [...res.data].reverse();
      setAllUsers(users);
      setReferralUsers(users.filter((u) => u.referredBy));
    } catch {
      toast.error("Failed to load referral data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getReferrerEmail = (code?: string) => {
    const ref = allUsers.find((u) => u.referralCode === code);
    return ref?.email || "N/A";
  };

  /* ================= UPDATE STATUS WITH SWEET ALERT ================= */
  const updateStatus = async (userId: string, status: ReferralStatus) => {
    let reason = "";

    if (status === "rejected") {
      // SweetAlert2 Input Modal
      const { value: text, isDismissed } = await Swal.fire({
        title: "Rejection Reason",
        input: "textarea",
        inputLabel: "Why are you rejecting this referral?",
        inputPlaceholder: "Type your reason here...",
        inputAttributes: { "aria-label": "Type your reason here" },
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Confirm Reject",
        inputValidator: (value) => {
          if (!value) return "You need to write a reason!";
        }
      });

      if (isDismissed) return;
      reason = text;
    } else if (status === "approved") {
      // Approval Confirmation
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will add $5 to the referrer's balance.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22c55e",
        confirmButtonText: "Yes, Approve!",
      });
      if (!result.isConfirmed) return;
    }

    setUpdatingId(userId);
    try {
      await axios.patch("http://localhost:3200/api/user/admin/update-referral-status", {
        userId,
        status,
        rejectionReason: reason,
      });

      Swal.fire({
        title: status === "approved" ? "Approved!" : "Rejected!",
        text: status === "approved" ? "Bonus has been sent." : "User has been notified.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const statusBadge = (user: UserType) => {
    if (user.referralStatus === "approved")
      return (
        <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
          <CheckCircle size={14} /> Approved
        </span>
      );

    if (user.referralStatus === "rejected")
      return (
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-full w-fit">
            <XCircle size={14} /> Rejected
          </span>
          {user.rejectionReason && (
            <span className="text-[10px] text-gray-400 italic flex items-center gap-0.5 ml-1">
              <Info size={10} /> {user.rejectionReason}
            </span>
          )}
        </div>
      );

    return (
      <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-full">
        <Clock size={14} /> Pending
      </span>
    );
  };

  const filtered = referralUsers.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.referredBy || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen font-sans text-gray-800">
      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4 border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Referral Control ({filtered.length})</h1>
          <p className="text-xs text-gray-500 mt-1 italic">Approved referrals pay $5 to the inviter.</p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all disabled:opacity-50"
          >
            <RotateCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search user..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 transition-all shadow-sm w-64 outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-[11px] uppercase text-gray-500 font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Invited By</th>
                <th className="px-6 py-4">New User</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">{statusBadge(user)}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-gray-700">{getReferrerEmail(user.referredBy)}</p>
                    <span className="text-[10px] text-blue-500 font-mono">CODE: {user.referredBy}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold text-sm ${user.referralStatus === "rejected" ? "text-gray-400 line-through" : "text-green-600"}`}>
                      $5.00
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      disabled={updatingId === user._id || user.referralStatus !== "pending"}
                      value={user.referralStatus || "pending"}
                      onChange={(e) => updateStatus(user._id, e.target.value as ReferralStatus)}
                      className="border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer bg-white hover:border-blue-400 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <option value="pending">🟡 Pending</option>
                      <option value="approved">🟢 Approve</option>
                      <option value="rejected">🔴 Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RefDetails;