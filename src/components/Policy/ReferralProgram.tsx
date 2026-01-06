import React from "react";
import {
  Gift,
  Users,
  Share2,
  CheckCircle,
  ArrowRight,
  Copy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthHook } from "../../hook/useAuthHook";

const ReferralProgram: React.FC = () => {
  const { data } = useAuthHook();
  const referralLink = `http://localhost:3000/register?ref=${data?.referralCode}`;

  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2 সেকেন্ড পর আবার "Copy Link" হবে
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Copy failed! Please copy manually.");
    }
  };

  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-yellow-100 border border-yellow-300 mb-8">
            <Gift className="w-7 h-7 text-yellow-600" />
            <span className="text-yellow-700 font-bold text-lg">
              Referral Program
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#e6c06c] mb-6">
            Invite Friends.
            <br />
            Earn $10 Each!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your link → Friend completes first $50+ trade → Both get $10
            wallet credit instantly!
          </p>
        </div>

        {/* How It Works - Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {[
            { step: "1", title: "Share Your Link", icon: Share2 },
            { step: "2", title: "Friend Signs Up & Trades", icon: Users },
            { step: "3", title: "Both Get $10 Credit", icon: Gift },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#33ac6f] flex items-center justify-center">
                <item.icon className="w-9 h-9 text-white" />
              </div>
              <div className="text-4xl font-bold text-[#e6c06c] mb-2">
                0{item.step}
              </div>
              <h3 className="text-xl font-semibold text-[#00183b]">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Referral Link Box */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="p-8 bg-gradient-to-br from-[#00183b] to-[#002a5c] rounded-3xl text-center text-white">
            <p className="text-lg mb-4 opacity-90">
              Your Personal Referral Link
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 break-all font-mono text-lg">
              {referralLink}
            </div>
            <button
              onClick={handleCopy}
              className="mt-6 px-8 py-4 bg-teal-500 hover:bg-teal-400 rounded-2xl font-bold text-lg transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Rules */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-[#00183b] text-center mb-8">
            Rules & Conditions
          </h2>
          <ul className="space-y-4 max-w-3xl mx-auto text-gray-700">
            {[
              "New users only (no existing accounts)",
              "First trade must be $50 or more",
              "Credit expires in 90 days",
              "No self-referrals or fake accounts",
              "We reserve the right to cancel abusive referrals",
              "Follow the all the website social media quality",
              "Post atleast or repost 1 website video to qualify"
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#33ac6f] flex-shrink-0 mt-0.5" />
                <span className="text-lg">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-all"
          >
            Go to Dashboard
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;
