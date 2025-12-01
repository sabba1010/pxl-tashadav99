import React, { useMemo, useState } from "react";

/* --------------------- Types --------------------- */
type ParcelStatus = "Pending" | "In Transit" | "Delivered" | "Cancelled" | "Returned";

type Parcel = {
  id: string;
  orderId: string;
  customer: string;
  phone?: string;
  origin: string;
  destination: string;
  weightKg: number;
  date: string; // ISO
  status: ParcelStatus;
  eta?: string;
  notes?: string;
  location?: { lat: number; lng: number; lastSeen: string }; // fake truck location
};

/* --------------------- Fake Data --------------------- */
const FAKE_PARCELS: Parcel[] = [
  { id: "P-1001", orderId: "ORD-1001", customer: "María González", phone: "+53 51 123456", origin: "Barcelona, Spain", destination: "Havana, Cuba", weightKg: 2.3, date: "2025-02-03", status: "Pending", notes: "Pick up at office" },
  { id: "P-1002", orderId: "ORD-1002", customer: "Carlos Pérez", phone: "+53 5 1234567", origin: "Santiago de Cuba", destination: "Miami, USA", weightKg: 5.0, date: "2025-02-01", status: "In Transit", eta: "2025-02-08", location: { lat: 23.1136, lng: -82.3666, lastSeen: "2025-02-04 09:14" } },
  { id: "P-1003", orderId: "ORD-1003", customer: "Ana López", phone: "+34 678901234", origin: "Valencia, Spain", destination: "Camagüey, Cuba", weightKg: 1.2, date: "2025-01-30", status: "Delivered", eta: "2025-02-02", location: { lat: 21.3805, lng: -77.9164, lastSeen: "2025-02-02 14:00" } },
  { id: "P-1004", orderId: "ORD-1004", customer: "Luis Fernández", phone: "+1 305 555 0198", origin: "Miami, USA", destination: "Havana, Cuba", weightKg: 12.4, date: "2025-01-29", status: "Delivered", eta: "2025-02-03" },
  { id: "P-1005", orderId: "ORD-1005", customer: "Elena Martínez", phone: "+34 654321987", origin: "Madrid, Spain", destination: "Holguín, Cuba", weightKg: 3.5, date: "2025-02-05", status: "Pending" },
  { id: "P-1006", orderId: "ORD-1006", customer: "Roberto Díaz", phone: "+53 5 9876543", origin: "Varadero, Cuba", destination: "Madrid, Spain", weightKg: 8.1, date: "2025-01-27", status: "Returned", notes: "Customs issue" },
  { id: "P-1007", orderId: "ORD-1007", customer: "Sofia Rivera", phone: "+34 699112233", origin: "Málaga, Spain", destination: "Cuba (Domestic)", weightKg: 0.9, date: "2025-02-02", status: "In Transit", location: { lat: 23.7500, lng: -80.4167, lastSeen: "2025-02-04 08:30" } },
  { id: "P-1008", orderId: "ORD-1008", customer: "Jorge Herrera", phone: "+1 7864445566", origin: "New York, USA", destination: "Havana, Cuba", weightKg: 7.7, date: "2025-01-31", status: "Cancelled", notes: "Customer cancelled" },
  { id: "P-1009", orderId: "ORD-1009", customer: "Isabel Torres", phone: "+34 622334455", origin: "Sevilla, Spain", destination: "Santa Clara, Cuba", weightKg: 4.4, date: "2025-02-04", status: "Pending" },
  { id: "P-1010", orderId: "ORD-1010", customer: "Miguel Ruiz", phone: "+53 5 5551234", origin: "Havana, Cuba", destination: "Panama City, Panama", weightKg: 10.0, date: "2025-01-28", status: "In Transit", location: { lat: 23.0000, lng: -82.0000, lastSeen: "2025-02-04 06:50" } },
];

/* --------------------- Helpers --------------------- */
function fmt(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString();
}

/* small badge color helper */
function statusClasses(s: ParcelStatus) {
  switch (s) {
    case "Pending": return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "In Transit": return "bg-blue-100 text-blue-800 border border-blue-300";
    case "Delivered": return "bg-green-100 text-green-800 border border-green-300";
    case "Cancelled": return "bg-red-100 text-red-800 border border-red-300";
    case "Returned": return "bg-purple-100 text-purple-800 border border-purple-300";
    default: return "";
  }
}

