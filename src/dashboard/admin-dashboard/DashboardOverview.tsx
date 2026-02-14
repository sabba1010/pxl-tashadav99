import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
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

const BASE_URL = "http://localhost:3200";

interface AdminMetrics {
  totalUsers: number;
  totalBuyers: number;
  totalSellers: number;
  totalUserBalance: number;
  activeListings: number;
  pendingListings: number;
  totalSystemBalance: number;
  lifetimeEarnings: number;
  availableAdminBalance: number;
  adminSalesBalance: number;
  adminWalletBalance: number; // 🔥 Admin wallet = system turnover
  currentSystemTurnover: number;
  pendingDepositRequests: number;
  pendingWithdrawalRequests: number;
  totalBuyerDeposits: number;
  totalAdminWithdrawn: number;
  totalSellerWithdrawn: number;
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

      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-current opacity-[0.03] rounded-full" />
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  /* ─────────────────────────────────────────────────────────────
   * REAL-TIME DATA FETCHING (POLLING STRATEGY)
   * ─────────────────────────────────────────────────────────────
   * - Uses React Query (TanStack Query) for automatic background updates.
   * - Refetches every 5 seconds (5000ms) to ensure admin data is live.
   * - 'metrics' state is derived directly from the 'data' query result.
   */
  const fetchDashboardData = async (): Promise<AdminMetrics> => {
    const [uRes, prRes, puRes, payRes, wRes, finRes] = await Promise.all([
      axios.get(`${BASE_URL}/api/user/getall`).catch(() => ({ data: [] })),
      axios.get(`${BASE_URL}/product/all-sells`).catch(() => ({ data: [] })),
      axios.get(`${BASE_URL}/purchase/getall`).catch(() => ({ data: [] })),
      axios.get(`${BASE_URL}/api/payments`).catch(() => ({ data: [] })),
      axios.get(`${BASE_URL}/withdraw/getall`).catch(() => ({ data: [] })),
      axios.get(`${BASE_URL}/api/admin/financial-metrics`).catch(() => ({ data: { metrics: {} } })),
    ]);

    const users = (Array.isArray(uRes.data) ? uRes.data : []) as any[];
    const products = (Array.isArray(prRes.data) ? prRes.data : []) as any[];
    const purchases = (Array.isArray(puRes.data) ? puRes.data : []) as any[];
    const payments = (Array.isArray(payRes.data) ? payRes.data : []) as any[];
    const withdraws = (Array.isArray(wRes.data) ? wRes.data : []) as any[];
    const finMetrics = (finRes.data?.metrics || {}) as any;

    const usersMap = new Map(users.map((u: any) => [u._id.toString(), u]));

    // Total buyer deposits (successful/credited payments)
    const totalBuyerDeposits = payments.reduce((acc: number, p: any) => {
      const status = p.status?.toLowerCase();
      if (["successful", "completed"].includes(status) || p.credited) {
        return acc + Number(p.amount || 0);
      }
      return acc;
    }, 0);

    // Separate seller vs admin withdrawals
    let totalSellerWithdrawn = 0;
    let totalAdminWithdrawn = 0;

    withdraws.forEach((w: any) => {
      const statusLower = w.status?.toLowerCase() || "";
      if (["approved", "success", "completed"].includes(statusLower)) {
        const amount = Number(w.amount || 0);
        const uid = (w.userId || w.sellerId)?.toString();

        if (!uid) {
          // If no UID → likely admin withdrawal
          totalAdminWithdrawn += amount;
          return;
        }

        const user = usersMap.get(uid);
        if (user) {
          if (user.role === "admin") {
            totalAdminWithdrawn += amount;
          } else {
            totalSellerWithdrawn += amount;
          }
        } else {
          // If UID exists but user not found → assume seller
          totalSellerWithdrawn += amount;
        }
      }
    });

    return {
      totalUsers: users.length,
      totalBuyers: users.filter((u: any) => u.role === "buyer").length,
      totalSellers: users.filter((u: any) => u.role === "seller").length,
      totalUserBalance: finMetrics.totalWalletBalanceHeldByUsers || 0,
      activeListings: products.filter((p: any) => p.status === "active").length,
      pendingListings: products.filter((p: any) => p.status === "pending").length,
      totalSystemBalance: purchases.reduce((s: number, p: any) => s + (Number(p.totalAmount || p.price) || 0), 0),
      lifetimeEarnings: finMetrics.lifetimePlatformProfit || 0,
      availableAdminBalance: finMetrics.currentWalletPlatformProfit || 0,
      adminSalesBalance: finMetrics.adminSalesBalance || 0,
      adminWalletBalance: finMetrics.adminWalletBalance || 0,
      currentSystemTurnover: finMetrics.currentSystemTurnover || 0,
      pendingDepositRequests: payments.filter((p: any) => {
        const status = p.status?.toLowerCase() || "";
        return status !== "successful" && status !== "completed" && !p.credited;
      }).length,
      pendingWithdrawalRequests: withdraws.filter((w: any) => w.status?.toLowerCase() === "pending").length,
      totalBuyerDeposits,
      totalAdminWithdrawn,
      totalSellerWithdrawn,
    };
  };

  const { data: metrics, isLoading: loading, refetch } = useQuery({
    queryKey: ["adminDashboardOverview"],
    queryFn: fetchDashboardData,
    refetchInterval: 5000,
    // This enables the 5-second polling
  });

