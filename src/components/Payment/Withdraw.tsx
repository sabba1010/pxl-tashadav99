import React, { useState, ChangeEvent, FormEvent } from 'react';

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

const WithdrawForm = () => {
  const [paymentMethod, setPaymentMethod] = useState<'kora' | 'flutterwave'>('kora');

  const [formData, setFormData] = useState<WithdrawFormData>({
    amount: '',
    currency: 'NGN',
    accountNumber: '',
    bankCode: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value as 'kora' | 'flutterwave');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.amount || Number(formData.amount) <= 0) {
      setMessage({ text: 'Amount must be greater than 0', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // TODO: Get the real logged-in User ID from your Auth Context or LocalStorage
      // Example: const user = JSON.parse(localStorage.getItem('user'));
      // const currentUserId = user._id; 
      const currentUserId = "64f8a5f3e4b0a1a2b3c4d5e6"; // Testing ID (Replace with Real Logic)

      const requestBody = {
          userId: currentUserId, // [FIX] This field was missing causing 400 Error
          paymentMethod,
          ...formData,
          // Backend might handle createdAt, but sending it is fine if schema allows
          status: 'pending',
          createdAt: new Date().toISOString(),
      };

      const response = await fetch('http://localhost:3200/withdraw/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Withdraw request submitted successfully! 🚀', type: 'success' });

        setFormData({
          amount: '',
          currency: 'NGN',
          accountNumber: '',
          bankCode: '',
          fullName: '',
          phoneNumber: '',
          email: '',
          note: ''
        });
        setPaymentMethod('kora');
      } else {
        // Now you will see the exact error message from backend (e.g., "userId is required")
        setMessage({ text: data.message || 'Submission failed.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Server connection failed. Is the backend running?', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 bg-white rounded-2xl shadow-xl mt-10 border border-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Withdraw Funds
      </h2>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Gateway */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Payment Gateway <span className="text-red-500">*</span>
          </label>
          <select
            value={paymentMethod}
            onChange={handleMethodChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="kora">Kora (Korapay)</option>
            <option value="flutterwave">Flutterwave</option>
          </select>
        </div>

        {/* Amount & Currency */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="NGN">NGN – Nigerian Naira</option>
              <option value="GHS">GHS – Ghanaian Cedi</option>
              <option value="KES">KES – Kenyan Shilling</option>
              <option value="USD">USD – US Dollar</option>
            </select>
          </div>
        </div>

        {/* Bank Details */}
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                <input
                type="text"
                name="accountNumber"
                placeholder="1234567890"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                required
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Code</label>
                <input
                type="text"
                name="bankCode"
                placeholder="e.g. 044"
                value={formData.bankCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                required
                />
            </div>
        </div>

        {/* Name (Conditional/Optional based on logic, but keeping visible for safety) */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Account Holder Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              required
            />
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="+234..."
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
            </div>
            <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="user@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                />
            </div>
        </div>

        {/* Note */}
        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">Note (Optional)</label>
            <textarea
            name="note"
            placeholder="Reason..."
            value={formData.note}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          className={`w-full py-4 text-white text-lg font-bold rounded-lg transition duration-200 
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'}`}
        >
          {loading ? 'Processing...' : 'Submit Withdraw Request'}
        </button>
      </form>
    </div>
  );
};

export default WithdrawForm;