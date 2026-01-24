import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3200";

type Msg = { text: string; type?: "success" | "error" | "info" } | null;

const AdminSettings: React.FC = () => {
  const [fee, setFee] = useState<number | "">("");
  const [buyerDepositRate, setBuyerDepositRate] = useState<number | "">("");
  const [sellerWithdrawalRate, setSellerWithdrawalRate] = useState<number | "">("");
  const [feeLoading, setFeeLoading] = useState(false);
  const [buyerLoading, setBuyerLoading] = useState(false);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [feeMessage, setFeeMessage] = useState<Msg>(null);
  const [buyerMessage, setBuyerMessage] = useState<Msg>(null);
  const [sellerMessage, setSellerMessage] = useState<Msg>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings`);
        if (!res.ok) return;
        const data = await res.json();
        const s = data?.settings || {};
        setFee(s.registrationFee ?? 15);
        setBuyerDepositRate(s.buyerDepositRate ?? 0);
        setSellerWithdrawalRate(s.sellerWithdrawalRate ?? 0);
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

  const handleSaveSeller = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSellerMessage(null);
    if (sellerWithdrawalRate === "" || isNaN(Number(sellerWithdrawalRate)) || Number(sellerWithdrawalRate) < 0 || Number(sellerWithdrawalRate) > 100) {
      setSellerMessage({ text: "Seller withdrawal rate must be between 0 and 100", type: "error" });
      return;
    }
    setSellerLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerWithdrawalRate: Number(sellerWithdrawalRate) }),
      });
      const data = await res.json();
      if (data.success) {
        setSellerMessage({ text: `Seller withdrawal rate saved`, type: "success" });
        const s = data.settings || {};
        setSellerWithdrawalRate(s.sellerWithdrawalRate ?? Number(sellerWithdrawalRate));
      } else {
        setSellerMessage({ text: data.message || "Save failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setSellerMessage({ text: "Network error. Try again.", type: "error" });
    } finally {
      setSellerLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
            <h3 className="text-2xl font-extrabold text-gray-900">Seller Account Activation</h3>
            <p className="mt-1 text-sm text-gray-600">Set the one-time registration fee for new sellers (USD)</p>
          </div>

          <div className="p-6 space-y-6">
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