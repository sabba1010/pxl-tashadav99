import React from "react";
import images from "../../assets/social media (1).png";

const HeroBannerSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#00183b] via-[#002a5c] to-[#003d80] text-white py-16 md:py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      {/* Original gold decorative blobs – unchanged */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-[#daab4c] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -left-32 w-80 h-80 bg-[#d4a643] opacity-20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side */}
        <div className="space-y-8">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#daab4c] to-[#f0d084]">
            Buy Social Accounts Marketplace
          </h1>

          <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl">
            Connecting buyers and sellers in the digital world, our platform
            offers a secure and transparent marketplace for acquiring and
            trading valuable social media accounts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            {/* Email input – green focus only */}
            <input
              type="email"
              placeholder="Enter Your Email"
              className="px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 placeholder-gray-400 text-white 
                         focus:outline-none focus:border-[#33ac6f] focus:ring-4 focus:ring-[#33ac6f]/30 
                         transition-all duration-300"
            />

            {/* Button: Green → Gold on hover, white text */}
            <button className="
              px-8 py-4 
              bg-[#33ac6f] hover:bg-[#e7c06c] 
              text-white font-bold 
              rounded-xl shadow-xl 
              hover:shadow-2xl hover:shadow-[#e7c06c]/40 
              transform hover:scale-105 
              transition-all duration-300
            ">
              Get Started
            </button>
          </div>
        </div>

        {/* Right side – image */}
        <div className="flex justify-center lg:justify-end">
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