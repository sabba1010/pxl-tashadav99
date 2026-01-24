import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaUniversity,
  FaStickyNote,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { useAuthHook } from "../../hook/useAuthHook";

// react-icons v5+ TypeScript fix
const CreditCardIcon = FaCreditCard as React.ElementType;
const MoneyBillIcon = FaMoneyBillWave as React.ElementType;
const UniversityIcon = FaUniversity as React.ElementType;
const StickyNoteIcon = FaStickyNote as React.ElementType;

interface WithdrawFormData {
  amount: string;
  currency: string;
  accountNumber: string;
  bankCode: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  note: string;
  bankName: string;
}

const WithdrawForm: React.FC = () => {
  const { user, setUser } = useAuth();
  const { data } = useAuthHook();

  const [paymentMethod, setPaymentMethod] = useState<"kora" | "flutterwave" | "localbank">(
    "kora"
  );
  const [formData, setFormData] = useState<WithdrawFormData>({
    amount: "",
    currency: "USD", // 👈 Default USD
    accountNumber: "",
    bankCode: "",
    fullName: "",
    phoneNumber: "",
    email: data?.email || "",
    note: "",
    bankName: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  }>({ text: "", type: "success" });
  const [savedBankAccount, setSavedBankAccount] = useState<any>(null);

  // Load saved bank account details on component mount
  useEffect(() => {
    const fetchSavedBankAccount = async () => {
      if (!data?._id) return;
      
      try {
        const response = await fetch(`http://localhost:3200/api/user/get-bank-account/${data._id}`);
        const result = await response.json();
        
        if (result.success && result.bankDetails) {
          setSavedBankAccount(result.bankDetails);
        }
      } catch (error) {
        console.error("Error fetching saved bank account:", error);
      }
    };

    fetchSavedBankAccount();
  }, [data?._id]);

  // Pre-fill form when paymentMethod changes to "localbank" and savedBankAccount exists
  useEffect(() => {
    if (paymentMethod === "localbank" && savedBankAccount) {
      setFormData(prev => ({
        ...prev,
        accountNumber: savedBankAccount.accountNumber || "",
        bankCode: savedBankAccount.bankCode || "",
        fullName: savedBankAccount.fullName || "",
        bankName: savedBankAccount.bankName || "",
        phoneNumber: savedBankAccount.phoneNumber || "",
      }));
    }
  }, [paymentMethod, savedBankAccount]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value as "kora" | "flutterwave" | "localbank");
  };

  // Save bank account details to user profile
  const handleSaveBankAccount = async () => {
    if (!data?._id) {
      toast.error("Please login first");
      return;
    }

    if (!formData.accountNumber || !formData.bankCode || !formData.fullName || !formData.bankName) {
      toast.error("Please fill all bank details");
      return;
    }

    try {
      const response = await fetch("http://localhost:3200/api/user/save-bank-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data._id,
          accountNumber: formData.accountNumber,
          bankCode: formData.bankCode,
          fullName: formData.fullName,
          bankName: formData.bankName,
          phoneNumber: formData.phoneNumber,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSavedBankAccount(result.bankDetails);
        toast.success("Bank account saved successfully!");
      } else {
        toast.error(result.message || "Failed to save bank account");
      }
    } catch (error) {
      console.error("Error saving bank account:", error);
      toast.error("Error saving bank account");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const amountNum = Number(formData.amount);
    const MIN_WITHDRAW_LIMIT = 5; // 🟢 Set minimum to $5
    const MAX_WITHDRAW_LIMIT = 1000; // 🛑 Set maximum to $100

    // 🟢 Validation: Minimum $5 Check
    if (!amountNum || amountNum < MIN_WITHDRAW_LIMIT) {
      const minErrMsg = `Minimum withdrawal amount is $${MIN_WITHDRAW_LIMIT}`;
      toast.error(minErrMsg);
      setMessage({ text: minErrMsg, type: "error" });
      return;
    }

    // 🛑 Validation: Max Limit Check
    if (amountNum > MAX_WITHDRAW_LIMIT) {
      const maxErrMsg = `Maximum withdrawal limit is $${MAX_WITHDRAW_LIMIT}`;
      toast.error(maxErrMsg);
      setMessage({
        text: `Error: You cannot withdraw more than $${MAX_WITHDRAW_LIMIT} USD`,
        type: "error",
      });
      return;
    }

    if (!formData.accountNumber || !formData.bankCode || !formData.fullName) {
      setMessage({ text: "Bank account details are required", type: "error" });
      return;
    }

    if (!data?._id) {
      toast.error("Please login first");
      return;
    }

    // Balance Check
    const currentBalance = (data as any).balance || 0;

    if (currentBalance < amountNum) {
      toast.error("Insufficient Balance!");
      setMessage({
        text: `Insufficient Balance! You have $${currentBalance}`,
        type: "error",
      });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "success" });

    try {
      const requestBody = {
        userId: data._id,
        paymentMethod,
        amount: amountNum,
        currency: formData.currency,
        accountNumber: formData.accountNumber,
        bankCode: formData.bankCode,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber || null,
        email: formData.email || null,
        note: formData.note || null,
        bankName: formData.bankName || null,
      };

      const withdrawResponse = await fetch(
        "http://localhost:3200/withdraw/post",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const withdrawData = await withdrawResponse.json();

      if (withdrawResponse.ok) {
        // Visual Balance Update
        const newBalance = currentBalance - amountNum;

        if (setUser) {
          setUser({ ...user, balance: newBalance } as any);
        }

        // Save bank account for local bank method
        if (paymentMethod === "localbank" && formData.bankName) {
          try {
            await fetch("http://localhost:3200/api/user/save-bank-account", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: data._id,
                accountNumber: formData.accountNumber,
                bankCode: formData.bankCode,
                fullName: formData.fullName,
                bankName: formData.bankName,
                phoneNumber: formData.phoneNumber,
              }),
            });
          } catch (error) {
            console.error("Error saving bank account after withdrawal:", error);
          }
        }

        toast.success(`Request submitted! $${amountNum} deducted.`);
        setMessage({
          text: `Success! $${amountNum} deducted. New Balance: $${newBalance}`,
          type: "success",
        });

        // Reset Form
        setFormData({
          amount: "",
          currency: "USD",
          accountNumber: "",
          bankCode: "",
          fullName: "",
          phoneNumber: "",
          email: data?.email || "",
          note: "",
          bankName: "",
        });
      } else {
        const errorMsg = withdrawData.message || "Request failed";
        toast.error(errorMsg);
        setMessage({ text: errorMsg, type: "error" });
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      toast.error("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl mt-10 border border-gray-100">
      <h2 className="text-4xl font-black text-center mb-10 text-[#0A1D37]">
        Withdraw <span className="text-[#D4A017]">Funds</span>
      </h2>

      {message.text && (
        <div
          className={`mb-8 p-6 rounded-2xl text-center font-bold text-lg shadow-md ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border-2 border-green-200"
              : "bg-red-50 text-red-700 border-2 border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Payment Gateway */}
        <div className="bg-[#0A1D37] p-8 rounded-2xl text-white">
          <label className="block text-xl font-bold mb-4 flex items-center gap-3">
            <CreditCardIcon size={28} /> Payment Gateway
          </label>
          <select
            value={paymentMethod}
            onChange={handleMethodChange}
            className="w-full px-6 py-5 rounded-xl bg-white/10 border border-white/20 text-[#d4a643] text-lg focus:ring-4 focus:ring-[#D4A017] outline-none"
            required
          >
            <option value="kora">Kora (Korapay) - Recommended</option>
            <option value="flutterwave">Flutterwave</option>
            <option value="localbank">Local Bank Account</option>
          </select>
        </div>

        {/* Amount & Currency */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xl font-bold text-[#0A1D37] mb-3 flex items-center gap-3">
              <MoneyBillIcon size={28} /> Amount (Min: $5)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-6 py-5 border-2 border-gray-200 rounded-xl focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20 text-2xl font-bold transition"
              required
              min="5"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-xl font-bold text-[#0A1D37] mb-3">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-6 py-5 border-2 border-gray-200 rounded-xl focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20 text-lg transition"
            >
              <option value="USD">USD – US Dollar</option>
            </select>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
          <h3 className="text-2xl font-bold text-[#0A1D37] mb-6 flex items-center gap-3">
            <UniversityIcon size={30} /> Bank Account Details
          </h3>

          {/* Display saved bank account if local bank is selected */}
          {paymentMethod === "localbank" && savedBankAccount && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-semibold mb-3">✓ Using your saved bank account</p>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-600">Account Holder</p>
                  <p className="font-semibold text-gray-800">{savedBankAccount.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Bank Name</p>
                  <p className="font-semibold text-gray-800">{savedBankAccount.bankName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Account Number</p>
                  <p className="font-semibold text-gray-800 truncate">{savedBankAccount.accountNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Bank Code</p>
                  <p className="font-semibold text-gray-800">{savedBankAccount.bankCode}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">Account Number *</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="e.g. 0123456789"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#D4A017] transition"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Bank Code *</label>
              <input
                type="text"
                name="bankCode"
                value={formData.bankCode}
                onChange={handleChange}
                placeholder="e.g. 044"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#D4A017] transition"
                required
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block font-medium mb-2">
              Account Holder Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Sabba Hossain"
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#D4A017] transition"
              required
            />
          </div>

          {paymentMethod === "localbank" && (
            <div className="mt-6">
              <label className="block font-medium mb-2">Bank Name *</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="e.g. First Bank of Nigeria"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-[#D4A017] transition"
                required={paymentMethod === "localbank"}
              />
              
              <button
                type="button"
                onClick={handleSaveBankAccount}
                className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] active:scale-98"
              >
                💾 Save Bank Account for Future
              </button>
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="+880..."
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#D4A017] transition"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-[#D4A017] transition"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xl font-bold text-[#0A1D37] mb-3 flex items-center gap-3">
            <StickyNoteIcon size={28} /> Note (Optional)
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={4}
            placeholder="Any message for admin..."
            className="w-full px-6 py-5 border-2 border-gray-200 rounded-xl focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20 resize-none transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-6 text-white text-2xl font-black rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-98 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-[#0A1D37] to-[#1a3a63] hover:from-[#D4A017] hover:to-[#f0b90b] hover:text-[#0A1D37]"
          }`}
        >
          {loading ? "Processing..." : "SUBMIT WITHDRAWAL REQUEST"}
        </button>
      </form>
    </div>
  );
};

export default WithdrawForm;