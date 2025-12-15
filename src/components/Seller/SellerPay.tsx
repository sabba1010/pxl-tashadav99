import React, { useState } from 'react';
import { CreditCard, Bitcoin, Wallet, FileText, PlusCircle, CheckSquare, Search } from 'lucide-react';

const SellerPay = () => {
  const [selectedMethod, setSelectedMethod] = useState('bank');

  return (
    // Container: Mobile e padding kom (p-4), Desktop e beshi (md:p-8)
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 p-4 md:p-8">
      
      {/* Header Section */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start mb-8 md:mb-12">
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Become a merchant</h1>
          <p className="text-gray-500 mt-2 text-sm">A one-time payment is required to complete your merchant registration.</p>
        </div>

        {/* Stepper Section */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end mt-6 lg:mt-0 overflow-x-auto">
          <div className="flex items-center min-w-max">
            
            {/* Step 1: Make Payment (Active) */}
            <div className="flex flex-col items-center relative z-10 px-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-500 text-orange-500 mb-2 transition-all">
                <FileText size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="text-[10px] md:text-xs text-orange-500 font-medium whitespace-nowrap">Make Payment</span>
            </div>
            
            {/* Connector Line (Hidden on very small screens, visible on md+) */}
            <div className="hidden sm:block w-8 md:w-16 h-[2px] bg-orange-200 -mt-6 mx-1"></div>

            {/* Step 2: Add account */}
            <div className="flex flex-col items-center relative z-10 px-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 text-gray-400 mb-2 transition-all">
                <PlusCircle size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap">Add account</span>
            </div>

            {/* Connector Line */}
            <div className="hidden sm:block w-8 md:w-16 h-[2px] bg-gray-200 -mt-6 mx-1"></div>

            {/* Step 3: Credentials */}
            <div className="flex flex-col items-center relative z-10 px-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 text-gray-400 mb-2 transition-all">
                <CheckSquare size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap">Credentials</span>
            </div>

            {/* Connector Line */}
            <div className="hidden sm:block w-8 md:w-16 h-[2px] bg-gray-200 -mt-6 mx-1"></div>

            {/* Step 4: Review */}
            <div className="flex flex-col items-center relative z-10 px-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 text-gray-400 mb-2 transition-all">
                <Search size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap">Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-5 md:p-10 min-h-[400px] md:min-h-[500px] flex flex-col items-center">
        
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 md:mb-10 text-center">Make A One Time Payment</h2>

        <div className="w-full max-w-2xl space-y-4">
          
          {/* Option 1: Bank / Card */}
          <div 
            onClick={() => setSelectedMethod('bank')}
            className={`flex items-start p-4 md:p-5 border rounded-lg cursor-pointer transition-all ${
              selectedMethod === 'bank' 
                ? 'border-orange-500 ring-1 ring-orange-500 bg-white' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="mt-1 mr-3 md:mr-4 text-gray-600 flex-shrink-0">
               <CreditCard className={`${selectedMethod === 'bank' ? 'text-orange-500' : 'text-gray-500'} w-5 h-5 md:w-6 md:h-6`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Bank / Card payment</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Make deposit using either your card or transfer to our local bank</p>
            </div>
            {selectedMethod === 'bank' && (
                <div className="ml-2 text-orange-500 font-bold hidden sm:block">↓</div>
            )}
          </div>

          {/* Option 2: Crypto */}
          <div 
            onClick={() => setSelectedMethod('crypto')}
            className={`flex items-start p-4 md:p-5 border rounded-lg cursor-pointer transition-all ${
              selectedMethod === 'crypto' 
                ? 'border-orange-500 ring-1 ring-orange-500 bg-white' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="mt-1 mr-3 md:mr-4 text-gray-600 flex-shrink-0">
               <Bitcoin className={`${selectedMethod === 'crypto' ? 'text-orange-500' : 'text-gray-500'} w-5 h-5 md:w-6 md:h-6`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">Crypto Deposit</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Fund your wallet with popular cryptocurrencies like USDT, ETH, BNB, SOL and more.</p>
            </div>
          </div>

          {/* Option 3: Wallet */}
          <div 
            onClick={() => setSelectedMethod('wallet')}
            className={`flex items-start p-4 md:p-5 border rounded-lg cursor-pointer transition-all ${
              selectedMethod === 'wallet' 
                ? 'border-orange-500 ring-1 ring-orange-500 bg-white' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="mt-1 mr-3 md:mr-4 text-gray-600 flex-shrink-0">
               <Wallet className={`${selectedMethod === 'wallet' ? 'text-orange-500' : 'text-gray-500'} w-5 h-5 md:w-6 md:h-6`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">AcctEmpire Wallet</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Make payment using your Acctbazaar account Balance</p>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <button className="mt-8 md:mt-10 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-12 rounded shadow-md transition-colors w-full md:w-auto text-sm md:text-base">
          Pay $15
        </button>

      </div>
    </div>
  );
};

export default SellerPay;