import React from 'react';
import image from '../../assets/medium-shot-smiley-woman-with-crossed-arms (1).png'

const Contact = () => {
    return (
        <div className="w-full min-h-screen bg-gradient-to-r from-green-900 via-green-700 to-yellow-600 py-16">

            {/* TOP PROFILES */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-0">

                    {[1, 2, 3].map((item, index) => (
                        <React.Fragment key={item}>

                            {/* Profile */}
                            <div className="flex items-center gap-4 text-white px-4 sm:px-6 md:px-8 lg:px-8">
                                <img
                                    src={image}
                                    alt="profile"
                                    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                <div className="flex flex-col">
                                    <h3 className="text-xl sm:text-2xl font-bold lg:text-2xl">
                                        {item === 1 ? "Karen Gómez" : item === 2 ? "Laura Martínez" : "Ana Sofía"}
                                    </h3>

                                    <p className="text-xs sm:text-sm opacity-90 mb-2 lg:text-sm">
                                        {item === 1
                                            ? "Atención al cliente"
                                            : item === 2
                                            ? "Asesora comercial"
                                            : "Soporte y consultas"}
                                    </p>

                                    <button className="px-5 py-1.5 text-xs font-bold bg-transparent border-2 border-orange-400 text-white rounded-full hover:bg-orange-400 transition w-fit">
                                        CONTACTAR
                                    </button>
                                </div>
                            </div>

                            {/* Vertical line (desktop only) */}
                            {index < 2 && (
                                <div className="hidden lg:block w-0.5 h-32 bg-orange-500 mx-6"></div>
                            )}

                        </React.Fragment>
                    ))}

                </div>
            </div>

            {/* CONTACT FORM BOX */}
            <div className="max-w-7xl mx-auto mt-10 bg-green-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl text-white">

                {/* Title + text */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
                    <h2 className="text-3xl sm:text-4xl font-bold lg:text-4xl">Contáctame</h2>
                    <p className="max-w-xl text-xs sm:text-sm leading-relaxed opacity-90">
                        Si deseas información, solicitar un servicio o realizar una consulta, 
                        llena el formulario y te responderé lo antes posible.  
                        Trabajo con rapidez, profesionalidad y total seguridad para ofrecerte 
                        la mejor experiencia posible.
                    </p>
                </div>

                {/* Form grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left inputs */}
                    <div className="flex flex-col gap-5">
                        <input
                            type="text"
                            placeholder="Tu nombre completo"
                            className="bg-transparent border-2 border-orange-400 rounded-full px-6 py-3 text-sm outline-none placeholder-white placeholder-opacity-70 focus:border-orange-300 transition"
                        />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            className="bg-transparent border-2 border-orange-400 rounded-full px-6 py-3 text-sm outline-none placeholder-white placeholder-opacity-70 focus:border-orange-300 transition"
                        />
                        <input
                            type="tel"
                            placeholder="Número de teléfono"
                            className="bg-transparent border-2 border-orange-400 rounded-full px-6 py-3 text-sm outline-none placeholder-white placeholder-opacity-70 focus:border-orange-300 transition"
                        />
                        <input
                            type="text"
                            placeholder="Asunto del mensaje"
                            className="bg-transparent border-2 border-orange-400 rounded-full px-6 py-3 text-sm outline-none placeholder-white placeholder-opacity-70 focus:border-orange-300 transition"
                        />
                    </div>

                    {/* Right textarea + button */}
                    <div className="flex flex-col gap-4">
                        <textarea
                            placeholder="Escribe aquí tu mensaje…"
                            className="bg-transparent border-2 border-orange-400 rounded-3xl p-5 text-sm outline-none placeholder-white placeholder-opacity-70 focus:border-orange-300 transition resize-none"
                            rows={8}
                        ></textarea>

                        <div className="flex justify-center lg:justify-end">
                            <button className="bg-orange-500 text-white font-bold px-10 py-3 text-sm rounded-full hover:bg-orange-600 transition shadow-lg">
                                ENVIAR MENSAJE
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Contact;
