import React from "react";
import QuienesSomosImg from "../../assets/Grupo.png";
import HeroBg from "../../assets/HeroBg.png";

const QuienesSomosBanner: React.FC = () => {
  return (

    <div className="overflow-x-hidden">
      <div
        style={{
          backgroundImage: `url(${HeroBg})`,
          backgroundPosition: "bottom",
        }}
      >
        <div className="relative w-full overflow-x-hidden">
          <div className="hidden md:block">
            <h1 className=" md:py-52 lg:py-60 md:pl-20 lg:pl-32 xl:pl-52 md:text-5xl lg:text-7xl 2xl:text-9xl text-white uppercase">
              Quiénes Somos
            </h1>
          </div>

          <div className="block md:hidden">
            <h1 className="py-20 pl-10 text-5xl font-bold text-white uppercase">
              Quiénes <br /> Somos
            </h1>
          </div>

          <img
            src={QuienesSomosImg}
            alt=""
            className="absolute top-1 lg:top-[-5px] lg:right-[-200px] xl:right-0 right-[-100px]  pointer-events-none "
          />
        </div>
      </div>

      <div className="mt-[-55px] md:mt-[-40px]">
        <div className="bg-[#046838] max-w-[1500px] mx-auto rounded-3xl p-6 md:p-12 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-start relative">
            <div
              className="hidden md:block absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-orange-500"
              aria-hidden="true"
            ></div>

            <div className="text-white md:pr-4 relative z-10 text-center md:text-left">
              <p className="text-2xl sm:text-3xl lg:text-4xl leading-tight pt-6 md:pt-0 mb-6">
                Nos especializamos en ofrecer soluciones innovadoras de logística.
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl leading-tight">
                Adaptadas para satisfacer las necesidades únicas de nuestros clientes.
              </p>
            </div>

            <hr className="md:hidden border border-[#fa921d] w-[200px] mx-auto" />

            <div className="text-white text-base lg:text-lg space-y-4 md:pl-4 relative text-center md:text-left z-10">
              <p>
                La logística contrata a grandes profesionales de diversos orígenes, lo que simplemente nos hace más fuertes, y no podríamos estar más orgullosos de impulsar y optimizar tu negocio.
              </p>
              <p>
                <strong>Real Transport Inc</strong> fue fundada e incorporada en <strong>1997</strong> en Milwaukee, Wisconsin.
              </p>
              <p>
                Nuestro equipo experimentado brinda un servicio inigualable, una comunicación excepcional y utiliza planificación logística de vanguardia para que tu envío se complete a tiempo, fundada también en diversos orígenes, lo cual nos fortalece aún mas.
              </p>
            </div>
          </div>

          <div className="mt-12 md:mt-16 pt-8 md:pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <span className="text-[#fa921d] text-5xl sm:text-6xl lg:text-9xl block">+50</span>
              <span className="text-white text-xl sm:text-2xl font-semibold">Clientes</span>
            </div>

            <div>
              <span className="text-[#fa921d] text-5xl sm:text-6xl lg:text-9xl block">+65</span>
              <span className="text-white text-xl sm:text-2xl font-semibold">Países</span>
            </div>

            <div>
              <span className="text-[#fa921d] text-5xl sm:text-6xl lg:text-9xl block">+15</span>
              <span className="text-white text-xl sm:text-2xl font-semibold">Años</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 1024px) {
          .overflow-x-hidden { overflow-x: hidden !important; }
        }/* Hide horizontal scrollbar on desktop only */


      `}</style>
 </div>
  );
};

export default QuienesSomosBanner;
