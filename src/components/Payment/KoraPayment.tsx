"use client";

import React, { useState } from "react";
import axios from "axios";

interface UserData {
  name: string;
  email: string;
}

interface PaymentResponse {
  checkoutUrl: string;
}

interface KoraPaymentProps {
  amount: number; // এখানে dynamic amount আসবে
  currency?: "NGN" | "USD" | "GHS"; // optional, default NGN
  user?: UserData; // optional, default value দিয়ে রাখা যাবে
}

export default function KoraPayment({
  amount,
  currency = "NGN",
  user = { name: "Rubel Mia", email: "rubel@example.com" },
}: KoraPaymentProps) {
  const [loading, setLoading] = useState(false);

  // টাকা সুন্দর করে দেখানোর জন্য
  const formatAmount = () => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  const handlePayment = async () => {
    if (loading) return;

    try {
      setLoading(true);

     const response = await axios.post(
  "https://vps-backend-server-beta.vercel.app/korapay/create",
  { amount, user, currency },
  { headers: { "Content-Type": "application/json" } }
);

const data = response.data as PaymentResponse;

const { checkoutUrl } = data;


      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert("Payment link পাওয়া যায়নি!");
      }
    } catch (err: any) {
      console.error("KoraPay Error:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "পেমেন্ট শুরু করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all shadow-md ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700 text-white hover:shadow-xl"
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Processing...
        </span>
      ) : (
        <>Pay with KoraPay </>
      )}
    </button>
  );
}
