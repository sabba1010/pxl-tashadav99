// src/components/Wallet.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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
        <div className="h-80 flex flex-col items-center justify-center text-gray-400">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="mb-3 opacity-80">
            <path d="M3 7h18" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="8" width="18" height="10" rx="2" stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M8 12h8" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div>No Data Found</div>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm">
            <div>
              <div className="text-sm font-medium">{t.type === "withdraw" ? "Withdrawal" : t.type === "manual-deposit" ? "Manual Deposit" : "Online Deposit"}</div>
              <div className="text-xs text-gray-500">{t.date} • {t.note}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">${t.amount.toFixed(2)}</div>
              <div className={`text-xs ${t.status === "completed" ? "text-green-600" : t.status === "pending" ? "text-yellow-600" : "text-red-600"}`}>{t.status}</div>
              <div className="mt-2 flex gap-2 justify-end">
                <button onClick={() => { setShowReportModal(true); }} className="text-xs px-2 py-1 rounded bg-orange-50 text-orange-600 border border-orange-100">Report</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-[85vh] p-8 bg-[#faf6f6]">
      <div className="max-w-7xl mx-auto bg-white rounded-md p-6 shadow-sm">
        <h2 className="text-3xl font-bold mb-6">Wallet</h2>
        <div className="grid grid-cols-12 gap-6">
          {/* Left card - made larger (height + width) */}
          <div className="col-span-12 lg:col-span-5">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-b from-[#ffb07a] to-[#ff6a45] relative text-white h-96 p-8 flex flex-col justify-between">
              <div>
                <div className="text-sm opacity-90">Your Balance</div>
              </div>

              <div className="bg-white/20 rounded-xl px-6 py-3 self-start">
                <div className="text-3xl font-semibold">${balance.toFixed(2)}</div>
              </div>

              <svg className="absolute right-0 top-0 opacity-10" width="320" height="320" viewBox="0 0 240 240" fill="none">
                <circle cx="120" cy="120" r="110" stroke="white" strokeWidth="2" />
                <circle cx="40" cy="40" r="80" stroke="white" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="mt-6 flex items-center gap-6">
              <button
                onClick={() => setShowDepositModal(true)}
                className="flex flex-col items-center gap-2"
                title="Deposit"
              >
                <div className="w-14 h-14 rounded-md border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 12h14" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600 mt-1">Deposit</div>
              </button>

             <Link to="/report" className="ml-auto px-4 py-2 rounded-md bg-orange-500 text-white">
             Report transaction
             </Link>
            </div>
          </div>

          {/* Right main area - slightly wider */}
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-4 border-b pb-3 mb-4">
              {/* Active tab styling: orange bg + white text */}
              <button
                onClick={() => setActiveTab("online")}
                className={`px-4 py-2 text-sm rounded-md transition ${activeTab === "online" ? "bg-orange-500 text-white shadow" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Online Deposit
              </button>

              <button
                onClick={() => setActiveTab("manual")}
                className={`px-4 py-2 text-sm rounded-md transition ${activeTab === "manual" ? "bg-orange-500 text-white shadow" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Manual Deposit
              </button>

              <button
                onClick={() => setActiveTab("withdraw")}
                className={`px-4 py-2 text-sm rounded-md transition ${activeTab === "withdraw" ? "bg-orange-500 text-white shadow" : "text-gray-600 hover:bg-gray-50"}`}
              >
                Withdraw History
              </button>
            </div>

            <div className="min-h-[24rem] border border-gray-100 rounded-md p-6 bg-white">
              {activeTab === "online" && (
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <button onClick={() => handleFakeTopUp(10)} className="px-3 py-2 bg-orange-100 text-orange-600 rounded">Fake +$10</button>
                    <div className="text-sm text-gray-500">Simulate an online deposit (fake data)</div>
                  </div>
                  {renderList(onlineDeposits)}
                </div>
              )}

              {activeTab === "manual" && (
                <div>
                  <div className="mb-4 text-sm text-gray-500">Manual deposits submitted by user (mock). Admin approves them in real product.</div>
                  {renderList(manualDeposits)}
                </div>
              )}

              {activeTab === "withdraw" && (
                <div>
                  <div className="mb-4 text-sm text-gray-500">Past withdrawals</div>
                  {renderList(withdrawals)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Larger Floating + button */}
      {showFloating && (
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setNotice({ type: "info", text: "Scrolled to top (mock)" });
          }}
          aria-label="Open new ticket"
          className="fixed right-6 bottom-6 z-50 w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg hover:bg-orange-600 transition"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-md w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-3">Submit Manual Deposit (mock)</h3>

            <label className="text-xs text-gray-700">Amount (USD)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="50"
            />

            <label className="text-xs text-gray-700">Note</label>
            <input value={depositNote} onChange={(e) => setDepositNote(e.target.value)} className="w-full border rounded px-3 py-2 mb-4" placeholder="Payment reference" />

            <div className="flex items-center gap-3">
              <button onClick={submitManualDeposit} className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-60" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
              <button onClick={() => setShowDepositModal(false)} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-md w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Report Transaction (mock)</h3>
            <p className="text-sm text-gray-600 mb-4">You are submitting a mock report. In production this will notify support.</p>
            <div className="flex items-center gap-3">
              <button onClick={() => submitReport()} className="px-4 py-2 bg-orange-500 text-white rounded disabled:opacity-60" disabled={loading}>
                {loading ? "Sending..." : "Send Report"}
              </button>
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast / Notice */}
      {notice && (
        <div className={`fixed left-1/2 -translate-x-1/2 bottom-6 z-60 px-4 py-2 rounded-md text-sm ${notice.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : notice.type === "error" ? "bg-red-50 text-red-700 border border-red-100" : "bg-gray-50 text-gray-700 border border-gray-100"}`}>
          {notice.text}
        </div>
      )}

      {/* small toggle to hide/show floating */}
      <button
        onClick={() => setShowFloating((s) => !s)}
        className="fixed right-6 bottom-24 z-50 w-10 h-10 rounded-full bg-white text-gray-600 border shadow"
        title="Toggle FAB"
      >
        {showFloating ? "—" : "+"}
      </button>
    </div>
  );
}
