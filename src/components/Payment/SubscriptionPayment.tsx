// components/DeductAndCreditAction.tsx

import React, { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const MySwal = Swal; // Allows <></> inside html if needed

interface DeductAndCreditActionProps {
  userId: string;
  deductAmount: number;
  creditAmount: number;
  newPlan?: string;
  onSuccess?: (data: {
    newBalance: number;
    newSalesCredit: number;
    subscribedPlan?: string;
  }) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  disabled?: boolean;
  children?: React.ReactNode;
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
  const naigate = useNavigate();

  const handleTransaction = async () => {
    // Validation before showing alert
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

    // SweetAlert2 Confirmation
    const result = await MySwal.fire({
      title: "Confirm Transaction",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#d4a643",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm Purchase",
    });

    // If user cancels → stop here
    if (!result.isConfirmed) {
      return;
    }

    // Proceed with transaction
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch(
        `https://tasha-vps-backend-2.onrender.com/api/user/getall/${userId}`,
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
      setMessage(data.message || "Transaction completed successfully!");

      // Success callback
      onSuccess?.({
        newBalance: data.newBalance,
        newSalesCredit: data.newSalesCredit,
        subscribedPlan: data.subscribedPlan,
      });

      // Optional: Show success toast
      MySwal.fire({
        icon: "success",
        title: "Success!",
        text: "Balance deducted and sales credit added.",
        timer: 3000,
        showConfirmButton: false,
      });
      naigate("/selling-form");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Transaction failed");
      onError?.(err.message);

      // Optional: Show error alert
      MySwal.fire({
        icon: "error",
        title: "Failed",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);

      // Auto-clear status message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3200);
    }
  };

  return (
    <div className="space-y-4">
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
          bg-gradient-to-r from-[#0A1A3A] to-[#1e3a6d] text-white border-0
        `}
      >
        <span className="relative flex items-center justify-center gap-3 text-white">
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {children || buttonText}
        </span>
      </Button>

      {/* Status Message */}
      {status !== "idle" && (
        <div
          className={`
            relative overflow-hidden rounded-xl px-5 py-4 text-sm font-medium
            shadow-md border backdrop-blur-sm transition-all duration-500
            flex items-center gap-3
            ${
              status === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }
          `}
        >
          {status === "success" ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span className="relative">{message}</span>
          <div
            className={`absolute left-0 top-0 bottom-0 w-1 ${
              status === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default DeductAndCreditAction;
