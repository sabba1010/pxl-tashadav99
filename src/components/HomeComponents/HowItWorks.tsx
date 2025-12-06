import React from "react";
import image1 from "../../assets/Homeimages2.png";
const HowItWorks = () => {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#00183b] to-[#002a5c]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-5xl font-bold text-[#e6c06c]">
            How It Works
          </h2>
          <p className="text-white text-xl mt-4">
            Simple, Secure, and Fast Process
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <img
            src={image1}
            alt="How it works"
            className="rounded-2xl shadow-2xl"
          />
          <div className="space-y-10">
            {[
              {
                icon: "📝",
                title: "Registration & Account Setup",
                desc: "Sign up in seconds and verify your identity.",
              },
              {
                icon: "🔍",
                title: "Browse Premium Listings",
                desc: "Explore thousands of verified accounts.",
              },
              {
              
              },
              {
                icon: "💳",
                title: "Secure Escrow Payment",
                desc: "Funds held safely until transfer is complete.",
              },
              {
                icon: "🔑",
                title: "Instant Account Transfer",
                desc: "Receive full access immediately after confirmation.",
              },
              {
                icon: "🎉",
                title: "Start Growing",
                desc: "Your new digital asset is ready to use!",
              },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="text-4xl bg-gradient-to-br from-[#33ac6f] to-[#33ac6f] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="text-white/90 text-lg mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
