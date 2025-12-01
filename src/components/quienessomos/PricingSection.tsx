import React from "react";
import PricingImg from '../../assets/Grupo-1653.png';


const PricingSection: React.FC = () => {
  return (
    <div className="flex justify-center w-full md:py-20 py-10 bg-white">
      {/* ORANGE WRAPPER */}
      
      <div
        className="rounded-[40px] pt-20 md:pb-0 pb-5 px-6 relative"
        style={{
          width: "1600px",
          backgroundColor: "#F9921D",
          boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        {/* TITLE */}
        <div className="text-center">
          <h1
            className="font-avenir font-bold tracking-[2px] text-white md:text-5xl text-4xl"
            
          >
            PRECIOS FLEXIBLES Y TRANSPARENTES
          </h1>

          <p
            className="font-avenir font-medium mt-4 text-white leading-tight"
            style={{ fontSize: "30px" }}
          >
            diseñados para adaptarse a tus necesidades logísticas
          </p>
        </div>

        {/* CARDS */}
        <div className="md:mt-20 mt-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 place-items-center">
          {/* CARD 1 */}
          <div
            className="w-[350px] bg-[#065F3A] rounded-[18px] px-10 pt-8 pb-10 text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
            style={{ height: "480px" }}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold font-avenir text-[22px] leading-tight text-center w-full tracking-[1px]">
                PAQUETE <br /> BÁSICO
              </h3>
              <span className="text-xl -mt-2">♡</span>
            </div>

            <div className="w-full h-[2px] bg-[#F9921D] my-5"></div>

            <div className="text-center">
              <p className="font-bold text-[60px] leading-[60px]">8.99</p>
              <span className="text-lg">$/LB</span>

              <p className="text-[13px] mt-4 opacity-90 leading-tight">
                ismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut
                wisi enim ad minim veniam, quis nostrud
              </p>

              <div className="mt-5 text-[18px] space-y-1">
                <p>Detalle 1</p>
                <p>Detalle 2</p>
                <p>Detalle 3</p>
              </div>

              <button
                className="mt-5 bg-[#F9921D] text-white font-bold text-[18px] w-[140px] py-2 rounded-full"
              >
                Solicitar
              </button>
            </div>
          </div>

          {/* CARD 2 (BIGGER) */}
          <div
            className="w-[350px] bg-[#065F3A] rounded-[18px] px-10 pt-8 pb-10 text-white shadow-[0_12px_24px_rgba(0,0,0,0.3)] scale-105"
            style={{ height: "540px" }}
          >
            <div className="flex justify-between">
              <h3 className="font-bold font-avenir text-[22px] leading-tight text-center w-full tracking-[1px]">
                PAQUETE <br /> PERSONALIZADO
              </h3>
              <span className="text-xl -mt-2">♡</span>
            </div>

            <div className="w-full h-[2px] bg-[#F9921D] my-5"></div>

            <div className="text-center">
              <p className="font-bold text-[60px] leading-[60px]">0.99</p>
              <span className="text-lg">$/LB</span>

              <div className="flex justify-center my-4">
                <img
                  alt="priceing"
                  src={PricingImg}
                  className="w-[125px] h-[125px] object-contain"
                />
              </div>

              <p className="text-[13px] mt-2 opacity-90 leading-tight">
                ismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut
                wisi enim ad minim veniam, quis nostrud exer
              </p>

              <button
                className="mt-5 bg-[#F9921D] text-white font-bold text-[18px] w-[180px] py-2 rounded-full"
              >
                Contactar directo
              </button>
            </div>
          </div>

          {/* CARD 3 */}
          <div
            className="w-[350px] bg-[#065F3A] rounded-[18px] px-10 pt-8 pb-10 text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
            style={{ height: "480px" }}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold font-avenir text-[22px] leading-tight text-center w-full tracking-[1px]">
                PAQUETE <br /> PLUS
              </h3>
              <span className="text-xl -mt-2">♡</span>
            </div>

            <div className="w-full h-[2px] bg-[#F9921D] my-5"></div>

            <div className="text-center">
              <p className="font-bold text-[60px] leading-[60px]">6.99</p>
              <span className="text-lg">$/LB</span>

              <p className="text-[13px] mt-4 opacity-90 leading-tight">
                ismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut
                wisi enim ad minim veniam, quis nostrud
              </p>

              <div className="mt-5 text-[18px] space-y-1">
                <p>Detalle 1</p>
                <p>Detalle 2</p>
                <p>Detalle 3</p>
              </div>

              <button
                className="mt-5 bg-[#F9921D] text-white font-bold text-[18px] w-[140px] py-2 rounded-full"
              >
                Solicitar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
