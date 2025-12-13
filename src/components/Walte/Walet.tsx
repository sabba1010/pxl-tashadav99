import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaArrowUp } from "react-icons/fa";

/* Workaround: cast icons to React components to avoid TS2786 */
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
  const CLEAN_WHITE = "#FFFFFF";

  const [balance, setBalance] = useState<number>(FAKE_BALANCE);
  const [activeTab, setActiveTab] = useState<"online" | "manual" | "withdraw">("manual");
  const [onlineDeposits, setOnlineDeposits] = useState<Tx[]>(sampleOnlineDeposits);
  const [manualDeposits, setManualDeposits] = useState<Tx[]>(sampleManualDeposits);
  const [withdrawals, setWithdrawals] = useState<Tx[]>(sampleWithdrawals);
  const [notice, setNotice] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const handleFakeTopUp = (amount = 10) => {
    setBalance((b) => Number((b + amount).toFixed(2)));
    const tx: Tx = {
      id: `o-${Date.now()}`,
      type: "deposit",
      amount,
      status: "completed",
      date: new Date().toISOString().slice(0, 10),
      note: "Fake top-up",
    };
    setOnlineDeposits((p) => [tx, ...p]);
    setNotice({ type: "success", text: `+$${amount.toFixed(2)} added (fake).` });
  };

  const renderList = (items: Tx[]) => {
    if (!items || items.length === 0) {
      return (
        <div className="h-48 sm:h-60 lg:h-80 flex flex-col items-center justify-center" style={{ color: "#9CA3AF" }}>
          <div className="text-sm">No Data Found</div>
        </div>
      );
    }
    return (
      <div className="space-y-2 sm:space-y-3">
        {items.map((t) => (
          <div
            key={t.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 border rounded-md bg-white shadow-sm gap-2 sm:gap-0"
          >
            <div>
              <div className="text-xs sm:text-sm font-medium" style={{ color: EMPIRE_BLUE }}>
                {t.type === "withdraw"
                  ? "Withdrawal"
                  : t.type === "manual-deposit"
                  ? "Manual Deposit"
                  : "Online Deposit"}
              </div>
              <div className="text-xs text-gray-500">
                {t.date} • {t.note}
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold" style={{ color: EMPIRE_BLUE }}>
                ${t.amount.toFixed(2)}
              </div>
              <div
                className="text-xs"
                style={{
                  color:
                    t.status === "completed"
                      ? EMERALD
                      : t.status === "pending"
                      ? ROYAL_GOLD
                      : "#DC2626",
                }}
              >
                {t.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-[85vh] p-4 sm:p-6 lg:p-8" style={{ backgroundColor: "#f3efee" }}>
      <div className="max-w-7xl mx-auto bg-white rounded-md p-4 sm:p-6 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6" style={{ color: EMPIRE_BLUE }}>
          Wallet
        </h2>

        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* LEFT */}
          <div className="col-span-12 lg:col-span-5">
            <div
              className="rounded-2xl overflow-hidden relative text-white h-48 sm:h-60 lg:h-96 p-4 sm:p-6 lg:p-8 flex flex-col justify-between"
              style={{ background: `linear-gradient(180deg, ${EMPIRE_BLUE} 0%, ${ROYAL_GOLD} 100%)` }}
            >
              <div className="text-xs sm:text-sm opacity-90">Your Balance</div>

              <div className="bg-white/20 rounded-xl px-4 sm:px-6 py-2 sm:py-3 self-start">
                <div className="text-2xl sm:text-3xl font-semibold" style={{ color: CLEAN_WHITE }}>
                  ${balance.toFixed(2)}
                </div>
              </div>
            </div>

            {/* ACTIONS – SAME STYLE */}
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              {/* Deposit */}
              <Link to="/payment" className="flex flex-col items-center gap-2 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-md border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                  <FaPlusIcon size={16} />
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Deposit</div>
              </Link>

              {/* Withdraw – SAME */}
              <Link to="/withdraw" className="flex flex-col items-center gap-2 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-md border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                  <FaArrowUpIcon size={16} />
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Withdraw</div>
              </Link>

              <Link
                to="/report"
                className="ml-0 sm:ml-auto px-3 sm:px-4 py-2 rounded-md font-medium text-xs sm:text-sm w-full sm:w-auto text-center"
                style={{ backgroundColor: ROYAL_GOLD, color: CHARCOAL }}
              >
                Report transaction
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex gap-2 sm:gap-4 border-b pb-2 sm:pb-3 mb-4 overflow-x-auto">
              <button onClick={() => setActiveTab("online")}>Online Deposit</button>
              <button onClick={() => setActiveTab("manual")}>Manual Deposit</button>
              <button onClick={() => setActiveTab("withdraw")}>Withdraw History</button>
            </div>

            <div className="min-h-[20rem] sm:min-h-[24rem] border rounded-md p-4 sm:p-6 bg-white">
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
