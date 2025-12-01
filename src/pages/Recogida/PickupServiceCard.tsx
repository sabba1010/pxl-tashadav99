import React from "react";
import mapIllustration from "../../assets/pickup-map.png"; // update path

const PickupServiceCard: React.FC = () => {
  return (
    <section className="w-full flex justify-center py-12 px-4 bg-transparent">
      {/* CARD: fluid but keep original max size */}
      <div
        className="
          z-10 lg:mt-[-9%] md:mt-[-7%]
          bg-[#0f6b3f] text-white rounded-[30px] shadow-2xl
          px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 py-10 sm:py-12 md:py-14 overflow-hidden
          w-full max-w-[1673px]
        "
      >
        {/* Title (responsive with clamp so it never gets too small or too large) */}
        <h1
          className="text-center font-semibold leading-tight"
          style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
        >
          <span className="text-orange-400">Vamos a tu casa u oficina</span>
        </h1>

        {/* Divider */}
        <div className="w-full flex justify-center mt-8 mb-8">
          <div className="h-[3px] w-full max-w-[800px] bg-orange-400 rounded-full" />
        </div>

        {/* Subtitle */}
        <h2
          className="text-center tracking-widest mb-10"
          style={{ fontSize: "clamp(18px, 2.2vw, 30px)" }}
        >
          CÓMO FUNCIONA:
        </h2>

        {/* Timeline */}
        <div className="relative mb-12 px-4 sm:px-10">
          {/* Horizontal line (positioned responsively using left/right offsets) */}
          <div className="absolute left-6 right-6 sm:left-16 sm:right-16 top-[110px] h-[4px] bg-orange-400 rounded-full"></div>

          {/* Steps: responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-center gap-8 sm:gap-10">
            {[
              { num: "01", text: "Solicitas la recogida" },
              { num: "02", text: "Confirmamos horario" },
              { num: "03", text: "Vamos a tu dirección" },
              { num: "04", text: "Procesamos y enviamos" }
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center px-2">
                {/* Number - responsive using clamp */}
                <div
                  className="font-light mb-4"
                  style={{ fontSize: "clamp(36px, 6.2vw, 90px)" }}
                >
                  {step.num}
                </div>

                {/* Dot */}
                <div className="w-6 h-6 bg-orange-400 rounded-full mb-4 z-10" />

                {/* Label */}
                <p style={{ fontSize: "clamp(16px, 1.6vw, 22px)" }} className="leading-tight max-w-[260px]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Areas + Image */}
        <div className="bg-[#0c5c36] border-[3px] border-orange-400 rounded-[22px] p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row items-center gap-8 mt-8">
          {/* Areas */}
          <div className="flex-1 w-full">
            <h3 className="font-semibold mb-4" style={{ fontSize: "clamp(20px, 2.4vw, 32px)" }}>
              ÁREAS:
            </h3>

            <ul className="grid grid-cols-2 gap-3 text-[clamp(14px,1.6vw,22px)]">
              <li className="flex items-center gap-2"><span className="text-orange-400">•</span> Miami</li>
              <li className="flex items-center gap-2"><span className="text-orange-400">•</span> Hialeah</li>
              <li className="flex items-center gap-2"><span className="text-orange-400">•</span> Homestead</li>
              <li className="flex items-center gap-2"><span className="text-orange-400">•</span> Doral</li>
              <li className="flex items-center gap-2"><span className="text-orange-400">•</span> Kendall</li>
            </ul>
          </div>

          {/* Illustration */}
          <div className="w-full lg:w-[420px] flex-shrink-0">
            <img
              src={mapIllustration}
              alt="map"
              className="w-full h-auto object-contain drop-shadow-lg"
              draggable={false}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 sm:mt-12 text-[clamp(18px,2.2vw,30px)] font-medium flex flex-col sm:flex-row justify-around items-center gap-4 sm:gap-0">
          <p>+ Comodidad</p>
          <p>+ Ahorro de tiempo</p>
          <p>+ Seguridad</p>
        </div>
      </div>
    </section>
  );
};

export default PickupServiceCard;
