// src/components/TestPayment.tsx
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";
import { FlutterwaveConfig } from "flutterwave-react-v3/dist/types";
import { CreditCard } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TestPaymentProps {
  amount: number;
}

const TestPayment: React.FC<TestPaymentProps> = ({ amount }) => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const { user } = useAuth();
    const navigate = useNavigate();
    console.log(user)
  // যদি user না থাকে তাহলে config-এ ডিফল্ট বা empty রাখবো (hook চলবে)
  const config: FlutterwaveConfig = {
    public_key: "FLWPUBK_TEST-2de87089e34448fe528b45106c0d7ceb-X",
    tx_ref: `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    amount,
    currency: "NGN",
    payment_options: "card,ussd,banktransfer,mobilemoney",
    customer: {
      email: user?.email || "guest@example.com", // fallback
      phone_number: "08012345678",
      name: user?.name || "Guest User",
    },
    customizations: {
      title: "Payment",
      description: "Secure payment via Flutterwave",
      logo: "https://your-logo-url.com/logo.png",
    },
  };

  // Hook টা এখানে top level-এ কল করা হচ্ছে — সবসময় চলবে
  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    // এখানে চেক করছি user আছে কিনা
    if (!user || !user.email) {
      setPaymentStatus("Error: You must be logged in to make a payment.");
      return;
    }

    handleFlutterPayment({
      callback: (response) => {
        console.log("Flutterwave response:", response);

        if (response.status === "successful") {
          setPaymentStatus(`Success! Transaction ID: ${response.transaction_id}`);

          fetch("http://localhost:3200/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transaction_id: response.transaction_id,
              tx_ref: response.tx_ref,
              amount: response.amount,
              currency: response.currency,
              status: response.status,
              userEmail: user.email,
            }),
          })
            .then((res) => res.json())
            .then((data) => console.log("Backend response:", data))
            .catch((err) => {
              console.error("Verification failed:", err);
              setPaymentStatus("Server verification failed");
            });
        } else {
          setPaymentStatus("Payment failed or cancelled");
        }

            closePaymentModal();
            navigate('/wallet');
            toast.success(`Payment ${response.amount} Deposit successful!`);
      },
      onClose: () => {
        setPaymentStatus("Payment cancelled by user");
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 my-8">
      {/* লগইন না থাকলে মেসেজ দেখাও */}
      {!user ? (
        <div className="text-center text-red-600 font-bold text-lg">
          Please log in to make a payment.
        </div>
      ) : (
        <>
          <div className="text-center">
            <p className="text-gray-600">Paying as:</p>
            <p className="font-semibold text-lg">{user.email}</p>
            <p className="text-xl font-bold mt-2">Amount: ₦{amount}</p>
          </div>

          <button
            onClick={handlePayment}
            className="flex items-center justify-center gap-4 w-full max-w-md px-10 py-5 
                       bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold 
                       rounded-xl shadow-xl transition duration-300"
          >
            <CreditCard size={28} />
            Pay ₦{amount} with Flutterwave
          </button>
        </>
      )}

      {paymentStatus && (
        <div
          className={`w-full max-w-md p-5 rounded-xl text-center font-bold text-lg ${
            paymentStatus.includes("Success")
              ? "bg-green-100 text-green-800 border-2 border-green-400"
              : "bg-red-100 text-red-800 border-2 border-red-400"
          }`}
        >
          {paymentStatus}
        </div>
      )}
    </div>
  );
};

export default TestPayment;