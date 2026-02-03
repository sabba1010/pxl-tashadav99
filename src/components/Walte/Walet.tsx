import React, { useEffect, useState } from "react";
import { FaArrowUp, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthHook } from "../../hook/useAuthHook";
import { useDepositByUser } from "../../hook/useDepositByUser";

const FaPlusIcon = FaPlus as unknown as React.ComponentType<any>;
const FaArrowUpIcon = FaArrowUp as unknown as React.ComponentType<any>;

type Tx = {
  id: string;
  type: "deposit" | "withdraw";
  amount: number;
  status: "pending" | "completed" | "rejected" | "successful" | "declined";
  date: string;
  note?: string;
  reason?: string;           // ← for showing why it was declined/rejected
};

export default function Wallet(): React.ReactElement {
  const EMPIRE_BLUE = "#0A1A3A";
  const ROYAL_GOLD = "#D4A643";
  const EMERALD = "#1BC47D";
  const PENDING_COLOR = "#F59E0B";
  const REJECTED_COLOR = "#DC2626";

  // Hooks
  const {
    payments,
    isLoading: depositLoading,
    isError: depositError,
  } = useDepositByUser();
  const loginUserData = useAuthHook();

  // UI State
  const [activeTab, setActiveTab] = useState<"online" | "withdraw">("online");

  // Withdraw state
  const [withdrawals, setWithdrawals] = useState<Tx[]>([]);
  const [withdrawLoading, setWithdrawLoading] = useState(true);
  const [withdrawError, setWithdrawError] = useState(false);

  // Fetch withdrawals
  const fetchWithdrawals = async () => {
    if (!loginUserData?.data?.email) return;

    try {
      setWithdrawLoading(true);
      const response = await fetch("https://tasha-vps-backend-2.onrender.com/withdraw/getall");
      if (!response.ok) throw new Error("Failed to fetch withdrawals");
      const data = await response.json();

      const currentUserEmail = loginUserData.data.email;

      const filteredData = data.filter(
        (wd: any) => wd.email === currentUserEmail
      );

      const mapped: Tx[] = filteredData.map((wd: any) => {
        let displayStatus = wd.status?.toLowerCase() || "pending";
        let displayReason = "";

        // Normalize status
        if (displayStatus === "success") {
          displayStatus = "completed";
        } else if (displayStatus === "declined" || displayStatus === "rejected") {
          displayStatus = "rejected";
          displayReason = wd.adminNote || wd.note || "";
        }

        return {
          id: wd._id,
          type: "withdraw",
          amount: Number(wd.amount) || 0,
          status: displayStatus as Tx["status"],
          date: new Date(wd.createdAt).toISOString().split("T")[0],
          note: `${wd.paymentMethod?.toUpperCase() || "Unknown"} • ${
            wd.bankCode || wd.accountNumber || "N/A"
          }`,
          reason: displayReason.trim() || undefined,
        };
      });

      setWithdrawals(mapped);
      setWithdrawError(false);
    } catch (err) {
      console.error("Withdraw fetch error:", err);
      setWithdrawError(true);
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Auto refresh when withdraw tab is active
  useEffect(() => {
    if (activeTab === "withdraw") {
      fetchWithdrawals();
      const interval = setInterval(fetchWithdrawals, 10000);
      return () => clearInterval(interval);
    }
  }, [activeTab, loginUserData?.data?.email]);

  // Map deposits
  const onlineDeposits: Tx[] = payments.map((tx) => ({
    id: tx._id,
    type: "deposit",
    amount: Number(tx.amount) || 0,
    status:
      tx.status === "successful"
        ? "completed"
        : tx.status === "pending"
        ? "pending"
        : "rejected",
    date: new Date(tx.createdAt).toISOString().split("T")[0],
    note: `Tx ID: ${tx.transactionId || "N/A"}`,
  }));

  // Helpers
  const tabClass = (tab: "online" | "withdraw") =>
    `pb-3 px-1 text-base font-medium transition-all duration-300 border-b-4 ${
      activeTab === tab
        ? "border-[#D4A643] text-[#0A1A3A]"
        : "border-transparent text-gray-500 hover:text-[#0A1A3A]"
    }`;

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "completed" || s === "successful") return EMERALD;
    if (s === "pending") return PENDING_COLOR;
    if (s === "rejected" || s === "declined") return REJECTED_COLOR;
    return "#6B7280"; // gray fallback
  };

  const getStatusDisplay = (status: string) => {
    const s = status.toLowerCase();
    if (s === "successful" || s === "completed") return "Completed";
    if (s === "declined") return "Declined";
    if (s === "rejected") return "Rejected";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderList = (items: Tx[]) => {
    if (!items.length) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400">
          <div className="text-lg">No transactions yet</div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((t) => (
          <div
            key={t.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex-1">
              <div
                className="text-lg font-semibold"
                style={{ color: EMPIRE_BLUE }}
              >
                {t.type === "withdraw" ? "Withdrawal" : "Online Deposit"}
              </div>

              <div className="text-sm text-gray-500 mt-1">
                {t.date} • {t.note || "-"}
              </div>

              {/* Show decline/reject reason */}
              {(t.status === "rejected" || t.status === "declined") &&
                t.reason && (
                  <div className="mt-2 text-sm text-red-600 font-medium">
                    Reason: {t.reason}
                  </div>
                )}
            </div>

            <div className="text-right mt-4 sm:mt-0">
              <div
                className="text-2xl font-bold"
                style={{ color: EMPIRE_BLUE }}
              >
                ${t.amount.toFixed(2)}
              </div>
              <div
                className="text-sm font-medium mt-1"
                style={{ color: getStatusColor(t.status) }}
              >
                {getStatusDisplay(t.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === "online") {
      if (depositLoading)
        return (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Loading deposits...
          </div>
        );
      if (depositError)
        return (
          <div className="h-64 flex items-center justify-center text-red-500">
            Failed to load deposits
          </div>
        );
      return renderList(onlineDeposits);
    }

    if (activeTab === "withdraw") {
      if (withdrawLoading)
        return (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Loading withdrawals...
          </div>
        );
      if (withdrawError)
        return (
          <div className="h-64 flex items-center justify-center text-red-500">
            Failed to load withdrawals
          </div>
        );
      return renderList(withdrawals);
    }

    return null;
  };

  return (
    <div className="min-h-[85vh] p-4 sm:p-6 lg:p-8 bg-[#f3efee]">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold mb-8"
          style={{ color: EMPIRE_BLUE }}
        >
          Your Wallet
        </h2>

        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {/* Left - Balance & Actions */}
          <div className="col-span-12 lg:col-span-5">
            <div
              className="rounded-3xl overflow-hidden relative text-white h-52 sm:h-80 lg:h-96 p-8 flex flex-col justify-between shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${EMPIRE_BLUE} 0%, #152850 50%, ${ROYAL_GOLD} 100%)`,
              }}
            >
              <div className="text-lg opacity-90">Available Balance</div>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
                ${loginUserData.data?.balance?.toFixed(2) || "0.00"}
              </div>
              <div className="text-sm opacity-80">Updated just now</div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-6">
              <Link
                to="/payment"
                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#D4A643] to-[#E8C87A] text-[#111111] hover:scale-105"
              >
                <FaPlusIcon size={22} />
                Deposit Funds
              </Link>

              {loginUserData.data?.role !== "buyer" && (
                <Link
                  to="/withdraw"
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-2 text-[#0A1A3A] hover:bg-[#0A1A3A] hover:text-white hover:scale-105"
                  style={{ borderColor: ROYAL_GOLD }}
                >
                  <FaArrowUpIcon size={22} className="rotate-45" />
                  Withdraw Funds
                </Link>
              )}
            </div>
          </div>

          {/* Right - Transaction History */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex gap-8 border-b pb-4 mb-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("online")}
                className={tabClass("online")}
              >
                Online Deposit
              </button>
              <button
                onClick={() => setActiveTab("withdraw")}
                className={tabClass("withdraw")}
              >
                Withdraw History
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100 min-h-[28rem]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}