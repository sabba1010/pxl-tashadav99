import React, { useState } from 'react';
import { CreditCard, FileText, PlusCircle, CheckSquare, Search, X, Lock, Store } from 'lucide-react';

// Make sure these paths match where your files are located
import TestPayment from "../TestPayment"; 
import KoraPayment from "../Payment/KoraPayment"; 

const SellerPay = () => {
  // State for Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  // Fixed amount for Seller Activation
  const activationFee = 15;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-4 md:p-8 relative">
      
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start mb-8 md:mb-12">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Activate Seller Account</h1>
          <p className="text-gray-500 mt-2 text-sm">Pay the one-time fee to upgrade your account to Seller status.</p>
        </div>

        {/* Stepper Section */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end mt-6 lg:mt-0 overflow-x-auto">
          <div className="flex items-center min-w-max">
            {/* Step 1: Activation Fee (Active) */}
            <div className="flex flex-col items-center relative z-10 px-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-500 text-orange-500 mb-2">
                <FileText size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="text-[10px] md:text-xs text-orange-500 font-medium whitespace-nowrap">Activation Fee</span>
            </div>
            <div className="hidden sm:block w-8 md:w-16 h-[2px] bg-orange-200 -mt-6 mx-1"></div>

            {/* Step 2: Add Details */}
            <div className="flex flex-col items-center relative z-10 px-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 text-gray-400 mb-2">
                <PlusCircle size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap">Store Details</span>
            </div>
            <div className="hidden sm:block w-8 md:w-16 h-[2px] bg-gray-200 -mt-6 mx-1"></div>

            {/* Step 3: Verification */}
            <div className="flex flex-col items-center relative z-10 px-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 text-gray-400 mb-2">
                <CheckSquare size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap">Verification</span>
            </div>
            <div className="hidden sm:block w-8 md:w-16 h-[2px] bg-gray-200 -mt-6 mx-1"></div>

            {/* Step 4: Live */}
            <div className="flex flex-col items-center relative z-10 px-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 text-gray-400 mb-2">
                <Store size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap">Go Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-5 md:p-10 min-h-[400px] flex flex-col items-center z-0">
        
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 text-center">
            Merchant Activation Fee
        </h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
            Unlock exclusive seller features and start selling today by paying the one-time activation fee.
        </p>

        <div className="w-full max-w-2xl space-y-4">
          <div className="flex items-start p-4 md:p-5 border rounded-lg bg-orange-50 border-orange-500 ring-1 ring-orange-500 transition-all">
            <div className="mt-1 mr-3 md:mr-4 text-orange-600 flex-shrink-0">
               <Store className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Seller Membership</h3>
              <p className="text-xs md:text-sm text-gray-600 mt-1">One-time payment for lifetime merchant access.</p>
            </div>
            <div className="ml-2 text-orange-600 font-bold text-lg">${activationFee}</div>
          </div>
        </div>

        {/* INITIAL PAY BUTTON */}
        <div className="mt-8 md:mt-10 w-full max-w-2xl">
            <button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-12 rounded shadow-lg hover:shadow-xl transition-all w-full text-sm md:text-base transform active:scale-95"
            >
                Pay Activation Fee (${activationFee})
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">
                Secure payment processing. No hidden charges.
            </p>
        </div>
      </div>

      {/* ================= PAYMENT MODAL ================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn relative">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 md:p-6 flex justify-between items-center text-white">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Lock size={18} /> Upgrade to Seller
                </h3>
                <p className="text-xs text-orange-100 mt-1">Completing payment verifies your account</p>
              </div>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/20 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Payment Options */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="text-center mb-6">
                 <p className="text-sm text-gray-500">Total Amount</p>
                 <h2 className="text-3xl font-bold text-gray-900">${activationFee}.00</h2>
              </div>

              <p className="text-sm font-medium text-gray-700 mb-2">Select Payment Method:</p>
              
              <div className="space-y-4">
                 {/* Note: Backend Logic Required
                    পেমেন্ট সফল হওয়ার পর আপনার ব্যাকএন্ডে ইউজার রোল 
                    'user' থেকে 'seller' এ আপডেট করার লজিক থাকতে হবে।
                 */}
                 
                 {/* Flutterwave / Test */}
                 <TestPayment amount={activationFee} />

                 {/* Kora Payment */}
                 <div className="w-full">
                    <KoraPayment amount={activationFee} />
                 </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                <p className="text-xs text-gray-400">
                    After payment, your account will be automatically upgraded.
                </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPay;