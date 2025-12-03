import { Box as LucideBox, Check, Clock, Home, Package, Truck } from "lucide-react";

const OrderProgress = ({ currentStep = 2 }: { currentStep: number }) => {
  const steps = [
    { label: "Order Placed", desc: "Your order has been placed", icon: <Clock className="w-7 h-7" /> },
    { label: "Order Confirmed", desc: "Order confirmed by seller", icon: <Check className="w-7 h-7" /> },
    { label: "Packing & Handover", desc: "Items packed & handed over", icon: <Package className="w-7 h-7" /> },
    { label: "In Transit", desc: "Shipment on the way", icon: <Truck className="w-7 h-7" /> },
    { label: "Out for Delivery", desc: "Package out for delivery", icon: <LucideBox className="w-7 h-7" /> },
    { label: "Delivered", desc: "Successfully delivered", icon: <Home className="w-7 h-7" /> }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-[#FFFFFF]">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#0A1A3A]">Order Tracking</h2>
        <p className="text-[#111111] mt-2">Track your order status in real-time</p>
      </div>

      {/* Progress Container */}
      <div className="relative">
        {/* Base Line */}
        <div className="absolute left-8 top-10 w-[90%] h-1.5 bg-[#11111133] rounded-full -z-10 md:left-10 md:top-10">
          <div
            className="absolute left-0 top-0 h-full bg-[#0A1A3A] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-10 md:space-y-0 md:flex md:gap-8 md:items-start md:justify-between px-2 md:px-0">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={index} className="flex items-center md:flex-col md:items-center md:w-44 group">

                {/* Circle */}
                <div
                  className={`
                    relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-4
                    shadow-md transition-all duration-700 z-10 mx-4 md:mx-0 group-hover:scale-105
                    ${
                      isCompleted
                        ? "bg-[#0A1A3A] border-[#0A1A3A] text-[#FFFFFF] scale-110"
                        : isCurrent
                        ? "bg-[#D4A643] border-[#D4A643] text-[#111111] scale-105 animate-pulse"
                        : "bg-[#FFFFFF] border-[#0A1A3A] text-[#111111]"
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-7 h-7" /> : step.icon}

                  {/* Pulse Effect */}
                  {isCurrent && (
                    <div className="absolute -inset-2 bg-[#D4A643] opacity-20 rounded-full animate-ping"></div>
                  )}
                </div>

                {/* Labels */}
                <div className="ml-6 md:ml-0 md:mt-6 md:text-center flex-1 min-w-0">
                  <h3
                    className={`
                      font-semibold text-sm md:text-base mb-1 truncate pr-2
                      ${isCompleted || isCurrent ? "text-[#0A1A3A]" : "text-[#111111] opacity-60"}
                    `}
                  >
                    {step.label}
                  </h3>

                  <p
                    className={`
                      text-xs md:text-sm
                      ${isCompleted || isCurrent ? "text-[#111111]" : "text-[#11111199]"}
                    `}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Card */}
      <div className="mt-12 border border-[#D4A643] rounded-2xl p-6 bg-[#FFFFFF]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#D4A643] rounded-xl flex items-center justify-center shadow-md">
              <Check className="w-7 h-7 text-[#111111]" />
            </div>

            <div>
              <h3 className="font-bold text-xl text-[#0A1A3A]">Current Status</h3>
              <p className="text-lg font-semibold text-[#D4A643]">{steps[currentStep]?.label}</p>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="text-sm text-[#111111] bg-[#FFFFFF] px-6 py-3 rounded-xl border border-[#11111122] shadow-sm">
              <span className="font-mono font-bold text-[#0A1A3A]">
                {Math.round((currentStep / (steps.length - 1)) * 100)}%
              </span>
              <span className="ml-2 opacity-70">Complete</span>
            </div>

            <div className="w-24 h-2 bg-[#11111122] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0A1A3A] transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default OrderProgress;
