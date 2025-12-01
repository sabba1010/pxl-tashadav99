import React, { useMemo, useState } from "react";

/**
 * Pickup.tsx
 * - Cliente-facing Pickup page (Cuba-friendly Spanish labels)
 * - Fake data, create pickup modal, details modal, download manifest
 */

type Pickup = {
  id: string;
  requesterName: string;
  requesterPhone: string;
  city: string;
  address: string;
  pickupDate: string; // ISO date
  window: string; // time window
  itemsCount: number;
  weightKg: number;
  status: "scheduled" | "collected" | "cancelled";
  note?: string;
  createdAt: string;
};

const FAKE_PICKUPS: Pickup[] = [
  {
    id: "PCK-1001",
    requesterName: "Carlos Perez",
    requesterPhone: "+53 5 1234-5678",
    city: "La Habana",
    address: "Calle 23 #45, Vedado",
    pickupDate: "2025-01-18",
    window: "09:00 - 12:00",
    itemsCount: 2,
    weightKg: 3.8,
    status: "scheduled",
    note: "Fragile - manejar con cuidado",
    createdAt: "2025-01-12T10:00:00Z",
  },
  {
    id: "PCK-1002",
    requesterName: "Ana López",
    requesterPhone: "+53 5 9988-7744",
    city: "Santiago de Cuba",
    address: "Ave 1, Centro",
    pickupDate: "2025-01-16",
    window: "14:00 - 17:00",
    itemsCount: 1,
    weightKg: 1.2,
    status: "collected",
    createdAt: "2025-01-11T09:00:00Z",
  },
  {
    id: "PCK-1003",
    requesterName: "Miguel Ruiz",
    requesterPhone: "+53 5 4444-3311",
    city: "Camagüey",
    address: "Calle Real #12",
    pickupDate: "2025-01-20",
    window: "08:00 - 11:00",
    itemsCount: 3,
    weightKg: 6.5,
    status: "scheduled",
    createdAt: "2025-01-12T14:30:00Z",
  },
];

