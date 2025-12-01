import React from "react";
import image from "../../assets/Grupo-1640.png";

const CasilleroEscritorio: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-green-900 to-orange-300 p-4 md:p-6">
      <div
        className="bg-gradient-to-br from-green-800 to-green-900 text-white rounded-2xl md:rounded-3xl shadow-2xl relative overflow-visible w-full max-w-[1400px]"
        style={{ minHeight: "492px" }}
      >
        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] h-full">
          {/* LEFT – Content */}
          <div className="flex flex-col justify-center py-8 px-6 sm:px-8 md:px-10 lg:px-12 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
                Your US Address
              </h1>

              <button className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 transition-all text-white font-bold py-2.5 px-8 rounded-full shadow-lg uppercase text-xs tracking-wider whitespace-nowrap self-start">
                Seleccionar
              </button>
            </div>

            {/* Description – hidden on mobile to save space, shown from sm upwards */}
            <p className="hidden sm:block text-white/90 font-medium text-sm md:text-base leading-relaxed mb-6 md:mb-8">
              rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat...
            </p>

            {/* Mobile short description */}
            <p className="sm:hidden text-white/90 text-sm leading-relaxed mb-6">
              rápidos, económicos y seguros. Tu dirección en EE.UU. para comprar y recibir paquetes fácilmente.
            </p>

            {/* Inputs grid – 1 column on mobile, 2 from sm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <input
                  key={i}
                  type="text"
                  placeholder="Lorem ipsum dolor sit amet,"
                  className="w-full bg-transparent text-white placeholder-white/60 rounded-full py-3 px-5 border-2 border-orange-400 focus:border-orange-300 focus:outline-none text-sm transition-all"
                />
              ))}
            </div>
          </div>

          {/* RIGHT – Image (desktop overflow preserved) */}
          <div className="relative hidden lg:flex items-center justify-center overflow-visible">
            <div className="absolute inset-0 pointer-events-none overflow-visible">
              <img
                src={image}
                alt="US Address Illustration"
                className="object-contain drop-shadow-2xl z-50"
                style={{
                  position: "absolute",
                  right: "-130px",
                  top: "-70px",
                  height: "calc(100% + 180px)",
                  width: "auto",
                  maxWidth: "650px",
                }}
              />
            </div>
          </div>

          {/* Image for Tablet & Mobile – centered and scaled nicely, no extreme overflow */}
          <div className="flex lg:hidden items-center justify-center py-8 px-4">
            <img
              src={image}
              alt="US Address Illustration"
              className="w-full max-w-sm sm:max-w-md object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasilleroEscritorio;