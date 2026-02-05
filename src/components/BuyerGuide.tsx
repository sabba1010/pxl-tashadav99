import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, HelpCircle, CheckCircle, MessageSquare, Wallet, Clock, Shield } from "lucide-react";

const BuyerGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pt-12 sm:pt-20 pb-16 sm:pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-[#063970] to-[#022042] px-6 py-8 sm:px-10 sm:py-12 text-white">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Welcome to AcctEmpire</h1>
            <p className="text-xl sm:text-2xl font-semibold mt-2">Buyer's Complete Guide</p>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg opacity-90">
              Learn how to safely buy accounts, understand delivery types, and navigate the marketplace with confidence.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              Welcome to AcctEmpire! This guide will help you make smart purchases and have a secure buying experience on our platform.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Section 1 - Getting Started */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              1. Getting Started as a Buyer
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span><strong>Create an account</strong> with a valid email and password.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span><strong>Fund your wallet</strong> via Flutterwave or Korapay to purchase accounts.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span><strong>Browse the marketplace</strong> to find accounts that match your needs.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span><strong>Check seller ratings</strong> before making a purchase decision.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 - Before You Buy */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              2. Before You Buy - Important Checks
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-bold text-orange-900 mb-3">Required Steps:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span>Read the listing description completely to understand what you're buying.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span>Check the <strong>preview link</strong> provided by the seller if available.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span>Verify seller reputation score and read recent buyer reviews.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span>Ask questions via chat before purchasing if anything is unclear.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span>Confirm you have sufficient balance in your wallet.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 - Delivery Types */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              3. Understanding Delivery Types
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-bold text-blue-900 mb-3">⚡ Instant Delivery</h3>
                <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                  <li>• Account details sent automatically after purchase.</li>
                  <li>• No waiting time required.</li>
                  <li>• Order confirms immediately after payment.</li>
                  <li>• Perfect for pre-loaded accounts.</li>
                </ul>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-bold text-purple-900 mb-3">⏱️ Manual Delivery</h3>
                <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                  <li>• Seller delivers within specified timeframe.</li>
                  <li>• Examples: verification codes, setup assistance, custom setup.</li>
                  <li>• Seller has X hours/days to complete delivery.</li>
                  <li>• Order auto-confirms if not completed in time.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4 - Making a Purchase */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              4. How to Purchase
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
              <p className="text-gray-800 mb-4 font-semibold">Purchase Process:</p>
              <ol className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li><strong>Step 1:</strong> Find the account you want in the marketplace.</li>
                <li><strong>Step 2:</strong> Click "Buy Now" or add to cart (pay immediately or later).</li>
                <li><strong>Step 3:</strong> Confirm you accept the terms and conditions.</li>
                <li><strong>Step 4:</strong> Payment is deducted from your wallet balance.</li>
                <li><strong>Step 5:</strong> Instant delivery: account details appear immediately. Manual delivery: seller delivers within timeframe.</li>
                <li><strong>Step 6:</strong> Check your "My Purchases" dashboard for all order details.</li>
              </ol>
            </div>
          </section>

          {/* Section 5 - Wallet & Payment */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              5. Wallet & Payment Methods
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
              <p className="text-gray-800 mb-4 font-semibold">Payment Process:</p>
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li>• <strong>Flutterwave:</strong> Pay with NGN or international cards, funds convert to USD.</li>
                <li>• <strong>Korapay:</strong> Alternative payment gateway for Nigerian users.</li>
                <li>• <strong>Balance:</strong> Money stays in your wallet for future purchases.</li>
                <li>• <strong>Withdrawal:</strong> Request payouts to your bank account via your dashboard.</li>
                <li>• <strong>Exchange Rate:</strong> NGN to USD conversion rate is shown during payment.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 - Verifying Accounts */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
              6. After Purchase - Verifying Your Account
            </h2>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 sm:p-6">
              <p className="text-gray-800 mb-4 font-semibold">What to Do When You Receive an Account:</p>
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li>• <strong>Check credentials:</strong> Verify username and password work.</li>
                <li>• <strong>Use preview link:</strong> Some accounts have a preview link - inspect before fully accessing.</li>
                <li>• <strong>Request additional info:</strong> If 2FA codes or additional emails are needed, message the seller via chat.</li>
                <li>• <strong>Verify account details:</strong> Check followers, niche, engagement, and other details match the listing.</li>
                <li>• <strong>Don't share credentials externally:</strong> Keep all login info inside the platform for protection.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 - Communication & Disputes */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              7. Communication & Support
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-bold text-green-900 mb-3">How to Communicate:</h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li>• <strong>Use the chat feature</strong> - All communication must stay on the platform.</li>
                  <li>• <strong>Never go outside:</strong> Don't exchange personal contact info or meet off-platform.</li>
                  <li>• <strong>Be professional:</strong> Keep conversations polite and focused on the transaction.</li>
                  <li>• <strong>Document everything:</strong> Screenshots of chat can be used if issues arise.</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-bold text-red-900 mb-3">If There's an Issue:</h3>
                <ul className="space-y-2 text-sm sm:text-base">
                  <li>• Try to resolve with the seller via chat first.</li>
                  <li>• If account doesn't match description, provide evidence and open a support ticket.</li>
                  <li>• Include screenshots, chat history, and clear details about the problem.</li>
                  <li>• Our support team will review and assist with refunds if necessary.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 8 - Best Practices */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">✅ Best Practices for Safe Buying</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>Start small - Buy from sellers with high ratings on your first purchase.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>Check the seller's total sales and average rating before buying.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>Read buyer reviews - they reveal common issues with specific sellers.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>For manual delivery items, verify the seller's response time in their profile.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>Change the password immediately after accessing a purchased account.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>Keep your own account secure with a strong password and 2FA if available.</span>
              </li>
            </ul>
          </section>

          <div className="bg-gradient-to-r from-[#063970] to-[#022042] rounded-3xl shadow-2xl p-8 sm:p-12 text-white text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Remember: Trusted & Secure</h2>
            <p className="text-lg sm:text-xl mb-4">All transactions on AcctEmpire are protected by our escrow system.</p>
            <p className="text-base sm:text-lg opacity-90">Buy with confidence knowing your funds are safe until you confirm delivery.</p>
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
