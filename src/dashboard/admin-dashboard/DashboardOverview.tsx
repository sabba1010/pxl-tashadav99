import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  ShoppingBag, 
  PeopleAlt, 
  Storefront, 
  Refresh, 
  Payments, 
  AccountBalanceWallet,
  PersonOutline,
  ListAlt,
  MonetizationOn
} from "@mui/icons-material";
import axios from "axios";
import { CircularProgress, Typography, Box } from "@mui/material";

const BASE_URL = "https://tasha-vps-backend-2.onrender.com";

interface AdminMetrics {
  totalUsers: number;
  totalBuyers: number;
  totalSellers: number;
  totalUserBalance: number; 
  activeListings: number;
  pendingListings: number;
  totalSystemBalance: number;
  platformProfitUSD: number;
  pendingDepositRequests: number;
  pendingWithdrawalRequests: number;
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  linkTo?: string;
  variant?: "default" | "profit" | "warning" | "success" | "info" | "user" | "balance";
  isLoading?: boolean;
}> = ({ title, value, subtitle, icon, linkTo, variant = "default", isLoading = false }) => {
  
  const variantStyles = {
    default: "border-gray-300 bg-white shadow-sm",
    profit: "border-amber-500/40 bg-gradient-to-br from-amber-50 to-white",
    success: "border-emerald-500/40 bg-gradient-to-br from-emerald-50 to-white",
    warning: "border-orange-500/40 bg-gradient-to-br from-orange-50 to-white",
    info: "border-blue-500/40 bg-gradient-to-br from-blue-50 to-white",
    user: "border-violet-500/40 bg-gradient-to-br from-violet-50 to-white",
    balance: "border-emerald-600/40 bg-gradient-to-br from-emerald-100/50 to-white",
  };

  return (
    <div className={`group relative overflow-hidden rounded-[2rem] border-2 ${variantStyles[variant]} p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div className="z-10">
          <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.15em] mb-2">{title}</p>
          {isLoading ? (
            <CircularProgress size={28} sx={{ mt: 1, color: "#1A202C" }} />
          ) : (
            <p className="text-3xl font-[1000] text-slate-900 tracking-tight leading-none">{value}</p>
          )}
          {subtitle && <p className="text-xs text-slate-600 mt-3 font-bold opacity-80">{subtitle}</p>}
        </div>
        <div className="p-4 rounded-2xl bg-white shadow-inner border border-gray-100 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
      
      {linkTo && (
        <Link to={linkTo} className="mt-6 flex items-center gap-1 text-xs font-[900] uppercase text-indigo-600 tracking-wider hover:gap-3 transition-all">
          Manage Section <span className="text-lg">→</span>
        </Link>
      )}

      {/* Background Decorative Shape */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-current opacity-[0.03] rounded-full" />
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalUsers: 0, totalBuyers: 0, totalSellers: 0, totalUserBalance: 0,
    activeListings: 0, pendingListings: 0, totalSystemBalance: 0,
    platformProfitUSD: 0, pendingDepositRequests: 0, pendingWithdrawalRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [uRes, prRes, puRes, payRes, wRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/user/getall`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/product/all-sells`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/purchase/getall`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/api/payments`).catch(() => ({ data: [] })),
        axios.get(`${BASE_URL}/withdraw/getall`).catch(() => ({ data: [] })),
      ]);

      const users = Array.isArray(uRes.data) ? uRes.data : [];
      const products = Array.isArray(prRes.data) ? prRes.data : [];
      const purchases = Array.isArray(puRes.data) ? puRes.data : [];
      const payments = Array.isArray(payRes.data) ? payRes.data : [];
      const withdraws = Array.isArray(wRes.data) ? wRes.data : [];

      setMetrics({
        totalUsers: users.length,
        totalBuyers: users.filter((u: any) => u.role === "buyer").length,
        totalSellers: users.filter((u: any) => u.role === "seller").length,
        totalUserBalance: users.reduce((sum: number, u: any) => sum + (Number(u.balance) || 0), 0),
        activeListings: products.filter((p: any) => p.status === "active").length,
        pendingListings: products.filter((p: any) => p.status === "pending").length,
        totalSystemBalance: purchases.reduce((s: number, p: any) => s + (Number(p.totalAmount || p.price) || 0), 0),
        platformProfitUSD: purchases.filter((p: any) => ["completed", "success"].includes(p.status)).reduce((s: number, p: any) => s + (Number(p.adminFee) || 0), 0),
        pendingDepositRequests: payments.filter((p: any) => p.status.toLowerCase() !== "successful" && !p.credited).length,
        pendingWithdrawalRequests: withdraws.filter((w: any) => w.status === "pending").length,
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  return (
    <div className="p-10 bg-[#F4F7FE] min-h-screen space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 1000, color: "#1B2559", letterSpacing: "-1px" }}>
            Admin Overview
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: "#A3AED0", mt: 0.5 }}>
            Comprehensive analytics and platform control center
          </Typography>
        </Box>
        <button 
          onClick={fetchAllData} 
          className="flex items-center gap-3 px-7 py-3.5 bg-[#1B2559] text-white rounded-[1.2rem] shadow-xl shadow-indigo-200 hover:bg-indigo-800 transition-all active:scale-95"
        >
          <Refresh className={loading ? "animate-spin" : ""} fontSize="small" />
          <span className="text-sm font-black uppercase tracking-widest">Refresh Data</span>
        </button>
      </div>

      {/* Main Financial Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <MetricCard
          title="Total Wallet Balance"
          value={`$${metrics.totalUserBalance.toLocaleString()}`}
          variant="balance"
          subtitle="Total funds held by users"
          icon={<MonetizationOn sx={{ color: "#059669", fontSize: 38 }} />}
          isLoading={loading}
        />
        <MetricCard
          title="Net Platform Profit"
          value={`$${metrics.platformProfitUSD.toLocaleString()}`}
          variant="profit"
          subtitle="Verified admin commissions"
          icon={<TrendingUp sx={{ color: "#B45309", fontSize: 38 }} />}
          isLoading={loading}
        />
        <MetricCard
          title="System Turnover"
          value={`$${metrics.totalSystemBalance.toLocaleString()}`}
          variant="info"
          subtitle="Total transaction volume"
          icon={<AccountBalanceWallet sx={{ color: "#2563EB", fontSize: 38 }} />}
          isLoading={loading}
        />
      </div>

      {/* Section Divider */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-[1000] text-slate-800 uppercase tracking-tighter">User Statistics</h2>
        <div className="h-[2px] flex-1 bg-slate-200 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard title="Total Registered" value={metrics.totalUsers} variant="user" icon={<PeopleAlt sx={{ color: "#7C3AED", fontSize: 32 }} />} isLoading={loading} />
        <MetricCard title="Active Sellers" value={metrics.totalSellers} variant="user" icon={<Storefront sx={{ color: "#8B5CF6", fontSize: 32 }} />} isLoading={loading} />
        <MetricCard title="Active Buyers" value={metrics.totalBuyers} variant="user" icon={<PersonOutline sx={{ color: "#6366F1", fontSize: 32 }} />} isLoading={loading} />
      </div>

      {/* Section Divider */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-[1000] text-slate-800 uppercase tracking-tighter">Pending Actions</h2>
        <div className="h-[2px] flex-1 bg-slate-200 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Deposit Requests" value={metrics.pendingDepositRequests} variant="info" icon={<Payments sx={{ color: "#2563EB" }} />} linkTo="/admin-dashboard/deposits" isLoading={loading} />
        <MetricCard title="Pending Listings" value={metrics.pendingListings} variant="warning" icon={<ListAlt sx={{ color: "#EA580C" }} />} linkTo="/admin-dashboard/listings" isLoading={loading} />
        <MetricCard title="Withdrawal Claims" value={metrics.pendingWithdrawalRequests} variant="warning" icon={<AccountBalanceWallet sx={{ color: "#EA580C" }} />} linkTo="/admin-dashboard/withdrawals" isLoading={loading} />
        <MetricCard title="Live Products" value={metrics.activeListings} variant="success" icon={<ShoppingBag sx={{ color: "#059669" }} />} isLoading={loading} />
      </div>
    </div>
  );
};

export default DashboardOverview;