function rndId(prefix = "PCK") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function Pickup() {
  const [pickups, setPickups] = useState<Pickup[]>(FAKE_PICKUPS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Pickup["status"]>("all");

  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    requesterName: "",
    requesterPhone: "",
    city: "La Habana",
    address: "",
    pickupDate: "",
    window: "09:00 - 12:00",
    itemsCount: 1,
    weightKg: 1,
    note: "",
  });

  // Details modal
  const [selected, setSelected] = useState<Pickup | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pickups.filter(p => {
      const matchesQ =
        p.id.toLowerCase().includes(q) ||
        p.requesterName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesQ && matchesStatus;
    }).sort((a,b) => (b.createdAt.localeCompare(a.createdAt)));
  }, [pickups, query, statusFilter]);

  function openCreate() {
    setCreateOpen(true);
    setForm({
      requesterName: "",
      requesterPhone: "",
      city: "La Habana",
      address: "",
      pickupDate: "",
      window: "09:00 - 12:00",
      itemsCount: 1,
      weightKg: 1,
      note: "",
    });
  }

  function handleCreateSubmit() {
    // basic validation
    if (!form.requesterName || !form.requesterPhone || !form.address || !form.pickupDate) {
      return alert("Por favor complete nombre, teléfono, dirección y fecha de retiro.");
    }
    const newPickup: Pickup = {
      id: rndId("PCK"),
      requesterName: form.requesterName,
      requesterPhone: form.requesterPhone,
      city: form.city,
      address: form.address,
      pickupDate: form.pickupDate,
      window: form.window,
      itemsCount: Number(form.itemsCount),
      weightKg: Number(form.weightKg),
      status: "scheduled",
      note: form.note,
      createdAt: new Date().toISOString(),
    };
    setPickups(prev => [newPickup, ...prev]);
    setCreateOpen(false);
    alert(`Pickup creado: ${newPickup.id}`);
  }

  function changeStatus(id: string, next: Pickup["status"]) {
    setPickups(prev => prev.map(p => p.id === id ? { ...p, status: next } : p));
  }

  function downloadManifest(p: Pickup) {
    const data = { pickup: p };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.id}_pickup_manifest.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function statusBadge(s: Pickup["status"]) {
    switch(s) {
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "collected": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#166534]">Retiros (Pickup)</h1>
            <p className="text-sm text-gray-500">Solicita un retiro o revisa el estado de tus solicitudes.</p>
          </div>

          <div className="flex gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por ID, nombre o ciudad..."
              className="px-3 py-2 border rounded-md w-64"
            />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-3 py-2 border rounded-md">
              <option value="all">Todos</option>
              <option value="scheduled">Programados</option>
              <option value="collected">Recolectados</option>
              <option value="cancelled">Cancelados</option>
            </select>
            <button onClick={openCreate} className="px-4 py-2 bg-[#166534] text-white rounded-md">Nuevo Retiro</button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Solicitante</th>
                <th className="p-3 text-left">Ciudad</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Items / Peso</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.id}</td>
                  <td className="p-3">
                    <div>{p.requesterName}</div>
                    <div className="text-xs text-gray-500">{p.requesterPhone}</div>
                    <div className="text-xs text-gray-400">{p.address}</div>
                  </td>
                  <td className="p-3">{p.city}</td>
                  <td className="p-3">{new Date(p.pickupDate).toLocaleDateString()} <div className="text-xs text-gray-400">{p.window}</div></td>
                  <td className="p-3">{p.itemsCount} / {p.weightKg} kg</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${statusBadge(p.status)}`}>{p.status}</span></td>
                  <td className="p-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setSelected(p)} className="px-3 py-1 border rounded-md text-sm">Ver</button>
                      {p.status === "scheduled" && (
                        <>
                          <button onClick={() => changeStatus(p.id, "collected")} className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">Marcar Recolectado</button>
                          <button onClick={() => changeStatus(p.id, "cancelled")} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm">Cancelar</button>
                        </>
                      )}
                      <button onClick={() => downloadManifest(p)} className="px-3 py-1 border rounded-md text-sm">Manifiesto</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">No hay solicitudes de retiro.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow p-4 border">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">{p.requesterName}</div>
                  <div className="text-sm text-gray-500">{p.city} • {new Date(p.pickupDate).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs ${statusBadge(p.status)}`}>{p.status}</div>
                  <div className="text-sm mt-2">{p.itemsCount} items • {p.weightKg} kg</div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={() => setSelected(p)} className="flex-1 px-3 py-2 border rounded-md">Ver</button>
                {p.status === "scheduled" && (
                  <>
                    <button onClick={() => changeStatus(p.id, "collected")} className="px-3 py-2 bg-green-600 text-white rounded-md">Recolectado</button>
                    <button onClick={() => changeStatus(p.id, "cancelled")} className="px-3 py-2 bg-red-600 text-white rounded-md">Cancelar</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold mb-3">Nuevo Retiro</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-500">Nombre</label>
                <input className="w-full border rounded p-2 mt-1" value={form.requesterName} onChange={e => setForm(f => ({ ...f, requesterName: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-gray-500">Teléfono</label>
                <input className="w-full border rounded p-2 mt-1" value={form.requesterPhone} onChange={e => setForm(f => ({ ...f, requesterPhone: e.target.value }))} />
              </div>

              <div>
                <label className="text-sm text-gray-500">Ciudad</label>
                <select className="w-full border rounded p-2 mt-1" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
                  <option>La Habana</option>
                  <option>Santiago de Cuba</option>
                  <option>Camagüey</option>
                  <option>Holguín</option>
                  <option>Pinar del Río</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">Fecha de retiro</label>
                <input type="date" className="w-full border rounded p-2 mt-1" value={form.pickupDate} onChange={e => setForm(f => ({ ...f, pickupDate: e.target.value }))} />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-gray-500">Dirección</label>
                <input className="w-full border rounded p-2 mt-1" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>

              <div>
                <label className="text-sm text-gray-500">Ventana horaria</label>
                <select className="w-full border rounded p-2 mt-1" value={form.window} onChange={e => setForm(f => ({ ...f, window: e.target.value }))}>
                  <option>09:00 - 12:00</option>
                  <option>12:00 - 15:00</option>
                  <option>15:00 - 18:00</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500">Cantidad de ítems</label>
                <input type="number" className="w-full border rounded p-2 mt-1" min={1} value={form.itemsCount} onChange={e => setForm(f => ({ ...f, itemsCount: Number(e.target.value) }))} />
              </div>

              <div>
                <label className="text-sm text-gray-500">Peso total (kg)</label>
                <input type="number" className="w-full border rounded p-2 mt-1" min={0.1} step={0.1} value={form.weightKg} onChange={e => setForm(f => ({ ...f, weightKg: Number(e.target.value) }))} />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-gray-500">Nota (opcional)</label>
                <textarea className="w-full border rounded p-2 mt-1" rows={3} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setCreateOpen(false)} className="px-3 py-2 border rounded-md">Cancelar</button>
              <button onClick={handleCreateSubmit} className="px-4 py-2 bg-[#166534] text-white rounded-md">Crear Retiro</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{selected.id}</h3>
                <div className="text-sm text-gray-500">{selected.requesterName} • {selected.requesterPhone}</div>
              </div>
              <div>
                <button onClick={() => setSelected(null)} className="text-gray-600">✕</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-gray-500">Dirección</div>
                <div className="font-medium">{selected.address}</div>
                <div className="text-sm text-gray-400 mt-1">{selected.city}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Fecha / Ventana</div>
                <div className="font-medium">{new Date(selected.pickupDate).toLocaleDateString()} • {selected.window}</div>
                <div className="text-sm text-gray-500 mt-2">Creado: {new Date(selected.createdAt).toLocaleString()}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Items</div>
                <div className="font-medium">{selected.itemsCount} • {selected.weightKg} kg</div>
              </div>

              <div>
                <div className="text-sm text-gray-500">Estado</div>
                <div className="font-medium">{selected.status}</div>
              </div>

              <div className="sm:col-span-2">
                <div className="text-sm text-gray-500">Nota</div>
                <div className="mt-1 text-sm">{selected.note ?? "—"}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              {selected.status === "scheduled" && (
                <>
                  <button onClick={() => { changeStatus(selected.id, "collected"); setSelected(null); }} className="px-3 py-2 bg-green-600 text-white rounded-md">Marcar Recolectado</button>
                  <button onClick={() => { changeStatus(selected.id, "cancelled"); setSelected(null); }} className="px-3 py-2 bg-red-600 text-white rounded-md">Cancelar</button>
                </>
              )}
              <button onClick={() => { downloadManifest(selected); }} className="px-3 py-2 border rounded-md">Descargar Manifiesto</button>
              <button onClick={() => setSelected(null)} className="px-3 py-2 border rounded-md">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
