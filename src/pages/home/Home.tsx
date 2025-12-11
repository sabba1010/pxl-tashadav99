import React from "react";

import HeroBannerSection from "../../components/HomeComponents/HeroBannerSection";
import StandoutAccounts from "../../components/HomeComponents/StandoutAccounts";
import WhyChooseUs from "../../components/HomeComponents/WhyChooseUs";
import HowItWorks from "../../components/HomeComponents/HowItWorks";
import ReportTransaction from "../../components/HomeComponents/ReportTransaction";
//import HomeLinks from "../../components/HomeComponents/HomeLinks";
import HomeAboutSection from "../../components/HomeComponents/HomeAboutSection"
import ReferralProgram from "../../components/HomeComponents/ReferralProgram";

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-900 overflow-hidden">
      {/* Hero Banner Section - Modern Gradient + Glassmorphism */}
      <HeroBannerSection />
      {/* Standout Accounts Section - Modern Cards */}
      <StandoutAccounts />

       {/* Hero About Section - Modern Gradient + Glassmorphism */}
      <HomeAboutSection />
 
      {/* Why Choose Us + Features - Combined Modern Grid */}
      <WhyChooseUs />
      {/* How It Works - Modern Flow */}
      <HowItWorks />
        {/* How to Report a Transaction - Modern Flow */}
      <ReportTransaction />
      
      {/* Referral Program - Earn Rewards */}
      <ReferralProgram />

    </div>
  );
};

export default Home;
