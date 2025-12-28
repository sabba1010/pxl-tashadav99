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
        `http://localhost:3200/api/user/getall/${userId}`,
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
    <div className="space-y-3">
      <Button
        onClick={handleTransaction}
        disabled={loading || disabled || deductAmount <= 0}
        className="w-full"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children || buttonText}
      </Button>

      {status !== "idle" && (
        <div
          className={`flex items-center gap-2 rounded-md p-3 text-sm font-medium ${
            status === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default DeductAndCreditAction;
