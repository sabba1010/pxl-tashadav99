// src/components/Wallet.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";


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
  // Brand colors
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
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number | "">("");
  const [depositNote, setDepositNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const mounted = useRef(true);
  const [showFloating, setShowFloating] = useState(true);

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

  const submitManualDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) {
      setNotice({ type: "error", text: "Enter a valid amount." });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    if (!mounted.current) return;
    const newTx: Tx = {
      id: `m-${Date.now()}`,
      type: "manual-deposit",
      amount: Number(depositAmount),
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
      note: depositNote || "Manual deposit",
    };
    setManualDeposits((p) => [newTx, ...p]);
    setNotice({ type: "success", text: "Manual deposit submitted (mock)." });
    setDepositAmount("");
    setDepositNote("");
    setShowDepositModal(false);
    setLoading(false);
  };

  const submitReport = async (txId?: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    if (!mounted.current) return;
    setNotice({ type: "success", text: txId ? `Reported ${txId} — our team will check.` : "Reported successfully." });
    setShowReportModal(false);
    setLoading(false);
  };

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
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-80">
            <path d="M3 7h18" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="8" width="18" height="10" rx="2" stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M8 12h8" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="text-sm">No Data Found</div>
        </div>
      );
    }
    return (
      <div className="space-y-2 sm:space-y-3">
        {items.map((t) => (
          <div key={t.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 border rounded-md bg-white shadow-sm gap-2 sm:gap-0">
            <div className="w-full sm:w-auto">
              <div className="text-xs sm:text-sm font-medium" style={{ color: EMPIRE_BLUE }}>
                {t.type === "withdraw" ? "Withdrawal" : t.type === "manual-deposit" ? "Manual Deposit" : "Online Deposit"}
              </div>
              <div className="text-xs" style={{ color: "#6B7280" }}>{t.date} • {t.note}</div>
            </div>
            <div className="w-full sm:w-auto text-right">
              <div className="text-lg sm:text-lg font-semibold" style={{ color: EMPIRE_BLUE }}>${t.amount.toFixed(2)}</div>
              <div
                className="text-xs"
                style={{
                  color: t.status === "completed" ? EMERALD : t.status === "pending" ? ROYAL_GOLD : "#DC2626",
                }}
              >
                {t.status}
              </div>
              <div className="mt-2 flex gap-2 justify-end">
                <button
                  onClick={() => { setShowReportModal(true); }}
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: `${ROYAL_GOLD}20`, // translucent gold
                    color: ROYAL_GOLD,
                    border: `1px solid ${ROYAL_GOLD}30`,
                  }}
                >
                  Report
                </button>
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
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6" style={{ color: EMPIRE_BLUE }}>Wallet</h2>
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          {/* Left card - made larger (height + width) */}
          <div className="col-span-12 lg:col-span-5">
            <div
              className="rounded-2xl overflow-hidden relative text-white h-48 sm:h-60 lg:h-96 p-4 sm:p-6 lg:p-8 flex flex-col justify-between"
              style={{
                background: `linear-gradient(180deg, ${EMPIRE_BLUE} 0%, ${ROYAL_GOLD} 100%)`,
              }}
            >
              <div>
                <div className="text-xs sm:text-sm opacity-90">Your Balance</div>
              </div>

              <div className="bg-white/20 rounded-xl px-4 sm:px-6 py-2 sm:py-3 self-start">
                <div className="text-2xl sm:text-3xl font-semibold" style={{ color: CLEAN_WHITE }}>${balance.toFixed(2)}</div>
              </div>

              <svg className="absolute right-0 top-0 opacity-10" width="320" height="320" viewBox="0 0 240 240" fill="none">
                <circle cx="120" cy="120" r="110" stroke="white" strokeWidth="2" />
                <circle cx="40" cy="40" r="80" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex flex-col items-center gap-2 w-full sm:w-auto"
                title="Deposit"
              >
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-md border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14" stroke={ROYAL_GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 12h14" stroke={ROYAL_GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-xs sm:text-sm" style={{ color: "#6B7280" }}>Deposit</div>
              </button>

              <Link
                to="/report"
                className="ml-0 sm:ml-auto px-3 sm:px-4 py-2 rounded-md font-medium text-xs sm:text-sm w-full sm:w-auto text-center"
                style={{ backgroundColor: ROYAL_GOLD, color: CHARCOAL }}
              >
                Report transaction
              </Link>
            </div>
          </div>

          {/* Right main area - slightly wider */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-2 sm:gap-4 border-b pb-2 sm:pb-3 mb-4 overflow-x-auto">
              {/* Active tab styling */}
              <button
                onClick={() => setActiveTab("online")}
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md transition whitespace-nowrap"
                style={
                  activeTab === "online"
                    ? { backgroundColor: ROYAL_GOLD, color: CHARCOAL, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }
                    : { color: "#6B7280" }
                }
              >
                Online Deposit
              </button>

              <button
                onClick={() => setActiveTab("manual")}
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md transition whitespace-nowrap"
                style={
                  activeTab === "manual"
                    ? { backgroundColor: ROYAL_GOLD, color: CHARCOAL, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }
                    : { color: "#6B7280" }
                }
              >
                Manual Deposit
              </button>

              <button
                onClick={() => setActiveTab("withdraw")}
                className="px-2 sm:px-4 py-2 text-xs sm:text-sm rounded-md transition whitespace-nowrap"
                style={
                  activeTab === "withdraw"
                    ? { backgroundColor: ROYAL_GOLD, color: CHARCOAL, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }
                    : { color: "#6B7280" }
                }
              >
                Withdraw History
              </button>
            </div>

            <div className="min-h-[20rem] sm:min-h-[24rem] border border-gray-100 rounded-md p-4 sm:p-6 bg-white">
              {activeTab === "online" && (
                <div>
                  <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => handleFakeTopUp(10)}
                      className="px-2 sm:px-3 py-2 rounded text-xs sm:text-sm"
                      style={{ backgroundColor: `${ROYAL_GOLD}20`, color: ROYAL_GOLD }}
                    >
                      Fake +$10
                    </button>
                    <div className="text-xs sm:text-sm" style={{ color: "#6B7280" }}>Simulate an online deposit (fake data)</div>
                  </div>
                  {renderList(onlineDeposits)}
                </div>
              )}

              {activeTab === "manual" && (
                <div>
                  <div className="mb-4 text-xs sm:text-sm" style={{ color: "#6B7280" }}>Manual deposits submitted by user (mock). Admin approves them in real product.</div>
                  {renderList(manualDeposits)}
                </div>
              )}

              {activeTab === "withdraw" && (
                <div>
                  <div className="mb-4 text-xs sm:text-sm" style={{ color: "#6B7280" }}>Past withdrawals</div>
                  {renderList(withdrawals)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Larger Floating + button */}
      {/* {showFloating && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setNotice({ type: "info", text: "Scrolled to top (mock)" });
          }}
          aria-label="Open new ticket"
          className="fixed right-6 bottom-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition"
          style={{ backgroundColor: ROYAL_GOLD, color: CHARCOAL }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = EMERALD)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = ROYAL_GOLD)}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: CHARCOAL }}>
            <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )} */}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-md w-full max-w-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3" style={{ color: EMPIRE_BLUE }}>Submit Manual Deposit (mock)</h3>

            <label className="text-xs" style={{ color: "#374151" }}>Amount (USD)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full border rounded px-3 py-2 mb-3 text-sm"
              placeholder="50"
            />

            <label className="text-xs" style={{ color: "#374151" }}>Note</label>
            <input value={depositNote} onChange={(e) => setDepositNote(e.target.value)} className="w-full border rounded px-3 py-2 mb-4 text-sm" placeholder="Payment reference" />

            <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row">
              <button
                onClick={submitManualDeposit}
                className="px-4 py-2 rounded disabled:opacity-60 text-sm w-full sm:w-auto"
                disabled={loading}
                style={{ backgroundColor: ROYAL_GOLD, color: CHARCOAL }}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button onClick={() => setShowDepositModal(false)} className="px-4 py-2 border rounded text-sm w-full sm:w-auto" style={{ color: CHARCOAL }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-md w-full max-w-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3" style={{ color: EMPIRE_BLUE }}>Report Transaction (mock)</h3>
            <p className="text-xs sm:text-sm" style={{ color: "#6B7280", marginBottom: 12 }}>You are submitting a mock report. In production this will notify support.</p>
            <div className="flex items-center gap-2 sm:gap-3 flex-col sm:flex-row">
              <button onClick={() => submitReport()} className="px-4 py-2 rounded disabled:opacity-60 text-sm w-full sm:w-auto" disabled={loading} style={{ backgroundColor: ROYAL_GOLD, color: CHARCOAL }}>
                {loading ? "Sending..." : "Send Report"}
              </button>
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 border rounded text-sm w-full sm:w-auto" style={{ color: CHARCOAL }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast / Notice */}
      {notice && (
        <div
          className="fixed left-1/2 -translate-x-1/2 bottom-6 z-60 px-4 py-2 rounded-md text-sm"
          style={
            notice.type === "success"
              ? { backgroundColor: "#ECFDF5", color: EMERALD, border: "1px solid #D1FAE5" }
              : notice.type === "error"
                ? { backgroundColor: "#FEF2F2", color: "#B91C1C", border: "1px solid #FEE2E2" }
                : { backgroundColor: "#F3F4F6", color: CHARCOAL, border: "1px solid #E5E7EB" }
          }
        >
          {notice.text}
        </div>
      )}

      {/* small toggle to hide/show floating */}
      {/* <button
        onClick={() => setShowFloating((s) => !s)}
        className="fixed right-6 bottom-24 z-50 w-10 h-10 rounded-full border shadow"
        title="Toggle FAB"
        style={{ backgroundColor: CLEAN_WHITE, color: CHARCOAL }}
      >
        {showFloating ? "—" : "+"}
      </button> */}

      {/* Floating + button (visible on mobile & desktop) */}
      <Link
        to="/add-product"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#33ac6f] text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center text-xl sm:text-2xl font-light hover:opacity-95 transition z-40"
        aria-label="Add product"
      >
        {React.createElement(FaPlus as any, { size: 16 })}
      </Link>


    </div>
  );
}
