import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Clock, FileText, Image, Lock, MessageSquare, CheckCircle, Ban, Zap, TrendingUp, Users } from "lucide-react";

const SellerGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pt-12 sm:pt-20 pb-16 sm:pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-[#002a5c] to-[#00183b] px-6 py-8 sm:px-10 sm:py-12 text-white">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Welcome to AcctEmpire</h1>
            <p className="text-xl sm:text-2xl font-semibold mt-2">Seller's Complete Guide</p>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg opacity-90">
              Learn how to list accounts correctly, get approved quickly, and maximize your sales and reputation on our marketplace.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              Welcome to AcctEmpire! This guide covers everything you need to know to start selling successfully on our platform. Follow these guidelines to ensure quick approvals and happy customers.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {/* Section 1 - Getting Started */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              1. Before You Start Selling
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span><strong>Become a Seller:</strong> Pay the one-time seller activation fee ($XX USD) to unlock listing capabilities.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span><strong>Verify Your Identity:</strong> Complete identity verification to build buyer trust.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span><strong>Have Accounts Ready:</strong> Make sure the accounts you plan to sell are actually available and working.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span><strong>Understand the Rules:</strong> Review all guidelines to avoid rejections and account restrictions.</span>
              </li>
            </ul>
            <p className="mt-6 text-sm text-red-600 font-medium">
              ⚠️ Your reputation depends on accuracy, honesty, and following these rules. Violations may result in account suspension.
            </p>
          </section>

          {/* Section 2 - Delivery Types */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              2. Choosing the Right Delivery Type (Critical)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">⚡ Instant Delivery</h3>
                <p className="text-gray-800 mb-3 text-sm sm:text-base font-medium">Use for accounts that are ready to deliver immediately:</p>
                <ul className="text-gray-700 text-sm sm:text-base space-y-2">
                  <li>• Pre-created social media accounts</li>
                  <li>• Already-available gaming accounts</li>
                  <li>• Web logins that need no setup</li>
                  <li>• Anything instantly deliverable</li>
                </ul>
                <p className="mt-4 text-xs text-green-700 font-semibold bg-green-100 p-2 rounded">Order completes automatically after purchase</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-4">⏱️ Manual Delivery</h3>
                <p className="text-gray-800 mb-3 text-sm sm:text-base font-medium">Use for items requiring your action:</p>
                <ul className="text-gray-700 text-sm sm:text-base space-y-2">
                  <li>• Services requiring 2FA codes</li>
                  <li>• Custom setup or configuration</li>
                  <li>• Verification codes delivery</li>
                  <li>• eSIM delivery</li>
                  <li>• Account customization needed</li>
                </ul>
                <p className="mt-4 text-xs text-yellow-700 font-semibold bg-yellow-100 p-2 rounded">You must deliver within specified timeframe</p>
              </div>
            </div>
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
              <h3 className="font-bold text-red-900 mb-2">⚠️ CRITICAL: Incorrect Type = Rejection</h3>
              <p className="text-gray-800">Listing instant items as manual or vice versa results in rejection. Choose the correct type or your listing won't be approved.</p>
            </div>
          </section>

          {/* Section 3 - Delivery Time */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              3. Delivery Time (Required for Manual Listings)
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
              <p className="text-gray-800 mb-4 font-semibold">Set a realistic delivery timeframe:</p>
              <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <span><strong>Choose timeframe:</strong> 1 hour, 2 hours, 4 hours, 8 hours, 1 day, etc.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <span><strong>Be honest:</strong> Only select times you can actually meet 100% of the time.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <span><strong>Auto-confirm:</strong> If you miss the deadline, the order auto-completes and funds release.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  <span><strong>No delivery time = No approval:</strong> Manual listings without a timeframe are rejected.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 - Account Credentials */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              4. Username & Password Setup (Critical)
            </h2>
            <div className="space-y-4">
              <p className="text-gray-800 font-semibold">How to format credentials for different account types:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">📱 Numbers (Phone Verification)</h4>
                  <ul className="text-xs sm:text-sm space-y-2 text-gray-700">
                    <li><strong>Username:</strong> The phone number</li>
                    <li><strong>Password:</strong> Random/complex password</li>
                    <li><strong>Note:</strong> Buyer gets code via chat after purchase</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">📸 Social Media Accounts</h4>
                  <ul className="text-xs sm:text-sm space-y-2 text-gray-700">
                    <li><strong>Username:</strong> Actual account username</li>
                    <li><strong>Password:</strong> Working password</li>
                    <li><strong>Preview:</strong> Link MUST be provided</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">🎮 Gaming Accounts</h4>
                  <ul className="text-xs sm:text-sm space-y-2 text-gray-700">
                    <li><strong>Username:</strong> Account email or username</li>
                    <li><strong>Password:</strong> Working password</li>
                    <li><strong>Extra:</strong> Include 2FA recovery codes if available</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">🌐 Websites/Services</h4>
                  <ul className="text-xs sm:text-sm space-y-2 text-gray-700">
                    <li><strong>Username:</strong> Service name/type</li>
                    <li><strong>Password:</strong> Random/strong password</li>
                    <li><strong>Link:</strong> Add in description</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200 md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-3">🖼️ Verification Services (Special)</h4>
                  <ul className="text-xs sm:text-sm space-y-2 text-gray-700">
                    <li><strong>Username:</strong> Required details ONLY (phone, email, etc.)</li>
                    <li><strong>Password:</strong> Random/strong password</li>
                    <li><strong>Type:</strong> MUST be Manual Listing</li>
                    <li><strong>Delivery:</strong> Must have delivery time specified</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 - Listing Description */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              5. Description Requirements (Critical)
            </h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 sm:p-6">
              <p className="mb-4 text-gray-800 text-sm sm:text-base font-semibold">Your description must be detailed and honest:</p>
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                  <span><strong>What buyer gets:</strong> Clearly explain exactly what is included in the purchase.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                  <span><strong>Account age:</strong> State when the account was created.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                  <span><strong>Stats for social accounts:</strong> Include followers, engagement rate, niche, monetization status.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                  <span><strong>Special details:</strong> 2FA status, original email, restrictions, any issues.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                  <span><strong>Be specific:</strong> Avoid vague descriptions. Numbers and facts attract buyers.</span>
                </li>
              </ul>
              <p className="mt-5 text-indigo-900 font-semibold bg-indigo-100 p-3 rounded">❌ Misleading descriptions → Refunds or account penalties</p>
            </div>
          </section>

          {/* Section 6 - Preview Links */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Image className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600" />
              6. Preview Links (Required for Social Media)
            </h2>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 sm:p-6">
              <ul className="space-y-4 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2" />
                  <span><strong>Required for:</strong> Instagram, TikTok, YouTube, Facebook, and all social platforms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2" />
                  <span><strong>What it is:</strong> A public link to the account allowing buyers to verify before purchase.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2" />
                  <span><strong>How to create:</strong> Use the account preview link (usually the public profile URL).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2" />
                  <span><strong>No preview = No approval:</strong> Listings without preview links are rejected.</span>
                </li>
              </ul>
              <p className="mt-5 text-teal-900 font-semibold">✅ Preview links build buyer confidence and reduce disputes.</p>
            </div>
          </section>

          {/* Section 7 - Price Setting */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              7. Pricing Strategy
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                  <span><strong>Be competitive:</strong> Research similar accounts to price fairly.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                  <span><strong>Quality matters:</strong> Higher followers, engagement, and age = higher price.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                  <span><strong>Too high = No sales:</strong> Overpriced accounts won't sell.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
                  <span><strong>Earnings:</strong> You receive 80% of the sale price (20% platform fee).</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8 - Restricted Words */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Ban className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              8. Prohibited Words (Automatic Rejection)
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
              <p className="font-semibold text-red-900 mb-4">NEVER use these words or your listing will be auto-rejected:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <span className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium">❌ Fraud</span>
                <span className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium">❌ Scam</span>
                <span className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium">❌ Hacked</span>
                <span className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium">❌ Stolen</span>
                <span className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium">❌ Yahoo</span>
                <span className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium">❌ Client</span>
              </div>
              <p className="text-red-900 text-sm">And similar derogatory or illegal-related terms. Keep descriptions professional and honest.</p>
            </div>
          </section>

          {/* Section 9 - Communication Rules */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              9. Communication & Support Rules
            </h2>
            <ul className="space-y-4 text-gray-700 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                <span><strong>Use platform chat only:</strong> Never move conversations to WhatsApp, Telegram, etc.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                <span><strong>Don't ask for external contact:</strong> Never ask for buyer's personal details outside the platform.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                <span><strong>Be professional:</strong> Respond quickly and courteously to buyer inquiries.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                <span><strong>No off-platform deals:</strong> All transactions must happen through AcctEmpire escrow.</span>
              </li>
            </ul>
            <p className="mt-5 text-red-600 font-medium">⚠️ Violations may lead to account suspension and funds freeze.</p>
          </section>

          {/* Section 10 - After Listing */}
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              10. After Listing - What to Expect
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-blue-900 mb-3">⏳ Approval Process:</h3>
                <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                  <li>• Admin team reviews your listing within 24-48 hours.</li>
                  <li>• Must meet all guidelines (description, delivery type, preview link, etc.)</li>
                  <li>• You'll be notified if approved or if changes are needed.</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-green-900 mb-3">💰 Getting Paid:</h3>
                <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                  <li>• Instant delivery: Funds added to balance immediately after purchase.</li>
                  <li>• Manual delivery: Funds added when order completes (after delivery time expires or buyer confirms).</li>
                  <li>• You keep 80%, platform takes 20% commission.</li>
                  <li>• Withdraw to bank via wallet dashboard anytime.</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold text-yellow-900 mb-3">⭐ Building Your Reputation:</h3>
                <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                  <li>• Each sale gives you buyer reviews and ratings.</li>
                  <li>• Higher ratings = More visibility = More sales.</li>
                  <li>• Be reliable and responsive to maintain excellent ratings.</li>
                  <li>• Disputes hurt your reputation and earnings potential.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Final Reminder */}
          <div className="bg-gradient-to-r from-[#002a5c] to-[#00183b] rounded-3xl shadow-2xl p-8 sm:p-12 text-white text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">The Golden Rule of AcctEmpire</h2>
            <p className="text-lg sm:text-xl mb-4">What you list must exactly match what you deliver.</p>
            <p className="text-base sm:text-lg opacity-90">
              Your success depends on accuracy, honesty, and professionalism. Happy customers = More sales = Better reputation = More earnings.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerGuide;