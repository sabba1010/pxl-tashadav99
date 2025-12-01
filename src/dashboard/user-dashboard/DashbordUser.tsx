import React, { useMemo, useState } from "react";

// -----------------------------------------------------
//  FAKE DATA (replace with API later)
// -----------------------------------------------------

type Shipment = {
  id: string;
  type: "local" | "locker" | "consolidated";
  from: string;
  to: string;
  weight: number;
  status: "received" | "in_transit" | "delivered" | "ready";
  expectedDelivery?: string;
  shippedAt?: string;
  createdAt: string;
};

type LockerItem = {
  id: string;
  title: string;
  lockerId: string;
  weightKg: number;
  arrivedAt: string;
  ready: boolean;
};

type Invoice = {
  id: string;
  amount: number;
  status: "paid" | "due" | "overdue";
  dueDate: string;
};

const FAKE_SHIPMENTS: Shipment[] = [
  { id: "CUB-23011", type: "local", from: "La Habana", to: "Santiago de Cuba", weight: 2.5, status: "in_transit", expectedDelivery: "2025-01-18", shippedAt: "2025-01-12", createdAt: "2025-01-12" },
  { id: "INT-99231", type: "locker", from: "Miami Locker (XG15STV)", to: "La Habana", weight: 3.8, status: "received", expectedDelivery: "2025-01-20", createdAt: "2025-01-12" },
  { id: "LOC-55214", type: "local", from: "Camagüey", to: "Holguín", weight: 1.1, status: "delivered", expectedDelivery: "2025-01-10", shippedAt: "2025-01-08", createdAt: "2025-01-06" },
  { id: "CNL-77452", type: "consolidated", from: "Miami (3 items)", to: "Matanzas", weight: 7.4, status: "in_transit", expectedDelivery: "2025-01-19", shippedAt: "2025-01-11", createdAt: "2025-01-11" },
];

const FAKE_LOCKER: LockerItem[] = [
  { id: "MIAM-1001", title: "Zapatos Nike", lockerId: "XG15STV", weightKg: 1.4, arrivedAt: "2025-01-10", ready: true },
  { id: "MIAM-1003", title: "Ropa x3", lockerId: "XG15STV", weightKg: 2.1, arrivedAt: "2025-01-12", ready: true },
];

const FAKE_INVOICES: Invoice[] = [
  { id: "INV-1001", amount: 12.5, dueDate: "2025-01-18", status: "due" },
  { id: "INV-1002", amount: 5, dueDate: "2025-01-09", status: "overdue" },
];

// -----------------------------------------------------
//  Helper
// -----------------------------------------------------
function fmt(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString();
}

// -----------------------------------------------------
//  DASHBOARD COMPONENT
// -----------------------------------------------------
const DashbordUser = () => {
  const [shipments] = useState(FAKE_SHIPMENTS);
  const [locker] = useState(FAKE_LOCKER);
  const [invoices, setInvoices] = useState(FAKE_INVOICES);

  // KPI counts
  const totalParcels = shipments.length + locker.length;
  const incoming = shipments.filter(s => s.status === "received" || s.status === "ready").length + locker.filter(l => l.ready).length;
  const sent = shipments.filter(s => s.shippedAt).length;
  const pendingPayments = invoices.filter(i => i.status !== "paid").length;

  const upcoming = shipments.filter(s => s.expectedDelivery).slice(0, 5);
  const recent = shipments.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 6);

  const pay = (id: string) => {
    setInvoices(prev => prev.map(i => (i.id === id ? { ...i, status: "paid" } : i)));
    alert("Pago realizado (fake)");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-[#166534]">Dashboard del Cliente</h1>
        <p className="text-gray-600 mb-6">Resumen de tus envíos, casillero y pagos.</p>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-xs text-gray-600">Paquetes Totales</p>
            <p className="text-2xl font-bold text-[#166534]">{totalParcels}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-xs text-gray-600">Por Recibir</p>
            <p className="text-2xl font-bold text-yellow-600">{incoming}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-xs text-gray-600">Enviados</p>
            <p className="text-2xl font-bold text-blue-600">{sent}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-xs text-gray-600">Pagos Pendientes</p>
            <p className="text-2xl font-bold text-red-600">{pendingPayments}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* UPCOMING DELIVERIES */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-2">Próximas Entregas</h2>
              {upcoming.length === 0 ? (
                <p className="text-gray-500 text-sm">No tienes entregas próximas.</p>
              ) : (
                <ul className="space-y-3 text-sm">
                  {upcoming.map(s => (
                    <li key={s.id} className="flex justify-between border-b pb-2">
                      <p>
                        <b>{s.id}</b> <br />
                        {s.from} → {s.to}
                      </p>
                      <p className="text-right">{fmt(s.expectedDelivery)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* LOCKER SUMMARY */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-2">Mi Casillero</h2>

              {locker.map((l) => (
                <div key={l.id} className="border rounded p-3 mb-2 flex justify-between">
                  <div>
                    <p className="font-medium">{l.title}</p>
                    <p className="text-xs text-gray-500">ID: {l.id}</p>
                  </div>
                  <p className={`text-xs px-2 py-1 rounded ${l.ready ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {l.ready ? "Listo" : "En almacén"}
                  </p>
                </div>
              ))}
            </div>

            {/* PENDING PAYMENTS */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold mb-2">Facturas Pendientes</h2>

              {invoices.filter(i => i.status !== "paid").map(inv => (
                <div key={inv.id} className="border rounded p-3 mb-2 flex justify-between">
                  <div>
                    <p className="font-semibold">{inv.id}</p>
                    <p className="text-xs text-gray-600">Vence: {fmt(inv.dueDate)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => pay(inv.id)} className="px-3 py-1 bg-[#166534] text-white rounded text-sm">
                      Pagar
                    </button>
                    <button className="px-3 py-1 border rounded text-sm">PDF</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE — RECENT SHIPMENTS */}
          <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold mb-3">Envíos Recientes</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Origen → Destino</th>
                    <th className="p-2 text-left">Peso</th>
                    <th className="p-2 text-left">Estado</th>
                    <th className="p-2 text-left">Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {recent.map(s => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{s.id}</td>
                      <td className="p-2">{s.from} → {s.to}</td>
                      <td className="p-2">{s.weight} kg</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            s.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : s.status === "in_transit"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="p-2">{fmt(s.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashbordUser;
