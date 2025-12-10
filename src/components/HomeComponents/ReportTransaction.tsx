import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Mail,
  AlertCircle,
  FileText,
  Upload,
  Info,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const ReportTransaction: React.FC = () => {
  const steps = [
    { title: "Collect Evidence", desc: "Screenshots, order ID, usernames, receipts, chat logs.", icon: FileText },
    { title: "Fill the Form", desc: "Provide clear details: order number, date, amount, and issue.", icon: Info },
    { title: "Attach Proof", desc: "Upload all evidence. Wait for 100% upload before submitting.", icon: Upload },
    { title: "Submit Securely", desc: "Our Trust & Safety team reviews every report within 24–72 hours.", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 py-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-yellow-100 border border-yellow-300 mb-6">
            <Shield className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700 font-medium">Secure Reporting Process</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#e6c06c] mb-4">
            How to Report a Transaction
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fast, secure, and confidential. We're here to help you 24/7.
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid gap-4 md:gap-4 lg:gap-6 max-w-3xl mx-auto lg:grid-cols-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group flex items-center gap-3 md:gap-4 p-4 lg:p-5 rounded-2xl bg-gradient-to-b from-[#00183b] to-[#002a5c] border border-white/20 hover:border-teal-500/50 transition-all duration-300 min-h-[100px]"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#33ac6f] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl font-bold text-[#e6c06c]">0{idx + 1}</span>
                    <h3 className="text-base lg:text-lg font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{step.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-300 group-hover:translate-x-2 transition-all" />
              </div>
            );
          })}
        </div>

        {/* CTA Buttons - Now Mobile-Friendly & Beautiful */}
        <div className="mt-16 text-center space-y-4 md:space-y-0 md:flex md:justify-center md:gap-8">
          {/* Primary Button */}
          <Link
            to="/report"
            className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-5 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <AlertCircle className="w-6 h-6 md:w-7 md:h-7" />
            Open Report Form
            <ArrowRight className="w-6 h-6 ml-2" />
          </Link>

          {/* Secondary Button */}
          <a
            href="/"
            className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-5 text-lg md:text-xl font-medium text-gray-800 bg-gray-100 border-2 border-gray-300 rounded-2xl hover:bg-gray-200 hover:border-gray-400 active:scale-95 transition-all duration-300"
          >
            <Mail className="w-6 h-6 md:w-7 md:h-7" />
            Email Support Team
          </a>
        </div>

        {/* Security Notice */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-orange-50 border border-orange-300">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-orange-700 mb-2">Important Security Reminder</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our team will <span className="text-orange-700 font-bold">NEVER</span> ask for your password, 2FA codes, or private keys via email, chat, or phone. 
                  Always verify requests through official channels only.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportTransaction;