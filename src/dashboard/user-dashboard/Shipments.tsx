import React, { useState } from "react";

type Shipment = {
  id: string;
  type: "local" | "locker" | "consolidated";
  from: string;
  to: string;
  weight: number;
  status: "received" | "in_transit" | "delivered";
  date: string;
  timeline: string[];
};

/* 🔥 Fake Client Shipments */
const FAKE_SHIPMENTS: Shipment[] = [
  {
    id: "CUB-23011",
    type: "local",
    from: "La Habana",
    to: "Santiago de Cuba",
    weight: 2.5,
    status: "in_transit",
    date: "2025-01-10",
    timeline: ["Recibido en La Habana", "En tránsito a Camagüey"],
  },
  {
    id: "LOC-55214",
    type: "local",
    from: "Camagüey",
    to: "Holguín",
    weight: 1.1,
    status: "delivered",
    date: "2025-01-08",
    timeline: ["Recibido", "Enviado", "Entregado"],
  },
  {
    id: "INT-99231",
    type: "locker",
    from: "Locker Miami (EXPRESUR XG15STV)",
    to: "La Habana",
    weight: 3.8,
    status: "received",
    date: "2025-01-12",
    timeline: ["Recibido en Miami", "Preparado para envío"],
  },
  {
    id: "CNL-77452",
    type: "consolidated",
    from: "Miami (3 paquetes)",
    to: "Matanzas",
    weight: 7.4,
    status: "in_transit",
    date: "2025-01-11",
    timeline: ["Consolidado", "Salida del almacén"],
  },
];

export default function Shipments() {
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [query, setQuery] = useState("");

  const filtered = FAKE_SHIPMENTS.filter((s) =>
    s.id.toLowerCase().includes(query.toLowerCase())
  );

  function getStatusColor(status: Shipment["status"]) {
    switch (status) {
      case "received":
        return "bg-blue-100 text-blue-700";
      case "in_transit":
        return "bg-yellow-100 text-yellow-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "";
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Mis Envíos</h2>

        {/* Search */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por ID de envío..."
          className="px-3 py-2 border rounded-md w-full mb-4"
        />

        {/* Table Desktop */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">De</th>
                <th className="p-3 text-left">A</th>
                <th className="p-3 text-left">Peso</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{s.id}</td>
                  <td className="p-3 capitalize">{s.type}</td>
                  <td className="p-3">{s.from}</td>
                  <td className="p-3">{s.to}</td>
                  <td className="p-3">{s.weight} kg</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-md ${getStatusColor(
                        s.status
                      )}`}
                    >
                      {s.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelected(s)}
                      className="px-3 py-1 bg-green-700 text-white rounded-md"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">
                    No se encontraron envíos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-100"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{s.id}</p>
                  <p className="text-sm text-gray-500 capitalize">{s.type}</p>
                </div>

                <span
                  className={`px-2 py-1 h-fit text-xs rounded-md ${getStatusColor(
                    s.status
                  )}`}
                >
                  {s.status.replace("_", " ")}
                </span>
              </div>

              <div className="mt-2 text-sm">
                <p>
                  <b>De:</b> {s.from}
                </p>
                <p>
                  <b>A:</b> {s.to}
                </p>
                <p>
                  <b>Peso:</b> {s.weight} kg
                </p>
              </div>

              <button
                onClick={() => setSelected(s)}
                className="w-full mt-3 py-2 bg-green-700 text-white rounded-md"
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-2">Detalles del Envío</h3>
            <p className="text-sm text-gray-600 mb-4">ID: {selected.id}</p>

            <p><b>Tipo:</b> {selected.type}</p>
            <p><b>De:</b> {selected.from}</p>
            <p><b>A:</b> {selected.to}</p>
            <p><b>Peso:</b> {selected.weight} kg</p>

            <div className="mt-4">
              <h4 className="font-semibold">Historial</h4>
              <ul className="list-disc ml-5 mt-1 text-sm">
                {selected.timeline.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 border rounded-md"
              >
                Cerrar
              </button>
              <button className="px-4 py-2 bg-green-700 text-white rounded-md">
                Descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
