import React, { FC, FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const Spinner: FC<{ size?: number }> = ({ size = 18 }) => (
  <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" className="opacity-20" />
    <path d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" stroke="currentColor" />
  </svg>
);

export default function PaymentForm({ endpoint = "http://localhost:3200/api/submit" }) {
  const user  = useAuth(); // user.name, user.email
  const [payment, setPayment] = useState<"Kora" | "Flutterwave">("Kora");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user.user?.email || !user.user?.name) return setError("User not logged in");

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        paymentMethod: payment,
        submittedAt: new Date().toISOString(),
        name: user.user.name,
        email: user.user.email,
        amount,
        transactionId,
        message,
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.error || data?.message || `Status ${res.status}`);

      setSuccess(data?.message || "Payment submitted successfully!");
      setAmount("");
      setTransactionId("");
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "Network/server error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAmount("");
    setTransactionId("");
    setMessage("");
    setError(null);
    setSuccess(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }}
      className="max-w-lg mx-auto mt-8 mb-8 p-6 bg-gradient-to-br from-white via-slate-50 to-white/90 rounded-2xl shadow-lg border border-slate-100"
    >
      <h3 className="text-2xl font-semibold mb-2 text-slate-800">Payment Details</h3>
      <p className="text-sm text-slate-500 mb-6">
        {user.user?.name ? `Welcome, ${user.user.name}. Please enter your payment details.` : "Please log in to submit payment."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
          <div className="flex gap-2">
            {(["Kora", "Flutterwave"] as const).map(opt => {
              const active = payment === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPayment(opt)}
                  disabled={loading}
                  aria-pressed={active}
                  className={`flex-1 px-4 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300 disabled:opacity-60 ${
                    active ? "bg-indigo-600 text-white shadow-md border-indigo-600 font-medium"
                           : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount & Transaction ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                disabled={loading} placeholder="0.00"
                className="w-full rounded-lg border border-slate-200 pl-7 p-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 disabled:bg-slate-50 text-slate-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Transaction ID</label>
            <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)}
              disabled={loading} placeholder="TX_12345678"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 disabled:bg-slate-50 text-slate-700"
              required
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Message <span className="text-xs text-slate-400">(optional)</span></label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} disabled={loading} rows={4}
            placeholder="Write your message or order details..."
            className="w-full rounded-lg border border-slate-200 p-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none disabled:opacity-60 disabled:bg-slate-50 text-slate-700"
          />
        </div>

        {/* Buttons */}
        <div className="pt-2 space-y-4">
          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1"
            >
              {loading && <Spinner size={18} />}
              <span>{loading ? "Processing..." : "Submit Payment"}</span>
            </button>

            <button type="button" onClick={handleReset} disabled={loading}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-60"
            >
              Reset
            </button>
          </div>

          {/* Messages */}
          {success && <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm">{success}</div>}
          {error && <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>}
        </div>
      </form>
    </motion.div>
  );
}
