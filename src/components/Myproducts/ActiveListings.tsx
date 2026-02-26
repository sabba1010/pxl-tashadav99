import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import { useAuth } from "../../context/AuthContext";

type Ad = {
  _id: string;
  name: string;
  category: string;
  categoryIcon?: string;
  price?: number | string;
  status?: string;
  isVisible?: boolean;
  userEmail?: string;
};

const API = "https://tasha-vps-backend-2.onrender.com";

const ActiveListings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Ad[]>([]);

  const fetchAds = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    try {
      const res = await axios.get<Ad[]>(`${API}/product/all-sells?userEmail=${user?.email}`);
      const userAds = res.data.filter((ad: any) => ad.isVisible !== false);
      setItems(userAds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) fetchAds();
  }, [user?.email]);

  const sold = items.filter((i) => (i.status || "").toString().toLowerCase() === "sold");
  const completed = items.filter((i) => (i.status || "").toString().toLowerCase() === "completed");

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3EFEE]"><Loading /></div>
    );

  return (
    <div className="min-h-screen bg-[#F3EFEE] pt-12 pb-24 sm:pt-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1A3A] tracking-tight">Active Listings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage sold & completed sales from one place.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-[#0A1A3A]">{sold.length}</span>
              <span className="ml-1 text-gray-500">Sold</span>
              <span className="mx-3">•</span>
              <span className="font-bold text-[#0A1A3A]">{completed.length}</span>
              <span className="ml-1 text-gray-500">Completed</span>
            </div>

            <button
              onClick={fetchAds}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#33ac6f] hover:bg-[#28935a] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-all active:scale-95 shadow-sm"
              title="Reload listings"
            >
              <svg className={`w-4 h-4 transition-transform ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Reload</span>
            </button>

            <Link
              to="/myproducts"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#d4a643] hover:bg-[#c0a33b] text-white rounded-lg font-semibold text-sm transition-all active:scale-95 shadow-sm"
            >
              <span>My Ads</span>
            </Link>
          </div>
        </div>

        {/* Sold Listings */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Sold Listings</h2>
            <span className="text-xs text-gray-500">{sold.length} item(s)</span>
          </div>

          {sold.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-200">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3 8 4-16 3 8h4" /></svg>
              </div>
              <h3 className="text-base font-bold text-[#0A1A3A] mb-1">No sold listings</h3>
              <p className="text-xs text-gray-400 max-w-[360px] mx-auto">Items that are marked sold will appear here. They will move to Completed when the sale is finalized.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sold.map((it) => (
                <div key={it._id} className="p-4 bg-white rounded-lg border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    {it.categoryIcon ? <img src={it.categoryIcon} alt={it.category} className="w-8 h-8 object-contain" /> : <span className="text-sm font-bold">{(it.name || "").charAt(0)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{it.name}</div>
                    <div className="text-xs text-gray-500 truncate mt-1">{it.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${(Number(it.price) || 0).toFixed(2)}</div>
                    <div className="text-xs text-blue-700 font-bold">Sold</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completed Sales */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Completed Sales</h2>
            <span className="text-xs text-gray-500">{completed.length} item(s)</span>
          </div>

          {completed.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-gray-200">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
              </div>
              <h3 className="text-base font-bold text-[#0A1A3A] mb-1">No completed sales</h3>
              <p className="text-xs text-gray-400 max-w-[360px] mx-auto">Completed sales show here after an order is fully processed and confirmed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {completed.map((it) => (
                <div key={it._id} className="p-4 bg-white rounded-lg border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    {it.categoryIcon ? <img src={it.categoryIcon} alt={it.category} className="w-8 h-8 object-contain" /> : <span className="text-sm font-bold">{(it.name || "").charAt(0)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{it.name}</div>
                    <div className="text-xs text-gray-500 truncate mt-1">{it.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${(Number(it.price) || 0).toFixed(2)}</div>
                    <div className="text-xs text-green-600 font-bold">Completed</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ActiveListings;
