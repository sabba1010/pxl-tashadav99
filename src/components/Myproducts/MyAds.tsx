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

  const handleEdit = (id: string) => navigate(`/edit-product/${id}`);

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
    <div className="min-h-screen bg-[#F3EFEE] pt-20 pb-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0A1A3A] tracking-tight">
              My Listings
            </h1>
            <p className="text-gray-600 mt-2 text-base">
              Manage your products and monitor their approval status.
            </p>
          </div>

          <Link
            to="/selling-form"
            className="flex items-center justify-center gap-2.5 bg-[#0A1A3A] hover:bg-[#162a52] text-white px-7 py-3.5 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <Plus size={20} />
            Create New Ad
          </Link>
        </div>

        {/* Tabs (using MyPurchase tab design) */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8 ">
          <div className="flex gap-6 p-4 border-b overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`pb-2 text-sm whitespace-nowrap transition-all ${
                  activeTab === t
                    ? "text-[#d4a643] border-b-2 border-[#d4a643] font-bold"
                    : "text-gray-500"
                }`}
              >
                <span className="flex items-center gap-2">
                  {t}
                  <span className="text-xs text-gray-400 font-bold">{counts.get(t) ?? 0}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
         <div className="bg-white rounded-2xl shadow-sm border p-6">
        {/* Cards - Now matching Marketplace ItemCard height & style exactly */}
        <div className="space-y-4 ">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Filter size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1A3A] mb-2">
                No ads found
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                {activeTab === "All"
                  ? "You haven't created any listings yet."
                  : `No items in the "${activeTab}" category.`}
              </p>
              {activeTab === "All" && (
                <Link
                  to="/selling-form"
                  className="inline-block mt-5 text-[#33ac6f] font-semibold hover:underline"
                >
                  Create your first listing →
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 ">
              {filtered.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#f8fafb] rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200 p-4 flex items-top gap-4"
                >
                  {/* Icon - Same as Marketplace list mode */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                      <img
                        src={item.categoryIcon}
                        alt={item.category}
                        className="w-9 h-9 object-contain"
                      />
                    </div>
                  </div>

                  {/* Title, Description, Status */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-[#0A1A3A] truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {item.description || "No description provided"}
                    </p>

                    {/* Status Badge */}
                    <div className="mt-2">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {prettyStatusLabel(item.status)}
                      </span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col items-end gap-3">
                     <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                            Price
                          </span>
                    <div className="text-base font-bold text-[#0A1A3A] text-[20px]">
                      ${item.price}
                    </div>

                    <div className="flex items-center gap-1">
                      {statusOf(item.status) === "restore" && (
                        <button
                          onClick={() => handleRestore(item._id)}
                          className="p-2 border rounded-md hover:bg-emerald-50 text-emerald-600 transition"
                          title="Restore"
                        >
                          <RefreshCw size={15} />
                        </button>
                      )}

                      <button
                        onClick={() => handleEdit(item._id)}
                        className="p-2 border rounded-md hover:bg-gray-50 text-gray-600 transition"
                        title="Edit"
                      >
                        <Edit size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 border rounded-md hover:bg-red-50 text-gray-600 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Reject Reason - Only if needed */}
                  {(statusOf(item.status) === "denied" ||
                    statusOf(item.status) === "reject") &&
                    item.rejectReason && (
                      <div className="col-span-full mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs">
                        <AlertCircle size={14} className="text-rose-600 mt-0.5 flex-shrink-0" />
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
        </div>
</div>
      </div>
    </div>
  );
};

export default MyAds;