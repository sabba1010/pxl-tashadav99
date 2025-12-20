// src/components/Payment/Payment.tsx
import React, { useState } from "react";
import KoraPayment from "./KoraPayment";
import { FaChevronRight, FaChevronLeft, FaCreditCard } from "react-icons/fa";

// Helper that ensures icon returns a valid React element for TS
const Icon = (Comp: any, props: any = {}): React.ReactElement | null => {
  try {
    return React.createElement(Comp, props);
  } catch (err) {
    console.error("Icon render error", err);
    return null;
  }
};

const Payment: React.FC = () => {
  const [step, setStep] = useState<"amount" | "methods">("amount");
  const [amount, setAmount] = useState<string>("");
  const [finalAmount, setFinalAmount] = useState<number>(0);

  const quickAmounts = [10, 25, 50, 100];

  const handleNext = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setFinalAmount(num);
    setStep("methods");
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString(undefined, { style: "currency", currency: "USD" });

  return (
    <div className="my-24 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div
          className="bg-gradient-to-r from-[#0A1A3A] to-[#0F2B50] text-white rounded-2xl shadow-xl p-6 md:p-10"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Checkout</h1>
              <p className="text-sm opacity-80 mt-1">
                Secure payment & fast processing
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#D4A643] flex items-center justify-center text-[#0A1A3A] font-bold shadow-sm">
                ★
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 text-gray-800 shadow-sm">
            {/* Step indicator */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`flex items-center gap-3 ${
                  step === "amount" ? "" : "opacity-60"
                }`}
              >
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
                  <div className="text-xs text-gray-500">
                    How much will you pay
                  </div>
                </div>
              </div>

              <div className="flex-1 border-t border-dashed border-gray-200" />

              <div
                className={`flex items-center gap-3 ${
                  step === "methods" ? "" : "opacity-60"
                }`}
              >
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
                  <div className="text-xs text-gray-500">
                    Pick a payment provider
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: amount */}
            {step === "amount" && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    inputMode="decimal"
                    pattern="[0-9]*"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-9 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4A643] text-lg"
                  />
                </div>

                <div className="flex gap-2 mt-4">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      onClick={() => setAmount(String(q))}
                      className="text-sm px-3 py-2 rounded-md border border-gray-200 hover:shadow-sm transition shadow-sm"
                    >
                      {formatCurrency(q)}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      setAmount("");
                    }}
                    className="text-sm text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50"
                  >
                    Clear
                  </button>

                  <button
                    onClick={handleNext}
                    className="ml-auto inline-flex items-center gap-2 bg-[#D4A643] text-[#0A1A3A] px-5 py-2 rounded-lg font-medium shadow-md hover:scale-[1.01] transition"
                  >
                    Next {Icon(FaChevronRight)}
                  </button>
                </div>
              </>
            )}

            {/* Step 2: methods */}
            {step === "methods" && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Amount to pay</div>
                    <div className="text-2xl font-semibold">
                      {formatCurrency(finalAmount)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">Reference</div>
                    <div className="text-sm text-gray-600">
                      #{Math.floor(Math.random() * 900000 + 100000)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4">
                  {/* Flutterwave button (gold) */}
                  <button
                    onClick={async () => {
                      try {
                        // call your backend route
                        const res = await fetch(
                          "http://localhost:3200/flutterwave/create",
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              name: "Rubel Mia",
                              email: "test@gmail.com",
                              amount: finalAmount,
                            }),
                          }
                        );

                        const data = await res.json();
                        window.location.href = data.link;
                      } catch (err) {
                        console.error(err);
                        alert("Payment could not be initiated");
                      }
                    }}
                    className="w-full flex items-center gap-3 justify-center px-4 py-3 rounded-lg font-semibold shadow-md"
                    style={{
                      background: "linear-gradient(90deg,#D4A643,#FFBF3D)",
                      color: "#071428",
                    }}
                  >
                    {Icon(FaCreditCard, { className: "opacity-90" })} Pay with
                    Flutterwave
                  </button>

                  {/* KoraPayment component */}
                  <div className="w-full">
                    <KoraPayment amount={finalAmount} />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setStep("amount")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    {Icon(FaChevronLeft)} Change Amount
                  </button>

                  <button
                    onClick={() => alert("Receipt sent!")}
                    className="px-4 py-2 rounded-md bg-[#1BC47D] text-white font-medium shadow hover:scale-[1.01] transition"
                  >
                    Send Receipt
                  </button>
                </div>
              </>
            )}
          </div>

          <p className="text-xs text-white/80 mt-4">
            By continuing you agree to our{" "}
            <span className="underline">terms</span> and{" "}
            <span className="underline">privacy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
