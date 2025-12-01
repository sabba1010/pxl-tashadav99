import React from 'react';
import { ChevronDown } from "lucide-react";
import { WhatsApp } from "@mui/icons-material";

const FAQPage = () => {
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

                {/* VER MÁS BUTTON */}
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
        hover:scale-105
        hover:text-white
        transition-transform duration-200
        flex items-center gap-3
    "
                    >
                        VER MÁS
                        <ChevronDown size={28} className="text-white" />
                    </button>

                </div>

                {/* RESPONSIVE CONTACT BUTTON */}
                <div className="flex justify-center mt-16">
                    <button
                        className="
                            flex items-center justify-center gap-3
                            bg-transparent 
                            border border-orange-400 
                            rounded-full 
                            hover:bg-orange-400 
                            hover:text-[#085c3b] 
                            transition 
                            group 
                            text-white 
                            
                            text-lg
                            md:text-2xl 
                            font-bold 
                            uppercase 
                            
                            w-full
                            max-w-[600px]
                            px-5
                            py-3
                        "
                    >
                        <WhatsApp 
                            className="group-hover:text-[#085c3b]" 
                            style={{ fontSize: 28 }}
                        />
                        SI TIENES PREGUNTAS, CONTÁCTANOS
                    </button>
                </div>

            </div>
        </section>
    );
};

export default FAQPage;
