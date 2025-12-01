
import { Box, Check, Clock, Home, Package, Truck } from 'lucide-react';

const OrderProgress = ({ currentStep = 2 }: { currentStep: number | 2 }) => {
  const steps = [
    { label: 'Order Placed', desc: 'Your order has been placed', icon: <Clock className="w-7 h-7" /> },
    { label: 'Order Confirmed', desc: 'Order confirmed by seller', icon: <Check className="w-7 h-7" /> },
    { label: 'Packing & Handover', desc: 'Items packed & handed over', icon: <Package className="w-7 h-7" /> },
    { label: 'In Transit', desc: 'Shipment on the way', icon: <Truck className="w-7 h-7" /> },
    { label: 'Out for Delivery', desc: 'Package out for delivery', icon: <Box className="w-7 h-7" /> },
    { label: 'Delivered', desc: 'Successfully delivered', icon: <Home className="w-7 h-7" /> },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-gradient-to-br from-orange-50/30 via-white to-green-50/30">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-green-700 bg-clip-text text-transparent">
          Order Tracking
        </h2>
        <p className="text-gray-600 mt-2">Track your order status in real-time</p>
      </div>

      {/* Progress Container */}
      <div className="relative">
        {/* Fixed Progress Line - Perfectly Aligned */}
        <div className="absolute left-8 top-10 w-[90%] h-1.5 bg-green-700 rounded-full -z-10 md:left-10 md:top-10">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#FA921D] via-orange-500 to-[#035230] rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-10 md:space-y-0 md:flex md:gap-8 md:items-start md:justify-between px-2 md:px-0">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <div 
                key={index} 
                className="flex items-center md:flex-col md:items-center md:w-44 group"
              >
                {/* Step Circle - Fixed Alignment */}
                <div className={`
                  relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-4 
                  shadow-xl transition-all duration-700 z-10 mx-4 md:mx-0 group-hover:scale-105
                  ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-[#035230] to-green-700 border-green-500/80 text-white scale-110 shadow-green-500/25' 
                      : isCurrent 
                      ? 'bg-gradient-to-br from-[#FA921D] via-orange-500 to-amber-600 border-orange-500/80 text-white scale-105 shadow-orange-500/30 animate-pulse' 
                      : 'bg-white/80 border-gray-300/50 text-gray-500 hover:border-orange-300/60 hover:bg-orange-50/50 shadow-lg'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="w-7 h-7" />
                  ) : (
                    step.icon
                  )}
                  {isCurrent && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#FA921D] to-[#035230] rounded-full opacity-20 animate-ping" />
                  )}
                </div>

                {/* Step Info */}
                <div className="ml-6 md:ml-0 md:mt-6 md:text-center flex-1 min-w-0">
                  <h3 className={`
                    font-semibold text-sm md:text-base mb-1 truncate pr-2
                    ${
                      isCompleted || isCurrent 
                        ? 'text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent' 
                        : 'text-gray-500 group-hover:text-gray-700'
                    }
                  `}>
                    {step.label}
                  </h3>
                  <p className={`
                    text-xs md:text-sm
                    ${
                      isCompleted || isCurrent 
                        ? 'text-gray-700 font-medium' 
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

      {/* Current Status Card - Updated Colors */}
      <div className="mt-12 bg-gradient-to-r from-[#FA921D]/10 via-white to-[#035230]/10 border border-[#FA921D]/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FA921D] via-orange-500 to-[#035230] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Check className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">Current Status</h3>
              <p className="text-lg font-semibold bg-gradient-to-r from-[#FA921D] to-[#035230] bg-clip-text text-transparent">
                {steps[currentStep]?.label}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-200/50 shadow-sm">
              <span className="font-mono font-bold text-[#035230]">{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
              <span className="ml-2 text-gray-500">Complete</span>
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#FA921D] to-[#035230] rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default OrderProgress;