// components/DeductAndCreditAction.tsx

import React, { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@mui/material";
import { useAuthHook } from "../../hook/useAuthHook";
import { useNavigate } from "react-router-dom";

interface DeductAndCreditActionProps {
  userId: string;
  deductAmount: number; // balance থেকে কাটবে
  creditAmount: number; // salesCredit-এ যোগ হবে
  newPlan?: string; // অপশনাল: "basic" | "pro" | "premium" ইত্যাদি
  onSuccess?: (data: {
    newBalance: number;
    newSalesCredit: number;
    subscribedPlan?: string;
  }) => void;
  onError?: (error: string) => void;
  buttonText?: string; // বাটনে কী লেখা দেখাবে
  disabled?: boolean;
  children?: React.ReactNode; // কাস্টম কন্টেন্ট (যেমন আইকন + টেক্সট)
}

const DeductAndCreditAction: React.FC<DeductAndCreditActionProps> = ({
  userId,
  deductAmount,
  creditAmount,
  newPlan,
  onSuccess,
  onError,
  buttonText = "Confirm Transaction",
  disabled = false,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { data, refetch } = useAuthHook();
  const navigate = useNavigate();

  const handleTransaction = async () => {
    // Basic validation
    if (deductAmount <= 0) {
      setStatus("error");
      setMessage("Deduct amount must be greater than 0");
      onError?.("Deduct amount must be greater than 0");
      return;
    }
    if (creditAmount < 0) {
      setStatus("error");
      setMessage("Credit amount cannot be negative");
      onError?.("Credit amount cannot be negative");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch(
        `https://vps-backend-server-beta.vercel.app/api/user/getall/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deductAmount,
            creditAmount,
            ...(newPlan !== undefined && { newPlan }),
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Transaction failed");
      }

      setStatus("success");
      setMessage(data.message || "Transaction successful!");

      onSuccess?.({
        newBalance: data.newBalance,
        newSalesCredit: data.newSalesCredit,
        subscribedPlan: data.subscribedPlan,
      });
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong");
      onError?.(err.message);
    } finally {
      setLoading(false);

      // 5 সেকেন্ড পর মেসেজ ক্লিয়ার
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    }
  };

  return (
    <div className="space-y-4">
  {/* Premium Button */}
  <Button
    onClick={handleTransaction}
    disabled={loading || disabled || deductAmount <= 0}
    className={`
      relative w-full overflow-hidden rounded-xl px-6 py-4 text-base font-semibold
      shadow-lg transition-all duration-300 transform
      ${
        loading || disabled || deductAmount <= 0
          ? "cursor-not-allowed bg-gray-400 text-gray-200"
          : "hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
      }
      bg-gradient-to-r from-[#0A1A3A] to-[#1e3a6d]
      text-white border-0
    `}
  >
    {/* Optional shiny effect */}
    <span className="absolute inset-0 bg-[#d4a643] text-white" />

    <span className="relative flex items-center justify-center gap-3 text-white">
      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children || buttonText}
    </span>
  </Button>

  {/* Status Message - Enhanced */}
  {status !== "idle" && (
    <div
      className={`
        relative overflow-hidden rounded-xl px-5 py-4 text-sm font-medium
        shadow-md border backdrop-blur-sm transition-all duration-500
        flex items-center gap-3
        ${
          status === "success"
            ? "bg-[#d4a643] text-green-800"
            : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800"
        }
      `}
    >
      {/* Subtle glow effect for success */}
      {status === "success" && (
        <div className="absolute inset-0 bg-green-400 opacity-5 animate-pulse" />
      )}

      {/* Icon */}
      {status === "success" ? (
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
      )}

      {/* Message */}
      <span className="relative">{message}</span>

      {/* Optional small accent line */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-1
          ${status === "success" ? "bg-green-500" : "bg-red-500"}
        `}
      />
    </div>
  )}
</div>
  );
};

export default DeductAndCreditAction;
