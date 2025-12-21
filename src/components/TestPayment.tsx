import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { FlutterwaveConfig } from 'flutterwave-react-v3/dist/types';
import React, { useState } from 'react';

const TestPayment: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const config: FlutterwaveConfig = {
    public_key: 'FLWPUBK_TEST-2de87089e34448fe528b45106c0d7ceb-X', // তোমার Flutterwave TEST public key দিয়ে রাখো (FLWPUBK_TEST-...)
    tx_ref: `test-tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    amount: 500, // ডিফল্ট টেস্ট অ্যামাউন্ট
    currency: 'NGN',
    payment_options: 'card,ussd,banktransfer,mobilemoney',
    customer: {
      email: 'test@gmail.com',
      phone_number: '08012345678',
      name: 'Test User',
    },
    customizations: {
      title: 'Test Payment',
      description: 'Testing Flutterwave integration',
      logo: 'https://your-logo-url.com/logo.png', // চাইলে খালি রাখতে পারো
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    handleFlutterPayment({
      callback: (response) => {
        console.log('Flutterwave response:', response);

        if (response.status === 'successful') {
          setPaymentStatus(`Success! Transaction ID: ${response.transaction_id}`);

          
          fetch('http://localhost:3200/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transaction_id: response.transaction_id,
              tx_ref: response.tx_ref,
              amount: response.amount,
              currency: response.currency,
              status: response.status,
            }),
          })
            .then((res) => res.json())
            .then((data) => console.log('Verification response:', data))
            .catch((err) => console.error('Verification failed:', err));
        } else {
          setPaymentStatus('Payment failed or cancelled');
        }

        closePaymentModal(); // মোডাল বন্ধ করো
      },
      onClose: () => {
        setPaymentStatus('Payment cancelled by user');
        console.log('Payment modal closed');
      },
    });
  };

  return (
    <div style={{ textAlign: 'center', margin: '40px auto', maxWidth: '400px' }}>
      <h3>Flutterwave Test Payment</h3>
      <p>Amount: ₦500 (Fixed for testing)</p>

      <button
        type="button"
        onClick={handlePayment}
        style={{
          padding: '14px 32px',
          backgroundColor: '#f5a623',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        Pay ₦500 with Flutterwave
      </button>

      {paymentStatus && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: paymentStatus.includes('Success') ? '#d4edda' : '#f8d7da',
            color: paymentStatus.includes('Success') ? '#155724' : '#721c24',
            border: `1px solid ${paymentStatus.includes('Success') ? '#c3e6cb' : '#f5c6cb'}`,
          }}
        >
          <strong>{paymentStatus}</strong>
        </div>
      )}
    </div>
  );
};

export default TestPayment;