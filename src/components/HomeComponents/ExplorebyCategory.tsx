import React from "react";

const ExplorebyCategory = () => {
  return (
    <section className="pt-0 pb-24 px-6 md:px-12 lg:px-20 ">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold text-transparent bg-clip-text bg-[#c49322] mb-4">
          Explore by Category
        </h2>
        <p className="text-gray-700 text-lg">
          Discover & Acquire Unique Digital Assets
        </p>
      </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
        {[
          { icon: "⭐", title: "Featured Listings" },
          { icon: "🚀", title: "Marketing & Promotion" },
          { icon: "👤", title: "User Profiles" },
          { icon: "✅", title: "Verified Accounts" },
          { icon: "🛠️", title: "Customer Support" },
          { icon: "🔍", title: "Advanced Search" },
          { icon: "🛡️", title: "Escrow Security" },
          { icon: "📊", title: "Analytics Tools" },
        ].map((cat, i) => (
          <div
            key={i}
            className="group bg-[#002654] backdrop-blur-lg border border-[#002654]/60 rounded-2xl p-4 md:p-8 text-center hover:bg-[#00345f] hover:border-[#33ac6f]/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
          >
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 group-hover:scale-110 transition-transform text-white">
              {cat.icon}
            </div>
            <h3 className="text-sm md:text-lg font-semibold text-white">{cat.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExplorebyCategory;
