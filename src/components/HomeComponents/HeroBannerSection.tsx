import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import images from "../../assets/social media (1).png";

const HeroBannerSection = () => {
  const { isLoggedIn } = useAuth();

  return (
    <section className="relative text-white pt-8 md:pt-16 pb-12 md:pb-20 px-6 md:px-12 lg:px-20 overflow-hidden bg-gradient-to-br from-[#00183b] via-[#002a5c] to-[#003d80]">
      {/* Subtle dark overlay for depth */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Modernized decorative blobs – softer and more organic */}
      <div className="absolute top-10 -right-40 w-96 h-96 bg-[#daab4c] opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-10 -left-40 w-80 h-80 bg-[#d4a643] opacity-15 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#daab4c] opacity-5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left side - Content */}
        <div className="space-y-10 lg:space-y-12">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#daab4c] to-[#f0d084]">
              Buy Social Accounts Marketplace
            </h1>

            <p className="text-base md:text-base lg:text-lg text-gray-200 leading-relaxed max-w-2xl opacity-90">
              Connecting buyers and sellers in the digital world, our platform
              offers a secure and transparent marketplace for acquiring and
              trading valuable social media accounts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 max-w-xl">
            {/* Modern glassmorphism input */}
            {/* <input
              type="email"
              placeholder="Enter Your Email"
              className="px-7 py-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 
                         placeholder-gray-400 text-white text-base
                         focus:outline-none focus:border-[#33ac6f] focus:ring-4 focus:ring-[#33ac6f]/40 
                         transition-all duration-500 shadow-lg"
            /> */}

            {/* Button with modern hover effect */}
            <Link to={isLoggedIn ? "/marketplace" : "/login"} className="
              px-5 py-2 md:px-10 md:py-4 bg-[#33ac6f] hover:bg-[#3ed987] text-white font-bold text-sm md:text-lg rounded-lg shadow-md hover:shadow-[#33ac6f]/40 transform hover:scale-105 transition-all duration-300
            ">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </Link>
          </div>
        </div>

        {/* Right side - Image with floating animation */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <img
              src={images}
              alt="Social Marketplace"
              className="w-full max-w-lg lg:max-w-xl drop-shadow-2xl 
                         hover:scale-105 transition-transform duration-700 
                         animate-float"
            />
            {/* Subtle glow behind image */}
            <div className="absolute -inset-4 bg-[#daab4c] opacity-10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Custom animations (add to your global CSS or Tailwind config) */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default HeroBannerSection;