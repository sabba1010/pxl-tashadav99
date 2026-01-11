"use client";

import React, { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCreditCard,
} from "react-icons/fa";
import { toast } from "sonner";

// ✅ Icon helper (TS safe)
const Icon = (Comp: any, props: any = {}): React.ReactElement | null => {
  try {
    return React.createElement(Comp, props);
  } catch {
    return null;
  }
};

const Payment: React.FC = () => {
  const [step, setStep] = useState<"amount" | "methods">("amount");
  const [amount, setAmount] = useState<string>("");
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<"flw" | "kora" | null>(null);

  const quickAmounts = [10, 25, 50, 100];

  const handleNext = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 1) {
      toast.error("Please enter a valid amount");
      return;
    }
    setFinalAmount(num);
    setStep("methods");
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD" });

  // ===== Flutterwave (redirect via backend) =====
  const payWithFlutterwave = async () => {
    try {
      setLoading("flw");
      const res = await fetch("https://vps-backend-server-beta.vercel.app/flutterwave/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Rubel Mia",
          email: "test@gmail.com",
          amount: finalAmount,
        }),
      });

      const data = await res.json();
      window.location.href = data.link;
    } catch {
      toast.error("Flutterwave payment failed");
    } finally {
      setLoading(null);
    }
  };

  // ===== Korapay (redirect via backend) =====
  const payWithKorapay = async () => {
    try {
      setLoading("kora");
      const res = await fetch("https://vps-backend-server-beta.vercel.app/korapay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          user: {
            name: "Rubel Mia",
            email: "test@gmail.com",
          },
        }),
      });

      const data = await res.json();
      window.location.href = data.checkoutUrl;
    } catch {
      toast.error("Korapay payment failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="my-24 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div
          className="bg-gradient-to-r from-[#0A1A3A] to-[#0F2B50] text-white rounded-2xl shadow-xl p-6 md:p-10"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Checkout</h1>
              <p className="text-sm opacity-80 mt-1">
                Secure payment & fast processing
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#D4A643] flex items-center justify-center text-[#0A1A3A] font-bold">
              ★
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl p-6 text-gray-800 shadow-sm">
            {/* Step indicator */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`flex items-center gap-3 ${step !== "amount" && "opacity-60"}`}>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    step === "amount"
                      ? "bg-[#0A1A3A] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <div>
                  <div className="text-sm font-semibold">Enter Amount</div>
                  <div className="text-xs text-gray-500">How much will you pay</div>
                </div>
              </div>

              <div className="flex-1 border-t border-dashed border-gray-200" />

              <div className={`flex items-center gap-3 ${step !== "methods" && "opacity-60"}`}>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    step === "methods"
                      ? "bg-[#0A1A3A] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <div>
                  <div className="text-sm font-semibold">Choose Method</div>
                  <div className="text-xs text-gray-500">Pick a provider</div>
                </div>
              </div>
            </div>

            {/* STEP 1 */}
            {step === "amount" && (
              <>
                <label className="block text-sm font-medium mb-2">Amount</label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-9 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#D4A643] outline-none text-lg"
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      onClick={() => setAmount(String(q))}
                      className="text-sm px-3 py-2 rounded-md border hover:shadow-sm transition"
                    >
                      {formatCurrency(q)}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 bg-[#D4A643] text-[#0A1A3A] px-5 py-2 rounded-lg font-medium shadow-md"
                  >
                    Next {Icon(FaChevronRight)}
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === "methods" && (
              <>
                <div className="flex justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-500">Amount to pay</div>
                    <div className="text-2xl font-semibold">
                      {formatCurrency(finalAmount)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    #{Math.floor(Math.random() * 900000 + 100000)}
                  </div>
                </div>

                {/* Flutterwave */}
                <button
                  onClick={payWithFlutterwave}
                  disabled={loading !== null}
                  className="w-full flex items-center gap-3 justify-center px-4 py-3 rounded-lg font-semibold shadow-md mb-3"
                  style={{
                    background: "linear-gradient(90deg,#D4A643,#FFBF3D)",
                    color: "#071428",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {Icon(FaCreditCard)}
                  {loading === "flw"
                    ? "Redirecting..."
                    : "Pay with Flutterwave"}
                </button>

                {/* Korapay */}
                <button
                  onClick={payWithKorapay}
                  disabled={loading !== null}
                  className="w-full flex items-center gap-3 justify-center px-4 py-3 rounded-lg font-semibold shadow-md border"
                >
                  {Icon(FaCreditCard)}
                  {loading === "kora"
                    ? "Redirecting..."
                    : "Pay with Korapay"}
                </button>

                <div className="mt-6">
                  <button
                    onClick={() => setStep("amount")}
                    className="inline-flex items-center gap-2 text-gray-700 hover:underline"
                  >
                    {Icon(FaChevronLeft)} Change Amount
                  </button>
                </div>
              </>
            )}
          </div>

          <p className="text-xs text-white/80 mt-4 text-center">
            By continuing you agree to our terms & privacy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
