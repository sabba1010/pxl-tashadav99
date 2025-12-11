// src/components/PaymentForm.tsx
import React, { FC, FormEvent, useState } from "react";
import { motion } from "framer-motion";

type Props = { endpoint?: string };

const Spinner: FC<{ size?: number }> = ({ size = 18 }) => (
  <svg
    className="animate-spin"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" className="opacity-20" />
    <path d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" stroke="currentColor" />
  </svg>
);

export default function PaymentForm({ endpoint = "http://localhost:3200/api/submit" }: Props) {
  const [payment, setPayment] = useState<"Kora" | "Flutterwave">("Kora");
  const [name, setName] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Build payload and omit empty values explicitly
      const payload: Record<string, any> = {
        paymentMethod: payment,
        submittedAt: new Date().toISOString(),
      };
      if (name.trim()) payload.name = name.trim();
      if (transactionId.trim()) payload.transactionId = transactionId.trim();
      if (message.trim()) payload.message = message.trim();

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      // try parse JSON safely
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // server sent an error message?
        const serverMsg = data?.error || data?.message || `Status ${res.status}`;
        throw new Error(serverMsg);
      }

      setSuccess(data?.message || "Submitted successfully");
      // clear form
      setName("");
      setTransactionId("");
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "Network/server error");
    } finally {
      setLoading(false);
      
    }
  };

  

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="max-w-lg mx-auto mt-8 mb-8 p-6 bg-gradient-to-br from-white via-slate-50 to-white/90 rounded-2xl shadow-lg border border-slate-100"
    >
      <h3 className="text-2xl font-semibold mb-2 text-slate-800">Payment & Contact</h3>
      <p className="text-sm text-slate-500 mb-4">
        Quickly pick a payment method and leave an optional note — we'll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>

          <div className="flex gap-2">
            {(["Kora", "Flutterwave"] as const).map((opt) => {
              const active = payment === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPayment(opt)}
                  disabled={loading}
                  aria-pressed={active}
                  className={`flex-1 px-4 py-2 rounded-xl border transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300 disabled:opacity-60 ${
                    active
                      ? "bg-indigo-600 text-white shadow-md border-indigo-600"
                      : "bg-white text-slate-700 border-slate-200 hover:shadow-sm"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="Full name"
              className="w-full rounded-lg border border-slate-200 p-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="tx" className="block text-sm font-medium text-slate-700 mb-2">
              Transaction ID
            </label>
            <input
              id="tx"
              name="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              disabled={loading}
              placeholder="e.g. TX_12345"
              className="w-full rounded-lg border border-slate-200 p-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
              autoComplete="off"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
            Message <span className="text-xs text-slate-400">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            rows={4}
            placeholder="Write your message or order details..."
            className="w-full rounded-lg border border-slate-200 p-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none disabled:opacity-60"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:opacity-95 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {loading ? <Spinner size={18} /> : null}
            <span>{loading ? "Sending..." : "Submit"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setName("");
              setTransactionId("");
              setMessage("");
              setError(null);
              setSuccess(null);
            }}
            className="px-3 py-2 rounded-lg border text-sm text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-60"
            disabled={loading}
          >
            Reset
          </button>

          <div className="ml-auto text-sm space-x-2">
            {success && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {success}
              </span>
            )}

            {error && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {error}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-1">
          By submitting you agree to our <span className="underline">terms</span>.
        </p>
      </form>
    </motion.div>
  );
}
