import React from "react";
import car from "../../assets/Grupo car.png";

const Seccion: React.FC = () => {
  return (
    <div className="w-full max-w-[1673px] min-h-[400px] md:min-h-[500px] lg:h-[662.87px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 -mb-8 md:-mb-16 lg:-mb-[135px] bg-[#F7941D] flex items-center justify-between rounded-2xl shadow-lg overflow-visible relative py-12 md:py-16 lg:py-0">
      {/* ---------------- DESKTOP IMAGE ---------------- */}
      <div className="absolute left-0 -translate-x-8 sm:-translate-x-12 md:-translate-x-16 lg:-translate-x-20 -translate-y-6 md:-translate-y-12 pointer-events-none hidden sm:block">
        <img
          src={car}
          alt="Illustration"
          className="w-[300px] h-[258px] sm:w-[500px] sm:h-[344px] md:w-[600px] md:h-[516px] lg:w-[936.9px] lg:h-[805.79px] object-contain"
        />
      </div>

      {/* ---------------- RIGHT TEXT CONTENT ---------------- */}
      <div className="w-full sm:w-auto sm:max-w-xl text-white sm:ml-auto z-10">
        {/* TITLE */}
        <h1 className="font-[Avenir Next LT Pro] text-4xl sm:text-5xl md:text-6xl lg:text-[82px] leading-tight mb-4 md:mb-6">
          Sección <br /> de Recogida
        </h1>

        {/* PARAGRAPH */}
        <p className="font-[Avenir Next LT Pro] text-sm sm:text-base md:text-[17px] mb-6 md:mb-10 leading-relaxed">
          rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer
          adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet
          dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
          nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex
          ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in
          vulputate velit esse molestie consequat.
        </p>

        {/* BUTTON */}
        <button
          className="w-full sm:w-auto sm:min-w-[300px] md:min-w-[400px] lg:w-[599.59px] h-[56px] sm:h-[60px] md:h-[70.81px] bg-[#046838] rounded-[25px] shadow-md text-white text-lg sm:text-xl md:text-2xl lg:text-[28px] font-[Avenir Next LT Pro] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-[0_20px_30px_-5px_rgba(0,0,0,0.35)] hover:bg-[#035228] active:scale-95"
        >
          Solicitar Recogida
        </button>

        {/* MOBILE IMAGE */}
        <div className="block sm:hidden mt-8 flex justify-center">
          <img src={car} alt="Illustration" className="w-[260px] h-auto object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Seccion;
