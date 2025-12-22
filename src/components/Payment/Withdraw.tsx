import React, { useState } from 'react';

const WithdrawForm = () => {
  const [paymentMethod, setPaymentMethod] = useState<'kora' | 'flutterwave'>('kora');

  const [formData, setFormData] = useState({
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
  const [message, setMessage] = useState('');
  const [submitStatus, setSubmitStatus] =
    useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value as 'kora' | 'flutterwave');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus('pending');
    setMessage('');

    try {
      const response = await fetch('http://localhost:3200/withdraw/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          ...formData,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setMessage('Withdraw request submitted successfully. Status: Pending ⏳');

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
        setSubmitStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } catch {
      setSubmitStatus('error');
      setMessage('Network error. Please check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 bg-white rounded-2xl shadow-2xl mt-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Withdraw Funds
      </h2>

      <form onSubmit={handleSubmit} className="space-y-7">

        {/* Payment Gateway */}
        <div>
          <label className="block text-lg font-semibold mb-2">
            Payment Gateway <span className="text-red-500">*</span>
          </label>
          <select
            value={paymentMethod}
            onChange={handleMethodChange}
            className="w-full px-5 py-4 border-2 rounded-xl"
            required
          >
            <option value="kora">Kora (Korapay)</option>
            <option value="flutterwave">Flutterwave</option>
          </select>
        </div>

        {/* Amount & Currency */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="number"
            name="amount"
            placeholder="Withdraw Amount"
            value={formData.amount}
            onChange={handleChange}
            className="px-5 py-4 border-2 rounded-xl"
            required
          />

          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="px-5 py-4 border-2 rounded-xl"
          >
            <option value="NGN">NGN – Nigerian Naira</option>
            <option value="GHS">GHS – Ghanaian Cedi</option>
            <option value="KES">KES – Kenyan Shilling</option>
            <option value="USD">USD – US Dollar</option>
          </select>
        </div>

        {/* Bank Details */}
        <input
          type="text"
          name="accountNumber"
          placeholder="Bank Account Number"
          value={formData.accountNumber}
          onChange={handleChange}
          className="w-full px-5 py-4 border-2 rounded-xl"
          required
        />

        <input
          type="text"
          name="bankCode"
          placeholder="Bank Code or Bank Name"
          value={formData.bankCode}
          onChange={handleChange}
          className="w-full px-5 py-4 border-2 rounded-xl"
          required
        />

        {paymentMethod === 'flutterwave' && (
          <input
            type="text"
            name="fullName"
            placeholder="Account Holder Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-5 py-4 border-2 rounded-xl"
            required
          />
        )}

        {/* Contact */}
        <input
          type="text"
          name="phoneNumber"
          placeholder="e.g. +2348012345678"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full px-5 py-4 border-2 rounded-xl"
        />

        <input
          type="email"
          name="email"
          placeholder="Email address (optional)"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-5 py-4 border-2 rounded-xl"
        />

        <textarea
          name="note"
          placeholder="Additional note (optional)"
          value={formData.note}
          onChange={handleChange}
          rows={4}
          className="w-full px-5 py-4 border-2 rounded-xl"
        />

        <button
          disabled={loading}
          className="w-full py-5 bg-blue-600 text-white text-xl font-bold rounded-xl"
        >
          {loading ? 'Submitting...' : 'Submit Withdraw Request'}
        </button>

        {message && (
          <div className="mt-6 text-center font-semibold">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default WithdrawForm;
