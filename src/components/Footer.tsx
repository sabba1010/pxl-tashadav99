// components/Footer.tsx
import React from "react";
import { Facebook, Instagram, YouTube, WhatsApp } from "@mui/icons-material";
import Logo from "../assets/Grupo 1.png";   

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#292929] text-white">
      {/* Top Orange Line with Dots */}

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center md:text-left">

          {/* Left: Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start md:border-r-4 border-orange-400">
            <img src={Logo} alt="Expresur Logo" className="h-16 mb-4 w-1/2 object-contain" />
            <p className="text-sm text-gray-400 mt-2 font-medium">
              ENVÍOS A TODA LATINOAMÉRICA
            </p>
          </div>

          {/* Center: Social + Privacy */}
          <div className="flex flex-col items-center space-y-6">
            {/* Social Icons */}
            <div className="flex gap-6 text-4xl">
              <a href="#" className="text-[#FA921D] hover:scale-125 transition transform">
                <Facebook fontSize="inherit" />
              </a>
              <a href="#" className="text-[#FA921D] hover:scale-125 transition transform">
                <Instagram fontSize="inherit" />
              </a>
              <a href="#" className="text-[#FA921D] hover:scale-125 transition transform">
                <YouTube fontSize="inherit" />
              </a>
              <a href="#" className="text-[#FA921D] hover:scale-125 transition transform">
                <WhatsApp fontSize="inherit" />
              </a>
            </div>

            {/* Privacy Link */}
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-[#FA921D] transition underline underline-offset-4"
            >
              Declaración de Privacidad
            </a>
          </div>

          {/* Right: Contact Info */}
          <div className="flex flex-col items-center md:items-end space-y-3 text-sm md:border-l-4 border-orange-400">
            <h3 className="font-bold text-[#FA921D] text-lg">Contacta con nosotros</h3>
            <p className="text-gray-300">
              +1 (786) 314 4045 / +1 (561) 595 7755
            </p>
            <p className="text-gray-300">
              soporte@expresur.com
            </p>
            <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
              dirección general del local para atención
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;