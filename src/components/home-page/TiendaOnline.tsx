import React from 'react'
import { motion, } from 'framer-motion'
import car2 from './../../assets/Grupo car2.png'
import bg from './../../assets/Grupo 1567.png'

const TiendaOnline: React.FC = () => {
  return (
    <div
      className="w-full h-[852.87px] bg-cover bg-center flex items-center justify-center bg-[#026432]"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* ORANGE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="relative bg-[#F7941E] rounded-2xl shadow-2xl flex items-center px-16 py-12"
        style={{
          width: "1567.8px",
          height: "519.61px",
          overflow: "visible"
        }}
      >
        {/* LEFT TEXT AREA */}
        <div className="w-1/2 pr-24 space-y-8 z-10">
          <motion.h1
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-white font-bold uppercase"
            style={{
              fontFamily: "Avenir Next LT Pro",
              fontSize: "80px",
              lineHeight: "96px",
              letterSpacing: "4.96px",
            }}
          >
            TIENDA ONLINE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="text-white max-w-xl"
            style={{
              fontFamily: "Avenir Next LT Pro",
              fontSize: "17px",
              fontWeight: 500,
              lineHeight: "20px",
              letterSpacing: "1.05px",
            }}
          >
            rápidos, económicos y seguros Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet
            dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
            nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex
            ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in
            vulputate velit.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            whileHover={{
              scale: 1.08,
              backgroundColor: "#045f3a",
              boxShadow: "0 15px 35px rgba(0,0,0,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="relative text-white px-10 py-3 overflow-hidden"
            style={{
              background: "rgba(4,104,56,1)",
              borderRadius: "25px",
              fontFamily: "Avenir Next LT Pro",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "1.2px",
            }}
          >
            <span className="relative z-10">VISITA NUESTRA TIENDA</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ skew: "-20deg" }}
            />
          </motion.button>
        </div>

        {/* TRUCK IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            delay: 0.6,
            ease: "easeOut"
          }}
          className="absolute -right-4 -bottom-4"
          style={{ zIndex: 5 }}
        >
          <img
            src={car2}
            alt="Truck and boxes"
            className="w-[867.83px] h-auto drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TiendaOnline;