  // Fallback for metrics if data is undefined (e.g. loading)
  const safeMetrics = metrics || {
    totalUsers: 0,
    totalBuyers: 0,
    totalSellers: 0,
    totalUserBalance: 0,
    activeListings: 0,
    pendingListings: 0,
    totalSystemBalance: 0,
    lifetimeEarnings: 0,
    availableAdminBalance: 0,
    adminSalesBalance: 0,
    adminWalletBalance: 0,
    currentSystemTurnover: 0,
    pendingDepositRequests: 0,
    pendingWithdrawalRequests: 0,
    totalBuyerDeposits: 0,
    totalAdminWithdrawn: 0,
    totalSellerWithdrawn: 0,
  };

  // Use safeMetrics for display
  const displayMetrics = safeMetrics;

  return (
    <div className="p-4 md:p-8 bg-[#F4F7FE] min-h-screen space-y-6 md:space-y-10">
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
          onClick={() => refetch()}
          className="flex items-center gap-3 px-7 py-3.5 bg-[#1B2559] text-white rounded-[1.2rem] shadow-xl shadow-indigo-200 hover:bg-indigo-800 transition-all active:scale-95"
        >
          <Refresh className={loading ? "animate-spin" : ""} fontSize="small" />
          <span className="text-sm font-black uppercase tracking-widest">Refresh Data</span>
        </button>
      </div>

      {/* Main Financial Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <MetricCard
          title="Admin Total Balance"
          value={`$${displayMetrics.adminWalletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          variant="balance"
          subtitle="Total System Turnover"
          icon={<AccountBalanceWallet sx={{ color: "#059669", fontSize: 32 }} />}
          isLoading={loading}
        />
        <MetricCard
          title="System Turnover"
          value={`$${displayMetrics.currentSystemTurnover.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          variant="info"
          subtitle="Total volume of completed sales"
          icon={<TrendingUp sx={{ color: "#2563EB", fontSize: 32 }} />}
          isLoading={loading}
        />
        <MetricCard
          title="Available Platform Profit"
          value={`$${displayMetrics.availableAdminBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          variant="success"
          subtitle="Current wallet platform profit"
          icon={<AccountBalanceWallet sx={{ color: "#10B981", fontSize: 32 }} />}
          isLoading={loading}
        />
        <MetricCard
          title="Admin Sales Balance"
          value={`$${displayMetrics.adminSalesBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          variant="info"
          subtitle="Revenue from admin's own products"
          icon={<MonetizationOn sx={{ color: "#2563EB", fontSize: 32 }} />}
          isLoading={loading}
        />
        <MetricCard
          title="Lifetime Platform Profit"
          value={`$${displayMetrics.lifetimeEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          variant="profit"
          subtitle="Total 20% commission earned"
          icon={<TrendingUp sx={{ color: "#B45309", fontSize: 32 }} />}
          isLoading={loading}
        />
      </div>

      {/* User Statistics */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-[1000] text-slate-800 uppercase tracking-tighter">User Statistics</h2>
        <div className="h-[2px] flex-1 bg-slate-200 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <MetricCard title="Total Registered" value={displayMetrics.totalUsers} variant="user" icon={<PeopleAlt sx={{ color: "#7C3AED", fontSize: 32 }} />} isLoading={loading} />
        <MetricCard title="Active Sellers" value={displayMetrics.totalSellers} variant="user" icon={<Storefront sx={{ color: "#8B5CF6", fontSize: 32 }} />} isLoading={loading} />
        <MetricCard title="Active Buyers" value={displayMetrics.totalBuyers} variant="user" icon={<PersonOutline sx={{ color: "#6366F1", fontSize: 32 }} />} isLoading={loading} />
      </div>

      {/* Pending Actions */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-[1000] text-slate-800 uppercase tracking-tighter">Pending Actions</h2>
        <div className="h-[2px] flex-1 bg-slate-200 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Deposit Requests" value={displayMetrics.pendingDepositRequests} variant="info" icon={<Payments sx={{ color: "#2563EB" }} />} linkTo="/admin-dashboard/deposits" isLoading={loading} />
        <MetricCard title="Pending Listings" value={displayMetrics.pendingListings} variant="warning" icon={<ListAlt sx={{ color: "#EA580C" }} />} linkTo="/admin-dashboard/listings" isLoading={loading} />
        <MetricCard title="Withdrawal Claims" value={displayMetrics.pendingWithdrawalRequests} variant="warning" icon={<AccountBalanceWallet sx={{ color: "#EA580C" }} />} linkTo="/admin-dashboard/withdrawals" isLoading={loading} />
        <MetricCard title="Live Products" value={displayMetrics.activeListings} variant="success" icon={<ShoppingBag sx={{ color: "#059669" }} />} isLoading={loading} />
      </div>

      {/* Transaction Summaries */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-[1000] text-slate-800 uppercase tracking-tighter">Transaction Summaries</h2>
        <div className="h-[2px] flex-1 bg-slate-200 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <MetricCard
          title="Total Buyer Deposits"
          value={`$${displayMetrics.totalBuyerDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          variant="success"
          subtitle="Sum of successful deposits"
          icon={<Payments sx={{ color: "#059669", fontSize: 38 }} />}
          isLoading={loading}
        />
        <MetricCard
          title="Total Seller Withdrawals"
          value={`$${displayMetrics.totalSellerWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          variant="warning"
          subtitle="Total funds withdrawn by sellers"
          icon={<Storefront sx={{ color: "#B45309", fontSize: 38 }} />}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;