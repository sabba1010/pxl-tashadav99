import React from "react";

import HeroBannerSection from "../../components/HomeComponents/HeroBannerSection";
import StandoutAccounts from "../../components/HomeComponents/StandoutAccounts";
import ExplorebyCategory from "../../components/HomeComponents/ExplorebyCategory";
import WhyChooseUs from "../../components/HomeComponents/WhyChooseUs";
import HowItWorks from "../../components/HomeComponents/HowItWorks";

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-900 overflow-hidden">
      {/* Hero Banner Section - Modern Gradient + Glassmorphism */}
        <HeroBannerSection />
      {/* Standout Accounts Section - Modern Cards */}
      <StandoutAccounts />

     

    

       {/* Explore by Category - Glass Cards */}
     <ExplorebyCategory />

       {/* Why Choose Us + Features - Combined Modern Grid */}
      <WhyChooseUs />

      {/* How It Works - Modern Flow */}
   
    <HowItWorks />
    </div>
  );
};

export default Home;