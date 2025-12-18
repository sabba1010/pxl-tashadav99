import React from "react";
import HomeAboutSection from "../../components/HomeComponents/HomeAboutSection";
import { Link } from "react-router-dom";
import { CheckCircle, Shield, HeadphonesIcon } from "lucide-react";

const WhyChooseUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Reuse the HomeAboutSection hero as the page intro */}
      <HomeAboutSection />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#00183b]">
            Why Choose Our Marketplace
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We combine verification, escrow, and a specialised audience to make buying and selling social accounts
            secure, fast, and profitable.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Verified Listings",
              desc: "Each listing is rigorously verified to minimise fraud and maximise buyer confidence.",
              Icon: CheckCircle,
            },
            {
              title: "Escrow Protection",
              desc: "Funds are securely held in escrow until full delivery confirmation, protecting both buyer and seller.",
              Icon: Shield,
            },
            {
              title: "Dedicated Support",
              desc: "Our expert team assists with transfers, resolves disputes, and ensures smooth handoffs every step of the way.",
              Icon: HeadphonesIcon,
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              {/* Subtle background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#33ac6f]/5 rounded-full blur-3xl group-hover:bg-[#33ac6f]/10 transition-colors" />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#33ac6f] text-white mb-6 group-hover:scale-110 transition-transform">
                  <feature.Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#00183b] mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            to="/marketplace"
            className="inline-flex items-center px-8 py-4 bg-[#33ac6f] text-white font-semibold text-lg rounded-full hover:bg-[#3ed987] hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Browse Listings
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;