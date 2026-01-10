import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, HelpCircle, CheckCircle, MessageSquare } from "lucide-react";

const BuyerGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pt-12 sm:pt-20 pb-16 sm:pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-[#063970] to-[#022042] px-6 py-8 sm:px-10 sm:py-12 text-white">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Welcome to AcctEmpire</h1>
            <p className="text-xl sm:text-2xl font-semibold mt-2">Buyer Guide</p>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg opacity-90">
              This guide helps buyers understand how to safely purchase, verify accounts, and communicate with sellers.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              Welcome! Please follow these guidelines to get a smooth buying experience on AcctEmpire.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              1. Before You Buy
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>Read the listing description and preview carefully.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>Check seller reputation and reviews.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>Ask the seller questions via chat before purchase if unsure.</span>
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              2. Secure Payment & Delivery
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li>• Use platform payment methods only.</li>
                <li>• Do not share external contact details.</li>
                <li>• Verify delivery details before confirming.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
              3. Verifying Accounts
            </h2>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 sm:p-6">
              <p className="text-gray-800 mb-4 text-sm sm:text-base">When you receive an account:</p>
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li>• Use the provided preview link to inspect the account.</li>
                <li>• Test login immediately and check required details.</li>
                <li>• If codes are required, request them via chat.</li>
              </ul>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              4. Communication & Disputes
            </h2>
            <ul className="space-y-4 text-gray-700 text-sm sm:text-base">
              <li>• Keep all communication inside AcctEmpire.</li>
              <li>• If the item doesn't match the listing, open a dispute.</li>
              <li>• Be polite; provide clear evidence if reporting an issue.</li>
            </ul>
          </section>

          <div className="bg-gradient-to-r from-[#063970] to-[#022042] rounded-3xl shadow-2xl p-8 sm:p-12 text-white text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Final Tips</h2>
            <p className="text-lg sm:text-xl mb-4">Always verify listings and use chat to clarify any doubts.</p>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerGuide;
