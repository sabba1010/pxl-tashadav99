import axios from "axios";
import {
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  Filter,
  RefreshCw,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
}

const TABS: string[] = ["All", "Active", "Pending", "Denied", "Restore"];

const MyAds: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuth();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [items, setItems] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get<Ad[]>(
          "https://vps-backend-server-beta.vercel.app/product/all-sells"
        );

        const userAds = res.data.filter(
          (ad: { userEmail: string }) => ad.userEmail === user.user?.email
        );

        setItems(userAds);
      } catch (err) {
        console.error(err);
        toast.dismiss();
        toast.error("Failed to load ads");
      } finally {
        setLoading(false);
      }
    };

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
          await axios.delete(`https://vps-backend-server-beta.vercel.app/product/delete/${id}`);
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

  // const handleEdit = (id: string) => navigate(`/edit-product/${id}`);

  const getStatusColor = (s?: string) => {
    const st = statusOf(s);
    if (st === "approved" || st === "active")
      return "bg-emerald-100 text-emerald-700";
    if (st === "pending") return "bg-amber-100 text-amber-700";
    if (st === "denied" || st === "reject")
      return "bg-rose-100 text-rose-700";
    if (st === "restore") return "bg-gray-100 text-gray-600";
    return "bg-gray-100 text-gray-600";
  };

  const prettyStatusLabel = (s?: string) => {
    const st = statusOf(s);
    if (st === "approved" || st === "active") return "Active";
    if (st === "pending") return "Pending";
    if (st === "denied" || st === "reject") return "Denied";
    if (st === "restore") return "Restore";
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#0A1A3A] tracking-tight">
              My Listings
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Manage your products and monitor their approval status.
            </p>
          </div>

          <Link
            to="/selling-form"
            className="flex items-center justify-center gap-2 bg-[#d4a643] hover:bg-[#33ac6f] text-white px-6 py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base shadow-lg transition-all duration-300 active:scale-95"
          >
            <Plus size={18} />
            Create New Ad
          </Link>
        </div>

        {/* Tabs Section - Fixed Overflow and Gaps */}
        <div className="bg-white rounded-t-2xl">
          <div className="flex gap-4 sm:gap-6 p-4 border-b overflow-x-auto scrollbar-hide [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`pb-2 text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 ${
                  activeTab === t
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
                        {/* <button
                          onClick={() => handleEdit(item._id)}
                          className="p-1.5 sm:p-2 border rounded-lg hover:bg-gray-50 text-gray-600 transition"
                        >
                          <Edit size={14} />
                        </button> */}
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
    </div>
  );
};


export default MyAds;