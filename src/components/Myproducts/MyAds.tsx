import axios from "axios";
import { Delete, Edit, Plus, Trash } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading";

type Status = "restore" | "active" | "pending" | "denied" | "approved";

interface Ad {
  _id: string;
  category: string; // e.g., "Facebook"
  categoryIcon: string; // image URL
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
}

const TABS: string[] = ["All", "Active", "Pending", "Denied", "Restore"];

const MyAds: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuth();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [items, setItems] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch API data and filter by logged-in user
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
        alert("Failed to load ads");
      } finally {
        setLoading(false);
      }
    };
    if (user.user?.email) fetchAds();
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
    map.set("Denied", statuses.filter((s) => s === "denied").length);
    map.set("Restore", statuses.filter((s) => s === "restore").length);
    return map;
  }, [items]);

  const filtered = items.filter((i) => {
    const s = statusOf(i.status);
    const tab = activeTab.toLowerCase();
    if (tab === "all") return true;
    if (tab === "active") return s === "active" || s === "approved";
    if (tab === "pending") return s === "pending";
    if (tab === "denied") return s === "denied";
    if (tab === "restore") return s === "restore";
    return true;
  });

  const handleRestore = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it._id === id ? { ...it, status: "active" } : it))
    );
    alert("Ad restored");
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this ad?")) return;
    setItems((prev) => prev.filter((it) => it._id !== id));
  };

  const handleEdit = (id: string) => navigate(`/edit-product/${id}`);

  const prettyStatusLabel = (s?: string) => {
    const st = statusOf(s);
    if (st === "approved") return "Approved";
    if (st === "active") return "Active";
    if (st === "pending") return "Pending";
    if (st === "denied") return "Denied";
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
          <div className="flex items-center gap-3">
            <Link
              to="/add-product"
              className="mt-1 sm:mt-0 bg-[#d4a643] text-white px-4 py-2 rounded-full font-medium hover:opacity-95 transition-shadow shadow"
            >
              Create Ad
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 pt-4 sm:pt-6">
            <nav className="flex gap-4 sm:gap-6 border-b border-gray-100 pb-3 sm:pb-4 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-2 text-xs sm:text-sm ${
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
              <div className="py-12 sm:py-20 flex flex-col items-center text-center text-gray-500">
                <h3 className="text-lg sm:text-xl font-semibold text-[#0A1A3A] mb-2">
                  No Ads
                </h3>
                <p className="text-sm sm:text-base text-gray-500 max-w-md">
                  Add products for customers to buy from you.
                </p>
                <Link
                  to="/add-product"
                  className="mt-4 sm:mt-6 bg-[#D4A643] text-[#111] px-5 py-2 rounded-full font-medium hover:bg-[#1BC47D] transition"
                >
                  Start selling
                </Link>
              </div>
            ) : (
              <div className="max-h-[62vh] overflow-y-auto pr-2 sm:pr-4 space-y-4 sm:space-y-5">
                {filtered.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Category Icon */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.categoryIcon}
                        alt={item.category}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain bg-gray-50 p-2 border border-gray-100"
                      />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Title + Description */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        {/* Right Section: Price, Status, Actions */}
                        <div className="flex flex-col items-end gap-3">
                          {/* Price */}
                          <div className="text-2xl font-bold text-gray-900">
                            ${item.price}
                          </div>

                          {/* Status Badge */}
                          <span
                            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
                              statusOf(item.status) === "approved"
                                ? "bg-green-100 text-green-700"
                                : statusOf(item.status) === "active"
                                ? "bg-blue-100 text-blue-700"
                                : statusOf(item.status) === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : statusOf(item.status) === "denied"
                                ? "bg-red-100 text-red-700"
                                : statusOf(item.status) === "restore"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {prettyStatusLabel(item.status)}
                          </span>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {statusOf(item.status) === "restore" && (
                              <button
                                onClick={() => handleRestore(item._id)}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                              >
                                Restore
                              </button>
                            )}
                            <button
                              title="Edit"
                              onClick={() => handleEdit(item._id)}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              title="Delete"
                              onClick={() => handleDelete(item._id)}
                              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-red-600"
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

      {/* Floating + button */}
      <Link
        to="/add-product"
        className="hidden sm:flex sm:fixed bottom-6 right-6 w-14 h-14 bg-[#33ac6f] hover:bg-[#c4963a] text-white rounded-full shadow-2xl items-center justify-center z-50 transition-all"
        aria-label="Add product"
      >
        <Plus size={18} />
      </Link>
    </div>
  );
};

export default MyAds;
