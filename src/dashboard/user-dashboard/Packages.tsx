import React, { useMemo, useState } from "react";

/* ================= Fake Data ================= */
type Purchased = {
  id: string;
  packageId: string;
  name: string;
  origin: string;
  status: "Created" | "In Transit" | "In Miami" | "Customs" | "Delivered";
  estDelivery: string;
  createdAt: string;
  history: { date: string; status: string; note?: string }[];
};

type ServicePkg = {
  id: string;
  name: string;
  price: string;
  features: string[];
  tag?: string;
};

const PURCHASED: Purchased[] = [
  {
    id: "TRK-9001",
    packageId: "XG15STV",
    name: "Electronics Box",
    origin: "Havana, Cuba",
    status: "In Miami",
    estDelivery: "2025-02-04",
    createdAt: "2025-01-09",
    history: [
      { date: "2025-01-09", status: "Created", note: "Shipment created in Havana" },
      { date: "2025-01-11", status: "In Transit", note: "Left local hub" },
      { date: "2025-01-12", status: "In Miami", note: "Arrived Miami warehouse" },
    ],
  },
  {
    id: "TRK-9002",
    packageId: "AB93HRT",
    name: "Clothes & Accessories",
    origin: "Santiago de Cuba",
    status: "Customs",
    estDelivery: "2025-02-10",
    createdAt: "2025-01-07",
    history: [
      { date: "2025-01-07", status: "Created" },
      { date: "2025-01-10", status: "In Transit" },
      { date: "2025-01-12", status: "Customs", note: "Under customs review" },
    ],
  },
  {
    id: "TRK-9003",
    packageId: "XG15STV",
    name: "Fragile – Glassware",
    origin: "Camagüey",
    status: "Delivered",
    estDelivery: "2025-01-20",
    createdAt: "2025-01-03",
    history: [
      { date: "2025-01-03", status: "Created" },
      { date: "2025-01-15", status: "In Transit" },
      { date: "2025-01-20", status: "Delivered", note: "Left at locker" },
    ],
  },
];

const SERVICES: ServicePkg[] = [
  { id: "S-01", name: "Plan Básico", price: "$39 USD/mes", features: ["20 GB storage", "3 usuarios", "Soporte por email"] },
  { id: "S-02", name: "Plan Inicial", price: "$49 USD/mes", features: ["50 GB storage", "5 usuarios", "Email + Chat"], tag: "Popular" },
  { id: "S-03", name: "Plan Empresarial", price: "$129 USD/mes", features: ["200 GB", "25 usuarios", "Soporte prioritario"] },
  { id: "S-04", name: "Plan Premium", price: "$249 USD/mes", features: ["500 GB", "Ilimitados usuarios", "Soporte 24/7"], tag: "Best" },
];

/* ================= Helper ================= */
function fmt(d: string) {
  return new Date(d).toLocaleDateString();
}

