import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ShoppingBag } from "@mui/icons-material";
import { DollarSignIcon, Users2 } from "lucide-react";

interface AdminMetrics {
  totalUsers: number;
  activeListings: number;
  pendingListings: number;
  escrowBalanceUSD: number;
  platformProfitUSD: number;
  pendingDepositRequests: number;
  pendingWithdrawalRequests: number;
  totalTransactions: number;
}

interface ExchangeRates {
  buyerDepositRate: number;
  sellerWithdrawalRate: number;
  exchangeProfitMargin: number;
}

// Mock Data
const fetchMetrics = (): AdminMetrics => ({
  totalUsers: 2500,
  activeListings: 850,
  pendingListings: 15,
  escrowBalanceUSD: 45200.5,
  platformProfitUSD: 18450.75,
  pendingDepositRequests: 12,
  pendingWithdrawalRequests: 8,
  totalTransactions: 3120,
});

const fetchRates = (): ExchangeRates => ({
  buyerDepositRate: 1600,
  sellerWithdrawalRate: 1450,
  exchangeProfitMargin: 150,
});

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  linkTo?: string;
  variant?: "default" | "profit" | "warning" | "success";
}> = ({ title, value, subtitle, icon, linkTo, variant = "default" }) => {
  const variants = {
    default: "from-gray-800/5 to-white/10 border-white/20",
    profit: "from-[#D1A148]/20 via-amber-500/10 to-transparent border-[#D1A148]/30",
    success: "from-[#33ac6f]/20 via-emerald-500/10 to-transparent border-[#33ac6f]/30",
    warning: "from-orange-500/20 to-transparent border-orange-400/40",
  };

  const textColor = {
    default: "text-gray-700",
    profit: "text-[#D1A148]",
    success: "text-[#33ac6f]",
    warning: "text-orange-600",
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border ${variants[variant]} p-7 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#33ac6f]/10`}
    >
      {/* Gradient Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className={`absolute inset-0 bg-gradient-to-br ${variant === "profit" ? "from-[#D1A148]/10" : "from-[#33ac6f]/10"}`} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          {icon && (
            <div className={`p-3 rounded-2xl ${variant === "profit" ? "bg-[#D1A148]/15" : "bg-[#33ac6f]/15"}`}>
              {icon}
            </div>
          )}
        </div>
        <p className={`text-3xl font-black ${textColor[variant]} mb-2`}>
          {value}
        </p>

        {subtitle && (
          <p className="text-sm text-gray-500 leading-relaxed">
            {subtitle}
          </p>
        )}

        {linkTo && (
          <Link
            to={linkTo}
            className="mt-6 inline-flex items-center text-sm font-bold text-[#33ac6f] hover:text-[#2d8f5a] transition-colors"
          >
            View Details
            <span className="ml-1 transition-transform group-hover:translate-x-2">→</span>
          </Link>
        )}
      </div>

      {/* Active Glow Ring */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${variant === "profit" ? "from-[#D1A148]/40" : "from-[#33ac6f]/40"} to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition duration-1000 -z-10`} />
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  const [metrics] = useState<AdminMetrics>(fetchMetrics());
  const [rates] = useState<ExchangeRates>(fetchRates());

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="space-y-12 py-4 px-6">
      {/* Header */}
      <div>
        <p className="text-gray-600 mt-3 text-lg">
          Real-time insights into platform health, revenue, and operations
        </p>
      </div>

      {/* Financial Snapshot */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <DollarSignIcon className="text-[#33ac6f]" />
          Financial Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Escrow Balance"
            value={formatCurrency(metrics.escrowBalanceUSD)}
            subtitle="Funds held in escrow for active deals"
            icon={<ShoppingBag fontSize="small" className="text-[#33ac6f] text-2xl" />}
            variant="success"
          />

          <MetricCard
            title="Platform Profit (Lifetime)"
            value={formatCurrency(metrics.platformProfitUSD)}
            subtitle="Total earnings from spreads & fees"
            icon={<TrendingUp fontSize="small" className="text-[#D1A148]" />}
            variant="profit"
          />

          <MetricCard
            title="Total Transactions"
            value={metrics.totalTransactions.toLocaleString()}
            subtitle="Completed deals since launch"
            linkTo="transactions"
            variant="default"
          />

          <MetricCard
            title="Admin Revenue Share"
            value="20%"
            subtitle="Automatic cut from every sale"
            variant="profit"
          />
        </div>
      </section>

      {/* Exchange Rates & Profit Engine */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-2xl">Exchange Rate Engine</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Buyer Deposit Rate"
            value={`₦${rates.buyerDepositRate}`}
            subtitle="1 USD → NGN (when users fund wallet)"
            variant="default"
          />

          <MetricCard
            title="Seller Withdrawal Rate"
            value={`₦${rates.sellerWithdrawalRate}`}
            subtitle="1 USD → NGN (when sellers cash out)"
            variant="default"
          />

          <MetricCard
            title="Profit Per $1 Traded"
            value={`₦${rates.exchangeProfitMargin}`}
            subtitle="Your spread profit on every dollar exchanged"
            icon={<TrendingUp fontSize="small" className="text-[#D1A148]" />}
            variant="profit"
          />
        </div>
      </section>

      {/* Operational Queue */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Users2 className="text-[#33ac6f]" />
          Operations & Approvals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Pending Listings"
            value={metrics.pendingListings}
            subtitle="Awaiting your approval"
            linkTo="listings"
            variant="warning"
          />

          <MetricCard
            title="Deposit Requests"
            value={metrics.pendingDepositRequests}
            subtitle="NGN funding pending confirmation"
            linkTo="deposits"
            variant="warning"
          />

          <MetricCard
            title="Withdrawal Requests"
            value={metrics.pendingWithdrawalRequests}
            subtitle="Sellers waiting for payout"
            linkTo="withdrawals"
            variant="warning"
          />

          <MetricCard
            title="Total Registered Users"
            value={metrics.totalUsers.toLocaleString()}
            subtitle="Buyers + Sellers"
            linkTo="users"
            icon={<Users2 fontSize="small" className="text-[#33ac6f]" />}
            variant="success"
          />
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;