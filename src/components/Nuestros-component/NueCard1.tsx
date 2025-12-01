import React from "react";
import card1img from "../../assets/Grupo-1584.png";
import card2img from "../../assets/card-2.png";
import card3img from "../../assets/card-3.png";
import card4img from "../../assets/card-4.png";
import card5img from "../../assets/card-5.png";

const NueCard1 = () => {
  return (
    <div className="space-y-10 my-10">
      {/* card 1 (image on right) */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 items-center border-2 border-orange-400 p-10 rounded-xl max-w-6xl mx-auto">
        <div className="text-white">
          <h1 className="md:text-5xl text-3xl">Envíos Nacionales (USA)</h1>
          <p className="text-3xl my-5">Envíos dentro de Estados Unidos usando:</p>
          <p>
            FedEx: Express, 2-Day, Ground <br />
            USPS: Priority, First Class, Express <br />
            UPS: Next Day, 2nd Day, Ground <br />
            DHL (partners)
          </p>
          <button className="bg-orange-400 rounded-xl mt-5 text-white px-10 py-2">
            Cotizar Envío Internacional
          </button>
        </div>

        <div className="flex justify-end">
          <img className="md:-mr-32 w-2/3" src={card1img} alt="card-1" />
        </div>
      </div>

      {/* card 2 (image on left) */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 items-center border-2 border-orange-400 p-10 rounded-xl max-w-6xl mx-auto">
        <div className="flex justify-start">
          <img className="md:-ml-32 w-2/3" src={card2img} alt="card-2" />
        </div>

        <div className="text-white">
          <h1 className="md:text-5xl text-3xl">Envíos Internacionales (Aéreo)</h1>
          <p className="text-3xl my-5">Envíos por vía aérea a más de 50 países.</p>
          <button className="bg-orange-400 rounded-xl mt-5 text-white px-10 py-2">
            Cotizar Envío a Cuba
          </button>
        </div>
      </div>

      {/* card 3 (image on right) */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 items-center border-2 border-orange-400 p-10 rounded-xl max-w-6xl mx-auto">
        <div className="text-white">
          <h1 className="md:text-5xl text-3xl">Envíos a Cuba</h1>
          <p className="text-3xl my-5">Tiempos:</p>
          <p>
            Aéreo: 10–15 días <br />
            Marítimo: 20–30 días <br />
            Express: 3–5 días
          </p>
          <button className="bg-orange-400 rounded-xl mt-5 text-white px-10 py-2">
            Obtener Casillero
          </button>
        </div>

        <div className="flex justify-end">
          <img className="md:-mr-32 w-2/3" src={card3img} alt="card-3" />
        </div>
      </div>

      {/* card 4 (image on left) */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 items-center border-2 border-orange-400 p-10 rounded-xl max-w-6xl mx-auto">
        <div className="flex justify-start">
          <img className="md:-ml-32 w-2/3" src={card4img} alt="card-4" />
        </div>

        <div className="text-white">
          <h1 className="md:text-5xl text-3xl">Casillero Virtual</h1>
          <p className="text-3xl my-5">Dirección en Miami para recibir compras online.</p>
          <button className="bg-orange-400 rounded-xl mt-5 text-white px-10 py-2">
            Cotizar Envío Nacional
          </button>
        </div>
      </div>

      {/* card 5 (image on right) */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-10 items-center border-2 border-orange-400 p-10 rounded-xl max-w-6xl mx-auto">
        <div className="text-white">
          <h1 className="md:text-5xl text-3xl">Enviar Dinero (Remesas)</h1>
          <p className="text-3xl my-5">Enviar dinero rápido y seguro.</p>
          <button className="bg-orange-400 rounded-xl mt-5 text-white px-10 py-2">
            Enviar Dinero
          </button>
        </div>

        <div className="flex justify-end">
          <img className="md:-mr-32 w-2/3" src={card5img} alt="card-5" />
        </div>
      </div>
    </div>
  );
};

export default NueCard1;