/* ================= Component ================= */
export default function PackagesPage() {
  const [tab, setTab] = useState<"purchased" | "market">("purchased");
  const [query, setQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<Purchased | null>(null);
  const [selectedService, setSelectedService] = useState<ServicePkg | null>(null);

  const filteredPurchased = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PURCHASED.filter(p => p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.packageId.toLowerCase().includes(q));
  }, [query]);

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#166534]">Packages</h1>
            <p className="text-sm text-gray-500">Your shipments & available service plans</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex gap-1 bg-white rounded-md shadow-sm overflow-hidden">
              <button onClick={() => setTab("purchased")} className={`px-4 py-2 ${tab === "purchased" ? "bg-[#166534] text-white" : "text-gray-700"}`}>Purchased</button>
              <button onClick={() => setTab("market")} className={`px-4 py-2 ${tab === "market" ? "bg-[#166534] text-white" : "text-gray-700"}`}>Marketplace</button>
            </div>

            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by id, name..." className="px-3 py-2 border rounded-md w-72" />
          </div>
        </header>

        {/* CONTENT */}
        {tab === "purchased" ? (
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* left: list/table */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Purchased Shipments</h3>
                    <div className="text-sm text-gray-500">{filteredPurchased.length} results</div>
                  </div>

                  <div className="hidden md:block">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-3 text-left">Tracking ID</th>
                          <th className="p-3 text-left">Package</th>
                          <th className="p-3 text-left">Origin</th>
                          <th className="p-3 text-left">Status</th>
                          <th className="p-3 text-left">ETA</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPurchased.map(p => (
                          <tr key={p.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{p.id}</td>
                            <td className="p-3">{p.name}</td>
                            <td className="p-3">{p.origin}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'Delivered' ? 'bg-green-100 text-green-800' : p.status === 'Customs' ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'}`}>{p.status}</span>
                            </td>
                            <td className="p-3">{fmt(p.estDelivery)}</td>
                            <td className="p-3 text-right">
                              <button onClick={() => setSelectedTrack(p)} className="px-3 py-1 rounded-md bg-[#166534] text-white">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* mobile cards */}
                  <div className="md:hidden space-y-3">
                    {filteredPurchased.map(p => (
                      <div key={p.id} className="bg-gray-50 border rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-gray-500">{p.id} • {p.origin}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">ETA: {fmt(p.estDelivery)}</div>
                            <div className="mt-2">
                              <button onClick={() => setSelectedTrack(p)} className="px-3 py-1 rounded-md bg-[#166534] text-white text-sm">View</button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <span className={`px-2 py-1 rounded-full ${p.status === 'Delivered' ? 'bg-green-100 text-green-800' : p.status === 'Customs' ? 'bg-yellow-100 text-yellow-800' : 'bg-indigo-100 text-indigo-800'}`}>{p.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* quick stats */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-500">Total Shipments</div>
                    <div className="text-2xl font-bold text-[#166534]">{PURCHASED.length}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-500">Delivered</div>
                    <div className="text-2xl font-bold text-green-600">{PURCHASED.filter(x=>x.status==='Delivered').length}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-500">In Miami / Customs</div>
                    <div className="text-2xl font-bold text-indigo-700">{PURCHASED.filter(x=>x.status!=='Delivered').length}</div>
                  </div>
                </div>
              </div>

              {/* right: details / actions */}
              <aside className="bg-white rounded-lg shadow p-4">
                {selectedTrack ? (
                  <div>
                    <h4 className="font-semibold">{selectedTrack.name}</h4>
                    <div className="text-xs text-gray-500">{selectedTrack.id} • {selectedTrack.origin}</div>

                    <div className="mt-3">
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="font-medium mt-1">{selectedTrack.status}</div>
                    </div>

                    <div className="mt-3">
                      <div className="text-sm text-gray-500">Estimated Delivery</div>
                      <div className="font-medium mt-1">{selectedTrack.estDelivery}</div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm font-semibold">Tracking History</h5>
                      <ul className="mt-2 space-y-2 text-sm">
                        {selectedTrack.history.map((h, i) => (
                          <li key={i} className="flex items-start justify-between">
                            <div>
                              <div className="font-medium">{h.status}</div>
                              <div className="text-xs text-gray-500">{h.date} {h.note ? `• ${h.note}` : ''}</div>
                            </div>
                            <div className="text-xs text-gray-400">{h.date}</div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button onClick={() => alert('Download manifest (simulated)')} className="px-3 py-2 bg-[#166534] text-white rounded-md">Download Manifest</button>
                      <button onClick={() => setSelectedTrack(null)} className="px-3 py-2 border rounded-md">Close</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Select a shipment to see details.</div>
                )}
              </aside>
            </div>
          </section>
        ) : (
          /* MARKETPLACE */
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredServices.map(s => (
                <div key={s.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">{s.id}</div>
                      <div className="font-semibold mt-1">{s.name}</div>
                    </div>
                    {s.tag && <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">{s.tag}</div>}
                  </div>

                  <div className="mt-3 flex-1">
                    <div className="text-2xl font-bold text-[#166534]">{s.price}</div>
                    <ul className="mt-2 text-sm text-gray-700 space-y-1">
                      {s.features.map((f, i) => <li key={i}>• {f}</li>)}
                    </ul>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setSelectedService(s)} className="px-3 py-2 bg-[#166534] text-white rounded-md flex-1">Buy / Upgrade</button>
                    <button onClick={() => alert('Compare (simulated)')} className="px-3 py-2 border rounded-md">Compare</button>
                  </div>
                </div>
              ))}
            </div>

            {/* quick CTA */}
            <div className="mt-6 bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Need help choosing?</div>
                <div className="font-medium">Contact our support or request a demo</div>
              </div>
              <div>
                <button onClick={() => alert('Contact support (simulated)')} className="px-4 py-2 bg-[#166534] text-white rounded-md">Contact</button>
              </div>
            </div>

            {/* service modal */}
            {selectedService && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-xl w-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{selectedService.name}</h3>
                      <div className="text-sm text-gray-500">{selectedService.id} • {selectedService.price}</div>
                    </div>
                    <div>
                      <button onClick={() => setSelectedService(null)} className="text-gray-600">✕</button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ul className="text-sm text-gray-700 space-y-2">
                      {selectedService.features.map((f, i) => <li key={i}>• {f}</li>)}
                    </ul>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setSelectedService(null)} className="px-4 py-2 border rounded-md">Cancel</button>
                    <button onClick={() => { alert('Purchased (simulated)'); setSelectedService(null); }} className="px-4 py-2 bg-[#166534] text-white rounded-md">Confirm Purchase</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
