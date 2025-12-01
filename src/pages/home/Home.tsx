import React from "react";
import Seccion from "../../components/home-page/Seccion";
import FAQ from "../../components/home-page/FAQ";

import Quedicen from "../../components/home-page/Quedicen";
import Newone from "../../components/home-page/Newone";
import LogisticsTimeline from "../../components/home-page/LogisticsTimeline";
import Nuestros from "../../components/home-page/Nuestros";
import Rastrear from "../../components/home-page/Rastrear";
import HeroOne from "../../components/home-page/HeroOne";

const Home = () => {
  return (
    <>
      <HeroOne />
      <Nuestros />
      <Rastrear />
      <Seccion />
      <FAQ />
      <Newone />
      <Quedicen />
      <LogisticsTimeline />
    </>
  );
};

export default Home;
