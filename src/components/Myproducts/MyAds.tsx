import axios from "axios";
import {
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  Eye,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading";
import { toast } from "sonner"; // Import toast only (Toaster is in App.js)

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

  // --- Fetch Data ---
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get<Ad[]>(
          "http://localhost:3200/product/all-sells"
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

  // --- Statistics ---
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

  // --- Filter Logic ---
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

  // --- Actions ---
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Delete Ad?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444", // Red for danger
      cancelButtonColor: "#E5E7EB",
      cancelButtonText: "<span style='color: #374151'>Cancel</span>",
      confirmButtonText: "Yes, Delete",
      customClass: {
        popup: "rounded-2xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3200/product/delete/${id}`);
          setItems((prev) => prev.filter((it) => it._id !== id));

          // Single Alert Logic
          toast.dismiss();
          toast.success("Ad deleted successfully");
        } catch (err) {
          toast.dismiss();
          toast.error("Failed to delete ad");
        }
      }
    });
  };

  const handleRestore = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it._id === id ? { ...it, status: "active" } : it))
    );
    // Single Alert Logic
    toast.dismiss();
    toast.success("Ad restored to Active list");
  };

  const handleEdit = (id: string) => navigate(`/edit-product/${id}`);

  // --- Render Helpers ---
  const getStatusColor = (s?: string) => {
    const st = statusOf(s);
    if (st === "approved" || st === "active")
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    if (st === "pending") return "bg-amber-50 text-amber-700 border-amber-100";
    if (st === "denied" || st === "reject")
      return "bg-rose-50 text-rose-700 border-rose-100";
    return "bg-gray-50 text-gray-600 border-gray-100";
  };

  const prettyStatusLabel = (s?: string) => {
    const st = statusOf(s);
    if (st === "approved") return "Active"; // Showing "Active" for approved is cleaner
    if (st === "active") return "Active";
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
    <div className="min-h-screen bg-[#F3EFEE] pt-20 pb-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1A3A] tracking-tight">
              My Listings
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Manage your active products and track their status.
            </p>
          </div>
          <Link
            to="/selling-form"
            className="flex items-center justify-center gap-2 bg-[#0A1A3A] hover:bg-[#162a52] text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus size={18} />
            <span>Create New Ad</span>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 sticky top-20 z-10">
          <div className="px-2 sm:px-4">
            <nav className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar py-3">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${
                    activeTab === t
                      ? "text-[#0A1A3A] bg-gray-100"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t}
                  <span
                    className={`ml-2 text-xs py-0.5 px-2 rounded-full ${
                      activeTab === t
                        ? "bg-[#0A1A3A] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {counts.get(t) ?? 0}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Filter size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#0A1A3A]">No ads found</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                {activeTab === "All"
                  ? "You haven't listed any products yet."
                  : `You don't have any items in the "${activeTab}" category.`}
              </p>
              {activeTab === "All" && (
                <Link
                  to="/add-product"
                  className="inline-block mt-4 text-[#33ac6f] font-semibold hover:underline"
                >
                  Post your first ad &rarr;
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Icon / Image Section */}
                    <div className="flex-shrink-0 flex items-start justify-between sm:justify-start">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                        <img
                          src={item.categoryIcon}
                          alt={item.category}
                          className="w-full h-full object-contain opacity-90"
                        />
                      </div>

                      {/* Mobile Status Badge (Visible only on small screens) */}
                      <span
                        className={`sm:hidden px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {prettyStatusLabel(item.status)}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-[#0A1A3A] truncate pr-4 group-hover:text-[#33ac6f] transition-colors">
                            {item.name}
                          </h3>
                          {/* Desktop Status Badge */}
                          <span
                            className={`hidden sm:inline-flex px-3 py-1 rounded-full text-[11px] uppercase font-bold tracking-wide border ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {prettyStatusLabel(item.status)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>

                        {/* Rejected Reason Alert */}
                        {(statusOf(item.status) === "denied" ||
                          statusOf(item.status) === "reject") &&
                          item.rejectReason && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1">
                              <AlertCircle
                                size={16}
                                className="text-red-500 mt-0.5 flex-shrink-0"
                              />
                              <div>
                                <p className="text-xs font-bold text-red-800 uppercase">
                                  Action Required
                                </p>
                                <p className="text-xs text-red-600 mt-0.5">
                                  {item.rejectReason}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Footer: Price & Actions */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            Price
                          </span>
                          <span className="text-xl font-bold text-[#0A1A3A]">
                            ${item.price}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Restore Button */}
                          {statusOf(item.status) === "restore" && (
                            <button
                              onClick={() => handleRestore(item._id)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition"
                            >
                              <RefreshCw size={15} />
                              <span>Restore</span>
                            </button>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
                            <button
                              onClick={() => handleEdit(item._id)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-md transition-all shadow-sm hover:shadow"
                              title="Edit Ad"
                            >
                              <Edit size={16} />
                            </button>
                            <div className="w-px h-4 bg-gray-300 mx-0.5"></div>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-md transition-all shadow-sm hover:shadow"
                              title="Delete Ad"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <Link
        to="/add-product"
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-transform"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
};

export default MyAds;
