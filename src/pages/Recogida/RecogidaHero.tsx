import React from "react";
import HeroImg from "../../assets/RecogidaHero.png";
import HeroBg from "../../assets/HeroBg.png";
import { useAuth } from "../../context/AuthContext";

const RecogidaHero: React.FC = () => {
  const userData = useAuth();
  console.log(userData?.users);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(90deg, #0b5b39 0%, #8fc6b4 45%, #f5b370 100%), url(" +
          HeroBg +
          ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
        backgroundSize: "cover",
        minHeight: "80vh",
      }}
    >
     

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-12 md:pt-24 pb-6">
        <div className="md:flex items-center lg:gap-16">
          {/* LEFT: Title */}
    <h1
  className="
    text-white font-semibold tracking-tight leading-[1.05]
    text-[32px] sm:text-[42px] md:text-[55px] lg:text-[75px] xl:text-[90px]
    whitespace-pre
    lg:mt-[10%]
  "
>
  Servicio de{"\n"}
  <span className="inline-block">Recogida</span>
</h1>



          {/* RIGHT: Truck image - single className, responsive sizes, negative bottom margin only on lg, large z-index */}
          <div className="z-[9999] md:mb-[-20%] lg:mb-[-25%]   relative flex justify-center lg:justify-end items-end pointer-events-none">
            <img
              src={HeroImg}
              alt="Servicios logísticos"
              className={
                "pointer-events-none object-contain z-[9999] " +
                "w-[90%] h-auto " +                // base (mobile)
                "sm:w-[420px] sm:h-[344px] " +     // small tablets
                "md:w-[600px] md:h-[490px] " +     // medium screens
                "lg:w-[753.92px] lg:h-[616.04px] md:mr-[-40%] lg:mr-[-50%]"
              }
              style={{
                maxWidth: "none",
                maxHeight: "none",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecogidaHero;
