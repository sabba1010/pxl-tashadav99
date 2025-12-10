import React from "react";
import { Shield, Lock, Globe, Mail, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-teal-50 border border-teal-200 mb-8">
            <Shield className="w-6 h-6 text-teal-600" />
            <span className="text-teal-700 font-semibold">Your Privacy Matters</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#e6c06c] mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">Last updated: December 09, 2025</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-12 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">1. Information We Collect</h2>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start gap-3"><Lock className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" /> Name, email, phone, shipping address</li>
              <li className="flex items-start gap-3"><Lock className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" /> Transaction & order history</li>
              <li className="flex items-start gap-3"><Globe className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" /> IP address, browser, device info</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">2. How We Use Your Data</h2>
            <p>To process orders • Prevent fraud • Provide support • Improve our platform • Comply with laws</p>
          </section>

          <section className="bg-orange-50 p-8 rounded-2xl border border-orange-200">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-9 h-9 text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-orange-800 mb-2">We Never Sell Your Data</h3>
                <p className="text-orange-700">Your personal information is never sold or rented to third parties.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">3. Your Rights</h2>
            <p className="text-lg">You can access, correct, delete, or export your data at any time.</p>
            <a href="mailto:privacy@cctbazaar.com" className="inline-flex items-center gap-2 mt-4 text-teal-600 font-bold hover:underline">
              <Mail className="w-5 h-5" /> privacy@cctbazaar.com
            </a>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-20 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;