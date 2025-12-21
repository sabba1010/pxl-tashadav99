import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaArrowUp } from "react-icons/fa";
import { useAuthHook } from "../../hook/useAuthHook";
import { useAuth } from "../../context/AuthContext";

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

// API থেকে আসা রেসপন্সের জন্য টাইপ
type ApiTransaction = {
  _id: string;
  transactionId: number;
  amount: number;
  currency: string;
  status: "successful" | "pending" | "failed";
  customerEmail: string;
  createdAt: string;
};

const sampleWithdrawals: Tx[] = [
  { id: "w-1", type: "withdraw", amount: 20, status: "completed", date: "2025-10-01", note: "bKash" },
];

export default function Wallet(): React.ReactElement {
  const EMPIRE_BLUE = "#0A1A3A";
  const ROYAL_GOLD = "#D4A643";
  const CHARCOAL = "#111111";
  const EMERALD = "#1BC47D";

  // Manual ট্যাব সরিয়ে ফেলা হয়েছে
  const [activeTab, setActiveTab] = useState<"online" | "withdraw">("online");

  const [withdrawals] = useState<Tx[]>(sampleWithdrawals);

  // Online deposits from API
  const [onlineDeposits, setOnlineDeposits] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loginUserData = useAuthHook();
  const { user } = useAuth();

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // Fetch online deposits
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchOnlineDeposits = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:3200/api/payments");

        if (!response.ok) throw new Error("Failed to fetch transactions");

        const data: ApiTransaction[] = await response.json();

        const filtered = data
          .filter((tx) => tx.customerEmail.toLowerCase() === user.email.toLowerCase())
          .map((tx): Tx => ({
            id: tx._id,
            type: "deposit",
            amount: tx.amount,
            status: tx.status === "successful" ? "completed" : tx.status === "pending" ? "pending" : "rejected",
            date: new Date(tx.createdAt).toISOString().split("T")[0],
            note: `Tx ID: ${tx.transactionId}`,
          }));

        if (mounted.current) {
          setOnlineDeposits(filtered);
        }
      } catch (err) {
        if (mounted.current) {
          setError("Failed to load online deposits");
          console.error(err);
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    fetchOnlineDeposits();
  }, [user?.email]);

  const tabClass = (tab: "online" | "withdraw") =>
    `pb-3 px-1 text-base font-medium transition-all duration-300 border-b-4 ${
      activeTab === tab
        ? "border-[#D4A643] text-[#0A1A3A]"
        : "border-transparent text-gray-500 hover:text-[#0A1A3A]"
    }`;

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
                ${t.amount.toFixed(2)}
              </div>
              <div
                className="text-sm font-medium mt-1"
                style={{
                  color:
                    t.status === "completed" || t.status === "successful"
                      ? EMERALD
                      : t.status === "pending"
                      ? ROYAL_GOLD
                      : "#DC2626",
                }}
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
      if (loading) {
        return (
          <div className="h-64 flex items-center justify-center">
            <div className="text-lg text-gray-500">Loading transactions...</div>
          </div>
        );
      }
      if (error) {
        return (
          <div className="h-64 flex items-center justify-center text-red-500">
            <div className="text-lg">{error}</div>
          </div>
        );
      }
      return renderList(onlineDeposits);
    }

    if (activeTab === "withdraw") {
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
          {/* Left – Luxurious Balance Card */}
          <div className="col-span-12 lg:col-span-5">
            <div
              className="rounded-3xl overflow-hidden relative text-white h-72 sm:h-80 lg:h-96 p-8 flex flex-col justify-between shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${EMPIRE_BLUE} 0%, #152850 50%, ${ROYAL_GOLD} 100%)`,
              }}
            >
              <div className="text-lg opacity-90">Available Balance</div>
              <div className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
                ${loginUserData.data?.balance ?? "0.00"}
              </div>
              <div className="text-sm opacity-80">Updated just now</div>
            </div>

            {/* Premium Action Buttons */}
   <div className="mt-10 flex flex-col sm:flex-row gap-6">
  {/* Deposit Button */}
  <Link
    to="/payment"
    className="flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#D4A643] to-[#E8C87A] text-[#111111] hover:from-[#E8C87A] hover:to-[#D4A643] hover:scale-105"
  >
    <FaPlusIcon size={22} />
    Deposit Funds
  </Link>

  {/* Withdraw Button */}
  <Link
    to="/withdraw"
    className="flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-2 text-[#0A1A3A] hover:bg-[#0A1A3A] hover:text-white hover:border-[#0A1A3A] hover:scale-105"
    style={{ borderColor: ROYAL_GOLD }}
  >
    <FaArrowUpIcon size={22} className="rotate-45" />
    Withdraw Funds
  </Link>
</div>

            <Link
              to="/report"
              className="mt-4 block w-full text-center px-6 py-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: "#ffffff", color: EMPIRE_BLUE, border: `1px solid ${ROYAL_GOLD}` }}
            >
              Report Transaction
            </Link>
          </div>

          {/* Right – Transaction History */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex gap-8 border-b pb-4 mb-8 overflow-x-auto">
              <button onClick={() => setActiveTab("online")} className={tabClass("online")}>
                Online Deposit
              </button>
              <button onClick={() => setActiveTab("withdraw")} className={tabClass("withdraw")}>
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