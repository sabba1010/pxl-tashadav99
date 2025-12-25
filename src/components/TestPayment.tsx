// src/components/TestPayment.tsx
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";
import { FlutterwaveConfig } from "flutterwave-react-v3/dist/types";
import { CreditCard } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDepositByUser } from "../hook/useDepositByUser";

interface TestPaymentProps {
  amount: number;
}

const TestPayment: React.FC<TestPaymentProps> = ({ amount }) => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { refetch } = useDepositByUser();

  const { user } = useAuth();
  const navigate = useNavigate();

  // Config তৈরি করি — user না থাকলে fallback দিয়ে (hook চলবে)
  const config: FlutterwaveConfig = {
    public_key: "FLWPUBK_TEST-2de87089e34448fe528b45106c0d7ceb-X",
    tx_ref: `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    amount,
    currency: "USD",
    payment_options: "card,ussd,banktransfer,mobilemoney",
    customer: {
      email: user?.email || "guest@example.com",
      phone_number: "08012345678",
      name: user?.name || "Guest User",
    },
    customizations: {
      title: "AcctEmpire Deposit",
      description: "Secure payment via Flutterwave",
      logo: "https://i.ibb.co.com/tT25FD1K/headerlogo-e65b8413760c38578ce6.png",
    },
  };

  // Hook টা এখানে top-level-এ কল করা হচ্ছে — সবসময় চলবে
  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    // লগইন চেক — না থাকলে শুধু মেসেজ দেখাও
    if (!user || !user.email) {
      toast.error("Please log in to make a payment.");
      return;
    }

    setPaymentStatus(null);
    setIsProcessing(true);

    handleFlutterPayment({
      callback: async (response) => {
        console.log("Flutterwave response:", response);

        if (response.status === "successful") {
          const transaction_id = response.transaction_id;

          try {
            // Backend-এ verify করি
            const verifyRes = await fetch("https://vps-backend-server-beta.vercel.app/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                transaction_id,
                userEmail: user.email,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              setPaymentStatus(`Success! ₦${amount} verified.`);

              // Balance update
              const balanceRes = await fetch("https://vps-backend-server-beta.vercel.app/api/update-balance", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email }),
              });

              const balanceData = await balanceRes.json();

              if (balanceRes.ok) {
                const added = balanceData.totalAdded || 0;
                if (added > 0) {
                  toast.success(`₦${added} added to your wallet!`);
                } else {
                  toast.info("Payment already credited.");
                }
                refetch();
                navigate("/wallet");
              } else {
                toast.error("Failed to update balance: " + balanceData.message);
              }
            } else {
              setPaymentStatus("Verification failed: " + verifyData.message);
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            setPaymentStatus("Server error");
            toast.error("Something went wrong. Try again.");
          }
        } else {
          setPaymentStatus("Payment failed or cancelled");
          toast.error("Payment not completed");
        }

        closePaymentModal();
        setIsProcessing(false);
      },
      onClose: () => {
        setPaymentStatus("Payment cancelled");
        setIsProcessing(false);
        toast.info("Payment cancelled");
      },
    });
  };

  // UI: লগইন না থাকলে disable মেসেজ
  if (!user || !user.email) {
    return (
      <div className="w-full flex flex-col items-center gap-6 my-8">
        <div className="text-center text-red-600 font-bold text-lg">
          Please log in to make a payment.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 my-8">
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`flex items-center justify-center gap-4 w-full max-w-md px-10 py-5 
          text-white text-lg font-bold rounded-xl shadow-xl transition duration-300
          ${isProcessing 
            ? "bg-gray-500 cursor-not-allowed" 
            : "bg-orange-500 hover:bg-orange-600"
          }`}
      >
        <CreditCard size={28} />
        {isProcessing ? "Processing..." : `Pay with Flutterwave`}
      </button>

      {paymentStatus && (
        <div
          className={`w-full max-w-md p-5 rounded-xl text-center font-bold text-lg ${
            paymentStatus.includes("Success") || paymentStatus.includes("verified")
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