import axios from "axios";
import { Delete, Edit, Plus, Trash, AlertCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // SweetAlert2
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading";

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
        (ad) => ad.userEmail === user.user?.email
      );

      setItems(userAds);
    } catch (err) {
      console.error(err);
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
      title: "Are you sure?",
      text: "Delete this ad permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#33ac6f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3200/product/delete/${id}`);
          setItems((prev) => prev.filter((it) => it._id !== id));
          Swal.fire("Deleted!", "Your ad has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error!", "Failed to delete.", "error");
        }
      }
    });
  };

  const handleRestore = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it._id === id ? { ...it, status: "active" } : it))
    );
    Swal.fire({
      icon: "success",
      title: "Ad restored",
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: "top-end",
    });
  };

  const handleEdit = (id: string) => navigate(`/edit-product/${id}`);

  const prettyStatusLabel = (s?: string) => {
    const st = statusOf(s);
    if (st === "approved") return "Approved";
    if (st === "active") return "Active";
    if (st === "pending") return "Pending";
    if (st === "denied" || st === "reject") return "Denied";
    if (st === "restore") return "Restore";
    return st ? st.charAt(0).toUpperCase() + st.slice(1) : "Unknown";
  };

  if (loading)
    return (
      <div className="text-center mt-10">
        <Loading />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F3EFEE] pt-16 sm:pt-20 pb-20 sm:pb-24">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A1A3A]">
              My Ads
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              All of your product ads show here
            </p>
          </div>
          <Link
            to="/add-product"
            className="mt-1 sm:mt-0 bg-[#d4a643] text-white px-4 py-2 rounded-full font-medium hover:opacity-95 shadow"
          >
            Create Ad
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 pt-4 sm:pt-6">
            <nav className="flex gap-4 sm:gap-6 border-b border-gray-100 pb-3 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-2 text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === t
                      ? "text-[#33ac6f] border-b-2 border-[#d4a643]"
                      : "text-gray-500"
                  }`}
                >
                  {t}{" "}
                  <span className="text-gray-400">({counts.get(t) ?? 0})</span>
                </button>
              ))}
            </nav>
          </div>

          {/* List */}
          <div className="p-4 sm:p-6">
            {filtered.length === 0 ? (
              <div className="py-12 flex flex-col items-center text-center text-gray-500">
                <h3 className="text-lg font-semibold text-[#0A1A3A] mb-2">
                  No Ads
                </h3>
                <p className="text-sm">
                  Add products for customers to buy from you.
                </p>
                <Link
                  to="/add-product"
                  className="mt-4 bg-[#D4A643] text-white px-5 py-2 rounded-full font-medium transition"
                >
                  Start selling
                </Link>
              </div>
            ) : (
              <div className="max-h-[62vh] overflow-y-auto pr-2 space-y-4">
                {filtered.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 border border-gray-200 shadow-sm"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={item.categoryIcon}
                        alt=""
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain bg-gray-50 p-2 border border-gray-100"
                      />
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Reject Reason Display (New) */}
                          {(statusOf(item.status) === "denied" ||
                            statusOf(item.status) === "reject") &&
                            item.rejectReason && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md flex items-center gap-2">
                                <AlertCircle
                                  size={14}
                                  className="text-red-500"
                                />
                                <span className="text-[11px] text-red-600 font-medium">
                                  Reason: {item.rejectReason}
                                </span>
                              </div>
                            )}
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className="text-2xl font-bold text-gray-900">
                            ${item.price}
                          </div>
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
                              statusOf(item.status) === "approved" ||
                              statusOf(item.status) === "active"
                                ? "bg-green-100 text-green-700"
                                : statusOf(item.status) === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {prettyStatusLabel(item.status)}
                          </span>

                          <div className="flex items-center gap-2">
                            {statusOf(item.status) === "restore" && (
                              <button
                                onClick={() => handleRestore(item._id)}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium"
                              >
                                Restore
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(item._id)}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-red-600"
                            >
                              <Trash size={16} />
                            </button>
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
      </div>

      <Link
        to="/add-product"
        className="hidden sm:flex sm:fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] hover:bg-[#c4963a] text-white rounded-full shadow-2xl items-center justify-center z-50 transition-all"
      >
        <Plus size={18} />
      </Link>
    </div>
  );
};

export default MyAds;
