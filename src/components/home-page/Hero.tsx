import React from "react";
import HeroBg from "../../assets/HeroBg.png";


const Hero = () => {
  return (
    <div       className="min-h-[90vh] flex justify-center px-32 w-full bg-gradient-to-b from-[#005f37] to-[#a8cfc0] lg:h-[873px] py-12 lg:py-20 overflow-hidden relative"
      style={{
        backgroundImage: `url(${(HeroBg as any).src ?? HeroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
          }}
      >
      <div className="w-1/2 flex justify-center flex-col">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-[600] leading-tight tracking-tight">
          PROVEEDOR <br />
          DE SERVICIOS <br />
          LOGÍSTICOS
        </h1>
        <p className="max-w-xl text-sm md:text-base text-green-100 hidden md:block my-5">
          Soluciones logísticas integrales — transporte, almacenamiento y
          distribución con tecnología para que tu operación fluya.
        </p>
        <button
          type="button"
          className="hidden w-1/3  md:inline-flex items-center gap-3 px-6 py-3 bg-white text-green-900 rounded-full font-semibold shadow-lg hover:opacity-95 transition"
        >
          SOLICITAR COTIZACIÓN
        </button>
      </div>
      <div className="w-1/2"></div>
    </div>
  );
};

export default Hero;
