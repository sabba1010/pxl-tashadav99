import React, { useEffect, useState } from "react";
import { Search, RotateCcw, CheckCircle, Clock, XCircle, Info, MessageCircle, Mail, ExternalLink } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config";
import Swal from "sweetalert2";

/* ================= TYPES ================= */
type ReferralStatus = "pending" | "approved" | "rejected";

type UserType = {
  _id: string;
  email: string;
  phone?: string;
  dialCode?: string;
  countryCode?: string;
  role?: string;
  createdAt?: string;
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
      const res = await axios.get<UserType[]>(`${API_BASE_URL}/user/getall`);
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

  const getReferrerInfo = (codeOrUrl?: string) => {
    if (!codeOrUrl) return { email: "N/A", phone: "", dialCode: "", countryCode: "", referralCount: 0 };
    
    // Extract code from URL if present
    let cleanCode = codeOrUrl;
    if (codeOrUrl.includes("ref=")) {
      cleanCode = codeOrUrl.split("ref=")[1].split("&")[0];
    }

    const ref = allUsers.find((u) => u.referralCode === cleanCode);
    
    // For counting, it's safer to check if referredBy *includes* the code
    const count = allUsers.filter((u) => 
      u.referredBy === cleanCode || u.referredBy?.includes(`ref=${cleanCode}`)
    ).length;

    return {
      email: ref?.email || "N/A",
      phone: ref?.phone || "",
      dialCode: ref?.dialCode || "",
      countryCode: ref?.countryCode || "",
      referralCount: count
    };
  };

  const openGmail = (email: string) => {
    if (email === "N/A") return;
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`, "_blank");
  };

  const formatPhoneDisplay = (dialCode?: string, phone?: string) => {
    if (!phone) return "No phone";
    const cleanPhone = phone.startsWith("+") ? phone.substring(1) : phone;
    return `${dialCode || ""} ${cleanPhone}`;
  };

  const getWhatsAppLink = (dialCode?: string, phone?: string) => {
    if (!phone || phone.trim() === "" || phone === "N/A") return null;
    const cleanDial = (dialCode || "").replace("+", "");
    const cleanPhone = phone.replace(/^0/, "").replace(/\D/g, "");
    return `https://wa.me/${cleanDial}${cleanPhone}`;
  };

  const openWhatsApp = (dialCode: string, phone: string) => {
    const link = getWhatsAppLink(dialCode, phone);
    if (link) {
      window.open(link, "_blank");
    } else {
      toast.error("Phone number not available");
    }
  };

  const updateStatus = async (userId: string, status: ReferralStatus) => {
    let reason = "";

    if (status === "rejected") {
      const { value: text, isDismissed } = await Swal.fire({
        title: "Rejection Reason",
        input: "textarea",
        inputLabel: "Why are you rejecting this referral?",
        inputPlaceholder: "Type your reason here...",
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
      await axios.patch(`${API_BASE_URL}/user/admin/update-referral-status`, {
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
        <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full w-fit">
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
      <span className="flex items-center gap-1 text-yellow-600 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-full w-fit">
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
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans text-gray-800">
      {/* HEADER SECTION */}
      <div className=" mx-auto bg-white p-5 sm:p-6 rounded-xl shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4 border border-gray-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Referral Control ({filtered.length})</h1>
          <p className="text-xs text-gray-500 mt-1 italic">Approved referrals pay $5 to the inviter.</p>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all disabled:opacity-50"
          >
            <RotateCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search user..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 transition-all shadow-sm w-56 sm:w-64 outline-none text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="  bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]"> {/* min-w দিয়ে খুব ছোট হতে দেওয়া হয়নি */}
            <thead className="bg-gray-50 border-b border-gray-100 text-[11px] uppercase text-gray-500 font-bold tracking-wide">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Invited By</th>
                <th className="px-4 py-3">New User</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.map((user) => {
                const inviter = getReferrerInfo(user.referredBy);
                return (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4">{statusBadge(user)}</td>

                    {/* Referrer */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <button
                          onClick={() => openGmail(inviter.email)}
                          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 group"
                        >
                          <Mail size={13} className="text-gray-400 group-hover:text-blue-500" />
                          {inviter.email}
                          <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <div className="flex items-center gap-2 mt-1">
                          {inviter.countryCode && (
                            <img 
                              src={`https://flagcdn.com/w20/${inviter.countryCode.toLowerCase()}.png`}
                              alt={inviter.countryCode}
                              className="w-5 h-auto rounded-sm"
                            />
                          )}
                          <span className="text-xs text-gray-600 font-semibold">
                            {formatPhoneDisplay(inviter.dialCode, inviter.phone)}
                          </span>
                          {getWhatsAppLink(inviter.dialCode, inviter.phone) && (
                            <button
                              onClick={() => openWhatsApp(inviter.dialCode, inviter.phone)}
                              className="p-1 hover:bg-green-50 rounded-full transition-colors text-green-600"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </button>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <span className="text-[10px] text-blue-500 font-mono font-bold bg-blue-50 px-1.5 py-0.5 rounded uppercase border border-blue-100">CODE: {user.referredBy}</span>
                          <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">REFS: {inviter.referralCount}</span>
                        </div>
                      </div>
                    </td>

                    {/* New User */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <button
                          onClick={() => openGmail(user.email)}
                          className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 group"
                        >
                          <Mail size={13} className="text-gray-400 group-hover:text-blue-500" />
                          {user.email}
                          <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <div className="flex items-center gap-2 mt-1">
                          {user.countryCode && (
                            <img 
                              src={`https://flagcdn.com/w20/${user.countryCode.toLowerCase()}.png`}
                              alt={user.countryCode}
                              className="w-5 h-auto rounded-sm"
                            />
                          )}
                          <span className="text-xs text-gray-600 font-semibold">
                            {formatPhoneDisplay(user.dialCode, user.phone)}
                          </span>
                          {getWhatsAppLink(user.dialCode, user.phone) && (
                            <button
                              onClick={() => openWhatsApp(user.dialCode || "", user.phone || "")}
                              className="p-1 hover:bg-green-50 rounded-full transition-colors text-green-600"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </button>
                          )}
                        </div>
                        <div className="mt-1 flex gap-1.5 items-center">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${user.role === 'seller'
                              ? 'bg-orange-50 text-orange-600 border-orange-100'
                              : 'bg-teal-50 text-teal-600 border-teal-100'
                            }`}>
                            {user.role?.toUpperCase() || "BUYER"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className={`font-bold text-sm ${user.referralStatus === "rejected" ? "text-gray-400 line-through" : "text-green-600"}`}>
                        $5.00
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RefDetails;