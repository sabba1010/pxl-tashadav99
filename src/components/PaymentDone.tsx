import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Payment = {
  _id: string;
  paymentMethod: string;
  message?: string;
  submittedAt: string;
  status: string;
  meta?: any;
};

export default function PaymentDone() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:3200/payments");
        const data = await res.json();
        setPayments(data);
      } catch (err: any) {
        setError("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading payments...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-5">
      <h2 className="text-3xl font-semibold mb-5 text-slate-800">
        Payment Records
      </h2>

      <div className="space-y-5">
        {payments.map((p) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-5 rounded-xl border bg-white shadow-sm"
          >
            <div className="flex justify-between">
              <h3 className="text-xl font-medium text-indigo-600">
                {p.paymentMethod}
              </h3>
              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                {p.status}
              </span>
            </div>

            {p.message && (
              <p className="mt-2 text-slate-700">
                <strong>Message:</strong> {p.message}
              </p>
            )}

            <p className="mt-1 text-sm text-slate-500">
              <strong>Submitted At:</strong>{" "}
              {new Date(p.submittedAt).toLocaleString()}
            </p>

            {/* Optional meta object */}
            {p.meta && Object.keys(p.meta).length > 0 && (
              <pre className="mt-3 bg-slate-100 p-3 rounded text-sm text-slate-700">
                {JSON.stringify(p.meta, null, 2)}
              </pre>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
