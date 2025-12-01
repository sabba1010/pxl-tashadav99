import React from "react";

const FAQ: React.FC = () => {
  return (
    <section
      className="
        bg-[#026432ff]
        w-full
        max-w-[1944px]
        mx-auto
        px-5
        md:px-10
        lg:px-20
        pt-20
        pb-20
        overflow-hidden
      "
    >
      <div className="mt-10 md:mt-[135px]">
        {/* TITLE */}
        <h2
          className="
            text-white
            font-[Avenir_Next_LT_Pro]
            text-[40px]
            md:text-[60px]
            lg:text-[97px]
            font-[700]
            leading-tight
            md:leading-[90px]
            lg:leading-[116px]
            tracking-[3px]
            md:tracking-[4px]
            lg:tracking-[6.01px]
            text-center
            mx-auto
            px-2
          "
        >
          Preguntas Frecuentes (FAQ)
        </h2>

        {/* ORANGE LINE */}
        <div className="flex justify-center mt-6 md:mt-8 mb-10 md:mb-16 origin-center">
          <div
            className="
              bg-[#F5C65A]
              w-[643px]
              h-[0px]
              border-t-[3px]
              border-[#F5C65A]
            "
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 lg:gap-x-20 gap-y-12 md:gap-y-16">

          {/* LEFT COLUMN */}
          <div className="space-y-10 md:space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={`left-${i}`}>
                <h3
                  className="
                    text-white
                    font-[Avenir_Next_LT_Pro]
                    text-[20px]
                    md:text-[23px]
                    font-[500]
                    leading-[26px]
                    md:leading-[28px]
                    tracking-[1.2px]
                    md:tracking-[1.43px]
                    text-left
                    lg:ml-[327px]
                    ml-0
                    transition-colors duration-300 hover:text-[#F5C65A]
                  "
                >
                  rápidos, económicos y seguros Lorem ipsum dolor?
                </h3>

                <p
                  className="
                    text-white
                    font-[Avenir_Next_LT_Pro]
                    text-[15px]
                    md:text-[17px]
                    font-[500]
                    leading-[20px]
                    md:leading-[21px]
                    tracking-[1px]
                    text-left
                    lg:ml-[327px]
                    ml-0
                    mt-3
                  "
                >
                  rápidos, económicos y seguros Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit, sed diam nonummy nibh euismod
                  tincidunt ut laoreet dolore magna aliquam erat volutpat.
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-10 md:space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={`right-${i}`}>
                <h3
                  className="
                    text-white
                    font-[Avenir_Next_LT_Pro]
                    text-[20px]
                    md:text-[23px]
                    font-[500]
                    leading-[26px]
                    md:leading-[28px]
                    tracking-[1.2px]
                    md:tracking-[1.43px]
                    text-left
                    lg:mr-[266px]
                    mr-0
                    transition-colors duration-300 hover:text-[#F5C65A]
                  "
                >
                  rápidos, económicos y seguros Lorem ipsum dolor?
                </h3>

                <p
                  className="
                    text-white
                    font-[Avenir_Next_LT_Pro]
                    text-[15px]
                    md:text-[17px]
                    font-[500]
                    leading-[20px]
                    md:leading-[21px]
                    tracking-[1px]
                    text-left
                    lg:mr-[339px]
                    mr-0
                    mt-3
                  "
                >
                  rápidos, económicos y seguros Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit, sed diam nonummy nibh euismod
                  tincidunt ut laoreet dolore magna aliquam erat volutpat.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-16 md:mt-20">
          <button
            className="
              text-white
              font-[Avenir_Next_LT_Pro]
              text-[18px]
              md:text-[22px]
              tracking-[1px]
              md:tracking-[1.5px]
              px-10
              md:px-14
              py-2.5
              md:py-3
              rounded-[24.5px]
              border-[2px]
              border-[#FA921D]
              hover:scale-105
              hover:bg-[#FA921D]
              hover:text-white
              transition-transform duration-200
            "
          >
            VER MÁS
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
