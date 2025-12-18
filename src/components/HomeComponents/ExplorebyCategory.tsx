import React from "react";
import { Link } from "react-router-dom";

const ExplorebyCategory: React.FC = () => {
  const features = [
    { icon: "⭐", title: "Featured Listings" },
    { icon: "🚀", title: "Marketing & Promotion" },
    { icon: "👤", title: "User Profiles" },
    { icon: "✅", title: "Verified Accounts" },
    { icon: "🛠️", title: "Customer Support" },
    { icon: "🔍", title: "Advanced Search" },
    { icon: "🛡️", title: "Escrow Security" },
    { icon: "📊", title: "Analytics Tools" },
    { icon: "⚡", title: "Why Choose Us" },
    { icon: "🤝", title: "Why Us" },
  ];

  return (
    <section className="pt-0 pb-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#c49322] to-[#f0c14a] mb-4">
          Why Choose Us
        </h2>
        <p className="text-gray-700 text-lg">Discover & Acquire Unique Digital Assets</p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto mb-8">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="group backdrop-blur-lg border rounded-2xl p-4 md:p-6 text-center transition-all duration-300 cursor-pointer transform hover:scale-105 bg-[#002654] border-[#002654]/60 hover:bg-[#00345f] hover:border-[#33ac6f]/50"
          >
            <div className="text-2xl md:text-4xl mb-3 text-white">{f.icon}</div>
            <h3 className="text-sm md:text-lg font-semibold text-white">{f.title}</h3>
          </div>
        ))}
      </div>

      {/* CTA Buttons styled like HomeAboutSection */}
      {/* <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-10">
        <Link
          to="/why-choose-us"
          className="w-full sm:w-auto text-center px-6 py-3 md:px-10 md:py-4 bg-[#33ac6f] hover:bg-[#3ed987] text-white font-bold text-base md:text-lg rounded-lg shadow-md hover:shadow-[#33ac6f]/40 transform hover:scale-105 transition-all duration-300"
        >
          Why Choose Us
        </Link>

        <Link
          to="/refund"
          className="w-full sm:w-auto text-center px-6 py-3 md:px-10 md:py-4 bg-transparent border-2 border-[#daab4c] text-[#daab4c] hover:bg-[#daab4c] hover:text-white font-bold text-base md:text-lg rounded-lg transition-all duration-300"
        >
          Refund Policy
        </Link>
      </div> */}
    </section>
  );
};

export default ExplorebyCategory;