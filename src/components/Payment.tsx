import React from 'react';
import axios from 'axios';
import KoraPayment from './KoraPayment';

interface PaymentData {
  name: string;
  email: string;
  amount: number;
}

const Payment: React.FC = () => {
  const handlePayment = async () => {
    const paymentData: PaymentData = {
      name: 'Rubel Mia',
      email: 'test@gmail.com',
      amount: 50
    };

    try {
      // 1️⃣ Create Payment (call backend)
      const res = await axios.post<{ link: string }>('http://localhost:3200/create-payment', paymentData);

      // 2️⃣ Redirect user to Flutterwave checkout
      window.location.href = res.data.link;
    } catch (err) {
      console.error('Payment Error:', err);
      alert('Payment could not be initiated');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Flutterwave Payment</h2>
      <button
        onClick={handlePayment}
        style={{
          padding: '12px 24px',
          backgroundColor: '#1E88E5',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Pay Now
      </button>
      <KoraPayment/>
    </div>
  );
};

export default Payment;