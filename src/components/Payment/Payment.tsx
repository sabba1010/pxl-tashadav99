"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaChevronRight, FaCreditCard } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";
import { useAuthHook } from "../../hook/useAuthHook";

// ================= TYPES =================
interface ApiResponse {
  success?: boolean;
  link?: string;
  checkoutUrl?: string;
  message?: string;
}

const ChevronRightIcon = FaChevronRight as unknown as React.ComponentType<any>;
const CreditCardIcon = FaCreditCard as unknown as React.ComponentType<any>;

const Payment: React.FC = () => {
  const [step, setStep] = useState<"amount" | "methods">("amount");
  const [amount, setAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState(0);
  const [loading, setLoading] = useState<
    "flw" | "kora" | "verifying" | null
  >(null);
  const [exchangeRate, setExchangeRate] = useState(1500);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 🔐 SAME LOGIN USER AS WALLET
  const loginUserData = useAuthHook();
  const userEmail = loginUserData?.data?.email;

  const quickAmounts = [10, 25, 50, 100];

  // ================= FETCH SETTINGS =================
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await axios.get<{
          success: boolean;
          settings: {
            ngnToUsdRate?: number;
            depositRate?: number;
          };
        }>("http://localhost:3200/api/settings");
        if (res.data.success) {
          setExchangeRate(res.data.settings.depositRate || res.data.settings.ngnToUsdRate || 1500);
        }
      } catch (err) {
        console.error("Failed to fetch exchange rate", err);
      }
    };
    fetchRate();
  }, []);

  // ================= VERIFY FLUTTERWAVE =================
  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref");
    if (!tx_ref) return;

    const verifyPayment = async () => {
      try {
        setLoading("verifying");
        toast.info("Verifying payment...");

        const res = await axios.get<ApiResponse>(
          "http://localhost:3200/flutterwave/verify",
          { params: { tx_ref } }
        );

        if (res.data.success) {
          toast.success("Payment successful! Balance added.");
          navigate("/payment", { replace: true });
        } else {
          toast.error(res.data.message || "Verification failed");
        }
      } catch {
        toast.error("Payment verification failed");
      } finally {
        setLoading(null);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  // ================= STEP HANDLER =================
  const handleNext = () => {
    const num = Number(amount);
    if (!num || num <= 0) {
      toast.error("Enter valid amount");
      return;
    }
    setFinalAmount(num);
    setStep("methods");
  };

  // ================= FLUTTERWAVE =================
  const payWithFlutterwave = async () => {
    if (!userEmail) {
      toast.error("User not logged in");
      return;
    }

    try {
      setLoading("flw");

      const res = await axios.post<ApiResponse>(
        "http://localhost:3200/flutterwave/create",
        {
          amount: finalAmount,
          email: userEmail,
        }
      );

      if (res.data.link) {
        window.location.href = res.data.link;
      }
    } catch {
      toast.error("Flutterwave payment failed");
    } finally {
      setLoading(null);
    }
  };

  // ================= KORAPAY =================
  const payWithKorapay = async () => {
    if (!userEmail) {
      toast.error("User not logged in");
      return;
    }

    try {
      setLoading("kora");

      const res = await axios.post<ApiResponse>(
        "http://localhost:3200/korapay/create",
        {
          amount: finalAmount,
          email: userEmail,
        }
      );

      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
    } catch {
      toast.error("Korapay payment failed");
    } finally {
      setLoading(null);
    }
  };

  // ================= VERIFY SCREEN =================
  if (loading === "verifying") {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Verifying payment...
      </div>
    );
  }

  return (
    <div className="my-24 flex justify-center">
      <div className="w-full max-w-md p-6 bg-slate-900 text-white rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Deposit Funds</h2>

        {step === "amount" ? (
          <>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 mb-2 bg-slate-800 rounded"
            />

            {amount && !isNaN(Number(amount)) && (
              <div className="mb-4 bg-slate-800 p-3 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Estimated Conversion (Rate: ₦{exchangeRate}/$1)</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-white">${Number(amount).toLocaleString()} USD</span>
                  <span className="text-slate-500">→</span>
                  <span className="font-bold text-lg text-yellow-400">₦{(Number(amount) * exchangeRate).toLocaleString()} NGN</span>
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-4">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(String(q))}
                  className="px-3 py-1 bg-slate-700 rounded"
                >
                  ${q}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-yellow-500 text-black p-3 rounded flex justify-center gap-2"
            >
              Continue <ChevronRightIcon />
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-lg">
              Pay: <strong>${finalAmount}</strong>
              <br />
              <span className="text-sm text-gray-400">
                (~ ₦{(finalAmount * exchangeRate).toLocaleString()})
              </span>
            </p>

            <button
              onClick={payWithFlutterwave}
              disabled={loading !== null}
              className="w-full bg-orange-500 p-3 rounded flex justify-center gap-2 mb-3"
            >
              <CreditCardIcon />
              {loading === "flw" ? "Loading..." : "Pay with Flutterwave"}
            </button>

            <button
              onClick={payWithKorapay}
              disabled={loading !== null}
              className="w-full bg-indigo-600 p-3 rounded flex justify-center gap-2"
            >
              <CreditCardIcon />
              {loading === "kora" ? "Loading..." : "Pay with Korapay"}
            </button>

            <button
              onClick={() => setStep("amount")}
              className="w-full mt-4 text-sm opacity-70"
            >
              Change amount
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
