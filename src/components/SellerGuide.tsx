import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Clock, FileText, Image, Lock, MessageSquare, CheckCircle, Ban } from "lucide-react";

const SellerGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pt-20 pb-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-10 py-12 text-white">
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome to AcctEmpire</h1>
            <p className="text-2xl font-semibold mt-2">Seller Upload Guide</p>
            <p className="mt-6 text-lg opacity-90">
              This guide will help you upload listings correctly, get faster approvals, and avoid rejections.
            </p>
          </div>

          <div className="p-10">
            <p className="text-gray-700 leading-relaxed">
              Welcome to AcctEmpire! Please read this guide carefully before creating your first listing.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {/* Section 1 */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              1. Before You List
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>Make sure your seller account is active.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>Confirm you can deliver exactly what you plan to list.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                <span>Accuracy and honesty are required on AcctEmpire.</span>
              </li>
            </ul>
            <p className="mt-6 text-sm text-red-600 font-medium">
              Listings that do not follow platform rules will be rejected.
            </p>
          </section>

          {/* Section 2 - Manual Listings */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              2. Choosing the Correct Listing Type
            </h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-orange-800 mb-4">Manual Listings (Very Important)</h3>
              <p className="text-gray-800 mb-4">
                Any product or service that requires your action must be listed as a <strong>Manual Listing</strong>, including:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
                <li className="flex items-center gap-2">• Verification services</li>
                <li className="flex items-center gap-2">• Code delivery</li>
                <li className="flex items-center gap-2">• eSIM delivery</li>
                <li className="flex items-center gap-2">• Social media boosting</li>
                <li className="flex items-center gap-2">• Any service not instantly delivered</li>
              </ul>
              <p className="mt-5 text-orange-900 font-semibold">
                ⚠️ If listed incorrectly, they will be rejected.
              </p>
            </div>
          </section>

          {/* Section 3 - Delivery Time */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              3. Delivery Time Requirement (Compulsory)
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-gray-800 mb-4">For all Manual Listings, you must:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  Select the delivery time you need.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  Choose a realistic timeframe you can meet.
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                  Complete the service within the selected time.
                </li>
              </ul>
              <p className="mt-5 text-blue-900 font-semibold">
                Manual listings without a delivery time will not be approved.
              </p>
            </div>
          </section>

          {/* Section 4 - Username & Password Rules */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Lock className="w-8 h-8 text-purple-600" />
              4. Username & Password Setup Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-3">a. Numbers Requiring Codes</h4>
                <ul className="text-sm space-y-2 text-gray-700">• Use number as username<br />• Random password<br />• Buyer contacts via chat for code</ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-3">b. Social Media Boosting</h4>
                <ul className="text-sm space-y-2 text-gray-700">• Needed details in username<br />• Random password<br />• No unnecessary info</ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-3">c. eSIM Listings</h4>
                <ul className="text-sm space-y-2 text-gray-700">• eSIM number in username<br />• Random password<br />• Must be valid & ready</ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-900 mb-3">d. Verification Services</h4>
                <ul className="text-sm space-y-2 text-gray-700">• Only required details<br />• In username field<br />• Random password<br />• Manual Listing only</ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-3">e. Website Listings</h4>
                <ul className="text-sm space-y-2 text-gray-700">• Website name in username<br />• Random password<br />• Link in description/preview</ul>
              </div>
            </div>
          </section>

          {/* Section 5 - Social Media */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Image className="w-8 h-8 text-teal-600" />
              5. Social Media Listings (Compulsory)
            </h2>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
              <ul className="space-y-3 text-gray-700">
                <li>• Must include a preview link</li>
                <li>• Allows buyers to verify account before purchase</li>
                <li>• No preview → rejection or refund</li>
              </ul>
            </div>
          </section>

          {/* Section 6 - Description */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              6. Description Requirements (Very Important)
            </h2>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
              <p className="mb-4 text-gray-800">Every description must:</p>
              <ul className="space-y-3 text-gray-700">
                <li>• Clearly explain what the buyer receives</li>
                <li>• Include account creation year</li>
                <li>• Contain all important information</li>
                <li>• Exactly match what you deliver</li>
              </ul>
              <p className="mt-5 text-indigo-900 font-semibold">Misleading descriptions → refunds or penalties</p>
            </div>
          </section>

          {/* Section 7 - Restricted Words */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Ban className="w-8 h-8 text-red-600" />
              7. Restricted Words Policy
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-900">
              <p className="font-medium">Never use words like: fraud, scam, hacked, yahoo, client, or related terms.</p>
              <p className="mt-3 font-semibold">Automatic rejection for prohibited words.</p>
            </div>
          </section>

          {/* Section 8 - Communication */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-green-600" />
              8. Communication Rules
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li>• All communication stays inside AcctEmpire</li>
              <li>• Use only the built-in chat</li>
              <li>• Never ask for external contact</li>
              <li>• No off-platform transactions</li>
            </ul>
            <p className="mt-5 text-red-600 font-medium">Violations may lead to account restrictions.</p>
          </section>

          {/* Additional Sections - Working Pictures & Documents */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Listing Types</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Image className="w-6 h-6" /> Working Picture Listings
                </h3>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• Manual Listing only</li>
                  <li>• Title in username</li>
                  <li>• Random password</li>
                  <li>• Preview link required</li>
                  <li>• Delivered picture must match preview</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" /> Document / Format Listings
                </h3>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>• Manual Listing only</li>
                  <li>• File name in username</li>
                  <li>• Random password</li>
                  <li>• Clear description</li>
                  <li>• Preview link required</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Final Reminder */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Final Reminder</h2>
            <p className="text-xl mb-4">What you list must exactly match what you deliver.</p>
            <p className="text-lg opacity-90">
              Accuracy, transparency, and compliance are the keys to success on AcctEmpire.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerGuide;