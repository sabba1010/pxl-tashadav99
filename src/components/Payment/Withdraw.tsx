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
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value as 'kora' | 'flutterwave');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSubmitStatus('pending');

    try {
      const response = await fetch('http://localhost:3200/withdraw/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          status: 'pending',  // ডিফল্ট pending
          createdAt: new Date().toISOString(),
          userId: 'current_user_id' // পরে auth থেকে নিবে
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setMessage('উইথড্র রিকোয়েস্ট সফলভাবে জমা হয়েছে! স্ট্যাটাস: Pending ⏳');
        // ফর্ম রিসেট
        setFormData({
          amount: '', currency: 'NGN', accountNumber: '', bankCode: '',
          fullName: '', phoneNumber: '', email: '', note: ''
        });
      } else {
        setSubmitStatus('error');
        setMessage('কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (error) {
      setSubmitStatus('error');
      setMessage('নেটওয়ার্ক সমস্যা। ব্যাকএন্ড চলছে কি না চেক করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8">Withdraw Request</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* তোমার পুরানো ফর্ম ফিল্ডগুলো এখানে (আগের মতোই) */}
        {/* ... (Amount, Account Number, Bank Code, etc.) ... */}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-lg font-bold text-white ${
            loading ? 'bg-yellow-500' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'জমা হচ্ছে... ⏳' : 'Submit Request'}
        </button>

        {message && (
          <div className={`p-5 text-center rounded-lg font-bold text-lg border-4 ${
            submitStatus === 'success' ? 'bg-green-100 text-green-800 border-green-500' :
            submitStatus === 'error' ? 'bg-red-100 text-red-800 border-red-500' :
            'bg-yellow-100 text-yellow-800 border-yellow-500'
          }`}>
            {submitStatus === 'success' && '✅ '}
            {submitStatus === 'pending' && '⏳ '}
            {submitStatus === 'error' && '❌ '}
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default WithdrawForm;