import React from "react";

const MissionCommitment: React.FC = () => {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-32 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text  bg-gradient-to-r from-[#daab4c] to-[#b8860b] mb-6">
            Our Mission & Commitment
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We deliver trusted, high-quality digital asset listings and services built on transparency, ironclad security, and world-class customer support. Our mission is to empower creators and buyers with reliable tools and a truly fair marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Transparent Listings",
              description: "Clear, verified information from trusted sellers you can count on.",
              icon: "🔍",
            },
            {
              title: "Secure Payments",
              description: "Escrow-protected transactions that safeguard both buyers and sellers.",
              icon: "🔒",
            },
            {
              title: "Dedicated Support",
              description: "Lightning-fast, human-first support to solve any issue seamlessly.",
              icon: "🚀",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-white shadow-lg border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-slate-600 to-slate-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionCommitment;