import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaArrowUp } from "react-icons/fa";

const FaPlusIcon = FaPlus as unknown as React.ComponentType<any>;
const FaArrowUpIcon = FaArrowUp as unknown as React.ComponentType<any>;

type Tx = {
  id: string;
  type: "deposit" | "withdraw" | "manual-deposit";
  amount: number;
  status: "pending" | "completed" | "rejected";
  date: string;
  note?: string;
};

const FAKE_BALANCE = 123.45;
const sampleManualDeposits: Tx[] = [
  { id: "m-1", type: "manual-deposit", amount: 50, status: "pending", date: "2025-11-25", note: "bKash trx 12345" },
  { id: "m-2", type: "manual-deposit", amount: 100, status: "completed", date: "2025-11-18", note: "Bank transfer" },
];
const sampleWithdrawals: Tx[] = [
  { id: "w-1", type: "withdraw", amount: 20, status: "completed", date: "2025-10-01", note: "bKash" },
];
const sampleOnlineDeposits: Tx[] = [
  { id: "o-1", type: "deposit", amount: 30, status: "completed", date: "2025-11-10", note: "Card" },
];

export default function Wallet(): React.ReactElement {
  const EMPIRE_BLUE = "#0A1A3A";
  const ROYAL_GOLD = "#D4A643";
  const CHARCOAL = "#111111";
  const EMERALD = "#1BC47D";

  const [balance] = useState<number>(FAKE_BALANCE);
  const [activeTab, setActiveTab] = useState<"online" | "manual" | "withdraw">("manual");

  const [onlineDeposits] = useState<Tx[]>(sampleOnlineDeposits);
  const [manualDeposits] = useState<Tx[]>(sampleManualDeposits);
  const [withdrawals] = useState<Tx[]>(sampleWithdrawals);

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const tabClass = (tab: "online" | "manual" | "withdraw") =>
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
                {t.type === "withdraw" ? "Withdrawal" : t.type === "manual-deposit" ? "Manual Deposit" : "Online Deposit"}
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
                    t.status === "completed"
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
                ${balance.toFixed(2)}
              </div>
              <div className="text-sm opacity-80">Updated just now</div>
            </div>

            {/* Premium Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/payment"
                className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: ROYAL_GOLD, color: CHARCOAL }}
              >
                <FaPlusIcon size={20} />
                Deposit
              </Link>
              <Link
                to="/withdraw"
                className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white border-2 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ borderColor: ROYAL_GOLD, color: EMPIRE_BLUE }}
              >
                <FaArrowUpIcon size={20} className="rotate-45" />
                Withdraw
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
              <button onClick={() => setActiveTab("manual")} className={tabClass("manual")}>
                Manual Deposit
              </button>
              <button onClick={() => setActiveTab("withdraw")} className={tabClass("withdraw")}>
                Withdraw History
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-100 min-h-[28rem]">
              {activeTab === "online" && renderList(onlineDeposits)}
              {activeTab === "manual" && renderList(manualDeposits)}
              {activeTab === "withdraw" && renderList(withdrawals)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}