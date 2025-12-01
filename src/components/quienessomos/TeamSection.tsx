import React, { useState } from "react";
import Avatar from "../../assets/medium-shot-smiley-woman-with-crossed-arms (1).png";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  img: string;
}

const members: TeamMember[] = [
  {
    id: 1,
    name: "Karen",
    role: "Lorem ipsum dolor",
    img: Avatar,
  },
  {
    id: 2,
    name: "Karen",
    role: "Lorem ipsum dolor",
    img: Avatar,
  },
  {
    id: 3,
    name: "Karen",
    role: "Lorem ipsum dolor",
    img: Avatar,
  },
  {
    id: 4,
    name: "Karen",
    role: "Lorem ipsum dolor",
    img: Avatar,
  },
];

const listItems = [
  { title: "WAREHOUSE", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { title: "STOCK MANAGEMENT", desc: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { title: "OPERATIONAL COST", desc: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
  { title: "AIR FREIGHT", desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum." },
  { title: "WAREHOUSE", desc: "Excepteur sint occaecat cupidatat non proident, sunt in culpa." },
];

const TeamSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 grid grid-cols-1 lg:grid-cols-2 
                        ml-6 mr-6 sm:ml-6 sm:mr-6 md:ml-16 md:mr-16 lg:ml-[210px] lg:mr-[263.5px]">
      
      {/* LEFT SIDE */}
      <div className="max-w-lg mb-12 lg:mb-0">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-[#fa921dff] leading-tight mb-8">
          Conoce a nuestro equipo de expertos 
          que impulsa el éxito de tu logística.
        </h2>

        <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
          En el competitivo mundo empresarial de hoy, la demanda
          de soluciones de TI eficientes nunca ha sido más crítica.
        </p>

        <ul className="space-y-4 text-green-700 font-normal text-lg sm:text-xl lg:text-2xl">
          {listItems.map((item, index) => (
            <li key={index} className="flex flex-col">
              {/* Header button */}
              <button
                onClick={() => toggleDropdown(index)}
                className="flex items-center gap-3 w-full justify-start text-left text-green-700 font-semibold focus:outline-none"
              >
                <span className="text-orange-500 text-2xl font-bold">+</span>
                <span>{item.title}</span>
              </button>

              {/* Dropdown description */}
              {openIndex === index && (
                <p className="mt-2 text-green-700 text-sm sm:text-base pl-[2.25rem]">
                  {item.desc}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT SIDE */}
      <div className="grid grid-cols-2 gap-6 sm:gap-12 place-items-center">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col items-center text-center">
            <img
              src={member.img}
              alt="Foto del miembro del equipo"
              className="w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32 rounded-full object-cover shadow-md"
            />
            <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-green-700">
              {member.name}
            </h3>
            <p className="text-green-700 text-xs sm:text-sm">{member.role}</p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default TeamSection;
