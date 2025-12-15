import React, { FC, FormEvent, useState } from "react"; // useEffect removed
import { motion } from "framer-motion";

// Props types definition
type Props = { 
  endpoint?: string;
  currentUser?: {
    name?: string;
    email?: string;
  }
};

// Loading Spinner Component
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

export default function PaymentForm({ endpoint = "http://localhost:3200/api/submit", currentUser }: Props) {
  const [payment, setPayment] = useState<"Kora" | "Flutterwave">("Kora");
  
  // Form State (Manual input state)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper: Get effective values (Prefer currentUser prop over manual state)
  const effectiveName = currentUser?.name || name;
  const effectiveEmail = currentUser?.email || email;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Build payload using effective values directly
      const payload: Record<string, any> = {
        paymentMethod: payment,
        submittedAt: new Date().toISOString(),
      };
      
      // Use effectiveName & effectiveEmail directly
      if (effectiveName.trim()) payload.name = effectiveName.trim();
      if (effectiveEmail.trim()) payload.email = effectiveEmail.trim();
      if (amount.trim()) payload.amount = amount.trim();
      if (transactionId.trim()) payload.transactionId = transactionId.trim();
      if (message.trim()) payload.message = message.trim();

      // API Call
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const serverMsg = data?.error || data?.message || `Status ${res.status}`;
        throw new Error(serverMsg);
      }

      setSuccess(data?.message || "Payment submitted successfully!");
      
      // Clear form logic
      setName("");
      setEmail("");
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
    setName("");
    setEmail("");
    setAmount("");
    setTransactionId("");
    setMessage("");
    setError(null);
    setSuccess(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="max-w-lg mx-auto mt-8 mb-8 p-6 bg-gradient-to-br from-white via-slate-50 to-white/90 rounded-2xl shadow-lg border border-slate-100"
    >
      <h3 className="text-2xl font-semibold mb-2 text-slate-800">Payment Details</h3>
      <p className="text-sm text-slate-500 mb-6">
        {currentUser?.name 
          ? `Welcome, ${currentUser.name}. Please enter your payment details.` 
          : "Please fill in your details and payment information below."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Payment Method Selection */}
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
                  className={`flex-1 px-4 py-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300 disabled:opacity-60 ${
                    active
                      ? "bg-indigo-600 text-white shadow-md border-indigo-600 font-medium"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Name and Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Name
            </label>
            <input
              id="name"
              name="name"
              // DIRECTLY use currentUser.name if available
              value={effectiveName} 
              onChange={(e) => setName(e.target.value)}
              disabled={loading || !!currentUser?.name}
              readOnly={!!currentUser?.name}
              placeholder="Full Name"
              className={`w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-80 transition-colors ${
                 currentUser?.name 
                   ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed select-none" 
                   : "bg-white border-slate-200 placeholder-slate-400 text-slate-700"
              }`}
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              // DIRECTLY use currentUser.email if available
              value={effectiveEmail}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || !!currentUser?.email}
              readOnly={!!currentUser?.email}
              placeholder="user@example.com"
              className={`w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-80 transition-colors ${
                 currentUser?.email 
                   ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed select-none" 
                   : "bg-white border-slate-200 placeholder-slate-400 text-slate-700"
              }`}
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Amount and Transaction ID Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input
                id="amount"
                name="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-200 pl-7 p-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 disabled:bg-slate-50 text-slate-700"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="tx" className="block text-sm font-medium text-slate-700 mb-1.5">
              Transaction ID
            </label>
            <input
              id="tx"
              name="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              disabled={loading}
              placeholder="e.g. TX_12345678"
              className="w-full rounded-lg border border-slate-200 p-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 disabled:bg-slate-50 text-slate-700"
              autoComplete="off"
              required
            />
          </div>
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
            Message <span className="text-xs text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            rows={4}
            placeholder="Write your message or order details..."
            className="w-full rounded-lg border border-slate-200 p-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none disabled:opacity-60 disabled:bg-slate-50 text-slate-700"
          />
        </div>

        {/* Buttons & Status Messages */}
        <div className="pt-2 space-y-4">
          
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1"
            >
              {loading ? <Spinner size={18} /> : null}
              <span>{loading ? "Processing..." : "Submit Payment"}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-60"
              disabled={loading}
            >
              Reset
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{success}</span>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}

        </div>
        
        <p className="text-xs text-center text-slate-400 mt-2">
           Double-check your Transaction ID. By submitting, you agree to our terms.
        </p>

      </form>
    </motion.div>
  );
}