import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3200";

type Msg = { text: string; type?: "success" | "error" | "info" } | null;

const AdminSettings: React.FC = () => {
  const [fee, setFee] = useState<number | "">("");
  const [buyerDepositRate, setBuyerDepositRate] = useState<number | "">("");
  const [depositRate, setDepositRate] = useState<number | "">("");
  const [withdrawRate, setWithdrawRate] = useState<number | "">("");
  const [feeLoading, setFeeLoading] = useState(false);
  const [buyerLoading, setBuyerLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [feeMessage, setFeeMessage] = useState<Msg>(null);
  const [buyerMessage, setBuyerMessage] = useState<Msg>(null);
  const [depositMessage, setDepositMessage] = useState<Msg>(null);
  const [withdrawMessage, setWithdrawMessage] = useState<Msg>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings`);
        if (!res.ok) return;
        const data = await res.json();
        const s = data?.settings || {};
        setFee(s.registrationFee ?? 15);
        setBuyerDepositRate(s.buyerDepositRate ?? 0);
        setDepositRate(s.depositRate ?? s.ngnToUsdRate ?? 1500);
        setWithdrawRate(s.withdrawRate ?? 1400);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleSaveFee = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFeeMessage(null);
    if (fee === "" || isNaN(Number(fee)) || Number(fee) < 0) {
      setFeeMessage({ text: "Please enter a valid amount (≥ 0)", type: "error" });
      return;
    }
    setFeeLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationFee: Number(fee) }),
      });
      const data = await res.json();
      if (data.success) {
        setFeeMessage({ text: `Registration fee saved`, type: "success" });
        const s = data.settings || {};
        setFee(s.registrationFee ?? Number(fee));
      } else {
        setFeeMessage({ text: data.message || "Save failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setFeeMessage({ text: "Network error. Try again.", type: "error" });
    } finally {
      setFeeLoading(false);
    }
  };

  const handleSaveBuyer = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setBuyerMessage(null);
    if (buyerDepositRate === "" || isNaN(Number(buyerDepositRate)) || Number(buyerDepositRate) < 0 || Number(buyerDepositRate) > 100) {
      setBuyerMessage({ text: "Buyer deposit rate must be between 0 and 100", type: "error" });
      return;
    }
    setBuyerLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerDepositRate: Number(buyerDepositRate) }),
      });
      const data = await res.json();
      if (data.success) {
        setBuyerMessage({ text: `Buyer deposit rate saved`, type: "success" });
        const s = data.settings || {};
        setBuyerDepositRate(s.buyerDepositRate ?? Number(buyerDepositRate));
      } else {
        setBuyerMessage({ text: data.message || "Save failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setBuyerMessage({ text: "Network error. Try again.", type: "error" });
    } finally {
      setBuyerLoading(false);
    }
  };



  const handleSaveDepositRate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setDepositMessage(null);
    if (depositRate === "" || isNaN(Number(depositRate)) || Number(depositRate) <= 0) {
      setDepositMessage({ text: "Deposit rate must be greater than 0", type: "error" });
      return;
    }
    setDepositLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositRate: Number(depositRate) }),
      });
      const data = await res.json();
      if (data.success) {
        setDepositMessage({ text: `Deposit rate saved`, type: "success" });
        const s = data.settings || {};
        setDepositRate(s.depositRate ?? Number(depositRate));
      } else {
        setDepositMessage({ text: data.message || "Save failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setDepositMessage({ text: "Network error. Try again.", type: "error" });
    } finally {
      setDepositLoading(false);
    }
  };

  const handleSaveWithdrawRate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setWithdrawMessage(null);
    if (withdrawRate === "" || isNaN(Number(withdrawRate)) || Number(withdrawRate) <= 0) {
      setWithdrawMessage({ text: "Withdrawal rate must be greater than 0", type: "error" });
      return;
    }
    setWithdrawLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawRate: Number(withdrawRate) }),
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawMessage({ text: `Withdrawal rate saved`, type: "success" });
        const s = data.settings || {};
        setWithdrawRate(s.withdrawRate ?? Number(withdrawRate));
      } else {
        setWithdrawMessage({ text: data.message || "Save failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setWithdrawMessage({ text: "Network error. Try again.", type: "error" });
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
            <h3 className="text-2xl font-extrabold text-gray-900">Seller Account Activation</h3>
            <p className="mt-1 text-sm text-gray-600">Set the one-time registration fee for new sellers (USD)</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 -mx-6 -mt-6 px-8 py-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Exchange Rates (USD ⇄ NGN)</h3>
              <p className="text-xs text-gray-600">Control currency conversion for deposits and withdrawals</p>
            </div>

            <form onSubmit={handleSaveDepositRate} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <label htmlFor="depositRate" className="block text-sm font-bold text-gray-700">
                  Deposit Rate (1 USD = ₦X)
                </label>
                <p className="text-xs text-gray-500 mb-2">Used when users deposit NGN to receive USD balance</p>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₦</span>
                  <input
                    id="depositRate"
                    type="number"
                    step="0.01"
                    min="1"
                    value={depositRate as any}
                    onChange={(e) => setDepositRate(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="1500.00"
                    className="block w-full rounded-xl border border-gray-200 bg-white px-10 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    disabled={depositLoading}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={depositLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-green-700 hover:to-emerald-700 disabled:opacity-60"
                >
                  {depositLoading ? (
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                  ) : null}
                  <span>{depositLoading ? "Saving..." : "Save Deposit Rate"}</span>
                </button>

                {depositMessage && (
                  <p className={`text-xs font-medium ${depositMessage.type === "success" ? "text-green-700" : "text-red-700"}`}>
                    {depositMessage.text}
                  </p>
                )}
              </div>
            </form>

            <form onSubmit={handleSaveWithdrawRate} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <label htmlFor="withdrawRate" className="block text-sm font-bold text-gray-700">
                  Withdrawal Rate (1 USD = ₦Y)
                </label>
                <p className="text-xs text-gray-500 mb-2">Used when sellers withdraw USD to NGN</p>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₦</span>
                  <input
                    id="withdrawRate"
                    type="number"
                    step="0.01"
                    min="1"
                    value={withdrawRate as any}
                    onChange={(e) => setWithdrawRate(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="1400.00"
                    className="block w-full rounded-xl border border-gray-200 bg-white px-10 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    disabled={withdrawLoading}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={withdrawLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
                >
                  {withdrawLoading ? (
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                  ) : null}
                  <span>{withdrawLoading ? "Saving..." : "Save Withdrawal Rate"}</span>
                </button>

                {withdrawMessage && (
                  <p className={`text-xs font-medium ${withdrawMessage.type === "success" ? "text-green-700" : "text-red-700"}`}>
                    {withdrawMessage.text}
                  </p>
                )}
              </div>
            </form>

            {/* Profit Strategy Visualization */}
            <div className="rounded-xl bg-indigo-900 p-5 text-white shadow-lg border border-indigo-400/30">
              <h4 className="flex items-center gap-2 font-bold text-indigo-100 mb-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[10px]">i</span>
                Your Profit Logic
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-200">Deposit Rate (User Pays):</span>
                  <span className="font-mono">₦{depositRate} / $1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-200">Withdrawal Rate (You Pay):</span>
                  <span className="font-mono">₦{withdrawRate} / $1</span>
                </div>
                <div className="my-2 border-t border-indigo-700/50 pt-2 flex justify-between">
                  <span className="font-bold text-green-400">Your Profit (Spread):</span>
                  <span className="font-black text-green-400">
                    ₦{(Number(depositRate || 0) - Number(withdrawRate || 0)).toLocaleString()} per $1
                  </span>
                </div>
                <p className="text-[10px] text-indigo-300 leading-relaxed">
                  Profit is generated automatically from the spread between deposit and withdrawal rates.
                  No additional percentage fees are charged to users.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveFee} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <label htmlFor="fee" className="block text-sm font-medium text-gray-700">
                  Registration / Activation Fee
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                  <input
                    id="fee"
                    type="number"
                    step="0.01"
                    min="0"
                    value={fee as any}
                    onChange={(e) => setFee(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="15.00"
                    className="block w-full rounded-xl border border-gray-200 bg-white px-10 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    disabled={feeLoading}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={feeLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60"
                >
                  {feeLoading ? (
                    <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                  ) : null}
                  <span>{feeLoading ? "Saving..." : "Save Changes"}</span>
                </button>

                {feeMessage && (
                  <p className={`text-sm font-medium ${feeMessage.type === "success" ? "text-green-700" : "text-red-700"}`}>
                    {feeMessage.text}
                  </p>
                )}
              </div>
            </form>
            {/* 

    <div className="grid grid-cols-1 gap-4">
              <form onSubmit={handleSaveBuyer} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Buyer Deposit Rate</h4>
                    <p className="mt-1 text-sm text-gray-600">Percentage charged on each buyer deposit. This fee is deducted from the buyer's payment before crediting their account.</p>
                  </div>
                </div>

                {/* <div className="mt-3">
                  <label htmlFor="buyerRate" className="sr-only">Buyer Deposit Rate (%)</label>
                  <div className="relative">
                    <input
                      id="buyerRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={buyerDepositRate as any}
                      onChange={(e) => setBuyerDepositRate(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="0.00"
                      className="block w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      disabled={buyerLoading}
                    />
                  </div>
                </div> */}

            {/* <div className="mt-4 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={buyerLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60"
                  >
                    {buyerLoading ? (
                      <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                      </svg>
                    ) : null}
                    <span>{buyerLoading ? "Saving..." : "Save"}</span>
                  </button>

                  {buyerMessage && (
                    <p className={`text-sm font-medium ${buyerMessage.type === "success" ? "text-green-700" : "text-red-700"}`}>
                      {buyerMessage.text}
                    </p>
                  )}
                </div>
              </form> */}

            {/* <form onSubmit={handleSaveSeller} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Seller Withdrawal Rate</h4>
                    <p className="mt-1 text-sm text-gray-600">Percentage deducted from seller withdrawal amounts as an administrative fee. The net amount is what the seller receives.</p>
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="sellerRate" className="sr-only">Seller Withdrawal Rate (%)</label>
                  <div className="relative">
                    <input
                      id="sellerRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={sellerWithdrawalRate as any}
                      onChange={(e) => setSellerWithdrawalRate(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="0.00"
                      className="block w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-base text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      disabled={sellerLoading}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={sellerLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60"
                  >
                    {sellerLoading ? (
                      <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                      </svg>
                    ) : null}
                    <span>{sellerLoading ? "Saving..." : "Save"}</span>
                  </button>

                  {sellerMessage && (
                    <p className={`text-sm font-medium ${sellerMessage.type === "success" ? "text-green-700" : "text-red-700"}`}>
                      {sellerMessage.text}
                    </p>
                  )}
                </div>
              </form>
            </div> */}







          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;