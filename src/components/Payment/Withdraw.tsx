import React, { useState, ChangeEvent, FormEvent } from "react";
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
}

const WithdrawForm: React.FC = () => {
  const { user, setUser } = useAuth();
  const { refetch, data } = useAuthHook();

  const [paymentMethod, setPaymentMethod] = useState<"kora" | "flutterwave">(
    "kora"
  );
  const [formData, setFormData] = useState<WithdrawFormData>({
    amount: "",
    currency: "USD", // 👈 Default USD করে দেওয়া হয়েছে
    accountNumber: "",
    bankCode: "",
    fullName: "",
    phoneNumber: "",
    email: data?.email || "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  }>({ text: "", type: "success" });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value as "kora" | "flutterwave");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const amountNum = Number(formData.amount);
    const MAX_WITHDRAW_LIMIT = 100; // 🛑 $100 Limit

    // Validation: Empty or Zero
    if (!amountNum || amountNum <= 0) {
      setMessage({ text: "Amount must be greater than 0", type: "error" });
      return;
    }

    // 🛑 Validation: $100 Limit Check
    if (amountNum > MAX_WITHDRAW_LIMIT) {
      toast.error(`Maximum withdrawal limit is $${MAX_WITHDRAW_LIMIT}`);
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
            className="w-full px-6 py-5 rounded-xl bg-white/10 border border-white/20 text-white text-lg focus:ring-4 focus:ring-[#D4A017] outline-none"
            required
          >
            <option value="kora">Kora (Korapay) - Recommended</option>
            <option value="flutterwave">Flutterwave</option>
          </select>
        </div>

        {/* Amount & Currency */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xl font-bold text-[#0A1D37] mb-3 flex items-center gap-3">
              <MoneyBillIcon size={28} /> Amount (Limit: $100)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              max="100"
              className="w-full px-6 py-5 border-2 border-gray-200 rounded-xl focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/20 text-2xl font-bold transition"
              required
              min="1"
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
              {/* <option value="NGN">NGN – Nigerian Naira</option> */}
            </select>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
          <h3 className="text-2xl font-bold text-[#0A1D37] mb-6 flex items-center gap-3">
            <UniversityIcon size={30} /> Bank Account Details
          </h3>
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

        <p className="text-center text-sm text-gray-500 mt-8 uppercase tracking-wider font-medium">
          Approval required • Limit: $100 per request
        </p>
      </form>
    </div>
  );
};

export default WithdrawForm;