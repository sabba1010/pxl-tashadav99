import React from "react";
import HeroBg from "../../assets/HeroBg.png";
import HeroImg from "../../assets/tinda-hero-img.png";

const TiendaHero = () => {
  return (
    <div
      className="min-h-[40vh] grid grid-cols-2 md:px-20 md:py-0 py-5 px-5 overflow-x-hidden z-0"
      style={{
        backgroundImage: `url(${(HeroBg as any).src ?? HeroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col justify-center items-center">
        <h1 className="md:text-[100px] text-6xl text-white md:text-left text-center font-extrabold md:font-semibold">
          Tienda online
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center pt-10 md:w-full w-[500px] md:ml-0 -ml-40 md:mb-0 z-10">
        <img className="md:w-[70%] w-[320px] z-20" src={HeroImg} alt="" />
      </div>
    </div>
  );
};

export default TiendaHero;
