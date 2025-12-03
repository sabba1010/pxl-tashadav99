import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Interface for the primary financial and operational metrics
 */
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

/**
 * Interface for the dynamic rate card
 */
interface ExchangeRates {
  buyerDepositRate: number; // e.g., 1600 (NGN per $1)
  sellerWithdrawalRate: number; // e.g., 1450 (NGN per $1)
  exchangeProfitMargin: number; // Calculated profit margin (Buyer Rate - Seller Rate)
}

// --- MOCK API CALLS ---
// In a real application, replace these with asynchronous API calls (e.g., Axios/Fetch)

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

const fetchRates = (): ExchangeRates => {
  const buyer = 1600;
  const seller = 1450;
  return {
    buyerDepositRate: buyer,
    sellerWithdrawalRate: seller,
    exchangeProfitMargin: buyer - seller,
  };
};

// --- HELPER COMPONENT: CARD ---

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  linkTo?: string;
  isProfit?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  linkTo,
  isProfit,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between">
    <div>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
        {title}
      </h3>
      <div
        className={`text-4xl font-extrabold ${
          isProfit ? "text-[#D1A148]" : "text-gray-900"
        }`}
      >
        {value}
      </div>
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
    </div>
    {linkTo && (
      <Link
        to={linkTo}
        className="mt-4 text-[#D1A148] hover:text-[#e2bb73] text-sm font-semibold transition duration-150 flex items-center"
      >
        View Details &rarr;
      </Link>
    )}
  </div>
);

const DashboardOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [rates, setRates] = useState<ExchangeRates | null>(null);

  useEffect(() => {
    // Simulate data fetching on component mount
    setMetrics(fetchMetrics());
    setRates(fetchRates());
  }, []);

  if (!metrics || !rates) {
    return (
      <div className="text-center p-8 text-gray-500">
        Loading Admin Metrics...
      </div>
    );
  }

  // Helper for currency formatting
  const formatCurrency = (amount: number, currency: string = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);

  return (
    <div className="space-y-8">
      {/* 💰 Financial & Profit Overview (Based on Wallet & Escrow) */}
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
        Financial Snapshot
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Escrow Balance"
          value={formatCurrency(metrics.escrowBalanceUSD)}
          description="Funds awaiting buyer confirmation."
        />

        <MetricCard
          title="Platform Profit (Lifetime)"
          value={formatCurrency(metrics.platformProfitUSD)}
          isProfit={true}
          description="Total earnings from rate difference and 20% split."
        />

        <MetricCard
          title="Total Transactions"
          value={metrics.totalTransactions}
          linkTo="transactions"
          description="Completed purchases and transfers."
        />

        <MetricCard
          title="Admin Split Ratio"
          value="20%"
          description="Automatic percentage of every successful purchase."
        />
      </div>
      {/* ⚖️ Dynamic Exchange Rates & Profit Margin (CRITICAL) */}
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2 pt-4">
        Rate Management (NGN ⇄ USD)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Buyer Deposit Rate (NGN)"
          value={`₦${rates.buyerDepositRate}`}
          description={`Used for deposits (1 USD = ${rates.buyerDepositRate} NGN).`}
        />

        <MetricCard
          title="Seller Withdrawal Rate (NGN)"
          value={`₦${rates.sellerWithdrawalRate}`}
          description={`Used for withdrawals (1 USD = ${rates.sellerWithdrawalRate} NGN).`}
        />

        <MetricCard
          title="Profit Margin per $1"
          value={`₦${rates.exchangeProfitMargin}`}
          isProfit={rates.exchangeProfitMargin > 0}
          description="Admin profit generated from the rate difference."
        />
      </div>
      {/* 🚧 Operational Workload & Approvals */}
      <h2 className="text-xl font-bold text-gray-800 border-b pb-2 pt-4">
        Operational Workload
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Pending Listings"
          value={metrics.pendingListings}
          linkTo="listings" // Assuming you create a Pending Listings view
          description="Listings awaiting admin approval before going live."
        />

        <MetricCard
          title="Deposit Requests"
          value={metrics.pendingDepositRequests}
          linkTo="deposits"
          description="Pending NGN deposits requiring review/confirmation."
        />

        <MetricCard
          title="Withdrawal Requests"
          value={metrics.pendingWithdrawalRequests}
          linkTo="withdrawals"
          description="Pending seller withdrawals requiring admin release."
        />

        <MetricCard
          title="Total Users"
          value={metrics.totalUsers}
          linkTo="users"
          description="Total count of Buyers and Sellers."
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
