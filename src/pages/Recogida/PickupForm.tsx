import React, { useState } from "react";

type FormState = {
  nombre: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  fecha: string;
  franja: string;
  paquete: string;
};

const PickupForm: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    fecha: "",
    franja: "",
    paquete: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Pickup form submit:", form);
    alert("Formulario enviado (demo) — revisa la consola");
  };

  return (
    <section className="py-14 px-4 sm:px-8 lg:px-16">
      {/* Bigger title for large screens */}
      <h2
        className="
         mb-16 text-center text-orange-400 font-semibold tracking-tight mb-10
          text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
        "
      >
        Ideal para clientes ocupados
      </h2>

      <div className="flex justify-center ">
        <form
          onSubmit={handleSubmit}
          className="
            w-full 
            max-w-screen-xl           /* MUCH wider */
            bg-green-800 border-[3px] border-orange-400 rounded-3xl 
            shadow-[0_10px_0_rgba(243,152,30,0.25)]
            p-8 sm:p-12 lg:p-16 xl:p-20 
            grid grid-cols-1 md:grid-cols-2 
            gap-6 md:gap-10
          "
        >
          {/* Left column */}
          <div className="space-y-5 lg:space-y-6">
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="
                w-full rounded-full py-4 px-7 
                bg-transparent placeholder:text-orange-200 text-white
                border border-orange-400
                focus:outline-none focus:ring-2 focus:ring-orange-300
                text-base sm:text-lg lg:text-xl        /* Bigger on lg */
              "
            />

            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="
                w-full rounded-full py-4 px-7 
                bg-transparent placeholder:text-orange-200 text-white
                border border-orange-400
                focus:outline-none focus:ring-2 focus:ring-orange-300
                text-base sm:text-lg lg:text-xl
              "
            />

            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              className="
                w-full rounded-full py-4 px-7 
                bg-transparent placeholder:text-orange-200 text-white
                border border-orange-400
                focus:outline-none focus:ring-2 focus:ring-orange-300
                text-base sm:text-lg lg:text-xl
              "
            />

            <input
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              placeholder="Ciudad/Zona"
              className="
                w-full rounded-full py-4 px-7 
                bg-transparent placeholder:text-orange-200 text-white
                border border-orange-400
                focus:outline-none focus:ring-2 focus:ring-orange-300
                text-base sm:text-lg lg:text-xl
              "
            />
          </div>

          {/* Right column */}
          <div className="space-y-5 lg:space-y-6">
            <input
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              placeholder="Fecha"
              className="
                w-full rounded-full py-4 px-7 
                bg-transparent placeholder:text-orange-200 text-white
                border border-orange-400
                focus:outline-none focus:ring-2 focus:ring-orange-300
                text-base sm:text-lg lg:text-xl
              "
              onFocus={(e) => (e.currentTarget.type = "date")}
              onBlur={(e) => (e.currentTarget.type = "text")}
            />

            <input
              name="franja"
              value={form.franja}
              onChange={handleChange}
              placeholder="Franja horaria"
              className="
                w-full rounded-full py-4 px-7 
                bg-transparent placeholder:text-orange-200 text-white
                border border-orange-400
                focus:outline-none focus:ring-2 focus:ring-orange-300
                text-base sm:text-lg lg:text-xl
              "
            />

            <input
              name="paquete"
              value={form.paquete}
              onChange={handleChange}
              placeholder="Tipo de paquete"
              className="
                w-full rounded-full py-4 px-7 
                bg-transparent placeholder:text-orange-200 text-white
                border border-orange-400
                focus:outline-none focus:ring-2 focus:ring-orange-300
                text-base sm:text-lg lg:text-xl
              "
            />

            <div className="flex justify-end md:justify-center lg:justify-end pt-2">
              <button
                type="submit"
                className="
                  w-full md:w-auto 
                  rounded-full py-4 px-10 
                  bg-orange-400 text-white font-semibold tracking-wide
                  shadow-md hover:shadow-lg transition
                  text-lg lg:text-2xl          /* Bigger on large screens */
                "
              >
                PROGRAMAR RECOGIDA
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PickupForm;
