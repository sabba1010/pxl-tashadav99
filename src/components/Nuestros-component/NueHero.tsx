import React from "react";
import HeroImg from "../../assets/Hero1.png";
import HeroImg2 from "../../assets/Hero2.png";
import HeroBg from "../../assets/HeroBg.png";

const NueHero: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden w-full min-h-[90vh] md:min-h-[80vh] bg-gradient-to-b from-[#005f37] to-[#a8cfc0]"
      style={{
        backgroundImage: `url(${HeroBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div
        className="mx-auto px-6"
        style={{
          backgroundImage: `url(${HeroImg2})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
          backgroundSize: "contain",
        }}
      >
        <div className="md:flex lg:gap-16 items-center md:pt-32 md:pl-20 pt-10">
          {/* LEFT */}
          <div className="text-white space-y-8 text-center lg:text-left md:w-1/2">
            <h1 className="text-5xl sm:text-5xl md:text-7xl lg:text-[123px] font-semibold leading-tight tracking-tight">
              Nuestros <br></br> Servicios
            </h1>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex z-50 flex-col justify-center lg:justify-end w-full md:w-full lg:-mr-[50%] lg:-mb-[10%] md:-mr-[40%] md:-mb-[7%]">
            <img
              src={HeroImg}
              alt="Servicios logísticos"
              className="
                relative z-10
                max-w-full
                w-[500px]
                sm:w-[700px]
                md:w-[900px]
                lg:w-[1300px]
                object-contain
              "
            />

            <button
              type="button"
              className="mt-10 md:hidden block w-full sm:w-auto px-8 py-4 bg-green-800 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-200"
            >
              SOLICITAR COTIZACIÓN
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NueHero;
