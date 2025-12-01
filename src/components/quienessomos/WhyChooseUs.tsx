import React from "react";
import Illustration from "../../assets/Grupo-1648.png";

const WhyChooseUs: React.FC = () => {
  return (
    <div className="w-full flex justify-center bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1500px] w-full pt-[60px] md:pt-[120px] px-4 md:px-8">
        
        {/* LEFT SIDE */}
        <div className="pr-0 md:pr-16 lg:pr-32">
          
          {/* H1 — one line */}
          <h1 className="font-avenir font-bold text-4xl sm:text-5xl md:text-7xl leading-[40px] sm:leading-[56px] md:leading-[72px] text-[#FA921D] whitespace-normal md:whitespace-nowrap">
            Por qué elegirnos
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mt-4 sm:mt-6 text-[16px] sm:text-[18px] leading-[24px] sm:leading-[30px] max-w-full md:max-w-[520px]">
            En el competitivo mundo empresarial de hoy, la demanda de soluciones
            de logística eficientes nunca ha sido más crítica.
          </p>

          {/* FEATURES */}
          <div className="mt-8 md:mt-12 relative pl-4 md:pl-10">
            {/* Vertical line */}
            <div className="absolute -left-1 md:left-[-4px] top-3 h-[200px] sm:h-[260px] border-l-4 border-[#FA921D]" />

            {/* List */}
            <ul className="  space-y-4 sm:space-y-6 text-[18px] sm:text-[22px] leading-[28px] sm:leading-[32px]">
              <li>
                <span className="text-green-700 font-bold">30 CARGADORES</span> con experiencia
              </li>
              <li>
                <span className="text-green-700 font-bold">45 EXPERTOS</span> capacitados en almacén
              </li>
              <li>
                <span className="text-green-700 font-bold">120 CONDUCTORES</span> de camión expertos
              </li>
              <li>
                <span className="text-green-700 font-bold">345 PERSONAL</span> de entrega
              </li>
            </ul>

            {/* Dots */}
            <div className="absolute -left-1 md:left-[-10px] top-[12px] w-3 sm:w-4 h-3 sm:h-4 bg-orange-500 rounded-full" />
            <div className="absolute -left-1 md:left-[-10px] top-[68px] sm:top-[76px] w-3 sm:w-4 h-3 sm:h-4 bg-orange-500 rounded-full" />
            <div className="absolute -left-1 md:left-[-10px] top-[124px] sm:top-[140px] w-3 sm:w-4 h-3 sm:h-4 bg-orange-500 rounded-full" />
            <div className="absolute -left-1 md:left-[-10px] top-[180px] sm:top-[204px] w-3 sm:w-4 h-3 sm:h-4 bg-orange-500 rounded-full" />
          </div>

          {/* Button */}
          <button className="mt-10 md:mt-14 px-8 sm:px-12 py-3 sm:py-4 rounded-full text-white font-bold text-[16px] sm:text-[18px] bg-[#0A6F3C]">
            SOLICITAR COTIZACIÓN
          </button>
        </div>

        {/* RIGHT SIDE — Image */}
        <div className="flex justify-center md:justify-end items-center mt-8 md:mt-0">
          <img
            src={Illustration}
            alt="logistics illustration"
            className="w-full max-w-[500px] sm:max-w-[700px] md:max-w-[900px] object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default WhyChooseUs;
