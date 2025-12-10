// Payment.tsx
import React, { useState } from 'react';
import axios from 'axios';
import KoraPayment from './KoraPayment';

const Payment: React.FC = () => {
  // ── Step management & amount ─────────────────────
  const [step, setStep] = useState<'amount' | 'methods'>('amount');
  const [amount, setAmount] = useState<string>('');          // user input (string)
  const [finalAmount, setFinalAmount] = useState<number>(0); // parsed number for payment

  // ── Go to payment methods ────────────────────────
  const handleNext = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setFinalAmount(num);
    setStep('methods');
  };

  // ── Flutterwave payment ──────────────────────────
  const handleFlutterwavePayment = async () => {
    const paymentData = {
      name: 'Rubel Mia',
      email: 'test@gmail.com',
      amount: finalAmount,               // dynamic amount
    };

    try {
      const res = await axios.post<{ link: string }>(
        'http://localhost:3200/flutterwave/create',
        paymentData
      );
      // Redirect to Flutterwave checkout
      window.location.href = res.data.link;
    } catch (err) {
      console.error('Flutterwave Error:', err);
      alert('Payment could not be initiated');
    }
  };

  // ── UI ───────────────────────────────────────────
  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '50px auto',
        padding: '30px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2>Checkout</h2>

      {/* ───── Step 1: Enter Amount ───── */}
      {step === 'amount' && (
        <div>
          <p>Enter the amount you want to pay</p>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="e.g. 50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              padding: '12px',
              width: '100%',
              fontSize: '18px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
          <br />
          <button
            onClick={handleNext}
            style={{
              padding: '12px 32px',
              backgroundColor: '#1E88E5',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* ───── Step 2: Payment Methods ───── */}
      {step === 'methods' && (
        <div>
          <h3>
            Amount to pay: <strong>${finalAmount.toFixed(2)}</strong>
          </h3>
          <p>Choose a payment method</p>

          {/* Flutterwave Button */}
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleFlutterwavePayment}
              style={{
                padding: '14px 30px',
                backgroundColor: '#F5A623',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                width: '100%',
              }}
            >
              Pay with Flutterwave
            </button>
          </div>

          {/* Kora Payment Component – pass amount as prop */}
          <KoraPayment amount={finalAmount} />

          {/* Optional: back button */}
          <button
            onClick={() => setStep('amount')}
            style={{
              marginTop: '20px',
              background: 'transparent',
              border: '1px solid #666',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            ← Change Amount
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;