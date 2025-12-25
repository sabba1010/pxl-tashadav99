import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaArrowUp } from "react-icons/fa";
import { useAuthHook } from "../../hook/useAuthHook";
import { useDepositByUser } from "../../hook/useDepositByUser";

const FaPlusIcon = FaPlus as unknown as React.ComponentType<any>;
const FaArrowUpIcon = FaArrowUp as unknown as React.ComponentType<any>;

type Tx = {
  id: string;
  type: "deposit" | "withdraw";
  amount: number;
  status: "pending" | "completed" | "rejected" | "successful";
  date: string;
  note?: string;
};

export default function Wallet(): React.ReactElement {
  const EMPIRE_BLUE = "#0A1A3A";
  const ROYAL_GOLD = "#D4A643";
  const EMERALD = "#1BC47D";
  const PENDING_COLOR = "#F59E0B";
  const REJECTED_COLOR = "#DC2626";

  // Hooks
  const { payments, isLoading: depositLoading, isError: depositError } = useDepositByUser();
  const loginUserData = useAuthHook();
  
  const userBalance = loginUserData.data?.balance;

  // UI State
  const [activeTab, setActiveTab] = useState<"online" | "withdraw">("online");

  // Withdraw state
  const [withdrawals, setWithdrawals] = useState<Tx[]>([]);
  const [withdrawLoading, setWithdrawLoading] = useState(true);
  const [withdrawError, setWithdrawError] = useState(false);

  // Fetch withdrawals
  const fetchWithdrawals = async () => {
    try {
      setWithdrawLoading(true);
      const response = await fetch("https://vps-backend-server-beta.vercel.app/withdraw/getall");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      const mapped: Tx[] = data.map((wd: any) => ({
        id: wd._id,
        type: "withdraw",
        // এখানে amount কে number-এ কনভার্ট করা হয়েছে (ফিক্স!)
        amount: Number(wd.amount) || 0,
        status: wd.status === "success" ? "completed" : wd.status || "pending",
        date: new Date(wd.createdAt).toISOString().split("T")[0],
        note: wd.note || `${wd.paymentMethod?.toUpperCase() || ""} • ${wd.bankCode || ""}`,
      }));

      setWithdrawals(mapped);
      setWithdrawError(false);
    } catch (err) {
      console.error("Withdraw fetch error:", err);
      setWithdrawError(true);
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Auto refresh when withdraw tab active
  useEffect(() => {
    if (activeTab === "withdraw") {
      fetchWithdrawals();
      const interval = setInterval(fetchWithdrawals, 10000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Map deposits - amount কে number করা (নিরাপত্তার জন্য)
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
    note: `Tx ID: ${tx.transactionId}`,
  }));

  // Calculate balance
  const successfulWithdrawalsTotal = withdrawals
    .filter((w) => w.status === "completed")
    .reduce((sum, w) => sum + w.amount, 0);

  const successfulDepositsTotal = onlineDeposits
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);


  // Helpers
  const tabClass = (tab: "online" | "withdraw") =>
    `pb-3 px-1 text-base font-medium transition-all duration-300 border-b-4 ${
      activeTab === tab
        ? "border-[#D4A643] text-[#0A1A3A]"
        : "border-transparent text-gray-500 hover:text-[#0A1A3A]"
    }`;

  const getStatusColor = (status: string) => {
    if (status === "completed" || status === "successful") return EMERALD;
    if (status === "pending") return PENDING_COLOR;
    return REJECTED_COLOR;
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
            <div>
              <div className="text-lg font-semibold" style={{ color: EMPIRE_BLUE }}>
                {t.type === "withdraw" ? "Withdrawal" : "Online Deposit"}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {t.date} • {t.note || "-"}
              </div>
            </div>

            <div className="text-right mt-4 sm:mt-0">
              <div className="text-2xl font-bold" style={{ color: EMPIRE_BLUE }}>
                ${t.amount.toFixed(2)} {/* এখন নিরাপদ, কারণ amount number */}
              </div>
              <div
                className="text-sm font-medium mt-1"
                style={{ color: getStatusColor(t.status) }}
              >
                {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === "online") {
      if (depositLoading) return <div className="h-64 flex items-center justify-center text-gray-500">Loading deposits...</div>;
      if (depositError) return <div className="h-64 flex items-center justify-center text-red-500">Failed to load deposits</div>;
      return renderList(onlineDeposits);
    }

    if (activeTab === "withdraw") {
      if (withdrawLoading) return <div className="h-64 flex items-center justify-center text-gray-500">Loading withdrawals...</div>;
      if (withdrawError) return <div className="h-64 flex items-center justify-center text-red-500">Failed to load withdrawals</div>;
      return renderList(withdrawals);
    }

    return null;
  };

  return (
    <div className="min-h-[85vh] p-4 sm:p-6 lg:p-8 bg-[#f3efee]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ color: EMPIRE_BLUE }}>
          Your Wallet
        </h2>

        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {/* Left */}
          <div className="col-span-12 lg:col-span-5">
            <div
              className="rounded-3xl overflow-hidden relative text-white h-52 sm:h-80 lg:h-96 p-8 flex flex-col justify-between
               shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${EMPIRE_BLUE} 0%, #152850 50%, ${ROYAL_GOLD} 100%)`,
              }}
            >
              <div className="text-lg opacity-90">Available Balance</div>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
                ${loginUserData.data?.balance.toFixed(2) || "0.00"}
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

              <Link
                to="/withdraw"
                className="flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-2 text-[#0A1A3A] hover:bg-[#0A1A3A] hover:text-white hover:scale-105"
                style={{ borderColor: ROYAL_GOLD }}
              >
                <FaArrowUpIcon size={22} className="rotate-45" />
                Withdraw Funds
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex gap-8 border-b pb-4 mb-8 overflow-x-auto">
              <button onClick={() => setActiveTab("online")} className={tabClass("online")}>
                Online Deposit
              </button>
              <button
                onClick={() => {
                  setActiveTab("withdraw");
                  fetchWithdrawals();
                }}
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