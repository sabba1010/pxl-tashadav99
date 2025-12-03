import React from "react";
import images from "../../assets/social media (1).png";
const HeroBannerSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#00183b] via-[#002a5c] to-[#003d80] text-white py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="absolute top-20 -right-20 w-96 h-96 bg-[#daab4c] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -left-32 w-80 h-80 bg-[#d4a643] opacity-20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#daab4c] to-[#f0d084]">
            Buy Social Accounts Marketplace
          </h1>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
            Connecting buyers and sellers in the digital world, our platform
            offers a secure and transparent marketplace for acquiring and
            trading valuable social media accounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 placeholder-gray-400 focus:outline-none focus:border-[#daab4c] transition"
            />
            <button className="px-8 py-4 bg-gradient-to-r from-[#daab4c] to-[#f0d084] hover:from-[#c89a3f] hover:to-[#e0b860] text-black font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src={images}
            alt="Social Marketplace"
            className="w-full max-w-lg drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBannerSection;
