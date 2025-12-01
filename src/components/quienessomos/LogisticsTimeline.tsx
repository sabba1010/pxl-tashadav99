import React from "react";
import icon from "../../assets/Grupo-icon.png";
import timeline from "../../assets/Grupoline.png";

const LogisticsTimeline: React.FC = () => {
  return (
    <div
      className="w-full overflow-x-hidden flex justify-center bg-[linear-gradient(to_bottom,white_50%,#026432_50%)]"
      style={{ translate: "0" }}
    >
      {/* Mobile-only faster scroll */}
      <style>{`
        @media (max-width: 640px) {
          .mobile-faster {
            animation-duration: 8s !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-[2100px] px-4">

        {/* 🔵 TOP ICON – AUTO LOOP */}
        <div className="w-full overflow-hidden mb-8">
          <div
            className="flex will-change-transform animate-scrollX mobile-faster"
            style={{ animationPlayState: "running", touchAction: "pan-y" }}
          >
            <img
              src={icon}
              alt="Icon Row"
              draggable={false}
              className="min-w-[600px] sm:min-w-[1000px] md:min-w-[1600px] lg:min-w-[2000px] max-w-none h-auto object-contain select-none"
            />
            <img
              src={icon}
              alt="Icon Row Duplicate"
              draggable={false}
              className="min-w-[600px] sm:min-w-[1000px] md:min-w-[1600px] lg:min-w-[2000px] max-w-none h-auto object-contain select-none"
            />
          </div>
        </div>

        {/* 🟢 TIMELINE – AUTO LOOP */}
        <div className="w-full overflow-hidden">
          <div
            className="flex will-change-transform animate-scrollX mobile-faster"
            style={{ animationPlayState: "running", touchAction: "pan-y" }}
          >
            <img
              src={timeline}
              alt="Timeline"
              draggable={false}
              className="min-w-[800px] sm:min-w-[1400px] md:min-w-[2000px] lg:min-w-[2500px] max-w-none h-auto object-contain select-none"
            />
            <img
              src={timeline}
              alt="Timeline Duplicate"
              draggable={false}
              className="min-w-[800px] sm:min-w-[1400px] md:min-w-[2000px] lg:min-w-[2500px] max-w-none h-auto object-contain select-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default LogisticsTimeline;
