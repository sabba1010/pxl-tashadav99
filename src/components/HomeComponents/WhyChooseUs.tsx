import React from "react";
import ExplorebyCategory from "./ExplorebyCategory";

const WhyChooseUs = () => {
  return (
    <section className="pt-8 md:pt-16 pb-12 md:pb-20 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Why Choose Us */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#daab4c] to-[#b8860b] mb-12">
            Our Mission & Commitment
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10 mt-[-20px]">
            We deliver trusted, high-quality digital asset listings and services built on transparency, ironclad security, and world-class customer support. Our mission is to empower creators and buyers with reliable tools and a truly fair marketplace.
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: "🔍",
                title: "Full Transparency",
                desc: "See account history, metrics, and ownership proof before buying.",
              },
              {
                icon: "🔒",
                title: "Escrow Protection",
                desc: "Your payment is 100% secure until you receive the account.",
              },
              {
                icon: "⚡",
                title: "Instant Delivery",
                desc: "Get access within minutes after successful transaction.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#002654] p-6 md:p-10 rounded-3xl shadow-md md:shadow-xl hover:shadow-2xl transition"
              >
                <div className="text-3xl md:text-6xl mb-4 md:mb-6 text-[#daab4c]">{item.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">{item.title}</h3>
                <p className="text-gray-200 text-sm md:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}

        <ExplorebyCategory />
        {/* <div>
          <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#daab4c] to-[#b8860b] mb-12">
            Powerful Features for Buyers & Sellers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Targeted Exposure",
                desc: "Reach serious buyers looking for your exact niche.",
              },
              {
                icon: "💰",
                title: "Competitive Bidding",
                desc: "Drive up prices with real-time bidding system.",
              },
              {
                icon: "🛡️",
                title: "Fraud Protection",
                desc: "Advanced verification and dispute resolution.",
              },
              {
                icon: "📈",
                title: "Growth Tools",
                desc: "Analytics and insights included with premium accounts.",
              },
              {
                icon: "🌍",
                title: "Global Marketplace",
                desc: "Connect with buyers and sellers worldwide.",
              },
              {
                icon: "⚙️",
                title: "Easy Management",
                desc: "User-friendly dashboard for all your transactions.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-[#002654] p-4 md:p-8 rounded-2xl hover:shadow-xl transition"
              >
                <div className="text-2xl sm:text-3xl md:text-5xl mb-3 md:mb-4 text-[#daab4c]">{f.icon}</div>
                <h3 className="text-sm md:text-xl font-bold mb-2 md:mb-3 text-white">{f.title}</h3>
                <p className="text-gray-200 text-sm md:text-base">{f.desc}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default WhyChooseUs;