/* --------------------- Component --------------------- */
export default function AdminTracking() {
  const [parcels] = useState<Parcel[]>(FAKE_PARCELS);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selected, setSelected] = useState<Parcel | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return parcels.filter((p) => {
      const matchSearch =
        p.orderId.toLowerCase().includes(q) ||
        p.customer.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchDate = !dateFilter || p.date === dateFilter;
      return matchSearch && matchStatus && matchDate;
    });
  }, [parcels, search, statusFilter, dateFilter]);

  const totals = useMemo(() => {
    const t = { total: parcels.length, pending: 0, inTransit: 0, delivered: 0, cancelled: 0, returned: 0 };
    parcels.forEach(p => {
      if (p.status === "Pending") t.pending++;
      if (p.status === "In Transit") t.inTransit++;
      if (p.status === "Delivered") t.delivered++;
      if (p.status === "Cancelled") t.cancelled++;
      if (p.status === "Returned") t.returned++;
    });
    return t;
  }, [parcels]);

  return (
    <div className="p-4 md:p-8 bg-[#f7faf7] min-h-screen">
      <div className=" mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Tracking — Parcels</h1>
            <p className="text-sm text-gray-500 mt-1">Overview de envíos — muestra estado, conteos y detalles de seguimiento.</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por order, cliente, origen, destino..."
              className="px-3 py-2 border rounded-md w-64 md:w-80 focus:outline-none"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            />

            <button
              onClick={() => { setSearch(""); setStatusFilter("all"); setDateFilter(""); }}
              className="px-3 py-2 bg-[#166534] hover:bg-[#145c2e] text-white rounded-md"
            >
              Reset
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-xs text-gray-500">Total Parcels</div>
            <div className="text-2xl font-bold text-gray-800">{totals.total}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-xs text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{totals.pending}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-xs text-gray-500">In Transit</div>
            <div className="text-2xl font-bold text-blue-600">{totals.inTransit}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-xs text-gray-500">Delivered</div>
            <div className="text-2xl font-bold text-green-600">{totals.delivered}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-xs text-gray-500">Cancelled</div>
            <div className="text-2xl font-bold text-red-600">{totals.cancelled}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-xs text-gray-500">Returned</div>
            <div className="text-2xl font-bold text-purple-600">{totals.returned}</div>
          </div>
        </div>

        {/* Table (desktop) / Cards (mobile) */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block">
            <table className="min-w-full">
              <thead className="bg-[#166534] text-white">
                <tr>
                  <th className="p-3 text-left">Order</th>
                  <th className="p-3 text-left">Cliente</th>
                  <th className="p-3 text-left">Route</th>
                  <th className="p-3 text-left">Weight</th>
                  <th className="p-3 text-left">ETA</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Last Seen</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-[#166534]">{p.orderId}</td>
                    <td className="p-3">
                      <div className="font-medium">{p.customer}</div>
                      <div className="text-xs text-gray-500">{p.phone}</div>
                    </td>
                    <td className="p-3 text-sm">
                      <div>{p.origin}</div>
                      <div className="text-xs text-gray-500">→ {p.destination}</div>
                    </td>
                    <td className="p-3">{p.weightKg} kg</td>
                    <td className="p-3">{p.eta ?? "—"}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{p.location?.lastSeen ?? "—"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelected(p)}
                        className="px-3 py-1.5 bg-[#166534] text-white rounded-md hover:bg-[#145c2e]"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">No parcels found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden divide-y">
            {filtered.map((p) => (
              <div key={p.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">{p.orderId}</div>
                    <div className="font-medium">{p.customer}</div>
                    <div className="text-xs text-gray-500">{p.origin} → {p.destination}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#166534]">{p.weightKg} kg</div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses(p.status)}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-xs text-gray-500">{p.location?.lastSeen ?? fmt(p.date)}</div>
                  <div>
                    <button
                      onClick={() => setSelected(p)}
                      className="px-3 py-1.5 bg-[#166534] text-white rounded-md hover:bg-[#145c2e] text-sm"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-6 text-center text-gray-500">No parcels found.</div>
            )}
          </div>
        </div>

        {/* Quick footer actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
          <div className="text-sm text-gray-600">Showing {filtered.length} results</div>
          <div className="flex gap-3">
            <button onClick={() => alert("Export CSV (simulado)")} className="px-4 py-2 border rounded-md">Export CSV</button>
            <button onClick={() => alert("Open live map (simulado)")} className="px-4 py-2 bg-[#166534] text-white rounded-md hover:bg-[#145c2e]">Live Map</button>
          </div>
        </div>
      </div>

      {/* Modal: Parcel details */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">{selected.orderId} — {selected.customer}</h3>
                <p className="text-xs text-gray-500 mt-1">{selected.origin} → {selected.destination}</p>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">Status</div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses(selected.status)}`}>{selected.status}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-sm text-gray-700">
                <div><b>Order ID:</b> {selected.orderId}</div>
                <div><b>Customer:</b> {selected.customer} {selected.phone && <span className="text-gray-500">• {selected.phone}</span>}</div>
                <div><b>Weight:</b> {selected.weightKg} kg</div>
                <div><b>Date:</b> {fmt(selected.date)}</div>
                <div><b>ETA:</b> {selected.eta ?? "—"}</div>
                <div><b>Notes:</b> {selected.notes ?? "—"}</div>
              </div>

              <div>
                <div className="text-sm text-gray-700 mb-2"><b>Last known location</b></div>
                <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                  {/* Placeholder map — replace with map component (Leaflet/Google) */}
                  {selected.location ? (
                    <div>
                      <div>Lat: {selected.location.lat.toFixed(4)}</div>
                      <div>Lng: {selected.location.lng.toFixed(4)}</div>
                      <div className="text-xs text-gray-500 mt-1">Last seen: {selected.location.lastSeen}</div>
                    </div>
                  ) : (
                    <div>No live location</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setSelected(null)} className="px-4 py-2 border rounded-md">Cerrar</button>
              <button onClick={() => alert("Open logs (simulado)")} className="px-4 py-2 bg-[#166534] text-white rounded-md hover:bg-[#145c2e]">View Logs</button>
              <button onClick={() => alert("Send notification (simulado)")} className="px-4 py-2 bg-[#166534] text-white rounded-md hover:bg-[#145c2e]">Notify Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
