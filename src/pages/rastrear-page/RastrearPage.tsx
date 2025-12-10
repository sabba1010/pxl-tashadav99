import React, { useState } from "react";
import TrackingImage from "../../assets/rastrear-page-banner-image.png";
import HeroBg from "../../assets/HeroBg.png";
import { Box, Check, Clock, Home, Package, Truck } from 'lucide-react';

const steps = [
  { label: 'Order Placed', desc: 'Your order has been placed', icon: <Clock className="w-7 h-7" /> },
  { label: 'Order Confirmed', desc: 'Order confirmed by seller', icon: <Check className="w-7 h-7" /> },
  { label: 'Packing & Handover', desc: 'Items packed & handed over', icon: <Package className="w-7 h-7" /> },
  { label: 'In Transit', desc: 'Shipment on the way', icon: <Truck className="w-7 h-7" /> },
  { label: 'Out for Delivery', desc: 'Package out for delivery', icon: <Box className="w-7 h-7" /> },
  { label: 'Delivered', desc: 'Successfully delivered', icon: <Home className="w-7 h-7" /> },
];

const RastrearPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(4); 

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // API call এখানে হবে
    // setCurrentStep(newStepFromAPI);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div 
        className="relative min-h-[78vh] bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${HeroBg})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10">
          <div className="max-w-[1280px] mx-auto py-10 md:py-20 px-4">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center justify-center">
              
              {/* Left Side: Form */}
              <div className="w-full lg:w-1/2">
                {/* Title */}
                <div className="text-center lg:text-left pb-8 md:pb-12">
                  <h1 className="text-4xl md:text-5xl lg:text-[55px] text-white leading-tight font-bold">
                    Package Tracking <br />
                    is Easy with <br />
                    <span className="bg-gradient-to-r from-[#FA921D] to-[#035230] bg-clip-text text-transparent">
                      Order Number
                    </span>
                  </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleTrackOrder} className="space-y-6 max-w-lg mx-auto lg:mx-0">
                  {/* Tracking Number Input */}
                  <div>
                    <input
                      type="text"
                      placeholder="Número de rastreo"
                      className="
                        w-full p-4 pl-6 rounded-full border-2 border-[#FA921D]/50 
                        bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 
                        text-lg font-medium shadow-lg focus:border-[#035230] 
                        focus:ring-4 focus:ring-[#FA921D]/20 focus:outline-none
                        transition-all duration-300 hover:shadow-xl
                      "
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      className="
                        w-full p-4 pl-6 rounded-full border-2 border-[#FA921D]/50 
                        bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 
                        text-lg font-medium shadow-lg focus:border-[#035230] 
                        focus:ring-4 focus:ring-[#FA921D]/20 focus:outline-none
                        transition-all duration-300 hover:shadow-xl
                      "
                    />
                  </div>

                  {/* Track Button */}
                  <button
                    type="submit"
                    className="
                      w-full py-4 px-8 rounded-full text-xl font-bold uppercase 
                      bg-gradient-to-r from-[#FA921D] to-[#035230] 
                      hover:from-[#035230] hover:to-[#FA921D] text-white 
                      shadow-xl hover:shadow-2xl transform hover:scale-[1.02]
                      transition-all duration-300 ease-in-out
                      focus:ring-4 focus:ring-[#FA921D]/30
                    "
                  >
                    RASTREAR
                  </button>
                </form>
              </div>

              {/* Right Side: Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative">
                  <img
                    src={TrackingImage}
                    alt="Delivery Truck and Tracking Map Illustration"
                    className="w-full h-auto object-contain max-h-[600px] lg:max-h-[800px] mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracking Section */}
      <div className="relative -mt-10 lg:-mt-36 mb-10">
        <div className="w-full max-w-6xl mx-auto px-4">
          {/* Progress Container with White Background */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50">
            
            {/* Header */}
            <div className="text-center mb-10 lg:mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#FA921D] via-orange-600 to-[#035230] bg-clip-text text-transparent">
                Order Tracking Progress
              </h2>
              <p className="text-gray-600 mt-3 text-lg">Track your order status in real-time</p>
            </div>

            {/* Progress Steps */}
            <div className="relative">
              {/* Fixed Progress Line */}
              <div className="md:absolute hidden md:flex left-8 top-12 w-[calc(100%-3rem)] h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full -z-10 lg:left-10 lg:top-12 lg:w-[calc(100%-6rem)]">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FA921D] via-orange-500 to-[#035230] rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-12 lg:space-y-0 lg:flex lg:gap-10 lg:items-start lg:justify-between px-4 lg:px-0">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <div 
                      key={index} 
                      className="flex items-center lg:flex-col lg:items-center lg:w-48 group relative"
                    >
                      {/* Step Circle */}
                      <div className={`
                        relative flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 
                        shadow-2xl transition-all duration-700 z-10 mx-6 lg:mx-0 group-hover:scale-105
                        ${
                          isCompleted 
                            ? 'bg-gradient-to-br from-[#035230] to-green-700 border-green-500/80 text-white scale-110 shadow-green-500/30' 
                            : isCurrent 
                            ? 'bg-gradient-to-br from-[#FA921D] via-orange-500 to-amber-600 border-orange-500/80 text-white scale-110 shadow-orange-500/40 animate-pulse' 
                            : 'bg-white/80 border-gray-300/60 text-gray-500 hover:border-[#FA921D]/60 hover:bg-gradient-to-br hover:from-[#FA921D]/10 hover:to-[#035230]/10 shadow-xl'
                        }
                      `}>
                        {isCompleted ? (
                          <Check className="w-8 h-8 lg:w-9 lg:h-9" />
                        ) : (
                          step.icon
                        )}
                        {isCurrent && (
                          <div className="absolute -inset-2 bg-gradient-to-r from-[#FA921D] to-[#035230] rounded-full opacity-20 animate-ping" />
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="ml-8 lg:ml-0 lg:mt-6 lg:text-center flex-1 min-w-0">
                        <h3 className={`
                          font-bold text-sm lg:text-base mb-2 truncate pr-2
                          ${
                            isCompleted || isCurrent 
                              ? 'text-gray-900 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent' 
                              : 'text-gray-500 group-hover:text-gray-700 transition-colors'
                          }
                        `}>
                          {step.label}
                        </h3>
                        <p className={`
                          text-xs lg:text-sm font-medium
                          ${
                            isCompleted || isCurrent 
                              ? 'text-gray-700' 
                              : 'text-gray-400 group-hover:text-gray-600'
                          }
                        `}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Status Card */}
            <div className="mt-16 lg:mt-20 bg-gradient-to-r from-[#FA921D]/5 via-white/80 to-[#035230]/5 border border-[#FA921D]/20 rounded-3xl p-8 lg:p-10 backdrop-blur-xl shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#FA921D] via-orange-500 to-[#035230] rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/25">
                    <Check className="w-8 h-8 lg:w-9 lg:h-9 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl lg:text-2xl text-gray-900 mb-1">Current Status</h3>
                    <p className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#FA921D] to-[#035230] bg-clip-text text-transparent">
                      {steps[currentStep]?.label}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  {/* Progress Percentage */}
                  <div className="text-center bg-white/70 backdrop-blur-sm px-8 py-4 rounded-2xl border border-gray-200/50 shadow-lg">
                    <span className="text-3xl font-bold text-[#035230]">{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
                    <span className="ml-2 text-gray-600 font-medium">Complete</span>
                  </div>
                  
                  {/* Mini Progress Bar */}
                  <div className="w-full max-w-xs">
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-[#FA921D] to-[#035230] rounded-full transition-all duration-1000 ease-out shadow-sm"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RastrearPage;