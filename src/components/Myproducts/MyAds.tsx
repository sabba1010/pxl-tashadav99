import axios from "axios";
import {
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  Filter,
  RefreshCw,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading";
import { toast } from "sonner";

type Status =
  | "restore"
  | "active"
  | "pending"
  | "denied"
  | "approved"
  | "reject";

interface Ad {
  _id: string;
  category: string;
  categoryIcon: string;
  name: string;
  description: string;
  price: string;
  username: string;
  accountPass: string;
  previewLink: string;
  email: string;
  password: string;
  additionalInfo: string;
  userEmail: string;
  userRole: string;
  status: Status | string;
  rejectReason?: string;
  isVisible?: boolean;
}

const TABS: string[] = ["All", "Active", "Pending", "Denied", "Restore"];

const MyAds: React.FC = () => {
  const user = useAuth();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [items, setItems] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Ad>>({
    username: "",
    accountPass: "",
    email: "",
    password: "",
    previewLink: "",
    additionalInfo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAds = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    try {
      const res = await axios.get<Ad[]>(
        `http://localhost:3200/product/all-sells?userEmail=${user.user?.email}`
      );

      const userAds = res.data.filter(
        (ad: { status?: string }) => {
          const st = (ad.status || "").toString().toLowerCase();
          // exclude sold/completed from My Ads — they will be shown in Sold Listings
          if (st === "sold" || st === "completed") return false;
          return true;
        }
      );

      setItems(userAds);
      // Only show success toast on larger screens to avoid cluttering mobile view
      if (window.innerWidth >= 640) {
        toast.success("Listings reloaded!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.user?.email) {
      fetchAds();
    }
  }, [user.user?.email]);

  const statusOf = (s?: string | null) => (s ? s.toString().toLowerCase() : "");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    const statuses = items.map((it) => statusOf(it.status));
    map.set("All", items.length);
    map.set(
      "Active",
      statuses.filter((s) => s === "active" || s === "approved").length
    );
    map.set("Pending", statuses.filter((s) => s === "pending").length);
    map.set(
      "Denied",
      statuses.filter((s) => s === "denied" || s === "reject").length
    );
    map.set("Restore", statuses.filter((s) => s === "restore").length);
    return map;
  }, [items]);

  const filtered = items.filter((i) => {
    const s = statusOf(i.status);
    const tab = activeTab.toLowerCase();
    if (tab === "all") return true;
    if (tab === "active") return s === "active" || s === "approved";
    if (tab === "pending") return s === "pending";
    if (tab === "denied") return s === "denied" || s === "reject";
    if (tab === "restore") return s === "restore";
    return true;
  });

  useEffect(() => setCurrentPage(1), [activeTab, items]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    if (currentPage <= 4) {
      pages.push(2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push("...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Delete Ad?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#E5E7EB",
      confirmButtonText: "Yes, Delete",
      customClass: { popup: "rounded-2xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3200/product/delete/${id}`);
          setItems((prev) => prev.filter((it) => it._id !== id));
          toast.success("Ad deleted successfully");
        } catch (err) {
          toast.error("Failed to delete ad");
        }
      }
    });
  };

  const handleRestore = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it._id === id ? { ...it, status: "active" } : it))
    );
    toast.success("Ad restored to Active");
  };

  const handleEditDenied = (ad: Ad) => {
    setEditingAd(ad);
    setEditFormData({
      username: ad.username,
      accountPass: ad.accountPass,
      email: ad.email,
      password: ad.password,
      previewLink: ad.previewLink,
      additionalInfo: ad.additionalInfo,
    });
  };

  const handleResubmit = async () => {
    if (!editingAd) return;

    // Validate required fields
    if (!editFormData.username?.trim() || !editFormData.accountPass?.trim() ||
      !editFormData.email?.trim() || !editFormData.password?.trim() ||
      !editFormData.previewLink?.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        username: editFormData.username || "",
        accountPass: editFormData.accountPass || "",
        email: editFormData.email || "",
        password: editFormData.password || "",
        previewLink: editFormData.previewLink || "",
        additionalInfo: editFormData.additionalInfo || "",
        status: "pending",
      };

      await axios.patch(
        `http://localhost:3200/product/update/${editingAd._id}`,
        updateData
      );

      // Update local items
      setItems((prev) =>
        prev.map((it) =>
          it._id === editingAd._id
            ? { ...it, ...updateData }
            : it
        )
      );

      toast.success("Ad resubmitted successfully. Awaiting admin review.");
      setEditingAd(null);
      setEditFormData({});
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resubmit ad");
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleEdit = (id: string) => navigate(`/edit-product/${id}`);

  const getStatusColor = (s?: string) => {
    const st = statusOf(s);
    if (st === "approved" || st === "active")
      return "bg-emerald-100 text-emerald-700";
    if (st === "pending") return "bg-amber-100 text-amber-700";
    if (st === "denied" || st === "reject")
      return "bg-rose-100 text-rose-700";
    if (st === "restore") return "bg-gray-100 text-gray-600";
    if (st === "sold") return "bg-blue-100 text-blue-700";
    if (st === "completed") return "bg-green-50 text-green-600";
    return "bg-gray-100 text-gray-600";
  };

  const prettyStatusLabel = (s?: string) => {
    const st = statusOf(s);
    if (st === "approved" || st === "active") return "Active";
    if (st === "pending") return "Pending";
    if (st === "denied" || st === "reject") return "Denied";
    if (st === "restore") return "Restore";
    if (st === "sold") return "Sold";
    if (st === "completed") return "Completed";
    return "Unknown";
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3EFEE]">
        <Loading />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F3EFEE] pt-12 pb-24 sm:pt-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#0A1A3A] tracking-tight">
              My Listings
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Manage your products and monitor their approval status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <button
              onClick={fetchAds}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-[#33ac6f] hover:bg-[#28935a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-sm"
              title="Refresh listings"
            >
              <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reload</span>
            </button>

            <Link
              to="/active-listings"
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-sm"
              title="Sold Listings"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Sold Listings</span>
            </Link>

            <Link
              to="/selling-form"
              className="flex items-center justify-center gap-2 bg-[#d4a643] hover:bg-[#33ac6f] text-white px-6 py-3 rounded-xl sm:rounded-2xl font-semibold text-sm shadow-lg transition-all duration-300 active:scale-95"
            >
              <Plus size={18} />
              Create New Ad
            </Link>
          </div>
        </div>

        {/* Tabs Section - Fixed Overflow and Gaps */}
        <div className="bg-white rounded-t-2xl">
          <div className="flex gap-4 sm:gap-6 p-4 border-b overflow-x-auto scrollbar-hide [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`pb-2 text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === t
                  ? "text-[#d4a643] border-[#d4a643] font-bold"
                  : "text-gray-500 border-transparent"
                  }`}
              >
                <span className="flex items-center gap-1.5 sm:gap-2">
                  {t}
                  <span className="px-1.5 py-0.5 bg-gray-100 text-[10px] text-gray-500 rounded-md font-bold">
                    {counts.get(t) ?? 0}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* List Content Section */}
        <div className="bg-white rounded-b-2xl px-3 sm:px-6 py-6 sm:py-8 border-t-0 shadow-sm">
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-200">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Filter size={28} className="text-gray-300" />
                </div>
                <h3 className="text-base font-bold text-[#0A1A3A] mb-1">
                  No ads found
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-[200px] mx-auto">
                  {activeTab === "All"
                    ? "You haven't created any listings yet."
                    : `No items in the "${activeTab}" category.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {(paginated.length > 0 ? paginated : filtered).map((item) => (
                  <div
                    key={item._id}
                    className="bg-[#f8fafb] rounded-xl border border-gray-100 p-3 sm:p-4 flex flex-wrap items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <img
                          src={item.categoryIcon}
                          alt={item.category}
                          className="w-7 h-7 sm:w-9 sm:h-9 object-contain"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xs sm:text-sm text-[#0A1A3A] truncate">
                        {item.name}
                      </h3>
                      <div className="mt-1.5 sm:mt-2">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-md text-[9px] sm:text-xs font-bold uppercase tracking-wider ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {prettyStatusLabel(item.status)}
                        </span>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col items-end gap-2 sm:gap-3 flex-none">
                      <div className="text-base sm:text-lg font-bold text-[#0A1A3A]">
                        ${item.price}
                      </div>

                      <div className="flex items-center gap-1">
                        {statusOf(item.status) === "restore" && (
                          <button
                            onClick={() => handleRestore(item._id)}
                            className="p-1.5 sm:p-2 border rounded-lg hover:bg-emerald-50 text-emerald-600 transition"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}
                        {(statusOf(item.status) === "denied" || statusOf(item.status) === "reject") && (
                          <button
                            onClick={() => handleEditDenied(item)}
                            className="p-1.5 sm:p-2 border rounded-lg hover:bg-blue-50 text-blue-600 transition"
                            title="Edit and resubmit"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 sm:p-2 border rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Reject Reason */}
                    {(statusOf(item.status) === "denied" ||
                      statusOf(item.status) === "reject") &&
                      item.rejectReason && (
                        <div className="w-full flex-shrink-0 mt-3 p-2.5 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2 text-[10px] sm:text-xs">
                          <AlertCircle size={12} className="text-rose-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-rose-800">Action Required</p>
                            <p className="text-rose-700">{item.rejectReason}</p>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="max-w-screen-xl mx-auto mt-4 px-4 sm:px-6">
                <div className="flex justify-center items-center gap-2 mt-4 select-none">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, i) =>
                      page === "..." ? (
                        <span key={i} className="px-2 text-gray-400">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page as number)}
                          className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-semibold border transition-all
                            ${currentPage === page
                              ? "bg-[#33ac6f] border-[#33ac6f] text-white shadow-md"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal for Denied Ads */}
      {editingAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0A1A3A]">
                Edit & Resubmit Denied Ad
              </h2>
              <button
                onClick={() => setEditingAd(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {editingAd.rejectReason && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
                  <p className="text-sm font-bold text-rose-800 mb-2">Rejection Reason:</p>
                  <p className="text-sm text-rose-700">{editingAd.rejectReason}</p>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={editFormData.username || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, username: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Account Password *
                  </label>
                  <input
                    type="password"
                    value={editFormData.accountPass || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, accountPass: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter account password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Recovery Email *
                  </label>
                  <input
                    type="email"
                    value={editFormData.email || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter recovery email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Recovery Email Password *
                  </label>
                  <input
                    type="password"
                    value={editFormData.password || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter recovery email password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Profile Preview Link *
                  </label>
                  <input
                    type="url"
                    value={editFormData.previewLink || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, previewLink: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter profile preview link"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Additional Note
                  </label>
                  <textarea
                    value={editFormData.additionalInfo || ""}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, additionalInfo: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Add any additional information..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50 justify-end">
              <button
                onClick={() => setEditingAd(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleResubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Resubmit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default MyAds;