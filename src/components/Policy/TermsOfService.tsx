import React from "react";
import { FileText, Scale, Shield, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-50 border border-blue-200 mb-8">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-blue-700 font-semibold">Legal Agreement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#e6c06c] mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">Last updated: January 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-12 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">1. Agreement to Terms</h2>
            <p className="text-lg leading-relaxed">
              By accessing or using AcctEmpire ("the Platform"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our services.
            </p>
            <ul className="space-y-3 ml-6 mt-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                You must be at least 18 years old to use this platform
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                You agree to provide accurate and truthful information
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                You are responsible for maintaining account security
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">2. Use of Platform</h2>
            <p className="text-lg leading-relaxed">
              Users must follow all applicable laws and our policies when buying or selling accounts.
              The Platform serves as a marketplace connecting buyers and sellers.
            </p>
            <ul className="space-y-3 ml-6 mt-4">
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                All transactions are protected by our escrow system
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                Sellers must provide accurate account information
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-teal-500 mt-1 flex-shrink-0" />
                Buyers must complete payment within the specified timeframe
              </li>
            </ul>
          </section>

          <section className="bg-amber-50 p-8 rounded-2xl border border-amber-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-9 h-9 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-amber-800 mb-2">Prohibited Activities</h3>
                <p className="text-amber-700 mb-3">
                  The following activities are strictly prohibited on our platform:
                </p>
                <ul className="space-y-2 text-amber-700">
                  <li>• Fraudulent transactions or misrepresentation</li>
                  <li>• Selling stolen or hacked accounts</li>
                  <li>• Harassment or abusive behavior</li>
                  <li>• Attempting to bypass our escrow system</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">3. Disputes and Liability</h2>
            <p className="text-lg leading-relaxed">
              We provide a marketplace platform and facilitate transactions through our escrow system.
              While we strive to ensure smooth transactions, our liability is limited as follows:
            </p>
            <ul className="space-y-3 ml-6 mt-4">
              <li className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                We are not responsible for the quality or authenticity of accounts beyond our verification process
              </li>
              <li className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                Disputes should be reported within 48 hours of transaction completion
              </li>
              <li className="flex items-start gap-3">
                <Scale className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                Our decision in dispute resolution is final and binding
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">4. Fees and Payments</h2>
            <p className="text-lg leading-relaxed">
              AcctEmpire charges service fees for facilitating transactions. All fees are clearly displayed
              before transaction completion. Refunds are subject to our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">5. Termination</h2>
            <p className="text-lg leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms.
              Users may also close their accounts at any time through account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#00183b] mb-4">6. Contact Us</h2>
            <p className="text-lg">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <a
              href="mailto:legal@acctempire.com"
              className="inline-flex items-center gap-2 mt-4 text-blue-600 font-bold hover:underline"
            >
              <Mail className="w-5 h-5" /> legal@acctempire.com
            </a>
          </section>
        </div>

        {/* Back Button */}
        <div className="mt-20 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
