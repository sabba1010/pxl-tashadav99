"use client";

import React, { useState } from "react";
import axios from "axios";

interface UserData {
  name: string;
  email: string;
}

export default function KoraPayment() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (loading) return; // prevent double click

    try {
      setLoading(true);

      const user: UserData = {
        name: "Rubel Mia",
        email: "rubel@example.com",
      };

      const amount = 500; 

      const response = await axios.post(
        "http://localhost:3200/api/korapay/create-payment", 
        {
          amount,    
          user,     
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { checkoutUrl } = response.data;

      if (checkoutUrl) {
        // KoraPay এর পেমেন্ট পেজে রিডাইরেক্ট
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
      className={`px-6 py-3 rounded-lg font-medium transition-all ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
      }`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
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
        "Pay with KoraPay ₦1,500"
      )}
    </button>
  );
}